import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load correct env file
let envFile;
switch (process.env.NODE_ENV) {
  case "production":
    envFile = ".env.production";
    break;
  case "staging":
    envFile = ".env.staging";
    break;
  default:
    envFile = ".env.local";
}

dotenv.config({ path: path.resolve(__dirname, `../../${envFile}`) });

const commonConfig = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  dialect: process.env.DB_DIALECT || "postgres",
  logging: process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "staging",
  dialectOptions: {
    ssl: process.env.DB_SSL === "true" ? { require: true, rejectUnauthorized: false } : false,
  },
};

const config = {
  development: { ...commonConfig },
  test: { ...commonConfig },
  production: { ...commonConfig },
  staging: { ...commonConfig },
};

export default config;
