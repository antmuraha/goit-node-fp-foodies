import type { ReactElement } from "react";
import { Button, Modal } from "../../../shared/ui";
import { useAuth } from "../../../shared/hooks";
import styles from "./LogOutModal.module.css";

type LogOutModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const LogOutModal = ({ isOpen, onClose }: LogOutModalProps): ReactElement => {
  const { signOut } = useAuth();

  const handleConfirm = async (): Promise<void> => {
    await signOut();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} title="Log out" tabletTitle="Are you logging out?" onClose={onClose} centeredTitle>
      <div className={styles.content}>
        <p className={styles.subtitle}>You can always log back in at any time.</p>
        <div className={styles.btns}>
          <Button fullWidth onClick={handleConfirm} className={styles.actionBtn}>
            Log out
          </Button>
          <Button variant="secondary" fullWidth onClick={onClose} className={`${styles.actionBtn} ${styles.cancelBtn}`}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};
