import { useCallback, useEffect } from "react";
import { clearSelectedUser, fetchUserById } from "../../store/slices/usersSlice";
import { useAppDispatch, useAppSelector } from "./reduxHooks";

export const useDataUser = (userId?: number) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.users.selectedUser);
  const status = useAppSelector((state) => state.users.selectedUserStatus);
  const error = useAppSelector((state) => state.users.selectedUserError);

  const loadUser = useCallback(
    (id: number) => {
      void dispatch(fetchUserById(id));
    },
    [dispatch],
  );

  useEffect(() => {
    if (userId && Number.isFinite(userId)) {
      loadUser(userId);
      return;
    }

    dispatch(clearSelectedUser());
  }, [dispatch, loadUser, userId]);

  return {
    user,
    isLoading: status === "loading",
    error,
    loadUser,
  };
};
