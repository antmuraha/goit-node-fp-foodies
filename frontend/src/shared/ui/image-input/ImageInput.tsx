import { cloneElement, useEffect, useRef, useState, type MouseEvent, type ReactElement } from "react";
import { FileInput } from "../file-input";
import { validateFileSize } from "../../utils/fileValidation";
import { canvasCoverResize } from "../../utils/canvasUtils";
import styles from "./ImageInput.module.css";

type TriggerElementProps = {
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  disabled?: boolean;
};

type ImageInputProps = {
  id?: string;
  label?: string;
  initialImageUrl?: string;
  accept?: string;
  disabled?: boolean;
  hasError?: boolean;
  error?: string;
  onFileSelect?: (file: File | null) => void;
  elementTrigger?: ReactElement<TriggerElementProps> | false;
  showFileName?: boolean;
  maxSize?: number;
  targetWidth?: number;
  targetHeight?: number;
};

export const ImageInput = ({
  id,
  label,
  initialImageUrl,
  accept = "image/*",
  disabled = false,
  hasError = false,
  error,
  onFileSelect,
  elementTrigger,
  showFileName = false,
  maxSize,
  targetWidth,
  targetHeight,
}: ImageInputProps): ReactElement => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedImageName, setSelectedImageName] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileSelect = async (file: File | null): Promise<void> => {
    if (!file) return;

    if (maxSize !== undefined) {
      const sizeValidation = validateFileSize(file, maxSize);
      if (!sizeValidation.valid) {
        onFileSelect?.(null);
        return;
      }
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);

    let fileToProcess = file;

    if (targetWidth !== undefined && targetHeight !== undefined) {
      try {
        fileToProcess = await canvasCoverResize(file, targetWidth, targetHeight);
      } catch (err) {
        console.error("Canvas resize failed:", err);
        onFileSelect?.(null);
        return;
      }
    }

    const nextPreviewUrl = URL.createObjectURL(fileToProcess);
    setPreviewUrl(nextPreviewUrl);
    setSelectedImageName(fileToProcess.name);
    onFileSelect?.(fileToProcess);
  };

  const imageSrc = previewUrl || initialImageUrl || "";

  const handleTriggerClick = (): void => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const renderedTrigger = elementTrigger
    ? cloneElement(elementTrigger, {
        onClick: (event: MouseEvent<HTMLElement>) => {
          elementTrigger.props.onClick?.(event);
          if (!event.defaultPrevented) handleTriggerClick();
        },
        disabled: elementTrigger.props.disabled ?? disabled,
      })
    : null;

  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}

      {imageSrc ? (
        /* Uploaded image — click to replace */
        <button
          type="button"
          className={styles.previewBtn}
          onClick={handleTriggerClick}
          disabled={disabled}
          aria-label="Change image"
        >
          <img src={imageSrc} alt="Preview" className={styles.preview} />
        </button>
      ) : (
        /* Empty state — Figma: camera icon + "Upload a photo" */
        <button
          type="button"
          className={[styles.placeholder, hasError && styles.placeholderError].filter(Boolean).join(" ")}
          onClick={handleTriggerClick}
          disabled={disabled}
          aria-label="Upload a photo"
        >
          {/* Camera icon from Figma node 22:730 */}
          <svg
            className={styles.cameraIcon}
            width="64"
            height="64"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <rect x="8" y="18" width="48" height="36" rx="6" stroke="#bfbebe" strokeWidth="2.5" fill="none" />
            <path
              d="M22 18l4-8h12l4 8"
              stroke="#bfbebe"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <circle cx="32" cy="36" r="8" stroke="#bfbebe" strokeWidth="2.5" fill="none" />
            <circle cx="50" cy="26" r="2" fill="#bfbebe" />
          </svg>
          <span className={styles.placeholderText}>Upload a photo</span>
        </button>
      )}

      {elementTrigger !== false && (
        <FileInput
          ref={fileInputRef}
          id={id}
          accept={accept}
          onFileSelect={handleFileSelect}
          disabled={disabled}
          hint={showFileName ? selectedImageName || "Selected image is used for local preview only" : undefined}
          hasError={hasError}
          error={error}
          /* Hide native input when a custom trigger is provided — original logic preserved */
          className={elementTrigger ? styles.hiddenInput : undefined}
        />
      )}

      {renderedTrigger}
    </div>
  );
};
