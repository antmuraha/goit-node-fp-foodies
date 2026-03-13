import { Router } from "express";
import { getCurrentUser, updateAvatar } from "../controllers/usersControllers.js";
import authenticate from "../middleware/authenticate.js";
import { validateBody } from "../helpers/validateBody.js";
import { avatarUpdateSchema } from "../schemas/userSchemas.js";
import upload from "../config/multerConfig.js";

const usersRouter = Router();

usersRouter.get("/me", authenticate, getCurrentUser);

// PATCH /api/users/avatar - accepts both multipart file upload and JSON URL update
usersRouter.patch(
  "/avatar",
  authenticate,
  upload.single("avatar"),
  validateBody(avatarUpdateSchema, true),
  updateAvatar,
);

export default usersRouter;

