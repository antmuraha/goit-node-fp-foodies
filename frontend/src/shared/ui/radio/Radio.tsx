import type { InputHTMLAttributes, ReactElement } from 'react';
import styles from './Radio.module.css';

type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

export const Radio = ({ className = '', ...props }: RadioProps): ReactElement => {
  const classes = [styles.radio, className].filter(Boolean).join(' ');

  return <input className={classes} type="radio" {...props} />;
};
