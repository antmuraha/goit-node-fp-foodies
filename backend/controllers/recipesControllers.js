import { searchRecipes, getRecipeById as findRecipeById } from "../services/recipesServices.js";

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
