import type { ReactElement } from "react";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../shared/hooks/useAuth";
import { APP_ROUTES } from "../../shared/constants/routes";
import { Modal } from "../../shared/ui/modal/Modal";
import { Button } from "../../shared/ui/button/Button";
import { ProfileDropdownMenu } from "../../shared/components/ProfileDropdownMenu/ProfileDropdownMenu";
import styles from "./AuthWidget.module.css";

export const AuthWidget = (): ReactElement => {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, signOut } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

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
      <section className={styles.authLinks}>
        <a href={APP_ROUTES.SIGN_IN} className={styles.link}>
          SIGN IN
        </a>
        <a href="#" className={styles.link}>
          SIGN UP
        </a>
      </section>
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
          <Button onClick={handleConfirmLogout} fullWidth>
            LOG OUT
          </Button>
          <Button variant="secondary" onClick={handleCancelLogout} fullWidth>
            CANCEL
          </Button>
        </div>
      </Modal>
    </>
  );
};
