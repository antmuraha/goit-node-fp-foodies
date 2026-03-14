import {
  searchRecipes,
  getRecipeById as findRecipeById,
  createRecipe as createRecipeService,
  deleteRecipe as deleteRecipeService,
  getOwnRecipes as getOwnRecipesService,
  getPopularRecipesService,
  addFavoriteService,
  removeFavoriteService,
  listFavoritesService,
} from "../services/recipesServices.js";

export const getRecipes = async (req, res, next) => {
  try {
    const { categoryId, ingredientId, areaId, search, limit, offset } = req.query;
    const result = await searchRecipes({ categoryId, ingredientId, areaId, search, limit, offset });
    res.set("Cache-Control", "public, max-age=300, stale-while-revalidate=600");
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const getPopularRecipes = async (req, res, next) => {
  try {
    const { limit, offset } = req.query;
    const result = await getPopularRecipesService({ limit, offset });

    const data = {
      data: result || [],
      page: Number(offset) || 0,
      limit: Number(limit) || 10,
    };

    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const getRecipeById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid recipe id" });
    }
    const recipe = await findRecipeById(id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.set("Cache-Control", "public, max-age=600, stale-while-revalidate=1800");
    res.json(recipe);
  } catch (err) {
    next(err);
  }
};

export const createRecipe = async (req, res, next) => {
  try {
    const recipe = await createRecipeService(req.user.id, req.body);
    res.status(201).json(recipe);
  } catch (err) {
    next(err);
  }
};

export const getOwnRecipes = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { limit, offset } = req.query;
    const recipesList = await getOwnRecipesService(userId, { limit, offset });
    res.set("Cache-Control", "private, no-store");
    res.status(200).json(recipesList);
  } catch (err) {
    next(err);
  }
};

export const deleteRecipe = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid recipe id" });
    }

    await deleteRecipeService(id, req.user.id);

    res.json({ message: "Recipe deleted successfully" });
  } catch (err) {
    next(err);
  }
};

export const addFavorite = async (req, res, next) => {
  try {
    const recipeId = Number(req.params.id);

    if (!Number.isInteger(recipeId) || recipeId <= 0) {
      return res.status(400).json({ message: "Invalid recipe id" });
    }

    const result = await addFavoriteService(req.user.id, recipeId);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const removeFavorite = async (req, res, next) => {
  try {
    const recipeId = Number(req.params.id);

    if (!Number.isInteger(recipeId) || recipeId <= 0) {
      return res.status(400).json({ message: "Invalid recipe id" });
    }

    await removeFavoriteService(req.user.id, recipeId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const listFavorites = async (req, res, next) => {
  try {
    const { limit, offset } = req.query;

    const result = await listFavoritesService(req.user.id, {
      limit,
      offset,
    });

    res.set("Cache-Control", "private, no-store");
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
