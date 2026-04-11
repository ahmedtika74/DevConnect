import { configureStore } from "@reduxjs/toolkit";
import PostsReducer from "../features/posts/postsSlice";
import UserReducer from "../features/user/userSlice";
import FollowReducer from "../features/user/followSlice";
import NotificationReducer from "../features/notifications/notificationSlice";

export const store = configureStore({
  reducer: {
    posts: PostsReducer,
    user: UserReducer,
    follow: FollowReducer,
    notifications: NotificationReducer,
  },
});
