import { Router } from "express";

import { getAreas } from "../controllers/areasControllers.js";

const areasRouter = new Router();

areasRouter.get("/", getAreas);

export default areasRouter;
