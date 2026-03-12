import { Router } from "express";
import { getCurrentUser } from "../controllers/usersControllers.js";
import authenticate from "../middleware/authenticate.js";

const usersRouter = Router();

usersRouter.get("/me", authenticate, getCurrentUser);

export default usersRouter;
