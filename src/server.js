import dotenv from "dotenv";
import { execSync } from "child_process";
import app from "./app.js";
import { sequelize } from "./models/index.js";
import { startSessionCleaner } from "./utils/sessionCleaner.js";
// 🔥 Import the WhatsApp service engine to trigger client initialization automatically
import "./services/whatsappService.js";
dotenv.config();
console.log("process.env.PORT--", process.env.PORT);
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    console.log("🔄 Initializing server...");

    // 1️⃣ Test database connection
    await sequelize.authenticate();
    console.log("✅ Database connected successfully.");

    // 2️⃣ Run seeders automatically (safe on Render free tier)
    try {
      // console.log('🌱 Running seeders...');
      // execSync('npx sequelize-cli db:seed:all', { stdio: 'inherit' });
      // console.log('✅ Seeders executed successfully.');
    } catch (seedError) {
      console.warn("⚠️ Seeder execution skipped or failed:", seedError.message);
    }

    // 3️⃣ Start Express server (bind to 0.0.0.0 for Render)
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      startSessionCleaner();
      console.log("🌟 API Server is up!");
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
})();
