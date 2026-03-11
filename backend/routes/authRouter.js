import { Router } from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/authControllers.js";
import { validateBody } from "../helpers/validateBody.js";
import { registerSchema, loginSchema } from "../schemas/authSchemas.js";

const authRouter = Router();

authRouter.post("/register", validateBody(registerSchema), registerUser);
authRouter.post("/login", validateBody(loginSchema), loginUser);
authRouter.post("/logout", logoutUser); // need to add authenticate middleware

export default authRouter;
