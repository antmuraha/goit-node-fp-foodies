import type { ReactElement, ReactNode } from "react";
import { useEffect, useRef, useId, useCallback } from "react";
import { createPortal } from "react-dom";
import { Icon } from "../../components/Icon";
import styles from "./Modal.module.css";

type ModalProps = {
  isOpen: boolean;
  title: string;
  tabletTitle?: string;
  onClose: () => void;
  closeOnEscape?: boolean;
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
  centeredTitle?: boolean;
  children: ReactNode;
};

const FOCUSABLE_SELECTOR = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export const Modal = ({
  isOpen,
  title,
  tabletTitle,
  onClose,
  closeOnEscape = true,
  closeOnOverlayClick = true,
  showCloseButton = true,
  centeredTitle = false,
  children,
}: ModalProps): ReactElement | null => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const id = useId();

  const handleClose = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    previousFocus.current = document.activeElement as HTMLElement;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusable = modalRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    if (focusable && focusable.length > 0) {
      focusable[0].focus();
    } else {
      modalRef.current?.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === "Escape") handleClose();

      if (e.key === "Tab" && modalRef.current) {
        const elements = modalRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
        if (elements.length === 0) return;

        const first = elements[0];
        const last = elements[elements.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus.current?.focus();
    };
  }, [isOpen, closeOnEscape, handleClose]);

  const onOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  const target = document.getElementById("modal-root") || document.body;

  return createPortal(
    <div className={styles.overlay} onClick={onOverlayClick}>
      <div ref={modalRef} className={styles.modal} role="dialog" aria-modal="true" aria-labelledby={id} tabIndex={-1}>
        <div className={styles.header}>
          <h2 className={`${styles.title}${centeredTitle ? ` ${styles.titleCentered}` : ""}`} id={id}>
            {tabletTitle ? (
              <>
                <span className={styles.titleMobile}>{title}</span>
                <span className={styles.titleTablet}>{tabletTitle}</span>
              </>
            ) : (
              title
            )}
          </h2>
          {showCloseButton && (
            <button type="button" className={styles.closeButton} onClick={handleClose} aria-label="Close dialog">
              <Icon name="close" color="text-primary" size={24} />
            </button>
          )}
        </div>
        <div className={styles.modalContent}>{children}</div>
      </div>
    </div>,
    target,
  );
};
