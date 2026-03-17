import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { PaginatedUserListResponse, UserListQuery, UserSummary } from "../../entities/user";
import { usersApi } from "../../api/endpoints/usersApi";
import type { ApiError, AsyncStatus } from "../../shared/types/api";
import type { RootState } from "../store";
import { AUTH_REQUIRED_FOLLOW_REQUEST_ERROR, AUTH_REQUIRED_USER_REQUEST_ERROR } from "./constants";

type ProfileUsersState = {
  data: UserSummary[];
  total: number;
  limit: number;
  offset: number;
  status: AsyncStatus;
  error: string | null;
};

type FollowersState = {
  followers: ProfileUsersState;
  following: ProfileUsersState;
  followStatusByUserId: Record<string, boolean>;
  followStatusRequestByUserId: Record<string, AsyncStatus>;
};

type FollowMutationPayload = {
  userId: number | string;
};

type OptimisticFollowPayload = {
  user: UserSummary;
};

type OptimisticUnfollowPayload = {
  user: UserSummary;
};

type FollowStatusPayload = {
  userId: number | string;
  isFollowing: boolean;
};

const initialProfileUsersState: ProfileUsersState = {
  data: [],
  total: 0,
  limit: 0,
  offset: 0,
  status: "idle",
  error: null,
};

const initialState: FollowersState = {
  followers: { ...initialProfileUsersState },
  following: { ...initialProfileUsersState },
  followStatusByUserId: {},
  followStatusRequestByUserId: {},
};

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "object" && error !== null && "message" in error && typeof error.message === "string") {
    return error.message;
  }

  return "Unexpected followers request error";
};

const isSameUserId = (leftId: number | string, rightId: number | string): boolean => String(leftId) === String(rightId);
const toUserKey = (userId: number | string): string => String(userId);

const incrementTotal = (state: ProfileUsersState): void => {
  state.total += 1;
};

const decrementTotal = (state: ProfileUsersState): void => {
  state.total = Math.max(0, state.total - 1);
};

const applyFollowStatus = (state: FollowersState, userId: number | string, isFollowing: boolean): void => {
  state.followStatusByUserId[toUserKey(userId)] = isFollowing;
};

export const fetchProfileFollowers = createAsyncThunk<
  PaginatedUserListResponse,
  { id: number | string; query?: UserListQuery },
  { state: RootState; rejectValue: string }
>("followers/fetchProfileFollowers", async ({ id, query }, thunkApi) => {
  const token = thunkApi.getState().auth.token;

  if (!token) {
    return thunkApi.rejectWithValue(AUTH_REQUIRED_USER_REQUEST_ERROR);
  }

  try {
    return await usersApi.getProfileFollowers(token, id, query);
  } catch (error) {
    return thunkApi.rejectWithValue(getErrorMessage(error as ApiError));
  }
});

export const fetchProfileFollowing = createAsyncThunk<
  PaginatedUserListResponse,
  UserListQuery | undefined,
  { state: RootState; rejectValue: string }
>("followers/fetchProfileFollowing", async (query, thunkApi) => {
  const token = thunkApi.getState().auth.token;

  if (!token) {
    return thunkApi.rejectWithValue(AUTH_REQUIRED_USER_REQUEST_ERROR);
  }

  try {
    return await usersApi.getProfileFollowing(token, query);
  } catch (error) {
    return thunkApi.rejectWithValue(getErrorMessage(error as ApiError));
  }
});

export const followUser = createAsyncThunk<
  FollowMutationPayload,
  FollowMutationPayload,
  { state: RootState; rejectValue: string }
>("followers/followUser", async ({ userId }, thunkApi) => {
  const token = thunkApi.getState().auth.token;

  if (!token) {
    return thunkApi.rejectWithValue(AUTH_REQUIRED_FOLLOW_REQUEST_ERROR);
  }

  try {
    await usersApi.followUser(token, userId);
    return { userId };
  } catch (error) {
    return thunkApi.rejectWithValue(getErrorMessage(error as ApiError));
  }
});

export const unfollowUser = createAsyncThunk<
  FollowMutationPayload,
  FollowMutationPayload,
  { state: RootState; rejectValue: string }
>("followers/unfollowUser", async ({ userId }, thunkApi) => {
  const token = thunkApi.getState().auth.token;

  if (!token) {
    return thunkApi.rejectWithValue(AUTH_REQUIRED_FOLLOW_REQUEST_ERROR);
  }

  try {
    await usersApi.unfollowUser(token, userId);
    return { userId };
  } catch (error) {
    return thunkApi.rejectWithValue(getErrorMessage(error as ApiError));
  }
});

export const fetchFollowStatusByUserId = createAsyncThunk<
  FollowStatusPayload,
  FollowMutationPayload,
  { state: RootState; rejectValue: string }
