import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

import passport from "./config/passport.js";

import routes from "./routes/index.js";

import errorHandler from "./middlewares/ErrorHandler.js";
import { tenantMiddleware } from "./middlewares/tenantMiddleware.js";

const app = express();

/**
 * ============================================================
 * CORS Configuration
 * ============================================================
 *
 * Supports:
 *
 * Development
 * -----------
 * localhost
 * 127.0.0.1
 *
 * Platform
 * --------
 * syncware.fun
 *
 * Category Apps
 * -------------
 * mobile.syncware.fun
 * garments.syncware.fun
 * pharmacy.syncware.fun
 *
 * Tenant Storefronts
 * ------------------
 * *.syncware.fun
 *
 * ============================================================
 */

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "https://web-ui-d5g8.onrender.com",
];

const corsOptions = {
  origin(origin, callback) {
    // Postman / Mobile Apps / Server-to-Server
    if (!origin) {
      return callback(null, true);
    }

    // Explicit allow-list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    try {
      const hostname = new URL(origin).hostname;

      // Allow platform root
      if (hostname === "syncware.fun") {
        return callback(null, true);
      }

      // Allow every tenant & category app
      if (hostname.endsWith(".syncware.fun")) {
        return callback(null, true);
      }
    } catch (error) {
      console.error("Invalid CORS Origin:", origin);
    }

    console.warn("Blocked CORS Origin:", origin);

    return callback(new Error("Not allowed by CORS"));
  },

  credentials: true,

  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

  allowedHeaders: ["Content-Type", "Authorization", "X-App-Name"],

  exposedHeaders: ["set-cookie"],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(cookieParser());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.set("trust proxy", 1);

app.use(passport.initialize());

app.use(tenantMiddleware);

app.use("/api", routes);

app.use(errorHandler);

export default app;
