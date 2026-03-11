import { useCallback, useEffect } from "react";
import { fetchUsers } from "../../store/slices/usersSlice";
import { useAppDispatch, useAppSelector } from "./reduxHooks";

export const useDataUsers = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.users.list);
  const status = useAppSelector((state) => state.users.listStatus);
  const error = useAppSelector((state) => state.users.listError);

  const loadUsers = useCallback(() => {
    void dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (status === "idle") {
      loadUsers();
    }
  }, [loadUsers, status]);

  return {
    users,
    isLoading: status === "loading",
    error,
    loadUsers,
  };
};
