import { useCallback, useEffect } from "react";
import { updateAvatar } from "../../store/slices/authSlice";
import { fetchUserById } from "../../store/slices/usersSlice";
import { useAppDispatch, useAppSelector } from "./reduxHooks";

export const useDataUser = (userId?: number) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.users.selectedUser);
  const status = useAppSelector((state) => state.users.selectedUserStatus);
  const error = useAppSelector((state) => state.users.selectedUserError);
  const avatarUpdateStatus = useAppSelector((state) => state.auth.avatarUpdateStatus);
  const avatarUpdateError = useAppSelector((state) => state.auth.avatarUpdateError);

  const loadUser = useCallback(
    (id: number) => {
      void dispatch(fetchUserById(id));
    },
    [dispatch],
  );

  const uploadAvatar = useCallback(
    async (file: File): Promise<boolean> => {
      const result = await dispatch(updateAvatar(file));
      return updateAvatar.fulfilled.match(result);
    },
    [dispatch],
  );

  useEffect(() => {
    if (userId && Number.isFinite(userId)) {
      loadUser(userId);
      return;
    }
  }, [dispatch, loadUser, userId]);

  return {
    user,
    isLoading: status === "loading",
    error,
    loadUser,
    uploadAvatar,
    isAvatarUpdating: avatarUpdateStatus === "loading",
    avatarUpdateError,
  };
};
