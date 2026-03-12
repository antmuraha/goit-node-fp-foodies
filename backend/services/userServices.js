import db from "../models/index.js";

export const getFollowersList = async (userId, { page, limit }) => {
  const offset = (page - 1) * limit;
  const { count, rows } = await db.Follow.findAndCountAll({
    where: { followingId: userId },
    include: [{ model: db.User, as: "follower", attributes: ["id", "name", "email", "avatar"] }],
    order: [["createdAt", "DESC"]],
    limit,
    offset,
  });
  return { followers: rows.map((f) => f.follower), total: count, page, limit };
};

export const getFollowingList = async (userId, { page, limit }) => {
  const offset = (page - 1) * limit;
  const { count, rows } = await db.Follow.findAndCountAll({
    where: { followerId: userId },
    include: [{ model: db.User, as: "following", attributes: ["id", "name", "email", "avatar"] }],
    order: [["createdAt", "DESC"]],
    limit,
    offset,
  });
  return { following: rows.map((f) => f.following), total: count, page, limit };
};

export const getUserProfileWithMetrics = async (userId) => {
  const user = await db.User.findByPk(userId, {
    attributes: ["id", "name", "email", "avatar"],
  });

  if (!user) {
    throw { status: 404, message: "User not found" };
  }

  const [recipesCreated, favoritesCount, followersCount, followingCount] = await Promise.all([
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
