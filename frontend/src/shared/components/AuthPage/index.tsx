import { useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks";
import { APP_ROUTES } from "../../constants/routes";

type AuthPageProps = {
  children: React.ReactNode;
};

const AuthPage = ({ children }: AuthPageProps) => {
  const { isAuthenticated, isProfileLoading } = useAuth();
  const location = useLocation();
  const wasAuthenticated = useRef(isAuthenticated);

  if (isProfileLoading) {
    return <p>Loading profile...</p>;
  }

  if (!isAuthenticated) {
    // User just logged out from this protected page — go home without opening sign-in
    if (wasAuthenticated.current) {
      return <Navigate to={APP_ROUTES.HOME} replace />;
    }
    // User arrived at a protected page without being logged in — prompt sign-in
    return <Navigate to={APP_ROUTES.HOME} state={{ openSignIn: true, returnTo: location.pathname }} replace />;
  }

  wasAuthenticated.current = true;
  return <>{children}</>;
};

export default AuthPage;
