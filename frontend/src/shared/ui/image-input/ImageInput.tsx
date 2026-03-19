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
  label = "Image",
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
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileSelect = async (file: File | null): Promise<void> => {
    if (!file) {
      return;
    }

    // Validate file size if maxSize is provided
    if (maxSize !== undefined) {
      const sizeValidation = validateFileSize(file, maxSize);
      if (!sizeValidation.valid) {
        onFileSelect?.(null);
        return;
      }
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    let fileToProcess = file;

    // Resize image via canvas if target dimensions are provided
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
    if (disabled) {
      return;
    }

    fileInputRef.current?.click();
  };

  const renderedTrigger = elementTrigger
    ? cloneElement(elementTrigger, {
        onClick: (event: MouseEvent<HTMLElement>) => {
          elementTrigger.props.onClick?.(event);

          if (!event.defaultPrevented) {
            handleTriggerClick();
          }
        },
        disabled: elementTrigger.props.disabled ?? disabled,
      })
    : null;

  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}
      {imageSrc ? (
        <img src={imageSrc} alt="Preview" className={styles.preview} />
      ) : (
        <div className={styles.placeholder}>Select an image to see preview</div>
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
      {renderedTrigger}
    </div>
  );
};
