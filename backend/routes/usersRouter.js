import { Router } from "express";
import {
  followUser,
  getCurrentUser,
  getFollowers,
  getFollowing,
  getOtherUser,
  unfollowUser,
  updateAvatar,
} from "../controllers/usersControllers.js";
import authenticate from "../middleware/authenticate.js";
import { validateBody } from "../helpers/validateBody.js";
import { validateParams } from "../helpers/validateParams.js";
import validatePaginationParams from "../helpers/validatePaginationParams.js";
import { avatarUpdateSchema, followParamsSchema } from "../schemas/userSchemas.js";
import upload from "../config/multerConfig.js";

const usersRouter = Router();

usersRouter.get("/me", authenticate, getCurrentUser);
usersRouter.get("/me/followers", authenticate, validatePaginationParams, getFollowers);
usersRouter.get("/me/following", authenticate, validatePaginationParams, getFollowing);
usersRouter.post("/:id/follow", authenticate, validateParams(followParamsSchema), followUser);
usersRouter.delete("/:id/follow", authenticate, validateParams(followParamsSchema), unfollowUser);
usersRouter.get("/:id", authenticate, getOtherUser);

// PATCH /api/users/avatar - accepts both multipart file upload and JSON URL update
usersRouter.patch(
  "/avatar",
  authenticate,
  upload.single("avatar"),
  validateBody(avatarUpdateSchema, true),
  updateAvatar,
);

export default usersRouter;