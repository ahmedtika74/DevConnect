import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../services/supabaseClient";

export const fetchFollowData = createAsyncThunk(
  "follow/fetchFollowData",
  async ({ currentUserId, profileId }, { rejectWithValue }) => {
    try {
      const { count: followersCount, error: err1 } = await supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("following_id", profileId);

      if (err1) throw err1;

      const { count: followingCount, error: err2 } = await supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("follower_id", profileId);

      if (err2) throw err2;

      let isFollowing = false;
      if (currentUserId && currentUserId !== profileId) {
        const { data, error: err3 } = await supabase
          .from("follows")
          .select("id")
          .match({ follower_id: currentUserId, following_id: profileId })
          .maybeSingle();

        if (err3) throw err3;
        if (data) isFollowing = true;
      }

      return { followersCount, followingCount, isFollowing };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const toggleFollow = createAsyncThunk(
  "follow/toggle",
  async ({ currentUserId, profileId, isFollowing }, { rejectWithValue }) => {
    try {
      if (isFollowing) {
        const { error } = await supabase
          .from("follows")
          .delete()
          .match({ follower_id: currentUserId, following_id: profileId });

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("follows")
          .insert({ follower_id: currentUserId, following_id: profileId });

        if (error) throw error;
      }

      return !isFollowing;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const followSlice = createSlice({
  name: "follow",
  initialState: {
    followers: 0,
    following: 0,
    isFollowing: false,
    status: "idle",
    toggleStatus: "idle",
    error: null,
  },
  extraReducers: (builder) => {
    builder
      // Fetch Follow Data
      .addCase(fetchFollowData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFollowData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.followers = action.payload.followersCount || 0;
        state.following = action.payload.followingCount || 0;
        state.isFollowing = action.payload.isFollowing;
      })
      .addCase(fetchFollowData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Follow Cases
      .addCase(toggleFollow.pending, (state) => {
        state.toggleStatus = "loading";
      })
      .addCase(toggleFollow.fulfilled, (state, action) => {
        state.toggleStatus = "succeeded";
        const isNowFollowing = action.payload;

        state.isFollowing = isNowFollowing;
        if (isNowFollowing) {
          state.followers += 1;
        } else {
          state.followers -= 1;
        }
      })
      .addCase(toggleFollow.rejected, (state, action) => {
        state.toggleStatus = "failed";
        state.error = action.payload;
      });
  },
});

export default followSlice.reducer;
