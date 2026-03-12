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

const recipesRouter = new Router();

// todo: temporary auth stub to work until authenticate
// when authenticate will be ready - remove the stub (const authenticate) and add import as follows
// import authenticate from ".. /middleware/authenticate.js";
// in the import section
const authenticate = (req, res, next) => {
  req.user = { id: 1 }; // fake user
  next();
};

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
