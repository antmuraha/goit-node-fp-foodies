import { useCallback } from "react";
import { fetchProfile } from "../../store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "./reduxHooks";

export const useDataProfile = () => {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.auth.currentUser);
  const status = useAppSelector((state) => state.auth.profileStatus);
  const error = useAppSelector((state) => state.auth.profileError);
  const hasToken = useAppSelector((state) => Boolean(state.auth.token));

  const refreshProfile = useCallback(() => {
    void dispatch(fetchProfile());
  }, [dispatch]);

  return {
    profile,
    hasToken,
    isLoading: status === "loading",
    error,
    refreshProfile,
  };
};
