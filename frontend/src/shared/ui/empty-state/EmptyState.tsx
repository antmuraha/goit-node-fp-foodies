import styles from './EmptyState.module.css';

type EmptyStateProps = {
  message: string;
};

export const EmptyState = ({ message }: EmptyStateProps) => (
  <p className={styles.message}>{message}</p>
);
