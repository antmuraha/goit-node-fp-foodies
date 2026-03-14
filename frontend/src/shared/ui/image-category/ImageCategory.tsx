import type { ImgHTMLAttributes, ReactElement } from "react";
import styles from "./ImageCategory.module.css";

type ImageCategoryProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet"> & {
  src: string;
};

const buildRetinaImagePath = (src: string): string => {
  const queryIndex = src.indexOf("?");
  const basePath = queryIndex >= 0 ? src.slice(0, queryIndex) : src;
  const query = queryIndex >= 0 ? src.slice(queryIndex) : "";

  const extensionIndex = basePath.lastIndexOf(".");

  if (extensionIndex === -1) {
    return `${basePath}@2x${query}`;
  }

  const fileName = basePath.slice(0, extensionIndex);
  const extension = basePath.slice(extensionIndex);

  return `${fileName}@2x${extension}${query}`;
};

export const ImageCategory = ({
  src,
  alt,
  className = "",
  loading = "lazy",
  ...props
}: ImageCategoryProps): ReactElement => {
  const srcSet = `${src} 1x, ${buildRetinaImagePath(src)} 2x`;
  const classes = [styles.image, className].filter(Boolean).join(" ");

  return <img src={src} srcSet={srcSet} alt={alt} className={classes} loading={loading} {...props} />;
};
