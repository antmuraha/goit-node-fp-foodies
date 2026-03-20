import { Router } from "express";
import { getCategories, getCategoryById } from "../controllers/categoriesControllers.js";

const categoriesRouter = Router();

categoriesRouter.get("/", getCategories);
categoriesRouter.get("/:id", getCategoryById);

export default categoriesRouter;
