import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import dotenv from "dotenv";
import { db } from "../models/index.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/jwt.js";

dotenv.config();

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email =
          profile.emails?.[0]?.value || `${profile.username}@github.local`;
        const fullName = profile.displayName || profile.username;
        const githubId = profile.id;

        let user = await db.User.findOne({ where: { email } });

        if (!user) {
          user = await db.User.create({
            fullName,
            email,
            githubId,
            password: null,
            isActive: true,
            authProvider: "github",
          });
        } else if (user.authProvider !== "github") {
          user.authProvider = "github";
          await user.save();
        }

        // 🔹 Generate tokens
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
          expiresIn: "15m",
        });
        const refreshTokenDb = jwt.sign(
          { id: user.id, type: "refresh" },
          JWT_SECRET,
          { expiresIn: "7d" }
        );

        // 🔹 Create session entry in DB
        await db.Session.create({
          userId: user.id,
          token: refreshTokenDb,
          status: "active",
          ipAddress: "github-oauth",
          userAgent: "GitHubStrategy",
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        const authData = {
          token,
          refreshToken: refreshTokenDb,
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
