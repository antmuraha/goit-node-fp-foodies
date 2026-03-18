import { useId, useState, type ChangeEvent, type ReactElement, type TextareaHTMLAttributes } from "react";
import { FormErrorMessage } from "../form-error/FormErrorMessage";
import styles from "./TextArea.module.css";

type TextAreaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "maxLength"> & {
  label?: string;
  error?: string;
  hint?: string;
  hasError?: boolean;
  maxLength?: number;
};

export const TextArea = ({
  label,
  error,
  hint,
  hasError = !!error,
  className = "",
  id,
  disabled = false,
  readOnly = false,
  maxLength,
  value,
  defaultValue,
  onChange,
  ...props
}: TextAreaProps): ReactElement => {
  const generatedId = useId();
  const textareaId = id || generatedId;
  const errorId = error ? `${textareaId}-error` : undefined;
  const hintId = hint && !error ? `${textareaId}-hint` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

  const isControlled = value !== undefined;
  const [uncontrolledCount, setUncontrolledCount] = useState(
    defaultValue !== undefined ? String(defaultValue).length : 0,
  );
  const charCount = isControlled ? String(value).length : uncontrolledCount;

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (!isControlled) setUncontrolledCount(e.target.value.length);
    onChange?.(e);
  };

  const fieldClasses = [styles.field, hasError ? styles.error : ""].filter(Boolean).join(" ");

  const textareaClasses = [
    styles.textarea,
    disabled ? styles.disabled : "",
    readOnly ? styles.readOnly : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={textareaId} className={styles.label}>
          {label}
        </label>
      )}
      <div className={fieldClasses}>
        <textarea
          id={textareaId}
          className={textareaClasses}
          disabled={disabled}
          readOnly={readOnly}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          aria-invalid={hasError}
          aria-describedby={describedBy}
          {...props}
        />
        {maxLength !== undefined && (
          <div className={styles.counterRow}>
            <span className={styles.counter} aria-live="polite" aria-atomic="true">
              <span className={charCount > 0 ? styles.counterActive : styles.counterMuted}>
                {charCount}
              </span>
              <span className={styles.counterMuted}>/{maxLength}</span>
            </span>
          </div>
        )}
      </div>
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
};
