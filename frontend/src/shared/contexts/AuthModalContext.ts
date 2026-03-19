import { createContext, useContext } from "react";

type AuthModalContextValue = {
  openSignIn: () => void;
  openSignUp: () => void;
  openLogOut: () => void;
};

export const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export const useAuthModal = (): AuthModalContextValue => {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error("useAuthModal must be used within SharedLayout");
  return ctx;
};