>("followers/fetchFollowStatusByUserId", async ({ userId }, thunkApi) => {
  const token = thunkApi.getState().auth.token;

  if (!token) {
    return thunkApi.rejectWithValue(AUTH_REQUIRED_FOLLOW_REQUEST_ERROR);
  }

  try {
    const response = await usersApi.getFollowStatus(token, userId);

    return {
      userId: response.userId,
      isFollowing: response.isFollowing,
    };
  } catch (error) {
    return thunkApi.rejectWithValue(getErrorMessage(error as ApiError));
  }
});

const followersSlice = createSlice({
  name: "followers",
  initialState,
  reducers: {
    optimisticFollow: (state, action: PayloadAction<OptimisticFollowPayload>) => {
      const userExists = state.following.data.some((user) => isSameUserId(user.id, action.payload.user.id));

      if (userExists) {
        return;
      }

      state.following.data.unshift(action.payload.user);
      incrementTotal(state.following);
      applyFollowStatus(state, action.payload.user.id, true);
    },
    rollbackFollow: (state, action: PayloadAction<FollowMutationPayload>) => {
      const previousLength = state.following.data.length;
      state.following.data = state.following.data.filter((user) => !isSameUserId(user.id, action.payload.userId));

      if (state.following.data.length !== previousLength) {
        decrementTotal(state.following);
      }

      applyFollowStatus(state, action.payload.userId, false);
    },
    optimisticUnfollow: (state, action: PayloadAction<FollowMutationPayload>) => {
      const previousLength = state.following.data.length;
      state.following.data = state.following.data.filter((user) => !isSameUserId(user.id, action.payload.userId));

      if (state.following.data.length !== previousLength) {
        decrementTotal(state.following);
      }

      applyFollowStatus(state, action.payload.userId, false);
    },
    rollbackUnfollow: (state, action: PayloadAction<OptimisticUnfollowPayload>) => {
      const userExists = state.following.data.some((user) => isSameUserId(user.id, action.payload.user.id));

      if (userExists) {
        return;
      }

      state.following.data.unshift(action.payload.user);
      incrementTotal(state.following);
      applyFollowStatus(state, action.payload.user.id, true);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileFollowers.pending, (state) => {
        state.followers.status = "loading";
        state.followers.error = null;
      })
      .addCase(fetchProfileFollowers.fulfilled, (state, action) => {
        state.followers.status = "succeeded";
        state.followers.data = action.payload.data;
        state.followers.total = action.payload.total;
        state.followers.limit = action.payload.limit;
        state.followers.offset = action.payload.offset;
      })
      .addCase(fetchProfileFollowers.rejected, (state, action) => {
        state.followers.status = "failed";
        state.followers.error = action.payload ?? "Unable to load followers";
      })
      .addCase(fetchProfileFollowing.pending, (state) => {
        state.following.status = "loading";
        state.following.error = null;
      })
      .addCase(fetchProfileFollowing.fulfilled, (state, action) => {
        state.following.status = "succeeded";
        state.following.data = action.payload.data;
        state.following.total = action.payload.total;
        state.following.limit = action.payload.limit;
        state.following.offset = action.payload.offset;

        for (const user of action.payload.data) {
          applyFollowStatus(state, user.id, true);
        }
      })
      .addCase(fetchProfileFollowing.rejected, (state, action) => {
        state.following.status = "failed";
        state.following.error = action.payload ?? "Unable to load following users";
      })
      .addCase(followUser.pending, (state) => {
        state.following.error = null;
      })
      .addCase(followUser.rejected, (state, action) => {
        state.following.error = action.payload ?? "Unable to follow user";
      })
      .addCase(followUser.fulfilled, (state, action) => {
        applyFollowStatus(state, action.payload.userId, true);
      })
      .addCase(unfollowUser.pending, (state) => {
        state.following.error = null;
      })
      .addCase(unfollowUser.rejected, (state, action) => {
        state.following.error = action.payload ?? "Unable to unfollow user";
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        applyFollowStatus(state, action.payload.userId, false);
      })
      .addCase(fetchFollowStatusByUserId.pending, (state, action) => {
        state.following.error = null;
        state.followStatusRequestByUserId[toUserKey(action.meta.arg.userId)] = "loading";
      })
      .addCase(fetchFollowStatusByUserId.fulfilled, (state, action) => {
        state.followStatusRequestByUserId[toUserKey(action.payload.userId)] = "succeeded";
        applyFollowStatus(state, action.payload.userId, action.payload.isFollowing);
      })
      .addCase(fetchFollowStatusByUserId.rejected, (state, action) => {
        state.followStatusRequestByUserId[toUserKey(action.meta.arg.userId)] = "failed";
        state.following.error = action.payload ?? "Unable to resolve follow status";
      });
  },
});

export const { optimisticFollow, optimisticUnfollow, rollbackFollow, rollbackUnfollow } = followersSlice.actions;
export const followersReducer = followersSlice.reducer;
