import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { authApi } from "../../api/endpoints/authApi";
import type { ApiError, AsyncStatus } from "../../shared/types/api";
import { sessionStorageAdapter } from "../../shared/services/sessionStorage";
import { MeProfile } from "../../entities/user/model/types";

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterCredentials = {
  name: string;
  email: string;
  password: string;
};

type AuthState = {
  token: string | null;
  currentUser: MeProfile | null;
  profileStatus: AsyncStatus;
  profileError: string | null;
  loginStatus: AsyncStatus;
  loginError: string | null;
  registerStatus: AsyncStatus;
  registerError: string | null;
};

const initialState: AuthState = {
  token: null,
  currentUser: null,
  profileStatus: "idle",
  profileError: null,
  loginStatus: "idle",
  loginError: null,
  registerStatus: "idle",
  registerError: null,
};

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "object" && error !== null && "message" in error && typeof error.message === "string") {
    return error.message;
  }

  return "Unexpected request error";
};

const isUnauthorizedError = (error: unknown): error is ApiError => {
  return typeof error === "object" && error !== null && "status" in error && error.status === 401;
};

export const login = createAsyncThunk<{ token: string; user: MeProfile }, LoginCredentials, { rejectValue: string }>(
  "auth/login",
  async (credentials, thunkApi) => {
    try {
      const response = await authApi.login(credentials);
      const me = await authApi.getProfile(response.token);
      sessionStorageAdapter.save(response.token);
      return { ...response, user: me };
    } catch (error) {
      return thunkApi.rejectWithValue(getErrorMessage(error as ApiError));
    }
  },
);

export const register = createAsyncThunk<
  { token: string; user: MeProfile },
  RegisterCredentials,
  { rejectValue: string }
>("auth/register", async (credentials, thunkApi) => {
  try {
    await authApi.register(credentials);
    const response = await authApi.login({ email: credentials.email, password: credentials.password });
    const me = await authApi.getProfile(response.token);
    sessionStorageAdapter.save(response.token);
    return { ...response, user: me };
  } catch (error) {
    return thunkApi.rejectWithValue(getErrorMessage(error as ApiError));
  }
});

export const logout = createAsyncThunk<void, void, { state: { auth: AuthState }; rejectValue: string }>(
  "auth/logout",
  async (_, thunkApi) => {
    const token = thunkApi.getState().auth.token;
    if (token) {
      try {
        await authApi.logout(token);
      } catch {
        // proceed with local cleanup even if server logout fails
      }
    }
    thunkApi.dispatch(clearAuthSession());
  },
);

export const fetchProfile = createAsyncThunk<MeProfile, void, { state: { auth: AuthState }; rejectValue: string }>(
  "auth/fetchProfile",
  async (_, thunkApi) => {
    const token = thunkApi.getState().auth.token;

    if (!token) {
      return thunkApi.rejectWithValue("Missing auth token for profile request");
    }

    try {
      return await authApi.getProfile(token);
    } catch (error) {
      if (isUnauthorizedError(error)) {
        thunkApi.dispatch(clearAuthSession());
      }

      return thunkApi.rejectWithValue(getErrorMessage(error as ApiError));
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthSession: (state, action: PayloadAction<{ token: string; user?: MeProfile }>) => {
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
      state.registerStatus = "idle";
      state.registerError = null;
      sessionStorageAdapter.clear();
    },
    adjustFollowingCount: (state, action: PayloadAction<number>) => {
      if (!state.currentUser) {
        return;
      }

      const nextCount = state.currentUser.followingCount + action.payload;
      state.currentUser.followingCount = Math.max(0, nextCount);
    },
    adjustFavoritesCount: (state, action: PayloadAction<number>) => {
      if (!state.currentUser) {
        return;
      }

      const nextCount = state.currentUser.favoritesCount + action.payload;
      state.currentUser.favoritesCount = Math.max(0, nextCount);
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
      .addCase(register.pending, (state) => {
        state.registerStatus = "loading";
        state.registerError = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.registerStatus = "succeeded";
        state.token = action.payload.token;
        state.currentUser = action.payload.user;
      })
      .addCase(register.rejected, (state, action) => {
        state.registerStatus = "failed";
        state.registerError = action.payload ?? "Registration failed";
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
        if (!state.token) {
          return;
        }

        state.profileStatus = "failed";
        state.profileError = action.payload ?? "Unable to load profile";
      });
  },
});

export const { setAuthSession, rehydrateSession, clearAuthSession, adjustFollowingCount, adjustFavoritesCount } = authSlice.actions;
export const authReducer = authSlice.reducer;
