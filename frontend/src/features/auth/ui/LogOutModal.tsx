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
    <Modal isOpen={isOpen} title="Log out" onClose={onClose}>
      <div className={styles.content}>
        <p className={styles.subtitle}>You can always log back in at any time.</p>
        <div className={styles.btns}>
          <Button fullWidth onClick={handleConfirm}>
            Log out
          </Button>
          <Button variant="secondary" fullWidth onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};
