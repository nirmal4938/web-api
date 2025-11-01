import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import { db } from "../models/index.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/jwt.js";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const fullName = profile.displayName;
        const googleId = profile.id;

        let user = await db.User.findOne({ where: { email } });

        if (!user) {
          user = await db.User.create({
            fullName,
            email,
            googleId,
            password: null,
            isActive: true,
            authProvider: "google",
          });
        } else if (user.authProvider !== "google") {
          user.authProvider = "google";
          await user.save();
        }

        // 🔹 Generate access + refresh tokens
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
          expiresIn: "15m",
        });
        const refreshToken = jwt.sign(
          { id: user.id, type: "refresh" },
          JWT_SECRET,
          { expiresIn: "7d" }
        );

        // 🔹 Create session entry in DB
        await db.Session.create({
          userId: user.id,
          token: refreshToken,
          status: "active",
          ipAddress: "google-oauth",
          userAgent: "GoogleStrategy",
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        // 🔹 Attach both tokens in authData
        const authData = {
          token, // short-lived access token
          refreshToken,
          user: {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            authProvider: user.authProvider,
          },
        };

        done(null, authData);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));
