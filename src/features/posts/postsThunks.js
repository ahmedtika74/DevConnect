import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../services/supabaseClient";
import { toggleLike } from "./postsSlice";

export const PAGE_SIZE = 10;

export const createNewPost = createAsyncThunk(
  "posts/createNewPost",
  async ({ content, image, currentUser, username }, { rejectWithValue }) => {
    try {
      let imageUrl = null;

      if (image) {
        const fileExt = image.name.split(".").pop();
        const fileName = `DC-${Date.now()}.${fileExt}`;

        // Upload image
        const { error: uploadError } = await supabase.storage
          .from("post_images")
          .upload(fileName, image);
        if (uploadError) throw uploadError;

        // get image url
        const { data } = supabase.storage
          .from("post_images")
          .getPublicUrl(fileName);

        imageUrl = data.publicUrl;
      }

      // Insert Post data to db and get the post
      const { data: newPost, error: insertError } = await supabase
        .from("posts")
        .insert([{ content, image_url: imageUrl, user_id: currentUser.id }])
        .select(`*, users(full_name, avatar_url, username), likes(user_id)`)
        .single();

      if (insertError) throw insertError;

      return {
        post: newPost,
        isOwnProfile: currentUser?.username === username,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const POSTS_SELECT =
  "*, users(full_name, avatar_url, username), likes(user_id), comments(*, users(full_name, avatar_url, username))";

export const fetchFeedPosts = createAsyncThunk(
  "posts/fetchFeedPosts",
  async ({ page, feedType, currentUserId }, { rejectWithValue }) => {
    const limit = PAGE_SIZE;
    const from = page * limit;
    const to = from + limit - 1;

    try {
      if (feedType === "all") {
        const { data, error } = await supabase
          .from("posts")
          .select(POSTS_SELECT)
          .order("created_at", { ascending: false })
          .order("created_at", {
            referencedTable: "comments",
            ascending: false,
          })
          .range(from, to);

        if (error) throw error;
        return data;
      }

      if (feedType === "following") {
        const { data, error } = await supabase
          .from("follows")
          .select("following_id")
          .eq("follower_id", currentUserId);

        if (error) throw error;

        const ids = data.map((follow) => follow.following_id);
        ids.push(currentUserId);

        const { data: postsData, error: postsError } = await supabase
          .from("posts")
          .select(POSTS_SELECT)
          .in("user_id", ids)
          .order("created_at", { ascending: false })
          .order("created_at", {
            referencedTable: "comments",
            ascending: false,
          })
          .range(from, to);

        if (postsError) throw postsError;
        return postsData;
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchProfilePosts = createAsyncThunk(
  "posts/fetchProfilePosts",
  async ({ page, userId }, { rejectWithValue }) => {
    const limit = PAGE_SIZE;
    const from = page * limit;
    const to = from + limit - 1;

    try {
      const { data: postsData, error } = await supabase
        .from("posts")
        .select(POSTS_SELECT)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;
      return postsData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const deletePost = createAsyncThunk(
  "posts/delete",
  async ({ postId }, { rejectWithValue }) => {
    try {
      const { error } = await supabase.from("posts").delete().eq("id", postId);

      if (error) throw error;
      return postId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const updatePost = createAsyncThunk(
  "posts/update",
  async ({ post }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .update({ content: post.content })
        .eq("id", post.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const addComment = createAsyncThunk(
  "post/addComment",
  async ({ postId, userId, content }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("comments")
        .insert([{ post_id: postId, user_id: userId, content }])
        .select(`*, users(full_name, avatar_url, username)`)
        .single();

      if (error) throw error;
      return { postId, comment: data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const deleteComment = createAsyncThunk(
  "posts/deleteComment",
  async ({ commentId, postId }, { rejectWithValue }) => {
    try {
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId);

      if (error) throw error;
      return { commentId, postId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const toggleLikeThunk = createAsyncThunk(
  "posts/toggleLikeThunk",
  async ({ postId, userId, isLiked }, { dispatch, rejectWithValue }) => {
    dispatch(toggleLike({ postId, userId }));
    try {
      if (isLiked) {
        const { error } = await supabase
          .from("likes")
          .delete()
          .match({ post_id: postId, user_id: userId });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("likes")
          .insert([{ post_id: postId, user_id: userId }]);
        if (error) throw error;
      }
      return { postId, userId, isLiked };
    } catch (error) {
      console.error(error);
      dispatch(toggleLike({ postId, userId }));
      return rejectWithValue(error.message);
    }
  },
);
