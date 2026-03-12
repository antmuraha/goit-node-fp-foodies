import type { ReactElement } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { SignInForm } from "../../features/auth";
import { useAuth } from "../../shared/hooks";
import { APP_ROUTES } from "../../shared/constants/routes";
import styles from "./SignInPage.module.css";

type LocationState = {
  from?: Location;
};

export const SignInPage = (): ReactElement => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as LocationState | null)?.from?.pathname ?? APP_ROUTES.HOME;

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSuccess = (): void => {
    navigate(from, { replace: true });
  };

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Sign in</h1>
        <SignInForm onSuccess={handleSuccess} />
      </div>
    </main>
  );
};
