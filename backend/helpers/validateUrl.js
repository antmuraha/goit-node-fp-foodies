import HttpError from "./HttpError.js";

/**
 * Validates an image URL
 * @param {string} url - The image URL to validate
 * @returns {Promise<void>}
 */
const validateUrl = async (url) => {
  if (!url || url.trim() === "") {
    return;
  }

  try {
    new URL(url);
  } catch {
    throw HttpError(400, "Invalid image URL format");
  }
};

export default validateUrl;
