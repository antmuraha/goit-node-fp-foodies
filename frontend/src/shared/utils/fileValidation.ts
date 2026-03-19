type FileValidationResult = {
  valid: boolean;
  errorMessage?: string;
};

export const validateFileSize = (file: File, maxSizeBytes: number): FileValidationResult => {
  if (file.size > maxSizeBytes) {
    const maxSizeMB = (maxSizeBytes / (1024 * 1024)).toFixed(2);
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      errorMessage: `File size (${fileSizeMB} MB) exceeds maximum allowed size (${maxSizeMB} MB)`,
    };
  }

  return { valid: true };
};
