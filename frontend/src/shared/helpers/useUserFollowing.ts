import { useCallback, useState } from "react";
import { useStore } from "react-redux";
import type { UserSummary } from "../../entities/user";
import type { RootState } from "../../store/store";
import { FOLLOW_NOTIFICATIONS } from "../constants/notifications";
import { notificationService } from "../services/notifications";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { adjustFollowingCount } from "../../store/slices/authSlice";
import {
  fetchFollowStatusByUserId,
  followUser,
  optimisticFollow,
  optimisticUnfollow,
  rollbackFollow,
  rollbackUnfollow,
  unfollowUser,
} from "../../store/slices/followersSlice";
import { adjustSelectedUserFollowersCount } from "../../store/slices/usersSlice";
import {
  selectFollowStatusCache,
  selectFollowStatusRequestState,
  selectIsFollowingFromCache,
  selectResolvedIsFollowing,
} from "../../store/slices/followersSelectors";

const toKey = (userId: number | string): string => String(userId);

const toUserSummary = (user: { id: number; name: string; email: string; avatar: string | null }): UserSummary => ({
  id: user.id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
});

export const useUserFollowing = () => {
  const dispatch = useAppDispatch();
  const store = useStore<RootState>();
  const followingUsers = useAppSelector((state) => state.followers.following.data);
  const usersList = useAppSelector((state) => state.users.list);
  const selectedUser = useAppSelector((state) => state.users.selectedUser);
  const hasToken = useAppSelector((state) => Boolean(state.auth.token));

  const followStatusCache = useAppSelector(selectFollowStatusCache);

  const [pendingUserIds, setPendingUserIds] = useState<Set<string>>(new Set());

  const getFollowingStatus = useCallback(
    (userId: number | string): boolean | undefined => selectResolvedIsFollowing(store.getState(), userId),
    [store],
  );

  const isFollowing = useCallback(
    (userId: number | string): boolean => {
      const fromList = followingUsers.some((user) => toKey(user.id) === toKey(userId));

      if (fromList) {
        return true;
      }

      return selectIsFollowingFromCache(store.getState(), userId) ?? false;
    },
    // followStatusCache subscription ensures re-render when cache is updated by fetchFollowStatusByUserId
    [followingUsers, followStatusCache, store],
  );

  const isPending = useCallback(
    (userId: number | string): boolean => pendingUserIds.has(toKey(userId)),
    [pendingUserIds],
  );

  const ensureFollowingStatus = useCallback(
    async (userId: number | string): Promise<boolean | undefined> => {
      const status = getFollowingStatus(userId);

      if (typeof status === "boolean") {
        return status;
      }

      if (!hasToken) {
        return undefined;
      }

      if (selectFollowStatusRequestState(store.getState(), userId) === "loading") {
        return undefined;
      }

      const result = await dispatch(fetchFollowStatusByUserId({ userId }));

      if (fetchFollowStatusByUserId.fulfilled.match(result)) {
        return result.payload.isFollowing;
      }

      return undefined;
    },
    [dispatch, getFollowingStatus, hasToken, store],
  );

  const findUserSummaryById = useCallback(
    (userId: number | string): UserSummary | null => {
      const followingUser = followingUsers.find((user) => toKey(user.id) === toKey(userId));

      if (followingUser) {
        return followingUser;
      }

      const listUser = usersList.find((user) => toKey(user.id) === toKey(userId));

      if (listUser) {
        return listUser;
      }

      if (selectedUser && toKey(selectedUser.id) === toKey(userId)) {
        return toUserSummary(selectedUser);
      }

      return null;
    },
    [followingUsers, selectedUser, usersList],
  );

  const trackPendingUser = useCallback((userId: number | string) => {
    setPendingUserIds((prev) => {
      const next = new Set(prev);
      next.add(toKey(userId));
      return next;
    });
  }, []);

  const releasePendingUser = useCallback((userId: number | string) => {
    setPendingUserIds((prev) => {
      const next = new Set(prev);
      next.delete(toKey(userId));
      return next;
    });
  }, []);

  const toggleFollowing = useCallback(
    async (userId: number | string, isCurrentlyFollowing?: boolean): Promise<boolean> => {
      if (!hasToken || isPending(userId)) {
        return false;
      }

      const knownStatus = typeof isCurrentlyFollowing === "boolean" ? isCurrentlyFollowing : getFollowingStatus(userId);
      const resolvedStatus = typeof knownStatus === "boolean" ? knownStatus : await ensureFollowingStatus(userId);

      if (typeof resolvedStatus !== "boolean") {
        return false;
      }

      trackPendingUser(userId);

      if (resolvedStatus) {
        const removedUser = findUserSummaryById(userId);

        dispatch(optimisticUnfollow({ userId }));
        dispatch(adjustFollowingCount(-1));
        dispatch(adjustSelectedUserFollowersCount({ userId, delta: -1 }));

        const result = await dispatch(unfollowUser({ userId }));
        const isRejected = unfollowUser.rejected.match(result);

        if (isRejected) {
          if (removedUser) {
            dispatch(rollbackUnfollow({ user: removedUser }));
          }
          dispatch(adjustFollowingCount(1));
          dispatch(adjustSelectedUserFollowersCount({ userId, delta: 1 }));
          const message = typeof result.payload === "string" ? result.payload : FOLLOW_NOTIFICATIONS.UNFOLLOW_ROLLBACK;
          notificationService.error(message);
          releasePendingUser(userId);
          return false;
        }

        releasePendingUser(userId);
        return true;
      }

      const userToFollow = findUserSummaryById(userId);

      if (userToFollow) {
        dispatch(optimisticFollow({ user: userToFollow }));
        dispatch(adjustFollowingCount(1));
        dispatch(adjustSelectedUserFollowersCount({ userId, delta: 1 }));
      }

      const result = await dispatch(followUser({ userId }));
      const isRejected = followUser.rejected.match(result);

      if (isRejected) {
        if (userToFollow) {
          dispatch(rollbackFollow({ userId }));
          dispatch(adjustFollowingCount(-1));
          dispatch(adjustSelectedUserFollowersCount({ userId, delta: -1 }));
        }
        const message  = typeof result.payload === "string" ? result.payload : FOLLOW_NOTIFICATIONS.FOLLOW_ROLLBACK;
        notificationService.error(message);
        releasePendingUser(userId);
        return false;
      }

      releasePendingUser(userId);
      return true;
    },
    [
      dispatch,
      ensureFollowingStatus,
      findUserSummaryById,
      getFollowingStatus,
      hasToken,
      isPending,
      releasePendingUser,
      trackPendingUser,
    ],
  );

  return {
    ensureFollowingStatus,
    getFollowingStatus,
    isFollowing,
    isPending,
    toggleFollowing,
  };
};
