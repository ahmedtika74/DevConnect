import { createSlice } from "@reduxjs/toolkit";
import { fetchCurrentUser, updateProfile } from "./userThunks";

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    status: "idle",
    updateStatus: "idle",
    isAuthenticated: false,
  },
  reducers: {
    logoutUser: (state) => {
      state.currentUser = null;
      state.status = "idle";
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Current User
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentUser = action.payload;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.status = "failed";
        state.isAuthenticated = false;
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.updateStatus = "loading";
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        state.currentUser = action.payload;
      })
      .addCase(updateProfile.rejected, (state) => {
        state.updateStatus = "failed";
      });
  },
});

export const { logoutUser } = userSlice.actions;
export * from "./userThunks";
export default userSlice.reducer;
