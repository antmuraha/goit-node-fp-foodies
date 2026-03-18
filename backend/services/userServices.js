import HttpError from '../helpers/HttpError.js';
import db from '../models/index.js';

export const getFollowersList = async (userId, { page, limit }) => {
  const offset = (page - 1) * limit;
  const { count, rows } = await db.Follow.findAndCountAll({
    where: { followingId: userId },
    include: [
      {
        model: db.User,
        as: 'follower',
        attributes: ['id', 'name', 'email', 'avatarURL'],
      },
    ],
    order: [['createdAt', 'DESC']],
    limit,
    offset,
  });
  return { data: rows.map((f) => f.follower), total: count, page, limit };
};

/**
 * Creates a follow relation between two users.
 * @param {number} followerId
 * @param {number} followingId
 * @returns {Promise<{message: string}>}
 */
export const addFollow = async (followerId, followingId) => {
  if (followerId === followingId) {
    throw HttpError(400, 'Cannot follow yourself');
  }

  const targetUser = await db.User.findByPk(followingId);

  if (!targetUser) {
    throw HttpError(404, 'User not found');
  }

  const [, created] = await db.Follow.findOrCreate({
    where: { followerId, followingId },
    defaults: { followerId, followingId },
  });

  if (!created) {
    throw HttpError(409, 'Already following this user');
  }

  return { message: 'Followed successfully' };
};

/**
 * Removes a follow relation between two users.
 * @param {number} followerId
 * @param {number} followingId
 * @returns {Promise<{message: string}>}
 */
export const removeFollow = async (followerId, followingId) => {
  const deleted = await db.Follow.destroy({
    where: { followerId, followingId },
  });

  if (deleted === 0) {
    throw HttpError(404, 'Not following this user');
  }

  return { message: 'Unfollowed successfully' };
};

export const getFollowingList = async (userId, { page, limit }) => {
  const offset = (page - 1) * limit;
  const { count, rows } = await db.Follow.findAndCountAll({
    where: { followerId: userId },
    include: [
      {
        model: db.User,
        as: 'following',
        attributes: ['id', 'name', 'email', 'avatarURL'],
      },
    ],
    order: [['createdAt', 'DESC']],
    limit,
    offset,
  });
  return { data: rows.map((f) => f.following), total: count, page, limit };
};

export const getFollowStatus = async (followerId, followingId) => {
  if (followerId === followingId) {
    return { userId: followingId, isFollowing: false };
  }

  const targetUser = await db.User.findByPk(followingId);

  if (!targetUser) {
    throw HttpError(404, 'User not found');
  }

  const follow = await db.Follow.findOne({
    where: { followerId, followingId },
  });

  return {
    userId: followingId,
    isFollowing: Boolean(follow),
  };
};

export const getOtherUserProfile = async (targetId) => {
  const user = await db.User.findByPk(targetId, {
    attributes: ['id', 'name', 'email', 'avatarURL', 'createdAt'],
  });

  if (!user) {
    throw { status: 404, message: 'User not found' };
  }

  const [recipesCreated, followersCount] = await Promise.all([
    db.Recipe.count({ where: { userId: targetId } }),
    db.Follow.count({ where: { followingId: targetId } }),
  ]);

  const { id, name, email, avatarURL, createdAt } = user.toJSON();

  return {
    id,
    name,
    avatarURL,
    email,
    avatar,
    createdAt,
    recipesCreated,
    followersCount,
  };
};

export const getUserProfileWithMetrics = async (userId) => {
  const user = await db.User.findByPk(userId, {
    attributes: ['id', 'name', 'email', 'avatarURL'],
  });

  if (!user) {
    throw { status: 404, message: 'User not found' };
  }

  const [recipesCreated, favoritesCount, followersCount, followingCount] =
    await Promise.all([
      db.Recipe.count({ where: { userId } }),
      db.Favorite.count({ where: { userId } }),
      db.Follow.count({ where: { followingId: userId } }),
      db.Follow.count({ where: { followerId: userId } }),
    ]);

  return {
    ...user.toJSON(),
    recipesCreated,
    favoritesCount,
    followersCount,
    followingCount,
  };
};
