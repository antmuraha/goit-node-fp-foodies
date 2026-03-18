import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "./reduxHooks";
import {
  login,
  register,
  logout,
  type LoginCredentials,
  type RegisterCredentials,
} from "../../store/slices/authSlice";
import {
  selectIsAuthenticated,
  selectCurrentUser,
  selectIsProfileLoading,
  selectIsSigningIn,
  selectLoginError,
  selectIsRegistering,
  selectRegisterError,
} from "../../store/slices/authSelectors";
import { MeProfile } from "../../entities/user/model/types";

type UseAuthReturn = {
  isAuthenticated: boolean;
  currentUser: MeProfile | null;
  isProfileLoading: boolean;
  isSigningIn: boolean;
  loginError: string | null;
  isRegistering: boolean;
  registerError: string | null;
  signIn: (credentials: LoginCredentials) => Promise<boolean>;
  signUp: (credentials: RegisterCredentials) => Promise<boolean>;
  signOut: () => Promise<void>;
};

export const useAuth = (): UseAuthReturn => {
  const dispatch = useAppDispatch();

  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const currentUser = useAppSelector(selectCurrentUser);
  const isProfileLoading = useAppSelector(selectIsProfileLoading);
  const isSigningIn = useAppSelector(selectIsSigningIn);
  const loginError = useAppSelector(selectLoginError);
  const isRegistering = useAppSelector(selectIsRegistering);
  const registerError = useAppSelector(selectRegisterError);

  const signIn = useCallback(
    async (credentials: LoginCredentials): Promise<boolean> => {
      const result = await dispatch(login(credentials));
      return login.fulfilled.match(result);
    },
    [dispatch],
  );

  const signUp = useCallback(
    async (credentials: RegisterCredentials): Promise<boolean> => {
      const result = await dispatch(register(credentials));
      return register.fulfilled.match(result);
    },
    [dispatch],
  );

  const signOut = useCallback(async (): Promise<void> => {
    await dispatch(logout());
  }, [dispatch]);

  return {
    isAuthenticated,
    currentUser,
    isProfileLoading,
    isSigningIn,
    loginError,
    isRegistering,
    registerError,
    signIn,
    signUp,
    signOut,
  };
};
