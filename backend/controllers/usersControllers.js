import { getUserProfileWithMetrics, getFollowersList, getFollowingList, getOtherUserProfile } from "../services/userServices.js";

export const getCurrentUser = async (req, res, next) => {
  try {
    const profile = await getUserProfileWithMetrics(req.user.id);
    res.status(200).json(profile);
  } catch (err) {
    next(err);
  }
};

export const getFollowers = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(Math.max(1, parseInt(req.query.limit) || 20), 100);
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
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(Math.max(1, parseInt(req.query.limit) || 20), 100);
    const result = await getFollowingList(req.user.id, { page, limit });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
