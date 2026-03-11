import { registerSchema, loginSchema } from "../schemas/authSchemas.js";
import { register, login, logout } from "../services/authServices.js";

export const registerUser = async (req, res, next) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const user = await register(value);
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const result = await login(value);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    await logout(req.user.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
