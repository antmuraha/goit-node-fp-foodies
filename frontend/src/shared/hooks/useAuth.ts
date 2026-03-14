import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "./reduxHooks";
import { login, clearAuthSession, type LoginCredentials } from "../../store/slices/authSlice";
import {
  selectIsAuthenticated,
  selectCurrentUser,
  selectIsSigningIn,
  selectLoginError,
} from "../../store/slices/authSelectors";
import type { UserProfile } from "../../entities/user";

type UseAuthReturn = {
  isAuthenticated: boolean;
  currentUser: UserProfile | null;
  isSigningIn: boolean;
  loginError: string | null;
  signIn: (credentials: LoginCredentials) => Promise<boolean>;
  signOut: () => void;
};

export const useAuth = (): UseAuthReturn => {
  const dispatch = useAppDispatch();

  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const currentUser = useAppSelector(selectCurrentUser);
  const isSigningIn = useAppSelector(selectIsSigningIn);
  const loginError = useAppSelector(selectLoginError);

  const signIn = useCallback(
    async (credentials: LoginCredentials): Promise<boolean> => {
      const result = await dispatch(login(credentials));
      return login.fulfilled.match(result);
    },
    [dispatch],
  );

  const signOut = useCallback(() => {
    dispatch(clearAuthSession());
  }, [dispatch]);

  return { isAuthenticated, currentUser, isSigningIn, loginError, signIn, signOut };
};
