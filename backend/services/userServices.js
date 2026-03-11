import db from "../models/index.js";

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
