import type { ButtonHTMLAttributes, ReactElement } from "react";
import styles from "./Button.module.css";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export const Button = ({
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonProps): ReactElement => {
  const variantClass = variant === "secondary" ? styles.secondary : styles.primary;
  const classes = [styles.button, variantClass, className].filter(Boolean).join(" ");

  return <button className={classes} type={type} {...props} />;
};
