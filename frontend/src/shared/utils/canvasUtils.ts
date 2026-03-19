/**
 * Resizes an image file to target dimensions using canvas "cover" mode.
 * The image maintains aspect ratio and crops edges to fit the target dimensions.
 *
 * @param file - The image file to resize
 * @param targetWidth - Target canvas width in pixels
 * @param targetHeight - Target canvas height in pixels
 * @returns Promise that resolves to a new File with the resized image
 */
export const canvasCoverResize = async (file: File, targetWidth: number, targetHeight: number): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas 2D context"));
          return;
        }

        // Calculate dimensions to cover the target area while maintaining aspect ratio
        const imgAspect = img.width / img.height;
        const targetAspect = targetWidth / targetHeight;

        let drawWidth: number;
        let drawHeight: number;

        if (imgAspect > targetAspect) {
          // Image is wider: fit by height, crop sides
          drawHeight = targetHeight;
          drawWidth = targetHeight * imgAspect;
        } else {
          // Image is taller: fit by width, crop top/bottom
          drawWidth = targetWidth;
          drawHeight = targetWidth / imgAspect;
        }

        const offsetX = (targetWidth - drawWidth) / 2;
        const offsetY = (targetHeight - drawHeight) / 2;

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error("Failed to create blob from canvas"));
            return;
          }

          // Create a File from the blob with original filename (or .png as fallback)
          const fileName = file.name || "image.png";
          const resizedFile = new File([blob], fileName, {
            type: "image/png",
          });

          resolve(resizedFile);
        }, "image/png");
      };

      img.onerror = () => {
        reject(new Error("Failed to load image from file"));
      };

      img.src = event.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsDataURL(file);
  });
};
