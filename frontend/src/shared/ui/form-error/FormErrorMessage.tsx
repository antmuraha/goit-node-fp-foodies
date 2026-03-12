import type { ReactElement, ReactNode } from "react";
import styles from "./FormErrorMessage.module.css";

type FormErrorMessageVariant = "field" | "form";

type FormErrorMessageProps = {
  children: ReactNode;
  id?: string;
  variant?: FormErrorMessageVariant;
};

export const FormErrorMessage = ({ children, id, variant = "field" }: FormErrorMessageProps): ReactElement => {
  const variantClass = variant === "form" ? styles.form : styles.field;
  const classes = [styles.base, variantClass].join(" ");

  return (
    <span id={id} className={classes} role="alert">
      {children}
    </span>
  );
};
