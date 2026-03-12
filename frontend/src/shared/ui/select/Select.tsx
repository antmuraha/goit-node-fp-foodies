import type { ReactElement, ReactNode, SelectHTMLAttributes } from "react";
import { useRef, useState, useEffect } from "react";
import styles from "./Select.module.css";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectOptGroup {
  label: string;
  options: SelectOption[];
}

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "type"> & {
  /** Label text displayed above the select */
  label?: string;
  /** Error message displayed below the select */
  error?: string;
  /** Hint/helper text displayed below the select (shown when no error) */
  hint?: string;
  /** Whether the select has an error state (applies error styling) */
  hasError?: boolean;
  /** Placeholder text for the disabled default option */
  placeholder?: string;
  /** Children can be option or optgroup elements */
  children?: ReactNode;
};

interface ParsedOptions {
  items: (SelectOption | SelectOptGroup)[];
}

const parseOptionsFromChildren = (children: ReactNode): ParsedOptions => {
  const items: (SelectOption | SelectOptGroup)[] = [];

  const processChildren = (nodes: ReactNode) => {
    if (!nodes) return;

    if (Array.isArray(nodes)) {
      nodes.forEach((node) => processChildren(node));
      return;
    }

    if (!("type" in nodes)) return;

    const type = nodes.type;
    const props = nodes.props;

    // Handle optgroup
    if (type === "optgroup") {
      const groupOptions: SelectOption[] = [];
      if (props.children) {
        const groupChildren = Array.isArray(props.children)
          ? props.children
          : [props.children];
        groupChildren.forEach((child: any) => {
          if (child?.type === "option" && !child.props.hidden) {
            groupOptions.push({
              value: child.props.value,
              label: child.props.children,
            });
          }
        });
      }
      if (groupOptions.length > 0) {
        items.push({
          label: props.label,
          options: groupOptions,
        });
      }
    }
    // Handle option
    else if (type === "option" && !props.hidden && !props.disabled) {
      items.push({
        value: props.value,
        label: props.children,
      });
    }
  };

  processChildren(children);
  return { items };
};

const isOptGroup = (item: SelectOption | SelectOptGroup): item is SelectOptGroup => {
  return "options" in item;
};

export const Select = ({
  label,
  error,
  hint,
  hasError = !!error,
  className = "",
  id,
  disabled = false,
  placeholder,
  value,
  onChange,
  children,
  ...props
}: SelectProps): ReactElement => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${selectId}-error` : undefined;
  const hintId = hint && !error ? `${selectId}-hint` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || "");
  const [selectedLabel, setSelectedLabel] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const parsedOptions = parseOptionsFromChildren(children);

  // Find label for selected value
  useEffect(() => {
    let label = placeholder || "";
    for (const item of parsedOptions.items) {
      if (isOptGroup(item)) {
        const option = item.options.find((opt) => opt.value === selectedValue);
        if (option) {
          label = option.label;
          break;
        }
      } else if (item.value === selectedValue) {
        label = item.label;
        break;
      }
    }
    setSelectedLabel(label);
  }, [selectedValue, parsedOptions, placeholder]);

  // Handle external value changes
  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  const handleSelect = (val: string, label: string) => {
    setSelectedValue(val);
    setSelectedLabel(label);
    setIsOpen(false);

    // Trigger onChange if provided
    if (onChange) {
      const event = {
        target: { value: val },
      } as any;
      onChange(event);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const { key } = e;

    if (!isOpen) {
      if (key === "Enter" || key === " " || key === "ArrowDown") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    if (key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
      buttonRef.current?.focus();
    } else if (key === "Enter") {
      e.preventDefault();
      // Handle selection in list
      const focusedOption = listRef.current?.querySelector(
        "[data-focused=true]"
      ) as HTMLLIElement;
      if (focusedOption) {
        focusedOption.click();
      }
    }
  };

  const wrapperClasses = [
    styles.wrapper,
    disabled ? styles.disabled : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const buttonClasses = [
    styles.button,
    hasError ? styles.error : "",
    isOpen ? styles.open : "",
    disabled ? styles.buttonDisabled : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClasses}>
      {label && (
        <label htmlFor={selectId} className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.container} ref={dropdownRef}>
        <button
          ref={buttonRef}
          id={selectId}
          className={buttonClasses}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={`${selectId}-listbox`}
          aria-invalid={hasError}
          aria-describedby={describedBy}
          {...props}
        >
          <span className={styles.value}>{selectedLabel}</span>
          <svg
            className={styles.arrow}
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
          >
            <path fill="currentColor" d="M8 10L3 5h10z" />
          </svg>
        </button>

        {isOpen && (
          <ul
            ref={listRef}
            id={`${selectId}-listbox`}
            className={styles.list}
            role="listbox"
          >
            {parsedOptions.items.map((item, idx) => {
              if (isOptGroup(item)) {
                return (
                  <li key={`group-${idx}`} className={styles.optgroup}>
                    <div className={styles.optgroupLabel}>{item.label}</div>
                    <ul className={styles.optgroupOptions}>
                      {item.options.map((option) => (
                        <li
                          key={option.value}
                          role="option"
                          aria-selected={selectedValue === option.value}
                          className={selectedValue === option.value ? styles.selected : ""}
                          onClick={() => handleSelect(option.value, option.label)}
                        >
                          {option.label}
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              }

              return (
                <li
                  key={item.value}
                  role="option"
                  aria-selected={selectedValue === item.value}
                  className={selectedValue === item.value ? styles.selected : ""}
                  onClick={() => handleSelect(item.value, item.label)}
                >
                  {item.label}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {error && (
        <span id={errorId} className={styles.errorText} role="alert">
          {error}
        </span>
      )}
      {hint && !error && (
        <span id={hintId} className={styles.hintText}>
          {hint}
        </span>
      )}
    </div>
  );
};
