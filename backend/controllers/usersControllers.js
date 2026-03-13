import { saveAvatar, validateAvatarUrl } from "../services/avatarServices.js";
import db from "../models/index.js";
import {
  addFollow,
  getUserProfileWithMetrics,
  getFollowersList,
  getFollowingList,
  getOtherUserProfile,
  removeFollow,
} from "../services/userServices.js";

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

export const followUser = async (req, res, next) => {
  try {
    const followerId = req.user.id;
    const followingId = Number.parseInt(req.params.id, 10);
    const result = await addFollow(followerId, followingId);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const getFollowers = async (req, res, next) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(Math.max(1, Number.parseInt(req.query.limit, 10) || 20), 100);
    const result = await getFollowersList(req.user.id, { page, limit });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const getOtherUser = async (req, res, next) => {
  try {
    const profile = await getOtherUserProfile(req.params.id);
    res.status(200).json(profile);
  } catch (err) {
    next(err);
  }
};

export const getFollowing = async (req, res, next) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(Math.max(1, Number.parseInt(req.query.limit, 10) || 20), 100);
    const result = await getFollowingList(req.user.id, { page, limit });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const unfollowUser = async (req, res, next) => {
  try {
    const followerId = req.user.id;
    const followingId = Number.parseInt(req.params.id, 10);
    const result = await removeFollow(followerId, followingId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
