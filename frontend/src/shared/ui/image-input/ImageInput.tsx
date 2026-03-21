import { cloneElement, useEffect, useRef, useState, type MouseEvent, type ReactElement } from "react";
import { FileInput } from "../file-input";
import { Icon } from "../../components/Icon";
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
        /* Uploaded state — click anywhere on image to replace */
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
        /* Empty state — Figma node 22:736: camera icon 64px + "Upload a photo" underlined */
        <button
          type="button"
          className={[styles.placeholder, hasError && styles.placeholderError].filter(Boolean).join(" ")}
          onClick={handleTriggerClick}
          disabled={disabled}
          aria-label="Upload a photo"
        >
          {/* Figma: camera icon 64×64, color #bfbebe — token input-placeholder */}
          <Icon name="camera" color="input-placeholder" size={64} />
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
          className={elementTrigger ? styles.hiddenInput : undefined}
        />
      )}

      {/*
        Figma filled state (node 44:1570): "Upload another photo" shown ONLY when image is present.
        Empty state has no trigger link below the placeholder.
      */}
      {imageSrc && renderedTrigger}
    </div>
  );
};
