import type { ButtonHTMLAttributes, ReactElement } from "react";
import styles from "./Button.module.css";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "small" | "medium" | "large";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  isIconOnly?: boolean;
};

export const Button = ({
  variant = "primary",
  size = "medium",
  className = "",
  type = "button",
  isLoading = false,
  fullWidth = false,
  isIconOnly = false,
  children,
  disabled,
  ...props
}: ButtonProps): ReactElement => {
  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    isIconOnly && styles.isIconOnly,
    isLoading && styles.loading,
    fullWidth && styles.fullWidth,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} type={type} disabled={disabled || isLoading} {...props}>
      {isLoading ? "Loading..." : children}
    </button>
  );
};
