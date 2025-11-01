// controllers/SessionController.js
import { db } from "../models/index.js";


export const getActiveSessions = async (req, res) => {
  try {
    const sessions = await db.Session.findAll({
      where: { userId: req.user.id, status: "active" },
      attributes: ["id", "ipAddress", "userAgent", "createdAt", "expiresAt"],
    });
    res.json({ success: true, sessions });
  } catch (err) {
    console.error("Fetch sessions error:", err);
    res.status(500).json({ success: false, message: "Error fetching sessions" });
  }
};
