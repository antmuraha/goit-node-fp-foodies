import { baseImageUrl } from "../config/constants.js";
import HttpError from "../helpers/HttpError.js";
import validateUrl from "../helpers/validateUrl.js";
import {
  searchRecipes,
  getRecipeById as findRecipeById,
  createRecipe as createRecipeService,
  updateRecipe as updateRecipeService,
  deleteRecipe as deleteRecipeService,
  getOwnRecipes as getOwnRecipesService,
  getPopularRecipesService,
  addFavoriteService,
  removeFavoriteService,
  listFavoritesService,
  getFavoriteStatusService,
} from "../services/recipesServices.js";
import { saveImage } from "../services/uploadServices.js";

export const getRecipes = async (req, res, next) => {
  try {
    const { categoryId, ingredientId, areaId, search, limit, offset } = req.query;
    const result = await searchRecipes({ categoryId, ingredientId, areaId, search, limit, offset });
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
    const userId = Number.parseInt(req.params.id, 10);
    const { limit, offset } = req.query;
    const recipesList = await getOwnRecipesService(userId, { limit, offset });
    res.status(200).json(recipesList);
  } catch (err) {
    next(err);
  }
};

export const updateRecipe = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid recipe id" });
    }

    const recipe = await updateRecipeService(id, req.user.id, req.body);
    res.status(200).json(recipe);
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

export const uploadRecipeImage = async (req, res, next) => {
  try {
    const userId = req.user.id;
    let image;

    if (req.file) {
      image = await saveImage(`recipe-${Date.now()}`, req.file);
    } else if (req.body.avatar !== undefined) {
      await validateUrl(req.body.avatar);
      image = req.body.avatar || null;
    } else {
      throw HttpError(400, "Image file or URL required");
    }
    res.status(200).json({ image: image ? `${baseImageUrl}${image}` : null });
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

export const getFavoriteStatus = async (req, res, next) => {
  try {
    const recipeId = Number(req.params.id);

    if (!Number.isInteger(recipeId) || recipeId <= 0) {
      return res.status(400).json({ message: "Invalid recipe id" });
    }

    const result = await getFavoriteStatusService(req.user.id, recipeId);
    res.status(200).json(result);
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
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
