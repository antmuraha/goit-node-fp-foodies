import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { UserSummary } from "../../entities/user";
import { usersApi } from "../../api/endpoints/usersApi";
import type { ApiError, AsyncStatus } from "../../shared/types/api";
import type { RootState } from "../store";
import { clearAuthSession } from "./authSlice";
import { AUTH_REQUIRED_USER_REQUEST_ERROR } from "./constants";
import { UserDetailsResponse } from "../../entities/user/model/types";

type UsersState = {
  list: UserSummary[];
  selectedUser: UserDetailsResponse | null;
  listStatus: AsyncStatus;
  selectedUserStatus: AsyncStatus;
  listError: string | null;
  selectedUserError: string | null;
};

const initialState: UsersState = {
  list: [],
  selectedUser: null,
  listStatus: "idle",
  selectedUserStatus: "idle",
  listError: null,
  selectedUserError: null,
};

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "object" && error !== null && "message" in error && typeof error.message === "string") {
    return error.message;
  }

  return "Unexpected users request error";
};

export const fetchUsers = createAsyncThunk<UserSummary[], void, { state: RootState; rejectValue: string }>(
  "users/fetchUsers",
  async (_, thunkApi) => {
    try {
      const token = thunkApi.getState().auth.token;

      if (!token) {
        return thunkApi.rejectWithValue(AUTH_REQUIRED_USER_REQUEST_ERROR);
      }

      const response = await usersApi.getUsers({ token });
      return response.users;
    } catch (error) {
      return thunkApi.rejectWithValue(getErrorMessage(error as ApiError));
    }
  },
);

export const fetchUserById = createAsyncThunk<UserDetailsResponse, number, { state: RootState; rejectValue: string }>(
  "users/fetchUserById",
  async (id, thunkApi) => {
    const token = thunkApi.getState().auth.token;

    if (!token) {
      return thunkApi.rejectWithValue(AUTH_REQUIRED_USER_REQUEST_ERROR);
    }

    try {
      return await usersApi.getUserById(id, token);
    } catch (error) {
      return thunkApi.rejectWithValue(getErrorMessage(error as ApiError));
    }
  },
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearSelectedUser: (state) => {
      state.selectedUser = null;
      state.selectedUserError = null;
      state.selectedUserStatus = "idle";
    },
    adjustSelectedUserFollowersCount: (state, action: { payload: { userId: number | string; delta: number } }) => {
      if (!state.selectedUser) {
        return;
      }

      if (String(state.selectedUser.id) !== String(action.payload.userId)) {
        return;
      }

      const nextCount = state.selectedUser.followersCount + action.payload.delta;
      state.selectedUser.followersCount = Math.max(0, nextCount);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.listStatus = "loading";
        state.listError = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = action.payload ?? "Unable to load users";
      })
      .addCase(fetchUserById.pending, (state) => {
        state.selectedUserStatus = "loading";
        state.selectedUserError = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.selectedUserStatus = "succeeded";
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.selectedUserStatus = "failed";
        state.selectedUserError = action.payload ?? "Unable to load user";
      })
      .addCase(clearAuthSession, (state) => {
        state.list = [];
        state.selectedUser = null;
        state.listStatus = "idle";
        state.selectedUserStatus = "idle";
        state.listError = null;
        state.selectedUserError = null;
      });
  },
});

export const { clearSelectedUser, adjustSelectedUserFollowersCount } = usersSlice.actions;
export const usersReducer = usersSlice.reducer;
