// import dotenv from 'dotenv';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// const config = {
//   development: {
//     username: process.env.DB_USERNAME,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT || 5432,
//     dialect: process.env.DB_DIALECT || 'postgres',
//   },
//   test: {
//     username: process.env.DB_USERNAME || 'postgres',
//     password: process.env.DB_PASSWORD || 'test_password',
//     database: process.env.TEST_DB_NAME || 'test_db',
//     host: process.env.DB_HOST || '127.0.0.1',
//     dialect: process.env.DB_DIALECT || 'postgres',
//   },
//   production: {
//     username: process.env.DB_USERNAME,
//     password: process.env.DB_PASSWORD,
//     database: process.env.PROD_DB_NAME || 'prod_db',
//     host: process.env.DB_HOST,
//     dialect: process.env.DB_DIALECT || 'postgres',
//   },
// };

// export default config;


import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Choose which .env file to load
const envFile =
  process.env.NODE_ENV === "production" ? ".env.production" : ".env.local";

dotenv.config({ path: path.resolve(__dirname, `../../${envFile}`) });

const commonConfig = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  dialect: process.env.DB_DIALECT || "postgres",
  logging: process.env.NODE_ENV !== "production",
  dialectOptions: {
    ssl:
      process.env.NODE_ENV === "production"
        ? {
            require: true,
            rejectUnauthorized: false,
          }
        : false,
  },
};

const config = {
  development: { ...commonConfig },
  test: { ...commonConfig },
  production: { ...commonConfig },
};

export default config;
