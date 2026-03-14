import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks";
import { APP_ROUTES } from "../../constants/routes";

type AuthPageProps = {
  children: React.ReactNode;
};

const AuthPage = ({ children }: AuthPageProps) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={APP_ROUTES.HOME} state={{ openSignIn: true, returnTo: location.pathname }} replace />;
  }

  return <>{children}</>;
};

export default AuthPage;
