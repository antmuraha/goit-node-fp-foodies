import { getUserProfileWithMetrics } from "../services/userServices.js";
import { saveAvatar, validateAvatarUrl } from "../services/avatarServices.js";
import db from "../models/index.js";

export const getCurrentUser = async (req, res, next) => {
  try {
    const profile = await getUserProfileWithMetrics(req.user.id);
    res.status(200).json(profile);
  } catch (err) {
    next(err);
  }
};

/**
 * Updates user avatar - supports both file upload and URL update
 * Accepts multipart/form-data with 'avatar' file OR application/json with avatar URL
 */
export const updateAvatar = async (req, res, next) => {
  try {
    const userId = req.user.id;
    let avatarUrl;

    // Branch logic: file upload OR URL update
    if (req.file) {
      // File upload path
      avatarUrl = await saveAvatar(userId, req.file);
    } else if (req.body.avatar !== undefined) {
      // URL update path
      await validateAvatarUrl(req.body.avatar);
      avatarUrl = req.body.avatar || null;
    } else {
      // No file or URL provided
      throw { status: 400, message: "Avatar file or URL required" };
    }

    // Update user avatar in database
    await db.User.update({ avatar: avatarUrl }, { where: { id: userId } });

    // Fetch and return updated user profile
    const user = await db.User.findByPk(userId, {
      attributes: { exclude: ["password", "token"] },
    });

    res.status(200).json({ user: user.toJSON() });
  } catch (err) {
    next(err);
  }
};

