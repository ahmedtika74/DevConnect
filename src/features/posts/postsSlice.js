import { createSlice } from "@reduxjs/toolkit";
import {
  createNewPost,
  fetchFeedPosts,
  fetchProfilePosts,
  deletePost,
  updatePost,
  addComment,
  deleteComment,
  PAGE_SIZE,
} from "./postsThunks";
import { updateProfile } from "../user/userThunks";

function forEachPostList(state, postId, callback) {
  const lists = [state.feedItems, state.profileItems];
  for (const list of lists) {
    const index = list.findIndex((p) => p.id === postId);
    if (index !== -1) callback(list[index], list, index);
  }
  if (state.currentPost?.id === postId) {
    callback(state.currentPost);
  }
}

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    feedItems: [],
    profileItems: [],
    currentPost: null,
    feedStatus: "idle",
    profileStatus: "idle",
    postStatus: "idle",
    feedError: null,
    profileError: null,
    postError: null,
    deleteError: null,
    updateError: null,
    commentError: null,
    pageFeed: 0,
    pageProfile: 0,
    feedHasMore: true,
    profileHasMore: true,
  },
  reducers: {
    incrementFeedPage: (state) => {
      state.pageFeed += 1;
    },
    incrementProfilePage: (state) => {
      state.pageProfile += 1;
    },
    resetFeed: (state) => {
      state.feedHasMore = true;
      state.pageFeed = 0;
      state.feedItems = [];
    },
    resetProfile: (state) => {
      state.profileHasMore = true;
      state.pageProfile = 0;
      state.profileItems = [];
    },
    setCurrentPost: (state, action) => {
      state.currentPost = action.payload;
    },
    toggleLike: (state, action) => {
      const { postId, userId } = action.payload;
      forEachPostList(state, postId, (post) => {
        const existIndex = post.likes?.findIndex(
          (like) => like.user_id === userId,
        );
        if (existIndex !== -1 && existIndex !== undefined) {
          post.likes.splice(existIndex, 1);
        } else {
          post.likes = [
            ...(post.likes || []),
            { user_id: userId, post_id: postId },
          ];
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder
      // Add New Post
      .addCase(createNewPost.pending, (state) => {
        state.postStatus = "loading";
      })
      .addCase(createNewPost.fulfilled, (state, action) => {
        state.postStatus = "succeeded";
        const { post, isOwnProfile } = action.payload;

        state.feedItems = [post, ...state.feedItems];

        if (isOwnProfile) {
          state.profileItems = [post, ...state.profileItems];
        }
      })
      .addCase(createNewPost.rejected, (state, action) => {
        state.postStatus = "failed";
        state.postError = action.payload;
      })
      // Fetch Feed Posts
      .addCase(fetchFeedPosts.pending, (state) => {
        state.feedStatus = "loading";
      })
      .addCase(fetchFeedPosts.fulfilled, (state, action) => {
        state.feedStatus = "succeeded";
        const newPosts = action.payload || [];

        const uniquePosts = newPosts.filter(
          (newPost) =>
            !state.feedItems.some(
              (existingPost) => existingPost.id === newPost.id,
            ),
        );

        state.feedItems = [...state.feedItems, ...uniquePosts];

        if (newPosts.length < PAGE_SIZE) {
          state.feedHasMore = false;
        }
      })
      .addCase(fetchFeedPosts.rejected, (state, action) => {
        state.feedStatus = "failed";
        state.feedError = action.payload;
      })
      // Fetch Profile Posts
      .addCase(fetchProfilePosts.pending, (state) => {
        state.profileStatus = "loading";
      })
      .addCase(fetchProfilePosts.fulfilled, (state, action) => {
        state.profileStatus = "succeeded";
        const newPosts = action.payload || [];

        const uniquePosts = newPosts.filter(
          (newPost) =>
            !state.profileItems.some(
              (existingPost) => existingPost.id === newPost.id,
            ),
        );

        state.profileItems = [...state.profileItems, ...uniquePosts];

        if (newPosts.length < PAGE_SIZE) {
          state.profileHasMore = false;
        }
      })
      .addCase(fetchProfilePosts.rejected, (state, action) => {
        state.profileStatus = "failed";
        state.profileError = action.payload;
      })
      // Delete Post
      .addCase(deletePost.fulfilled, (state, action) => {
        state.feedItems = state.feedItems.filter(
          (p) => p.id !== action.payload,
        );
        state.profileItems = state.profileItems.filter(
          (p) => p.id !== action.payload,
        );
        if (state.currentPost?.id === action.payload) {
          state.currentPost = null;
        }
      })
      // Update Post
      .addCase(updatePost.fulfilled, (state, action) => {
        forEachPostList(state, action.payload.id, (post) => {
          Object.assign(post, action.payload);
        });
      })
      // Add Comment
      .addCase(addComment.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;
        forEachPostList(state, postId, (post) => {
          if (!post.comments) post.comments = [];
          post.comments.unshift(comment);
        });
      })
      // Delete Comment
      .addCase(deleteComment.fulfilled, (state, action) => {
        const { commentId, postId } = action.payload;
        forEachPostList(state, postId, (post) => {
          if (post.comments) {
            post.comments = post.comments.filter((c) => c.id !== commentId);
          }
        });
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        const newUserData = {
          full_name: updatedUser.full_name,
          username: updatedUser.username,
          avatar_url: updatedUser.avatar_url,
        };

        const lists = [state.feedItems, state.profileItems];
        for (const list of lists) {
          for (const post of list) {
            if (post.user_id === updatedUser.id) {
              post.users = { ...post.users, ...newUserData };
            }
          }
        }

        if (state.currentPost?.user_id === updatedUser.id) {
          state.currentPost.users = {
            ...state.currentPost.users,
            ...newUserData,
          };
        }
      });
  },
});

export const {
  incrementFeedPage,
  incrementProfilePage,
  toggleLike,
  resetFeed,
  resetProfile,
  setCurrentPost,
} = postsSlice.actions;
export * from "./postsThunks";
export default postsSlice.reducer;
