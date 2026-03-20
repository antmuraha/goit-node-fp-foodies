import styles from "./EmptyState.module.css";

type EmptyStateProps = {
  message: string;
};

export const EmptyState = ({ message }: EmptyStateProps) => (
  <div className={styles.container}>
    <p className={styles.message}>{message}</p>
  </div>
);
