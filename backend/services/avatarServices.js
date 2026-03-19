import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import HttpError from "../helpers/HttpError.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const AVATARS_DIR = path.join(__dirname, "../public/avatars");
const AVATAR_SIZE = 250;
const AVATAR_OUTPUT_EXTENSION = ".png";
const AVATAR_OUTPUT_MIME = "image/png";

/**
 * Saves an uploaded avatar file for a user
 * @param {number} userId - The user ID
 * @param {object} file - Multer file object
 * @returns {Promise<string>} - The avatar URL path
 */
export const saveAvatar = async (userId, file) => {
  if (!file) {
    throw HttpError(400, "No file provided");
  }

  try {
    await fs.mkdir(AVATARS_DIR, { recursive: true });

    const filename = `${userId}${AVATAR_OUTPUT_EXTENSION}`;
    const filepath = path.join(AVATARS_DIR, filename);

    const imageBuffer = await sharp(file.buffer).resize(AVATAR_SIZE, AVATAR_SIZE, { fit: "cover" }).png().toBuffer();
    await fs.writeFile(filepath, imageBuffer);

    return `/avatars/${filename}`;
  } catch {
    throw HttpError(500, "Failed to save avatar");
  }
};

/**
 * Validates an avatar URL
 * @param {string} url - The avatar URL to validate
 * @returns {Promise<void>}
 */
export const validateAvatarUrl = async (url) => {
  if (!url || url.trim() === "") {
    return;
  }

  try {
    new URL(url);
  } catch {
    throw HttpError(400, "Invalid avatar URL format");
  }
};
