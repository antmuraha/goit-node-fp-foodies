import { register, login, logout } from "../services/authServices.js";

export const registerUser = async (req, res, next) => {
  try {
    const user = await register(req.body);
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const result = await login(req.body);
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
