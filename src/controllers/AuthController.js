import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../models/index.js";
import {
  JWT_SECRET,
  JWT_EXPIRY,
  JWT_REFRESH_SECRET,
} from "../config/jwt.js";

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

// -----------------------------------------
// Helper: Generate JWT Access + Refresh
// -----------------------------------------
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );

  const refreshToken = jwt.sign(
    { id: user.id, email: user.email },
    JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );

  return { accessToken, refreshToken };
};

// -----------------------------------------
// Register New User (Local)
// -----------------------------------------
export const register = async (req, res) => {
  try {
    const { fullName, email, password, organizationId, departmentId } = req.body;

    const existing = await db.User.findOne({ where: { email } });
    if (existing)
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.User.create({
      fullName,
      email,
      password: hashedPassword,
      organizationId,
      departmentId,
      authProvider: "local", // 👈 added field
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        authProvider: user.authProvider,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// -----------------------------------------
// Login with JWT rotation & session save
// -----------------------------------------
export const login = async (req, res) => {
  const { email, password } = req.body;
  const ip = req.ip || req.headers["x-forwarded-for"];
  const agent = req.headers["user-agent"];
  // console.log("IP________", ip)
  try {
    const user = await db.User.findOne({
      where: { email },
      include: [
        { model: db.Organization, as: "organization" },
        { model: db.Department, as: "department" },
      ],
      attributes: { include: ["password"] },
    });

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    if (!user.isActive)
      return res.status(403).json({ success: false, message: "User inactive" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    const { accessToken, refreshToken } = generateTokens(user);

    // Store refresh token in DB (Session)
    await db.Session.create({
      userId: user.id,
      token: refreshToken,
      status: "active",
      ipAddress: ip,
      userAgent: agent,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // Secure Cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      token: accessToken,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        organization: user.organization,
        department: user.department,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// -----------------------------------------
// Refresh Access Token
// -----------------------------------------
export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!refreshToken)
      return res
        .status(401)
        .json({ success: false, message: "No refresh token provided" });

    const session = await db.Session.findOne({
      where: { token: refreshToken, status: "active" },
    });

    if (!session)
      return res
        .status(403)
        .json({ success: false, message: "Session invalid or expired" });

    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const user = await db.User.findByPk(decoded.id);

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

    // Rotate tokens
    await session.update({
      token: newRefreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true, token: accessToken });
  } catch (err) {
    console.error("Refresh error:", err);
    return res
      .status(403)
      .json({ success: false, message: "Invalid refresh token" });
  }
};

// -----------------------------------------
// Logout (Revoke session + clear cookie)
// -----------------------------------------
export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!refreshToken)
      return res
        .status(400)
        .json({ success: false, message: "No token provided" });

    const session = await db.Session.findOne({ where: { token: refreshToken } });
    if (session)
      await session.update({ status: "revoked" });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      path: "/",
    });

    return res.json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
