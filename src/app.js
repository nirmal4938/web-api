import express from "express";
import morgan from "morgan";
import cors from "cors";

import routes from "./routes/index.js";
import errorHandler from "./middlewares/ErrorHandler.js";
import cookieParser from "cookie-parser";
const app = express();

// ✅ Configure CORS properly
const allowedOrigins = [
  "http://localhost:5173", // your Vite frontend
  "https://web-ui-d5g8.onrender.com", // add this later for production
];
app.use(cookieParser());

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Parse request bodies
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ✅ Logging
app.use(morgan("dev"));

app.set("trust proxy", true);


// ✅ Routes
app.use("/api", routes);

// ✅ Health check
app.get("/", (req, res) => res.send("🌟 API Server is up!"));

// ✅ Global error handler
app.use(errorHandler);

export default app;
