import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const AVATARS_DIR = path.join(__dirname, '../public/avatars');

/**
 * Saves an uploaded avatar file for a user
 * @param {number} userId - The user ID
 * @param {object} file - Multer file object
 * @returns {Promise<string>} - The avatar URL path
 */
export const saveAvatar = async (userId, file) => {
  if (!file) {
    throw { status: 400, message: 'No file provided' };
  }

  try {
    // Create avatars directory if it doesn't exist
    await fs.mkdir(AVATARS_DIR, { recursive: true });

    // Generate filename with user ID and original extension
    const ext = path.extname(file.originalname);
    const filename = `${userId}${ext}`;
    const filepath = path.join(AVATARS_DIR, filename);

    // Save file to disk
    await fs.writeFile(filepath, file.buffer);

    // Return the URL path
    return `/avatars/${filename}`;
  } catch (err) {
    throw { status: 500, message: 'Failed to save avatar' };
  }
};

/**
 * Validates an avatar URL
 * @param {string} url - The avatar URL to validate
 * @returns {Promise<void>}
 */
export const validateAvatarUrl = async (url) => {
  if (!url || url.trim() === '') {
    // Allow empty URL to clear avatar
    return;
  }

  try {
    // Basic URL validation using URL constructor
    new URL(url);
  } catch (err) {
    throw { status: 400, message: 'Invalid avatar URL format' };
  }
};
