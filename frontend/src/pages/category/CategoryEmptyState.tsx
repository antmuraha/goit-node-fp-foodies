import styles from "./CategoryEmptyState.module.css";

export const CategoryEmptyState = () => (
  <div className={styles.container}>
    <div className={styles.illustration}>
      <svg
        width="96"
        height="96"
        viewBox="0 0 96 96"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Fork */}
        <line x1="26" y1="12" x2="26" y2="84" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path
          d="M19 12 L19 34 Q19 41 26 41 Q33 41 33 34 L33 12"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Knife */}
        <line x1="70" y1="12" x2="70" y2="84" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path
          d="M70 12 Q82 20 82 34 L70 39"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Plate outer */}
        <circle cx="48" cy="52" r="24" stroke="currentColor" strokeWidth="3" />
        {/* Plate inner ring */}
        <circle cx="48" cy="52" r="16" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
      </svg>
    </div>

    <h2 className={styles.title}>No recipes found</h2>
    <p className={styles.subtitle}>
      Try adjusting or clearing your filters to discover more delicious recipes.
    </p>
  </div>
);
