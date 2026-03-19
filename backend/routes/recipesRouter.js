import { Router } from "express";
import {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getPopularRecipes,
  addFavorite,
  removeFavorite,
  listFavorites,
  getFavoriteStatus,
  uploadRecipeImage,
} from "../controllers/recipesControllers.js";
import { createRecipeSchema, updateRecipeSchema } from "../schemas/recipeSchemas.js";
import { validateBody } from "../helpers/validateBody.js";
import authenticate from "../middleware/authenticate.js";
import upload from "../config/multerConfig.js";

const recipesRouter = new Router();

recipesRouter.get("/", getRecipes);
recipesRouter.get("/popular", getPopularRecipes);
recipesRouter.get("/favorites", authenticate, listFavorites);
recipesRouter.get("/:id/favorite", authenticate, getFavoriteStatus);
recipesRouter.get("/:id", getRecipeById);
recipesRouter.post("/", authenticate, validateBody(createRecipeSchema), createRecipe);
recipesRouter.post("/upload/image", authenticate, upload.single("image"), uploadRecipeImage);
recipesRouter.put("/:id", authenticate, validateBody(updateRecipeSchema), updateRecipe);
recipesRouter.delete("/:id", authenticate, deleteRecipe);
recipesRouter.post("/:id/favorite", authenticate, addFavorite);
recipesRouter.delete("/:id/favorite", authenticate, removeFavorite);

export default recipesRouter;
