import type { RootState } from "../store";
import type { AsyncStatus } from "../../shared/types/api";
import type { UserProfile } from "../../entities/user";

export const selectToken = (state: RootState): string | null => state.auth.token;

export const selectCurrentUser = (state: RootState): UserProfile | null => state.auth.currentUser;

export const selectIsAuthenticated = (state: RootState): boolean => state.auth.token !== null;

export const selectLoginStatus = (state: RootState): AsyncStatus => state.auth.loginStatus;

export const selectLoginError = (state: RootState): string | null => state.auth.loginError;

export const selectIsSigningIn = (state: RootState): boolean => state.auth.loginStatus === "loading";
