import { Router } from "express";
import {
  getRecipes,
  getRecipeById,
  createRecipe,
  deleteRecipe,
  getOwnRecipes,
  getPopularRecipes,
  addFavorite,
  removeFavorite,
  listFavorites,
} from "../controllers/recipesControllers.js";
import { createRecipeSchema } from "../schemas/recipeSchemas.js";
import { validateBody } from "../helpers/validateBody.js";
import authenticate from "../middleware/authenticate.js";

const recipesRouter = new Router();

recipesRouter.get("/", getRecipes);
recipesRouter.get("/popular", getPopularRecipes);
recipesRouter.get("/own", authenticate, getOwnRecipes);
recipesRouter.get("/favorites", authenticate, listFavorites);
recipesRouter.get("/:id", getRecipeById);
recipesRouter.post("/", authenticate, validateBody(createRecipeSchema), createRecipe);
recipesRouter.delete("/:id", authenticate, deleteRecipe);
recipesRouter.post("/:id/favorite", authenticate, addFavorite);
recipesRouter.delete("/:id/favorite", authenticate, removeFavorite);

export default recipesRouter;
