import jwt from 'jsonwebtoken';
import process from 'node:process';
import db from '../models/index.js';

const getTokenFromCookieHeader = (cookieHeader) => {
  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader.split(';').map((entry) => entry.trim());
  const tokenEntry = cookies.find((entry) => entry.startsWith('token='));
  const jwtEntry = cookies.find((entry) => entry.startsWith('jwt='));
  const candidate = tokenEntry || jwtEntry;

  if (!candidate) {
    return null;
  }

  const [, value] = candidate.split('=');
  return value || null;
};

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const [scheme, headerToken] = authHeader.split(' ');
    const cookieToken = getTokenFromCookieHeader(req.headers.cookie);
    const token =
      headerToken && scheme === 'Bearer' ? headerToken : cookieToken;

    if (!token) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await db.User.findByPk(id);

    if (!user || user.token !== token) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'Not authorized' });
  }
};

export default authenticate;
