import type { ReactElement } from "react";
import styles from "./NotFoundPage.module.css";
export const NotFoundPage = (): ReactElement => {
  return (
    <main className={styles.wrapper}>
      <div className={styles.container}>
        <h2 className={styles.title}>Oops! Page not found</h2>
        <p className={styles.description}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
      </div>
    </main>
  );
};
