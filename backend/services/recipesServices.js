import { Op } from "sequelize";
import db from "../models/index.js";

const { Recipe, Category, User, Ingredient, Area, RecipeIngredient, RecipeArea, Favorite } = db;

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;
const { fn, col, literal } = db.Sequelize;

export const searchRecipes = async ({ categoryId, ingredientId, areaId, search, limit, offset }) => {
  const safeLimit = Math.min(Math.max(Number(limit) || DEFAULT_LIMIT, 1), MAX_LIMIT);
  const safeOffset = Math.max(Number(offset) || 0, 0);

  const where = {};
  if (categoryId) where.categoryId = Number(categoryId);
  if (search) where.name = { [Op.iLike]: `%${search}%` };

  const include = [
    { model: Category, attributes: ["id", "name", "image"] },
    { model: User, as: "author", attributes: ["id", "name", "avatar"] },
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
    order: [["createdAt", "DESC"]],
  });

  return { total: count, limit: safeLimit, offset: safeOffset, recipes: rows };
};

export const getPopularRecipesService = async ({ limit, offset }) => {
  const safeLimit = Math.min(Math.max(Number(limit) || DEFAULT_LIMIT, 1), MAX_LIMIT);
  const safeOffset = Math.max(Number(offset) || 0, 0);

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

  return recipeIds.map((id) => recipes.find((r) => r.id === id));
};

export const getRecipeById = async (id) => {
  return Recipe.findByPk(id, {
    include: [
      { model: Category, attributes: ["id", "name", "image"] },
      { model: User, as: "author", attributes: ["id", "name", "avatar"] },
      {
        model: Ingredient,
        through: { attributes: ["quantity", "unit"] },
        attributes: ["id", "name", "image"],
      },
      {
        model: Area,
        through: { attributes: [] },
        attributes: ["id", "name"],
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
  const safeLimit = Math.min(Math.max(Number(limit) || DEFAULT_LIMIT, 1), MAX_LIMIT);
  const safeOffset = Math.max(Number(offset) || 0, 0);

  const { count, rows } = await Recipe.findAndCountAll({
    where: { userId },
    include: [
      { model: Category, attributes: ["id", "name", "image"] },
      { model: User, as: "author", attributes: ["id", "name", "avatar"] },
    ],
    limit: safeLimit,
    offset: safeOffset,
    distinct: true,
    order: [["createdAt", "DESC"]],
  });
  return { total: count, limit: safeLimit, offset: safeOffset, recipes: rows };
};

export const deleteRecipe = async (id, userId) => {
  const recipe = await Recipe.findByPk(id);

  if (!recipe) {
    const err = new Error("Recipe not found");
    err.status = 404;
    throw err;
  }

  if (recipe.userId !== userId) {
    const err = new Error("Not authorized");
    err.status = 403;
    throw err;
  }

  await recipe.destroy();
};
