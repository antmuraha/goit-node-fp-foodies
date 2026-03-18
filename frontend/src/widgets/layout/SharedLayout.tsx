import { useState, useEffect, type ReactElement } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { APP_ROUTES } from "../../shared/constants/routes";
import { Modal } from "../../shared/ui";
import { SignInForm, SignUpForm } from "../../features/auth";
import { Footer } from "../footer/Footer";

export const SharedLayout = (): ReactElement => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [returnTo, setReturnTo] = useState<string>(APP_ROUTES.HOME);

  useEffect(() => {
    if (location.state?.openSignIn) {
      setReturnTo(location.state.returnTo ?? location.pathname);
      setIsSignInOpen(true);
      navigate(location.pathname, { replace: true, state: {} });
    } else if (location.state?.openSignUp) {
      setReturnTo(location.state.returnTo ?? location.pathname);
      setIsSignUpOpen(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state?.openSignIn, location.state?.openSignUp]);

  const handleAuthSuccess = (): void => {
    setIsSignInOpen(false);
    setIsSignUpOpen(false);
    navigate(returnTo, { replace: true });
  };

  const switchToSignUp = (): void => {
    setIsSignInOpen(false);
    setIsSignUpOpen(true);
  };

  const switchToSignIn = (): void => {
    setIsSignUpOpen(false);
    setIsSignInOpen(true);
  };

  return (
    <div className="page-shell">
      <Outlet />
      <Footer />
      <Modal isOpen={isSignInOpen} title="Sign in" onClose={() => setIsSignInOpen(false)}>
        <SignInForm onSuccess={handleAuthSuccess} onCreateAccount={switchToSignUp} />
      </Modal>
      <Modal isOpen={isSignUpOpen} title="Sign up" onClose={() => setIsSignUpOpen(false)}>
        <SignUpForm onSuccess={handleAuthSuccess} onSignIn={switchToSignIn} />
      </Modal>
    </div>
  );
};
