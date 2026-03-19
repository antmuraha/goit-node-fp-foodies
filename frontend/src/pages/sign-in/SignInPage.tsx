import type { ReactElement } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../shared/hooks";
import { APP_ROUTES } from "../../shared/constants/routes";

type LocationState = {
  from?: Location;
};

export const SignInPage = (): ReactElement => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const from = (location.state as LocationState | null)?.from?.pathname ?? APP_ROUTES.HOME;

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return <Navigate to={APP_ROUTES.HOME} replace state={{ openSignIn: true, returnTo: from }} />;
};
