import type { InputHTMLAttributes, ReactElement } from "react";
import styles from "./Checkbox.module.css";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: string;
  indeterminate?: boolean;
};

export const Checkbox = ({
  label,
  indeterminate = false,
  className = "",
  id,
  disabled = false,
  ...props
}: CheckboxProps): ReactElement => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  const checkboxClasses = [
    styles.checkbox,
    indeterminate ? styles.indeterminate : "",
    disabled ? styles.disabled : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.wrapper}>
      <input
        id={checkboxId}
        className={checkboxClasses}
        type="checkbox"
        disabled={disabled}
        aria-checked={indeterminate ? "mixed" : undefined}
        {...props}
      />
      {label && (
        <label htmlFor={checkboxId} className={styles.label}>
          {label}
        </label>
      )}
    </div>
  );
};
