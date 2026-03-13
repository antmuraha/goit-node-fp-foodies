import jwt from "jsonwebtoken";
import db from "../models/index.js";

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await db.User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    req.user = { id: user.id };
    next();
  } catch (err) {
    res.status(401).json({ message: "Not authorized" });
  }
};

export default authenticate;
