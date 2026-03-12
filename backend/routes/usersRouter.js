import { Router } from "express";
import { getCurrentUser, getFollowers, getFollowing, getOtherUser } from "../controllers/usersControllers.js";
import validatePaginationParams from "../helpers/validatePaginationParams.js";
import authenticate from "../middleware/authenticate.js";

const usersRouter = Router();

usersRouter.get("/me", authenticate, getCurrentUser);
usersRouter.get("/me/followers", authenticate, validatePaginationParams, getFollowers);
usersRouter.get("/me/following", authenticate, validatePaginationParams, getFollowing);
usersRouter.get("/:id", authenticate, getOtherUser);

export default usersRouter;
