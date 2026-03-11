import type { InputHTMLAttributes, ReactElement } from "react";
import styles from "./Checkbox.module.css";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export const Checkbox = ({ className = "", ...props }: CheckboxProps): ReactElement => {
  const classes = [styles.checkbox, className].filter(Boolean).join(" ");

  return <input className={classes} type="checkbox" {...props} />;
};
