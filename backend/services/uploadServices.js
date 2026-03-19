import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import HttpError from "../helpers/HttpError.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RECIPE_IMAGE_DIR = path.join(__dirname, "../public/images");
const RECIPE_IMAGE_SIZE = 550;

const RECIPE_IMAGE_EXTENSION_BY_MIME = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
  "image/webp": ".webp",
};

const getRecipeImageExtension = (file) => {
  if (file?.mimetype && RECIPE_IMAGE_EXTENSION_BY_MIME[file.mimetype]) {
    return RECIPE_IMAGE_EXTENSION_BY_MIME[file.mimetype];
  }

  const ext = path.extname(file?.originalname || "").toLowerCase();
  return ext || ".png";
};

/**
 * Saves an uploaded recipe image file for a user
 * @param {string} prefix - The prefix for the image filename
 * @param {object} file - Multer file object
 * @returns {Promise<string>} - The recipe image URL path
 */
export const saveImage = async (prefix, file) => {
  if (!file) {
    throw HttpError(400, "No file provided");
  }

  try {
    await fs.mkdir(RECIPE_IMAGE_DIR, { recursive: true });

    const filename = `${prefix}${getRecipeImageExtension(file)}`;
    const filepath = path.join(RECIPE_IMAGE_DIR, filename);

    const imageBuffer = await sharp(file.buffer)
      .resize(RECIPE_IMAGE_SIZE, RECIPE_IMAGE_SIZE, { fit: "cover" })
      .png()
      .toBuffer();
    await fs.writeFile(filepath, imageBuffer);

    return `/images/${filename}`;
  } catch {
    throw HttpError(500, "Failed to save recipe image");
  }
};
