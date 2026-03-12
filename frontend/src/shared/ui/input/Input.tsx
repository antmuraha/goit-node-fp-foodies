import type { InputHTMLAttributes, ReactElement } from "react";
import styles from "./Input.module.css";

type InputType = "text" | "email" | "password" | "number";

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  /** HTML input type: text, email, password, or number */
  type?: InputType;
  /** Label text displayed above the input */
  label?: string;
  /** Error message displayed below the input */
  error?: string;
  /** Hint/helper text displayed below the input (shown when no error) */
  hint?: string;
  /** Whether the input has an error state (applies error styling) */
  hasError?: boolean;
};

export const Input = ({
  label,
  error,
  hint,
  hasError = !!error,
  className = "",
  id,
  disabled = false,
  readOnly = false,
  type = "text",
  ...props
}: InputProps): ReactElement => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${inputId}-error` : undefined;
  const hintId = hint && !error ? `${inputId}-hint` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

  const inputClasses = [
    styles.input,
    hasError ? styles.error : "",
    disabled ? styles.disabled : "",
    readOnly ? styles.readOnly : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        className={inputClasses}
        disabled={disabled}
        readOnly={readOnly}
        aria-invalid={hasError}
        aria-describedby={describedBy}
        {...props}
      />
      {error && (
        <span id={errorId} className={styles.errorText} role="alert">
          {error}
        </span>
      )}
      {hint && !error && (
        <span id={hintId} className={styles.hintText}>
          {hint}
        </span>
      )}
    </div>
  );
};
