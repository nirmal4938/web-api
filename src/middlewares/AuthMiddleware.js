// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import { db } from "../models/index.js";
import { JWT_SECRET } from "../config/jwt.js";

export const authenticateJWT = async (req, res, next) => {
  try {
    let token = null;

    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token && req.cookies?.syncware_session) {
      token = req.cookies.syncware_session;
    }

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const session = await db.Session.findOne({
      where: { userId: decoded.id, status: "active" },
      order: [["createdAt", "DESC"]],
    });

    if (!session) {
      return res.status(401).json({ message: "Session invalid" });
    }

    const user = await db.User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
