import { forwardRef, type ChangeEvent, type InputHTMLAttributes, type ReactElement } from "react";
import { FormErrorMessage } from "../form-error/FormErrorMessage";
import styles from "./FileInput.module.css";

type FileInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange"> & {
  label?: string;
  error?: string;
  hint?: string;
  hasError?: boolean;
  visuallyHidden?: boolean;
  onFileSelect?: (file: File | null, event: ChangeEvent<HTMLInputElement>) => void;
};

export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  (
    {
      label,
      error,
      hint,
      hasError = !!error,
      className = "",
      id,
      disabled = false,
      readOnly = false,
      visuallyHidden = false,
      onFileSelect,
      ...props
    },
    ref,
  ): ReactElement => {
    const inputId = id || `file-input-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = error ? `${inputId}-error` : undefined;
    const hintId = hint && !error ? `${inputId}-hint` : undefined;
    const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

    const wrapperClasses = [styles.wrapper, visuallyHidden ? styles.visuallyHiddenWrapper : ""]
      .filter(Boolean)
      .join(" ");

    const inputClasses = [
      styles.input,
      hasError ? styles.error : "",
      disabled ? styles.disabled : "",
      readOnly ? styles.readOnly : "",
      visuallyHidden ? styles.visuallyHiddenInput : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files && event.target.files.length > 0 ? event.target.files[0] : null;
      onFileSelect?.(file, event);
    };

    return (
      <div className={wrapperClasses}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
        )}

        <input
          id={inputId}
          ref={ref}
          type="file"
          className={inputClasses}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={hasError}
          aria-describedby={describedBy}
          onChange={handleChange}
          {...props}
        />

        {error && (
          <FormErrorMessage id={errorId} variant="field">
            {error}
          </FormErrorMessage>
        )}

        {hint && !error && (
          <span id={hintId} className={styles.hintText}>
            {hint}
          </span>
        )}
      </div>
    );
  },
);

FileInput.displayName = "FileInput";
