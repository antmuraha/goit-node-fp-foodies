import type { ReactElement, SelectHTMLAttributes } from "react";
import styles from "./Select.module.css";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  hasError?: boolean;
};

export const Select = ({ hasError = false, className = "", children, ...props }: SelectProps): ReactElement => {
  const classes = [styles.select, hasError ? styles.error : "", className].filter(Boolean).join(" ");

  return (
    <select className={classes} {...props}>
      {children}
    </select>
  );
};
