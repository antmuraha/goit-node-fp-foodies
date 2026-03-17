import type { RootState } from "../store";

const toUserKey = (userId: number | string): string => String(userId);

export const selectFollowingList = (state: RootState) => state.followers.following.data;

export const selectFollowStatusCache = (state: RootState) => state.followers.followStatusByUserId;

export const selectFollowStatusRequestState = (state: RootState, userId: number | string) =>
  state.followers.followStatusRequestByUserId[toUserKey(userId)] ?? "idle";

export const selectIsFollowingFromList = (state: RootState, userId: number | string): boolean | undefined => {
  const isFollowing = state.followers.following.data.some((user) => toUserKey(user.id) === toUserKey(userId));

  return isFollowing ? true : undefined;
};

export const selectIsFollowingFromCache = (state: RootState, userId: number | string): boolean | undefined =>
  state.followers.followStatusByUserId[toUserKey(userId)];

export const selectResolvedIsFollowing = (state: RootState, userId: number | string): boolean | undefined => {
  const listStatus = selectIsFollowingFromList(state, userId);

  if (typeof listStatus === "boolean") {
    return listStatus;
  }

  return selectIsFollowingFromCache(state, userId);
};
