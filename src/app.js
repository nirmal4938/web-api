import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "./config/passport.js";
import routes from "./routes/index.js";
import errorHandler from "./middlewares/ErrorHandler.js";

const app = express();

// const allowedOrigins = [
//   "http://localhost:5173",
//   "http://127.0.0.1:5173",
//   "https://web-ui-d5g8.onrender.com",
// ];

// const corsOptions = {
//   origin: function (origin, callback) {
//     console.log("🌍 Request Origin:", origin);
//     if (!origin || allowedOrigins.includes(origin)) {
//       return callback(null, origin || true);
//     } else {
//       console.warn("🚫 CORS blocked for origin:", origin);
//       return callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   exposedHeaders: ["set-cookie"],
// };

const corsOptions = {
  origin: ["http://localhost:5173", "http://127.0.0.1:5173", "https://web-ui-d5g8.onrender.com", "https://syncware.fun/"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["set-cookie"],
};

app.use(cors(corsOptions));
// app.options(/.*/, cors(corsOptions));

// ✅ Apply cors() globally first
app.use(cors(corsOptions));

// ✅ Handle preflight (OPTIONS) with same config
// app.options(/.*/, cors(corsOptions));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.set("trust proxy", 1);

app.use(passport.initialize());
app.use("/api", routes);
app.use(errorHandler);

export default app;
