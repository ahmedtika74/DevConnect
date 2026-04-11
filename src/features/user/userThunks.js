import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../services/supabaseClient";

export const fetchCurrentUser = createAsyncThunk(
  "users/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;
        return data;
      }
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async ({ userId, name, username, bio, imageFile, coverFile }, { rejectWithValue }) => {
    try {
      let imageUrl = undefined;
      let coverUrl = undefined;

      const uploadImage = async (file, bucketName) => {
        const fileExt = file.name.split(".").pop();
        const fileName = `${userId}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from(bucketName)
          .getPublicUrl(fileName);

        return data.publicUrl;
      };

      if (imageFile) {
        imageUrl = await uploadImage(imageFile, "avatars");
      }

      if (coverFile) {
        coverUrl = await uploadImage(coverFile, "covers");
      }

      const updates = {
        full_name: name,
        username: username,
        bio: bio,
        ...(imageUrl && { avatar_url: imageUrl }),
        ...(coverUrl && { cover_url: coverUrl }),
      };

      const { data: updatedUser, error: updateError } = await supabase
        .from("users")
        .update(updates)
        .eq("id", userId)
        .select()
        .single();

      if (updateError) {
        if (updateError.code === "23505" || updateError.message.includes("unique") || updateError.message.includes("already taken")) {
          throw new Error("Username already taken");
        }
        throw updateError;
      }

      return updatedUser;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);
