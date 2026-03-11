import { Router } from "express";
import { getRecipes, getRecipeById } from "../controllers/recipesControllers.js";

const recipesRouter = new Router();

recipesRouter.get("/", getRecipes);
recipesRouter.get("/:id", getRecipeById);

export default recipesRouter;
