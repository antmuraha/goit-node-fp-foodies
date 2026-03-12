import { Router } from "express";
import {
  followUser,
  getCurrentUser,
  getFollowers,
  getFollowing,
  getOtherUser,
  unfollowUser,
} from "../controllers/usersControllers.js";
import { validateParams } from "../helpers/validateParams.js";
import validatePaginationParams from "../helpers/validatePaginationParams.js";
import authenticate from "../middleware/authenticate.js";
import { followParamsSchema } from "../schemas/userSchemas.js";

const usersRouter = Router();

usersRouter.get("/me", authenticate, getCurrentUser);
usersRouter.get("/me/followers", authenticate, validatePaginationParams, getFollowers);
usersRouter.get("/me/following", authenticate, validatePaginationParams, getFollowing);
usersRouter.post("/:id/follow", authenticate, validateParams(followParamsSchema), followUser);
usersRouter.delete("/:id/follow", authenticate, validateParams(followParamsSchema), unfollowUser);
usersRouter.get("/:id", authenticate, getOtherUser);

export default usersRouter;
