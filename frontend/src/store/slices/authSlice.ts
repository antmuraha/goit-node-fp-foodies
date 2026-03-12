import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { authApi } from "../../api/endpoints/authApi";
import type { UserProfile } from "../../entities/user";
import type { ApiError, AsyncStatus } from "../../shared/types/api";
import { sessionStorageAdapter } from "../../shared/services/sessionStorage";

export type LoginCredentials = {
  email: string;
  password: string;
};

type AuthState = {
  token: string | null;
  currentUser: UserProfile | null;
  profileStatus: AsyncStatus;
  profileError: string | null;
  loginStatus: AsyncStatus;
  loginError: string | null;
};

const initialState: AuthState = {
  token: null,
  currentUser: null,
  profileStatus: "idle",
  profileError: null,
  loginStatus: "idle",
  loginError: null,
};

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "object" && error !== null && "message" in error && typeof error.message === "string") {
    return error.message;
  }

  return "Unexpected request error";
};

export const login = createAsyncThunk<{ token: string; user: UserProfile }, LoginCredentials, { rejectValue: string }>(
  "auth/login",
  async (credentials, thunkApi) => {
    try {
      const response = await authApi.login(credentials);
      sessionStorageAdapter.save(response.token);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(getErrorMessage(error as ApiError));
    }
  },
);

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
      sessionStorageAdapter.save(action.payload.token);
      if (action.payload.user) {
        state.currentUser = action.payload.user;
      }
      state.profileError = null;
    },
    rehydrateSession: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    clearAuthSession: (state) => {
      state.token = null;
      state.currentUser = null;
      state.profileStatus = "idle";
      state.profileError = null;
      state.loginStatus = "idle";
      state.loginError = null;
      sessionStorageAdapter.clear();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loginStatus = "loading";
        state.loginError = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loginStatus = "succeeded";
        state.token = action.payload.token;
        state.currentUser = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loginStatus = "failed";
        state.loginError = action.payload ?? "Login failed";
      })
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

export const { setAuthSession, rehydrateSession, clearAuthSession } = authSlice.actions;
export const authReducer = authSlice.reducer;
