import jwt from "jsonwebtoken";
import db from "../models/index.js";

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await db.User.findByPk(id);

    if (!user || user.token !== token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Not authorized" });
  }
};

export default authenticate;