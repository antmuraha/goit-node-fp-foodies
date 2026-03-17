import {
  addFollow,
  getFollowStatus,
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
    const userId = Number.parseInt(req.params.id, 10);
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(Math.max(1, Number.parseInt(req.query.limit, 10) || 20), 100);
    const result = await getFollowersList(userId, { page, limit });
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

export const getFollowStatusByUser = async (req, res, next) => {
  try {
    const followerId = req.user.id;
    const followingId = Number.parseInt(req.params.id, 10);
    const result = await getFollowStatus(followerId, followingId);
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
