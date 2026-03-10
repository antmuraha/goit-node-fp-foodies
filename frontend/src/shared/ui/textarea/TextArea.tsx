import type { ReactElement, TextareaHTMLAttributes } from 'react';
import styles from './TextArea.module.css';

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  hasError?: boolean;
};

export const TextArea = ({ hasError = false, className = '', ...props }: TextAreaProps): ReactElement => {
  const classes = [styles.textarea, hasError ? styles.error : '', className].filter(Boolean).join(' ');

  return <textarea className={classes} {...props} />;
};
