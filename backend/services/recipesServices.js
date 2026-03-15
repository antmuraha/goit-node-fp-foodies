import { Op } from 'sequelize';
import db from '../models/index.js';

const {
  Recipe,
  Category,
  User,
  Ingredient,
  Area,
  RecipeIngredient,
  RecipeArea,
  Favorite,
} = db;

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;
const { fn, col, literal } = db.Sequelize;

export const searchRecipes = async ({
  categoryId,
  ingredientId,
  areaId,
  search,
  limit,
  offset,
}) => {
  const safeLimit = Math.min(
    Math.max(Number(limit) || DEFAULT_LIMIT, 1),
    MAX_LIMIT,
  );
  const safeOffset = Math.max(Number(offset) || 0, 0);

  const where = {};
  if (categoryId) where.categoryId = Number(categoryId);
  if (search) where.name = { [Op.iLike]: `%${search}%` };

  const include = [
    { model: Category, attributes: ['id', 'name', 'image'] },
    { model: User, as: 'author', attributes: ['id', 'name', 'avatarURL'] },
  ];

  if (ingredientId) {
    include.push({
      model: Ingredient,
      through: { attributes: [] },
      where: { id: Number(ingredientId) },
      required: true,
      attributes: [],
    });
  }

  if (areaId) {
    include.push({
      model: Area,
      through: { attributes: [] },
      where: { id: Number(areaId) },
      required: true,
      attributes: [],
    });
  }

  const { count, rows } = await Recipe.findAndCountAll({
    where,
    include,
    limit: safeLimit,
    offset: safeOffset,
    distinct: true,
    order: [['createdAt', 'DESC']],
  });

  return { total: count, limit: safeLimit, offset: safeOffset, data: rows };
};

export const getPopularRecipesService = async ({ limit, offset }) => {
  const safeLimit = Math.min(
    Math.max(Number(limit) || DEFAULT_LIMIT, 1),
    MAX_LIMIT,
  );
  const safeOffset = Math.max(Number(offset) || 0, 0);
  /*
TODO: Temporary commented for testing without favorites.

  const topFavorites = await Favorite.findAll({
    attributes: ["recipeId", [fn("COUNT", col("recipeId")), "favoriteCount"]],
    group: ["recipeId"],
    order: [[literal('"favoriteCount"'), "DESC"]],
    limit: safeLimit,
    offset: safeOffset,
    raw: true,
  });

  const recipeIds = topFavorites.map((r) => r.recipeId);
  if (recipeIds.length === 0) return [];

  const recipes = await Recipe.findAll({
    where: { id: recipeIds },
    include: [
      { model: Category, attributes: ["id", "name", "image"] },
      { model: User, as: "author", attributes: ["id", "name", "avatar"] },
    ],
  });

  */

  // TODO: START TEMPORARY BLOCK
  const include = [
    { model: Category, attributes: ['id', 'name', 'image'] },
    { model: User, as: 'author', attributes: ['id', 'name', 'avatarURL'] },
  ];

  const { count, rows } = await Recipe.findAndCountAll({
    include,
    limit: safeLimit,
    offset: safeOffset,
    distinct: true,
    order: [['createdAt', 'DESC']],
  });

  return rows;
  // TODO: END TEMPORARY BLOCK

  return recipeIds.map((id) => recipes.find((r) => r.id === id));
};

export const getRecipeById = async (id) => {
  return Recipe.findByPk(id, {
    include: [
      { model: Category, attributes: ['id', 'name', 'image'] },
      { model: User, as: 'author', attributes: ['id', 'name', 'avatarURL'] },
      {
        model: Ingredient,
        through: { attributes: ['quantity', 'unit'] },
        attributes: ['id', 'name', 'image'],
      },
      {
        model: Area,
        through: { attributes: [] },
        attributes: ['id', 'name'],
      },
    ],
  });
};

export const createRecipe = async (userId, data) => {
  const { ingredients, areas, ...recipeData } = data;

  return db.sequelize.transaction(async (t) => {
    const recipe = await Recipe.create(
      {
        ...recipeData,
        userId,
      },
      { transaction: t },
    );

    if (ingredients?.length) {
      await RecipeIngredient.bulkCreate(
        ingredients.map((i) => ({
          recipeId: recipe.id,
          ingredientId: i.ingredientId,
          quantity: i.quantity,
        })),
        { transaction: t },
      );
    }

    if (areas?.length) {
      await RecipeArea.bulkCreate(
        areas.map((areaId) => ({
          recipeId: recipe.id,
          areaId,
        })),
        { transaction: t },
      );
    }

    return getRecipeById(recipe.id);
  });
};

export const getOwnRecipes = async (userId, { limit, offset }) => {
  const safeLimit = Math.min(
    Math.max(Number(limit) || DEFAULT_LIMIT, 1),
    MAX_LIMIT,
  );
  const safeOffset = Math.max(Number(offset) || 0, 0);

  const { count, rows } = await Recipe.findAndCountAll({
    where: { userId },
    include: [
      { model: Category, attributes: ['id', 'name', 'image'] },
      { model: User, as: 'author', attributes: ['id', 'name', 'avatarURL'] },
    ],
    limit: safeLimit,
    offset: safeOffset,
    distinct: true,
    order: [['createdAt', 'DESC']],
  });
  return { total: count, limit: safeLimit, offset: safeOffset, recipes: rows };
};

export const deleteRecipe = async (id, userId) => {
  const recipe = await Recipe.findByPk(id);

  if (!recipe) {
    const err = new Error('Recipe not found');
    err.status = 404;
    throw err;
  }

  if (recipe.userId !== userId) {
    const err = new Error('Not authorized');
    err.status = 403;
    throw err;
  }

  await recipe.destroy();
};

export const addFavoriteService = async (userId, recipeId) => {
  const recipe = await Recipe.findByPk(recipeId);

  if (!recipe) {
    const err = new Error('Recipe not found');
    err.status = 404;
    throw err;
  }

  const existing = await Favorite.findOne({
    where: { userId, recipeId },
  });

  if (existing) {
    const err = new Error('Recipe already in favorites');
    err.status = 409;
    throw err;
  }

  return Favorite.create({
    userId,
    recipeId,
  });
};

export const removeFavoriteService = async (userId, recipeId) => {
  const favorite = await Favorite.findOne({
    where: { userId, recipeId },
  });

  if (!favorite) {
    const err = new Error('Favorite not found');
    err.status = 404;
    throw err;
  }

  await favorite.destroy();
};

export const listFavoritesService = async (userId, { limit, offset }) => {
  const safeLimit = Math.min(
    Math.max(Number(limit) || DEFAULT_LIMIT, 1),
    MAX_LIMIT,
  );
  const safeOffset = Math.max(Number(offset) || 0, 0);

  const { count, rows } = await Favorite.findAndCountAll({
    where: { userId },
    include: [
      {
        model: Recipe,
        include: [
          { model: Category, attributes: ['id', 'name', 'image'] },
          {
            model: User,
            as: 'author',
            attributes: ['id', 'name', 'avatarURL'],
          },
        ],
      },
    ],
    limit: safeLimit,
    offset: safeOffset,
    order: [['createdAt', 'DESC']],
  });

  return {
    total: count,
    limit: safeLimit,
    offset: safeOffset,
    recipes: rows.map((f) => f.Recipe),
  };
};
