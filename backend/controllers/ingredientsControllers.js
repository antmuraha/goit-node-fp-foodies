import { listIngredients } from "../services/ingredientsServices.js";

export const getIngredients = async (req, res, next) => {
  try {
    const ingredients = await listIngredients();
    res.json(ingredients);
  } catch (err) {
    next(err);
  }
};
