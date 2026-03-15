import { useEffect, type ReactElement } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { APP_ROUTES } from "../../shared/constants/routes";

export const SharedLayout = (): ReactElement => {
  const location = useLocation();
  const navigate = useNavigate();

  // @ts-expect-error
  const handleSignInSuccess = () => {
    const returnTo = location.state?.returnTo ?? APP_ROUTES.HOME;
    navigate(returnTo, { replace: true });
    // closeSignInModal();
  };

  useEffect(() => {
    if (location.state?.openSignIn) {
      alert("Open sign-in modal"); // TODO - replace with actual modal logic
      // openSignInModal();
      // clear the state so back-navigation doesn't re-trigger it
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state]);

  return (
    <div className="page-shell">
      <Outlet />
    </div>
  );
};
