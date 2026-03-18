import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../models/index.js";

export const register = async ({ name, email, password }) => {
  const existing = await db.User.findOne({ where: { email } });
  if (existing) {
    throw { status: 409, message: "Email in use" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await db.User.create({
    name,
    email,
    password: hashedPassword,
    verify: true,
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
  };
};

export const login = async ({ email, password }) => {
  const user = await db.User.findOne({ where: { email } });
  if (!user) {
    throw { status: 401, message: "Email or password is wrong" };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw { status: 401, message: "Email or password is wrong" };
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  user.token = token;
  await user.save();

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
  };
};

export const logout = async (id) => {
  const user = await db.User.findOne({ where: { id } });
  if (!user) {
    throw { status: 401, message: "Not authorized" };
  }

  await user.update({ token: null });
  return user;
};
