import type { InputHTMLAttributes, ReactElement } from 'react';
import styles from './Input.module.css';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean;
};

export const Input = ({ hasError = false, className = '', ...props }: InputProps): ReactElement => {
  const classes = [styles.input, hasError ? styles.error : '', className].filter(Boolean).join(' ');

  return <input className={classes} {...props} />;
};
