import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { authApi } from "../../api/endpoints/authApi";
import type { UserProfile } from "../../entities/user";
import type { ApiError, AsyncStatus } from "../../shared/types/api";

type AuthState = {
  token: string | null;
  currentUser: UserProfile | null;
  profileStatus: AsyncStatus;
  profileError: string | null;
};

const initialState: AuthState = {
  token: null,
  currentUser: null,
  profileStatus: "idle",
  profileError: null,
};

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "object" && error !== null && "message" in error && typeof error.message === "string") {
    return error.message;
  }

  return "Unexpected profile request error";
};

export const fetchProfile = createAsyncThunk<UserProfile, void, { state: { auth: AuthState }; rejectValue: string }>(
  "auth/fetchProfile",
  async (_, thunkApi) => {
    const token = thunkApi.getState().auth.token;

    if (!token) {
      return thunkApi.rejectWithValue("Missing auth token for profile request");
    }

    try {
      return await authApi.getProfile(token);
    } catch (error) {
      return thunkApi.rejectWithValue(getErrorMessage(error as ApiError));
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthSession: (state, action: PayloadAction<{ token: string; user?: UserProfile }>) => {
      state.token = action.payload.token;
      if (action.payload.user) {
        state.currentUser = action.payload.user;
      }
      state.profileError = null;
    },
    clearAuthSession: (state) => {
      state.token = null;
      state.currentUser = null;
      state.profileStatus = "idle";
      state.profileError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.profileStatus = "loading";
        state.profileError = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profileStatus = "succeeded";
        state.currentUser = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.profileStatus = "failed";
        state.profileError = action.payload ?? "Unable to load profile";
      });
  },
});

export const { setAuthSession, clearAuthSession } = authSlice.actions;
export const authReducer = authSlice.reducer;
