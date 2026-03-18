import { useState, useEffect, type ReactElement } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { APP_ROUTES } from "../../shared/constants/routes";
import { Modal } from "../../shared/ui";
import { SignInForm } from "../../features/auth";
import { Footer } from "../footer/Footer";

export const SharedLayout = (): ReactElement => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [returnTo, setReturnTo] = useState<string>(APP_ROUTES.HOME);

  useEffect(() => {
    if (location.state?.openSignIn) {
      setReturnTo(location.state.returnTo ?? location.pathname);
      setIsSignInOpen(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state?.openSignIn]);

  const handleClose = (): void => {
    setIsSignInOpen(false);
  };

  const handleSuccess = (): void => {
    setIsSignInOpen(false);
    navigate(returnTo, { replace: true });
  };

  return (
    <div className="page-shell">
      <Outlet />
      <Footer />
      <Modal isOpen={isSignInOpen} title="Sign in" onClose={handleClose}>
        <SignInForm onSuccess={handleSuccess} />
      </Modal>
    </div>
  );
};
