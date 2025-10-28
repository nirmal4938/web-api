import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwt.js';

export const signToken = (payload, expiresIn = '1d') =>
  jwt.sign(payload, JWT_SECRET, { expiresIn });

export const verifyToken = (token) =>
  jwt.verify(token, JWT_SECRET);
