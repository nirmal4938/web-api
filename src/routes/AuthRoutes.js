// import express from "express";
// import validate from "../middlewares/ValidateMiddleware.js";
// import { registerSchema, loginSchema } from "../validations/AuthValidation.js";
// import {
//   register,
//   login,
//   logout,
//   refreshToken,
// } from "../controllers/AuthController.js";

// const router = express.Router();

// router.post("/register", validate(registerSchema), register);
// router.post("/login", validate(loginSchema), login);
// router.post("/logout", logout);
// router.post("/refresh", refreshToken);
// router.post("/google", authGooge);
// router.post("/google/callback", authGoogleCallback);


// export default router;



// src/auth/authRoutes.js
import express from "express";
import passport from "../config/passport.js";
import {
  register,
  login,
  logout,
  refreshToken,
} from "../controllers/AuthController.js";
import { authenticateJWT } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

// Existing routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refreshToken);


// Google OAuth start
router.get("/google/url", (req, res) => {
  const googleAuthURL = `${process.env.API_BASE_URL || "http://localhost:5000/api"}/auth/google`;
  res.json({ url: googleAuthURL });
});
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  (req, res) => {
    const { token, refreshToken } = req.user;

    // Detect environment dynamically
    const isProduction = process.env.NODE_ENV === "production";

    // Your frontend base URL (both for local + production)
    const FRONTEND_URL = process.env.FRONTEND_URL

    // ✅ Set secure, cross-site compatible cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,        // 🔒 true in production (Render uses HTTPS)
      sameSite: isProduction ? "None" : "Lax", // allow cross-site in prod
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // ✅ Redirect user back to frontend with short-lived token
    const redirectURL = `${FRONTEND_URL}/auth/success?token=${token}`;
    return res.redirect(redirectURL);
  }
);



// router.get(
//   "/google/callback",
//   passport.authenticate("google", { failureRedirect: "/login", session: false }),
//   (req, res) => {
//     // Successful auth
//     const { token, refreshToken, user } = req.user;

// res.cookie("refreshToken", refreshToken, {
//   httpOnly: true,
//   secure: false, // set to true if running HTTPS
//   sameSite: "None", // ✅ allow cross-origin cookies
//   path: "/",
//   maxAge: 7 * 24 * 60 * 60 * 1000,
// });
//     // Redirect frontend with token in URL (or cookie)
//     const redirectURL = `http://localhost:5173/auth/success?token=${token}`;
//     return res.redirect(redirectURL);
//   }
// );


// router.get(
//   "/google/callback",
//   passport.authenticate("google", { session: false }),
//   (req, res) => {
//     const { token, refreshToken, user } = req.user;

//     res.cookie("refreshToken", refreshToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "Strict",
//       path: "/",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     res.redirect(
//       `${process.env.CLIENT_URL}/auth/success?token=${token}`
//     );
//   }
// );

router.get("/me", authenticateJWT, (req, res) => {
  return res.json({
    success: true,
    user: req.user,
  });
});

export default router;
