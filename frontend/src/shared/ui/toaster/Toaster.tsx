import { useState, useEffect, useCallback, type ReactElement } from "react";
import { APP_NOTIFICATION_EVENT, type AppNotification } from "../../services/notifications";
import styles from "./Toaster.module.css";

type Toast = AppNotification & { id: number };

const DISMISS_AFTER_MS = 4000;

export const Toaster = (): ReactElement => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const { type, message } = (e as CustomEvent<AppNotification>).detail;
      const id = Date.now();
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => dismiss(id), DISMISS_AFTER_MS);
    };

    window.addEventListener(APP_NOTIFICATION_EVENT, handler);
    return () => window.removeEventListener(APP_NOTIFICATION_EVENT, handler);
  }, [dismiss]);

  return (
    <div className={styles.container} aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`${styles.toast} ${styles[toast.type]}`}>
          <span>{toast.message}</span>
          <button className={styles.close} onClick={() => dismiss(toast.id)} aria-label="Dismiss notification">
            ×
          </button>
        </div>
      ))}
    </div>
  );
};
