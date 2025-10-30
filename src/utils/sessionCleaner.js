// src/utils/sessionCleaner.js
import cron from "node-cron";
import { db } from "../models/index.js";

/**
 * Automatically clean up expired sessions every hour
 */
export const startSessionCleaner = () => {
  cron.schedule("0 * * * *", async () => {
    try {
      const now = new Date();

      const expiredSessions = await db.Session.update(
        { status: "expired" },
        {
          where: {
            expiresAt: { [db.Sequelize.Op.lt]: now },
            status: "active",
          },
        }
      );

      if (expiredSessions[0] > 0) {
        console.log(`🧹 Cleaned up ${expiredSessions[0]} expired sessions`);
      }
    } catch (err) {
      console.error("Session cleanup error:", err);
    }
  });

  console.log("🕒 Session cleaner scheduled (runs every hour)");
};
