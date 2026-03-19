import { useState, useEffect, useMemo, type ReactElement } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useScrollToTop } from "../../shared/hooks";
import { APP_ROUTES } from "../../shared/constants/routes";
import { AUTH_NOTIFICATIONS } from "../../shared/constants/notifications";
import { notificationService } from "../../shared/services/notifications";
import { Toaster } from "../../shared/ui";
import { AuthModalShell, LogOutModal } from "../../features/auth";
import { AuthModalContext } from "../../shared/contexts/AuthModalContext";
import { Footer } from "../footer/Footer";
import { Breadcrumb } from "../../shared/ui/breadcrumb";
import { useAppDispatch } from "../../shared/hooks";
import { clearAuthSession } from "../../store/slices/authSlice";

type AuthView = "signIn" | "signUp";

export const SharedLayout = (): ReactElement => {
  useScrollToTop();

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authView, setAuthView] = useState<AuthView>("signIn");
  const [isLogOutOpen, setIsLogOutOpen] = useState(false);
  const [returnTo, setReturnTo] = useState<string>(APP_ROUTES.HOME);

  useEffect(() => {
    if (location.state?.openSignIn) {
      setReturnTo(location.state.returnTo ?? location.pathname);
      setAuthView("signIn");
      setIsAuthOpen(true);
      navigate(location.pathname, { replace: true, state: {} });
    } else if (location.state?.openSignUp) {
      setReturnTo(location.state.returnTo ?? location.pathname);
      setAuthView("signUp");
      setIsAuthOpen(true);
      navigate(location.pathname, { replace: true, state: {} });
    } else if (location.state?.openLogOut) {
      setIsLogOutOpen(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state?.openSignIn, location.state?.openSignUp, location.state?.openLogOut]);

  useEffect(() => {
    const handleSessionExpired = (): void => {
      dispatch(clearAuthSession());
      notificationService.error(AUTH_NOTIFICATIONS.SESSION_EXPIRED);
    };

    window.addEventListener("session:expired", handleSessionExpired);
    return () => window.removeEventListener("session:expired", handleSessionExpired);
  }, [dispatch]);

  const handleSignInSuccess = (): void => {
    setIsAuthOpen(false);
    notificationService.success(AUTH_NOTIFICATIONS.SIGN_IN_SUCCESS);
    navigate(returnTo, { replace: true });
  };

  const handleSignUpSuccess = (): void => {
    setIsAuthOpen(false);
    notificationService.success(AUTH_NOTIFICATIONS.SIGN_UP_SUCCESS);
    navigate(returnTo, { replace: true });
  };

  const authModalCtx = useMemo(
    () => ({
      openSignIn: () => {
        setReturnTo(location.pathname);
        setAuthView("signIn");
        setIsAuthOpen(true);
      },
      openSignUp: () => {
        setReturnTo(location.pathname);
        setAuthView("signUp");
        setIsAuthOpen(true);
      },
      openLogOut: () => setIsLogOutOpen(true),
    }),
    [location.pathname],
  );

  return (
    <AuthModalContext.Provider value={authModalCtx}>
      <div className="page-shell">
        <Breadcrumb />
        <Outlet />
        <Footer />
        <AuthModalShell
          isOpen={isAuthOpen}
          initialView={authView}
          onClose={() => setIsAuthOpen(false)}
          onSignInSuccess={handleSignInSuccess}
          onSignUpSuccess={handleSignUpSuccess}
        />
        <LogOutModal isOpen={isLogOutOpen} onClose={() => setIsLogOutOpen(false)} />
        <Toaster />
      </div>
    </AuthModalContext.Provider>
  );
};
