import type { ReactElement } from "react";import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../shared/hooks/useAuth";
import { APP_ROUTES } from "../../shared/constants/routes";
import { Button, Input, Modal } from "../../shared/ui";
import { ProfileDropdownMenu } from "../../shared/components/ProfileDropdownMenu/ProfileDropdownMenu";
import styles from "./AuthWidget.module.css";

export const AuthWidget = (): ReactElement => {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, signOut, signIn } = useAuth();
  const [isSignInModalOpen, setIsSignInModalOpen] = useState<boolean>(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState<boolean>(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signup");

  const handleTabClick = (tab: "signin" | "signup") => {
    setActiveTab(tab);
  };

  const handleLogoutClick = useCallback(() => {
    setIsLogoutModalOpen(true);
  }, []);

  const handleConfirmLogout = useCallback(() => {
    signOut();
    setIsLogoutModalOpen(false);
    navigate(APP_ROUTES.HOME, { replace: true });
  }, [signOut, navigate]);

  const handleCancelLogout = useCallback(() => {
    setIsLogoutModalOpen(false);
  }, []);

  if (!isAuthenticated || !currentUser) {
    return (
      <>
        <div className={styles.authLinks}>
          <button
            onClick={() => {
              handleTabClick("signin");
              setIsSignInModalOpen(true);
              navigate(APP_ROUTES.SIGN_IN, {replace: true});
            }}
            className={`${styles.link} ${activeTab === "signin" ? styles.active : ""}`}
          >
            Sign in
          </button>
          <button
            onClick={() => {
              handleTabClick("signup");
              setIsSignUpModalOpen(true);
            }}
            className={`${styles.link} ${activeTab === "signup" ? styles.active : ""}`}
          >
            Sign up
          </button>
        </div>

        <Modal
          isOpen={isSignInModalOpen}
          title="Sign In"
          onClose={() => setIsSignInModalOpen(false)}
          closeOnEscape
          closeOnOverlayClick
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <Input type="email" placeholder="Email*" />
            <Input type="password" placeholder="Password" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <Button onClick={() => setIsSignInModalOpen(false)}>Sign In</Button>
            <p style={{ textAlign: "center", margin: "0", fontSize: "14px" }}>
              Don&apos;t have an account?{" "}
              <button
                onClick={() => {
                  setIsSignInModalOpen(false);
                  setIsSignUpModalOpen(true);
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--fd-color-main)",
                  textDecoration: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "inherit",
                }}
              >
                Create an account
              </button>
            </p>
          </div>
        </Modal>

        <Modal
          isOpen={isSignUpModalOpen}
          title="SIGN UP"
          onClose={() => setIsSignUpModalOpen(false)}
          closeOnEscape
          closeOnOverlayClick
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <Input type="text" placeholder="Name*" />
            <Input type="email" placeholder="Email*" />
            <Input type="password" placeholder="Password" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <Button style={{ marginTop: "8px" }} onClick={() => setIsSignUpModalOpen(false)}>
              CREATE
            </Button>
            <p style={{ textAlign: "center", margin: "8px 0 0 0", fontSize: "14px" }}>
              I already have an account?{" "}
              <button
                onClick={() => {
                  setIsSignUpModalOpen(false);
                  setIsSignInModalOpen(true);
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--fd-color-main)",
                  textDecoration: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "inherit",
                }}
              >
                Sign in
              </button>
            </p>
          </div>
        </Modal>

        <Modal
          isOpen={isLogoutModalOpen}
          title="ARE YOU LOGGING OUT?"
          onClose={() => setIsLogoutModalOpen(false)}
          closeOnEscape
          closeOnOverlayClick
        >
          <p className={styles.logoutDescription}>You can always log back in at any time.</p>

          <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: "16px" }}>
            <Button
              onClick={() => setIsLogoutModalOpen(false)}
              style={{
                width: "100%",
                height: "56px",
                borderRadius: "30px",
                backgroundColor: "#050505",
                color: "#fff",
              }}
            >
              LOG OUT
            </Button>

            <Button
              variant="secondary"
              onClick={() => setIsLogoutModalOpen(false)}
              style={{
                width: "100%",
                height: "56px",
                borderRadius: "30px",
                border: "1px solid #050505",
                backgroundColor: "#fff",
                color: "#050505",
              }}
            >
              CANCEL
            </Button>
          </div>
        </Modal>
      </>
    );
  }

  return (
    <>
      <ProfileDropdownMenu user={currentUser} onLogout={handleLogoutClick} />
      <Modal
        isOpen={isLogoutModalOpen}
        title="ARE YOU LOGGING OUT?"
        onClose={handleCancelLogout}
        closeOnEscape
        closeOnOverlayClick
      >
        <p className={styles.logoutDescription}>You can always log back in at any time.</p>
        <div className={styles.logoutActions}>
          <Button
            onClick={handleConfirmLogout}
            style={{
              width: "100%",
              height: "56px",
              borderRadius: "30px",
              backgroundColor: "#050505",
              color: "#fff",
            }}
          >
            LOG OUT
          </Button>
          <Button
            variant="secondary"
            onClick={() => setIsLogoutModalOpen(false)}
            style={{
              width: "100%",
              height: "56px",
              borderRadius: "30px",
              border: "1px solid #050505",
              backgroundColor: "#fff",
              color: "#050505",
            }}
          >
            CANCEL
          </Button>
        </div>
      </Modal>
    </>
  );
};
