import { Router } from "express";
import {
  followUser,
  getFollowStatusByUser,
  getCurrentUser,
  getFollowers,
  getFollowing,
  getOtherUser,
  unfollowUser,
} from "../controllers/usersControllers.js";
import { getOwnRecipes } from "../controllers/recipesControllers.js";
import { validateParams } from "../helpers/validateParams.js";
import authenticate from "../middleware/authenticate.js";
import { followParamsSchema } from "../schemas/userSchemas.js";

const usersRouter = Router();

usersRouter.get("/me", authenticate, getCurrentUser);
usersRouter.get("/me/following", authenticate, getFollowing);
usersRouter.get("/:id/follow/status", authenticate, validateParams(followParamsSchema), getFollowStatusByUser);
usersRouter.get("/:id/followers", authenticate, validateParams(followParamsSchema), getFollowers);
usersRouter.get("/:id/recipes", authenticate, validateParams(followParamsSchema), getOwnRecipes);
usersRouter.post("/:id/follow", authenticate, validateParams(followParamsSchema), followUser);
usersRouter.delete("/:id/follow", authenticate, validateParams(followParamsSchema), unfollowUser);
usersRouter.get("/:id", authenticate, getOtherUser);

export default usersRouter;
