import type { ReactElement } from "react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../shared/hooks/useAuth";
import { ProfileDropdownMenu } from "../../shared/components/ProfileDropdownMenu/ProfileDropdownMenu";
import styles from "./AuthWidget.module.css";

export const AuthWidget = (): ReactElement => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signup");

  const handleSignInClick = () => {
    setActiveTab("signin");
    navigate(location.pathname, { 
      state: { openSignIn: true, returnTo: location.pathname } 
    });
  };

  const handleSignUpClick = () => {
    setActiveTab("signup");
    navigate(location.pathname, { 
      state: { openSignUp: true, returnTo: location.pathname } 
    });
  };

  const handleLogoutClick = () => {
    navigate(location.pathname, { 
      state: { openLogOut: true } 
    });
  };

  if (!isAuthenticated || !currentUser) {
    return (
      <div className={styles.authLinks}>
        <button
          onClick={handleSignInClick}
          className={`${styles.link} ${activeTab === "signin" ? styles.active : ""}`}
        >
          Sign in
        </button>
        <button
          onClick={handleSignUpClick}
          className={`${styles.link} ${activeTab === "signup" ? styles.active : ""}`}
        >
          Sign up
        </button>
      </div>
    );
  }

  return <ProfileDropdownMenu user={currentUser} onLogout={handleLogoutClick} />;
};