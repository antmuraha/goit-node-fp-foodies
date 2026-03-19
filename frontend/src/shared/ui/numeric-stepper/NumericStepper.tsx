import { type ReactElement, type ChangeEvent, useCallback } from "react";
import styles from "./NumericStepper.module.css";

type NumericStepperProps = {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (next: number) => void;
  label: string;
};

export const NumericStepper = ({
  value = 10,
  min = 10,
  max = 1440,
  step = 10,
  onChange,
  label,
}: NumericStepperProps): ReactElement => {
  const clamp = useCallback((val: number) => Math.min(Math.max(val, min), max), [min, max]);

  const isLimitReached = value <= min || value >= max;

  const handleDecrement = () => {
    onChange(clamp(value - step));
  };

  const handleIncrement = () => {
    onChange(clamp(value + step));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue)) {
      onChange(clamp(newValue));
    } else if (e.target.value === "") {
      onChange(min);
    }
  };

  return (
    <div className={styles.container} aria-label={label}>
      <button type="button" className={styles.button} onClick={handleDecrement} disabled={value <= min}>
        -
      </button>

      <div className={styles.inputWrapper}>
        <input
          type="number"
          name="numeric-stapper"
          className={`${styles.input} ${isLimitReached ? styles.textLimit : ""}`}
          value={value}
          onChange={handleInputChange}
          min={min}
          max={max}
        />
        <p className={`${styles.unit} ${isLimitReached ? styles.textLimit : ""}`}>min</p>
      </div>

      <button type="button" className={styles.button} onClick={handleIncrement} disabled={value >= max}>
        +
      </button>
    </div>
  );
};
