import { Router } from "express";
import { getIngredients } from "../controllers/ingredientsControllers.js";

const ingredientRouter = new Router();

ingredientRouter.get("/", getIngredients);

export default ingredientRouter;
