import type { ReactElement, ReactNode } from "react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "./Modal.module.css";

type ModalProps = {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  closeOnEscape?: boolean;
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
  children: ReactNode;
};

const getPortalContainer = (): HTMLElement => {
  let container = document.getElementById("modal-root");
  if (!container) {
    container = document.createElement("div");
    container.id = "modal-root";
    document.body.appendChild(container);
  }
  return container;
};

const getFocusableElements = (element: HTMLElement): HTMLElement[] => {
  const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  return Array.from(element.querySelectorAll(focusableSelectors)) as HTMLElement[];
};

export const Modal = ({
  isOpen,
  title,
  onClose,
  closeOnEscape = true,
  closeOnOverlayClick = true,
  showCloseButton = true,
  children,
}: ModalProps): ReactElement | null => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    previousActiveElementRef.current = document.activeElement as HTMLElement;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusableElements = modalRef.current ? getFocusableElements(modalRef.current) : [];
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    } else {
      modalRef.current?.focus();
    }

    return () => {
      document.body.style.overflow = originalOverflow;

      if (previousActiveElementRef.current && previousActiveElementRef.current.focus) {
        previousActiveElementRef.current.focus();
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (closeOnEscape && event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === "Tab" && modalRef.current) {
        const focusableElements = getFocusableElements(modalRef.current);
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        const activeElement = document.activeElement;

        if (event.shiftKey && activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeOnEscape, onClose]);

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div
        ref={modalRef}
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`modal-title-${title}`}
        tabIndex={-1}
      >
        <div className={styles.header}>
          <h2 className={styles.title} id={`modal-title-${title}`}>
            {title}
          </h2>
          {showCloseButton && (
            <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close dialog">
              ×
            </button>
          )}
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );

  return createPortal(modalContent, getPortalContainer());
};
