// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import { db } from "../models/index.js";
import { JWT_SECRET } from "../config/jwt.js";

export const authenticateJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization header missing or malformed" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    // 🔹 Check if the session exists and is valid
    const session = await db.Session.findOne({
      where: { userId: decoded.id, status: "active" },
      order: [["createdAt", "DESC"]], // latest session
    });

    if (!session) {
      return res.status(401).json({ message: "Session not found or revoked" });
    }

    // 🔹 Check if session expired (in DB)
    if (session.expiresAt && new Date(session.expiresAt) < new Date()) {
      await session.update({ status: "expired" });
      return res.status(401).json({ message: "Session expired, please log in again" });
    }

    // 🔹 Load user details
    const user = await db.User.findByPk(decoded.id, {
      include: [
        { model: db.Organization, as: "organization" },
        { model: db.Department, as: "department" },
      ],
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid token: user not found" });
    }

    req.user = user;
    req.session = session;
    next();
  } catch (err) {
    console.error("JWT verification error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
