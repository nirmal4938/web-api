// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import { db } from '../models/index.js';
import { JWT_SECRET } from '../config/jwt.js';

export const authenticateJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing or malformed' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await db.User.findByPk(decoded.id, {
      include: [
        { model: db.Organization, as: 'organization' },
        { model: db.Department, as: 'department' },
      ],
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid token: user not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('JWT verification error:', err.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
