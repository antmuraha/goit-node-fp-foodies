import { Router } from "express";
import {
    getRecipes,
    getRecipeById,
    createRecipe,
    deleteRecipe,
} from "../controllers/recipesControllers.js";
import { createRecipeSchema } from "../schemas/recipeSchemas.js";

const recipesRouter = new Router();

// временная заглушка auth чтобы работало пока не сделают authenticate
// когда будет авторизация - убрать сщтые и добавить import следующий
// import authenticate from "../helpers/authenticate.js"; в шапке файла
const authenticate = (req, res, next) => {
    req.user = { id: 1 }; // fake user
    next();
};

recipesRouter.get("/", getRecipes);
recipesRouter.get("/:id", getRecipeById);
recipesRouter.post(
    "/",
    authenticate,
    validateBody(createRecipeSchema),
    createRecipe
);
recipesRouter.delete(
    "/:id",
    authenticate,
    deleteRecipe
);

export default recipesRouter;
