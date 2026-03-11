import { Router } from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/authControllers.js';

const authRouter = Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.post('/logout', logoutUser); // need to add authenticate middleware

export default authRouter;
