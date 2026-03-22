import type { ImgHTMLAttributes, ReactElement } from "react";

type RecipeImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src?: string | null;
};

const PREVIEW_SEGMENT = "/preview/";
const LARGE_PREVIEW_SEGMENT = "/preview/large/";

const buildLargeRecipeImageUrl = (src: string): string => {
  const queryIndex = src.indexOf("?");
  const basePath = queryIndex >= 0 ? src.slice(0, queryIndex) : src;
  const query = queryIndex >= 0 ? src.slice(queryIndex) : "";

  if (basePath.includes(LARGE_PREVIEW_SEGMENT)) {
    return `${basePath}${query}`;
  }

  if (!basePath.includes(PREVIEW_SEGMENT)) {
    return `${basePath}${query}`;
  }

  return `${basePath.replace(PREVIEW_SEGMENT, LARGE_PREVIEW_SEGMENT)}${query}`;
};

const RecipeImage = ({ src, alt, loading = "lazy", ...props }: RecipeImageProps): ReactElement | null => {
  if (!src) {
    return null;
  }

  const largeSrc = buildLargeRecipeImageUrl(src);

  return (
    <picture>
      <source media="(min-width: 768px)" srcSet={largeSrc} />
      <img src={src} alt={alt} loading={loading} {...props} />
    </picture>
  );
};

export default RecipeImage;
