import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../models/index.js";
import { JWT_SECRET, JWT_EXPIRY, JWT_REFRESH_SECRET } from "../config/jwt.js";

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

// -----------------------------------------
// Helper: Generate JWT Access + Refresh
// -----------------------------------------
const generateTokens = (user) => {
  const accessToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });

  const refreshToken = jwt.sign(
    { id: user.id, email: user.email },
    JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY },
  );

  return { accessToken, refreshToken };
};

// -----------------------------------------
// Register New User (Local)
// -----------------------------------------
export const register = async (req, res) => {
  try {
    const { fullName, email, password, organizationId, departmentId } =
      req.body;

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
// AuthController.js

// AuthController.js

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // ------------------------------------------------
    // USER
    // ------------------------------------------------

    const user = await db.User.findOne({
      where: { email },

      attributes: {
        include: ["password"],
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "User inactive",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // ------------------------------------------------
    // DOMAIN / CATEGORY
    // ------------------------------------------------

    let subdomain = null;

    const origin = req.headers.origin;

    if (origin) {
      try {
        const host = new URL(origin).hostname;
        const parts = host.split(".");

        if (parts.length >= 3) {
          subdomain = parts[0];
        }
      } catch (err) {
        subdomain = null;
      }
    }

    let category = null;

    if (subdomain) {
      category = await db.BusinessCategory.findOne({
        where: {
          subdomain,
          isActive: true,
        },
      });

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Business category not found",
        });
      }
    }

    // ------------------------------------------------
    // PLATFORM ROLE
    // ------------------------------------------------

    // ------------------------------------------------
    // PLATFORM ROLE
    // ------------------------------------------------

    const platformUserRole = await db.UserRole.findOne({
      where: {
        userId: user.id,

        scope: "platform",
      },

      include: [
        {
          model: db.Role,

          as: "role",

          include: [
            {
              model: db.Permission,

              as: "permissions",

              through: {
                attributes: [],
              },
            },
          ],
        },
      ],
    });

    // ------------------------------------------------
    // USER BUSINESSES
    // ------------------------------------------------

    const memberships = await db.UserBusiness.findAll({
      where: {
        userId: user.id,
      },

      include: [
        {
          model: db.Business,

          as: "business",

          required: true,

          where: category
            ? {
                businessCategoryId: category.id,
              }
            : {},

          include: [
            {
              model: db.BusinessCategory,

              as: "category",

              attributes: ["id", "key", "name", "subdomain"],
            },
          ],
        },
      ],

      order: [["isDefault", "DESC"]],
    });

    const businesses = memberships.map((m) => ({
      id: m.business.id,

      name: m.business.name,

      slug: m.business.slug,

      domain: m.business.domain,

      isDefault: m.isDefault,

      category: {
        id: m.business.category.id,

        key: m.business.category.key,

        name: m.business.category.name,

        subdomain: m.business.category.subdomain,
      },
    }));

    // ------------------------------------------------
    // TOKENS
    // ------------------------------------------------

    const { accessToken, refreshToken } = generateTokens(user);

    // ------------------------------------------------
    // SESSION
    // ------------------------------------------------

    await db.Session.create({
      userId: user.id,

      token: refreshToken,

      status: "active",

      ipAddress: req.ip,

      userAgent: req.headers["user-agent"],

      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // ------------------------------------------------
    // COOKIE
    // ------------------------------------------------

    const isProd = process.env.NODE_ENV === "production";

    res.cookie(
      "syncware_session",

      refreshToken,

      {
        httpOnly: true,

        secure: isProd,

        sameSite: isProd ? "None" : "Lax",

        path: "/",

        domain: isProd ? ".syncware.fun" : undefined,

        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    );

    // ------------------------------------------------
    // PLATFORM LOGIN
    // syncware.fun
    // ------------------------------------------------

    if (!subdomain && platformUserRole) {
      const role = platformUserRole.role;

      const permissions = role.permissions?.map((p) => p.slug) || [];

      return res.json({
        success: true,

        scope: "platform",

        accessToken,

        redirectUrl: "https://syncware.fun/dashboard",

        user: {
          id: user.id,

          fullName: user.fullName,

          email: user.email,

          avatarUrl: user.avatarUrl,
        },

        role: {
          id: role.id,

          name: role.name,

          slug: role.slug,

          scope: role.scope,

          level: role.level,
        },

        business: null,

        permissions,

        businesses,
      });
    }

    // ------------------------------------------------
    // BUSINESS LOGIN
    // ------------------------------------------------

    if (!memberships.length) {
      return res.status(403).json({
        success: false,

        message: category
          ? `You don't have access to ${category.name}`
          : "No business assigned",
      });
    }

    const membership = memberships[0];

    const business = membership.business;

    const rootDomain = process.env.ROOT_DOMAIN || "syncware.fun";

    let redirectUrl = "";
    redirectUrl: `https://${business.category.subdomain}.${rootDomain}`;

    // ------------------------------------------------
    // BUSINESS ROLE
    // ------------------------------------------------

    const userRole = await db.UserRole.findOne({
      where: {
        userId: user.id,

        businessId: business.id,

        scope: "business",
      },

      include: [
        {
          model: db.Role,

          as: "role",

          include: [
            {
              model: db.Permission,

              as: "permissions",

              through: {
                attributes: [],
              },
            },
          ],
        },
      ],
    });

    if (!userRole) {
      return res.status(403).json({
        success: false,

        message: "Role not assigned",
      });
    }

    const role = userRole.role;

    const permissions = role.permissions?.map((p) => p.slug) || [];

    // ------------------------------------------------
    // RESPONSE
    // ------------------------------------------------

    return res.json({
      success: true,

      scope: "business",

      accessToken,

      redirectUrl,

      user: {
        id: user.id,

        fullName: user.fullName,

        email: user.email,

        avatarUrl: user.avatarUrl,
      },

      business: {
        id: business.id,

        name: business.name,

        slug: business.slug,

        domain: business.domain,

        category: {
          id: business.category.id,

          key: business.category.key,

          name: business.category.name,

          subdomain: business.category.subdomain,
        },
      },

      role: {
        id: role.id,

        name: role.name,

        slug: role.slug,

        scope: role.scope,

        level: role.level,
      },

      permissions,

      businesses,
    });
  } catch (err) {
    console.error("Login error:", err);

    return res.status(500).json({
      success: false,

      message: "Internal server error",
    });
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
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

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

    const session = await db.Session.findOne({
      where: { token: refreshToken },
    });
    if (session) await session.update({ status: "revoked" });

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
export const bootstrap = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Missing access token",
      });
    }

    const accessToken = authHeader.split(" ")[1];
    const { businessId } = req.body;

    if (!businessId) {
      return res.status(400).json({
        success: false,
        message: "Missing business id",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(accessToken, JWT_SECRET); // ✅ same secret as sign()
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    return res.json({
      success: true,
      accessToken,
      businessId,
      user: decoded,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Bootstrap failed",
    });
  }
};
