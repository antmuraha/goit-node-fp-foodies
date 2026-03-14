import { listIngredients } from "../services/ingredientsServices.js";

export const getIngredients = async (_req, res, next) => {
  try {
    const ingredients = await listIngredients();
    res.set("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
    res.json(ingredients);
  } catch (err) {
    next(err);
  }
};
