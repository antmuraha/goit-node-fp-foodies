import { Op } from "sequelize";
import db from "../models/index.js";

const { Recipe, Category, User, Ingredient, Area, RecipeIngredient, RecipeArea, Favorite } = db;

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;
const { fn, col, literal } = db.Sequelize;

const toRecipeModelPayload = (data = {}) => {
  const payload = { ...data };

  if (typeof payload.name === "string") {
    payload.title = payload.name;
  }

  delete payload.name;
  delete payload.servings;

  return payload;
};

const toIngredientMeasure = (quantity, unit) => {
  const safeQuantity = quantity === null || quantity === undefined ? "" : String(quantity).trim();
  const safeUnit = typeof unit === "string" ? unit.trim() : "";

  if (!safeUnit) {
    return safeQuantity;
  }

  if (!safeQuantity) {
    return safeUnit;
  }

  const separator = safeUnit.length > 2 ? " " : "";
  return `${safeQuantity}${separator}${safeUnit}`;
};

const parseIngredientMeasure = (ingredient) => {
  const measureSource =
    typeof ingredient.measure === "string"
      ? ingredient.measure
      : typeof ingredient.quantity === "string"
        ? ingredient.quantity
        : String(ingredient.quantity ?? "");

  const measure = measureSource.trim();

  if (!measure) {
    return { quantity: "", unit: null };
  }

  const match = measure.match(/^(\d+(?:[.,]\d+)?)\s*(.*)$/);

  if (!match) {
    return { quantity: measure, unit: null };
  }

  const [, quantityRaw, unitRaw] = match;
  const quantity = quantityRaw.replace(",", ".");
  const unit = unitRaw?.trim() ? unitRaw.trim() : null;

  return { quantity, unit };
};

const normalizeRecipeDetail = (recipeInstance) => {
  if (!recipeInstance) {
    return null;
  }

  const recipe = recipeInstance.toJSON();
  const ingredients = Array.isArray(recipe.Ingredients)
    ? recipe.Ingredients.map((ingredient) => ({
        id: ingredient.id,
        measure: toIngredientMeasure(ingredient.RecipeIngredient?.quantity, ingredient.RecipeIngredient?.unit),
        name: ingredient.name,
        image: ingredient.image,
      }))
    : [];

  const { Ingredients, ...restRecipe } = recipe;

  return {
    ...restRecipe,
    ingredients,
  };
};

export const searchRecipes = async ({ categoryId, ingredientId, areaId, search, limit, offset }) => {
  const safeLimit = Math.min(Math.max(Number(limit) || DEFAULT_LIMIT, 1), MAX_LIMIT);
  const safeOffset = Math.max(Number(offset) || 0, 0);

  const where = {};
  if (categoryId) where.categoryId = Number(categoryId);
  if (search) where.title = { [Op.iLike]: `%${search}%` };

  const include = [
    { model: Category, as: "category", attributes: ["id", "name", "image"] },
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
      as: "areas",
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

  return { total: count, limit: safeLimit, offset: safeOffset, data: rows };
};

export const getPopularRecipesService = async ({ limit, offset }) => {
  const safeLimit = Math.min(Math.max(Number(limit) || DEFAULT_LIMIT, 1), MAX_LIMIT);
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
      { model: Category, as: "category", attributes: ["id", "name", "image"] },
      { model: User, as: "author", attributes: ["id", "name", "avatar"] },
    ],
  });

  */

  // TODO: START TEMPORARY BLOCK
  const include = [
    { model: Category, as: "category", attributes: ["id", "name", "image"] },
    { model: User, as: "author", attributes: ["id", "name", "avatar"] },
  ];

  const { count, rows } = await Recipe.findAndCountAll({
    include,
    limit: safeLimit,
    offset: safeOffset,
    distinct: true,
    order: [["createdAt", "DESC"]],
  });

  return rows;
  // TODO: END TEMPORARY BLOCK

  return recipeIds.map((id) => recipes.find((r) => r.id === id));
};

export const getRecipeById = async (id, options = {}) => {
  const { transaction } = options;

  const recipe = await Recipe.findByPk(id, {
    include: [
      { model: Category, as: "category", attributes: ["id", "name", "image"] },
      { model: User, as: "author", attributes: ["id", "name", "avatar"] },
      {
        model: Ingredient,
        through: { attributes: ["quantity", "unit"] },
        attributes: ["id", "name", "image"],
      },
      {
        model: Area,
        as: "areas",
        through: { attributes: [] },
        attributes: ["id", "name"],
      },
    ],
    transaction,
  });

  return normalizeRecipeDetail(recipe);
};

export const createRecipe = async (userId, data) => {
  const { ingredients, areas, ...recipeData } = data;
  const normalizedRecipeData = toRecipeModelPayload(recipeData);

  return db.sequelize.transaction(async (t) => {
    const recipe = await Recipe.create(
      {
        ...normalizedRecipeData,
        userId,
      },
      { transaction: t },
    );

    if (ingredients?.length) {
      await RecipeIngredient.bulkCreate(
        ingredients.map((i) => ({
          ...parseIngredientMeasure(i),
          recipeId: recipe.id,
          ingredientId: i.ingredientId,
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

    return getRecipeById(recipe.id, { transaction: t });
  });
};

export const updateRecipe = async (id, userId, data) => {
  const { ingredients, areas, ...recipeData } = data;
  const normalizedRecipeData = toRecipeModelPayload(recipeData);

  return db.sequelize.transaction(async (t) => {
    const recipe = await Recipe.findByPk(id, { transaction: t });

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

    if (Object.keys(normalizedRecipeData).length > 0) {
      await recipe.update(normalizedRecipeData, { transaction: t });
    }

    if (Array.isArray(ingredients)) {
      await RecipeIngredient.destroy({
        where: { recipeId: id },
        transaction: t,
      });

      if (ingredients.length > 0) {
        await RecipeIngredient.bulkCreate(
          ingredients.map((ingredientItem) => ({
            ...parseIngredientMeasure(ingredientItem),
            recipeId: id,
            ingredientId: ingredientItem.ingredientId,
          })),
          { transaction: t },
        );
      }
    }

    if (Array.isArray(areas)) {
      await RecipeArea.destroy({
        where: { recipeId: id },
        transaction: t,
      });

      if (areas.length > 0) {
        await RecipeArea.bulkCreate(
          areas.map((areaId) => ({ recipeId: id, areaId })),
          { transaction: t },
        );
      }
    }

    return getRecipeById(id, { transaction: t });
  });
};

export const getOwnRecipes = async (userId, { limit, offset }) => {
  const safeLimit = Math.min(Math.max(Number(limit) || DEFAULT_LIMIT, 1), MAX_LIMIT);
  const safeOffset = Math.max(Number(offset) || 0, 0);

  const { count, rows } = await Recipe.findAndCountAll({
    where: { userId },
    include: [
      { model: Category, as: "category", attributes: ["id", "name", "image"] },
      { model: User, as: "author", attributes: ["id", "name", "avatar"] },
    ],
    limit: safeLimit,
    offset: safeOffset,
    distinct: true,
    order: [["createdAt", "DESC"]],
  });
  return { total: count, limit: safeLimit, offset: safeOffset, data: rows };
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

export const addFavoriteService = async (userId, recipeId) => {
  const recipe = await Recipe.findByPk(recipeId);

  if (!recipe) {
    const err = new Error("Recipe not found");
    err.status = 404;
    throw err;
  }

  const existing = await Favorite.findOne({
    where: { userId, recipeId },
  });

  if (existing) {
    const err = new Error("Recipe already in favorites");
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
    const err = new Error("Favorite not found");
    err.status = 404;
    throw err;
  }

  await favorite.destroy();
};

export const getFavoriteStatusService = async (userId, recipeId) => {
  const favorite = await Favorite.findOne({ where: { userId, recipeId } });
  return { recipeId, isFavorite: Boolean(favorite) };
};

export const listFavoritesService = async (userId, { limit, offset }) => {
  const safeLimit = Math.min(Math.max(Number(limit) || DEFAULT_LIMIT, 1), MAX_LIMIT);
  const safeOffset = Math.max(Number(offset) || 0, 0);

  const { count, rows } = await Favorite.findAndCountAll({
    where: { userId },
    include: [
      {
        model: Recipe,
        include: [
          { model: Category, as: "category", attributes: ["id", "name", "image"] },
          { model: User, as: "author", attributes: ["id", "name", "avatar"] },
        ],
      },
    ],
    limit: safeLimit,
    offset: safeOffset,
    order: [["createdAt", "DESC"]],
  });

  return {
    total: count,
    limit: safeLimit,
    offset: safeOffset,
    data: rows.map((f) => f.Recipe),
  };
};
