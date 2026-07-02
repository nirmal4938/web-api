// src/routes/index.js

import { Router } from "express";

// 🧩 Core system routes
import AuthRoutes from "./AuthRoutes.js";
import PaymentRoutes from "./PaymentRoutes.js";
import UserRoutes from "./UserRoutes.js";
import OrganizationRoutes from "./OrganizationRoutes.js";
import SessionRoutes from "./SessionRoutes.js";

// 🏏 Cricket routes
import CricketRoutes from "./CricketRoutes.js";

// 🗳️ Election Management routes
import ElectionRoutes from "./ElectionRoutes.js";
import CandidateRoutes from "./CandidateRoutes.js";
import VoterRoutes from "./VoterRoutes.js";
import VoteRoutes from "./VoteRoutes.js";
import ElectionResultRoutes from "./ElectionResultRoutes.js";

import ChatRoutes from "./ChatRoutes.js";
import OnboardingRoutes from "./OnboardingRoutes.js";
import BusinessCategoryRoutes from "./BusinessCategoryRoutes.js";
import TenantRoutes from "./tenant.routes.js";

// ============================================================
// 🛍️ Storefront Engine
// ============================================================

import StorefrontRoutes from "../modules/storefront/storefront.routes.js";

const router = Router();

// ============================================================
// 🩺 Health Check
// ============================================================

router.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "🌟 API is healthy!",
  });
});

// ============================================================
// 🧩 Core Platform
// ============================================================

router.use("/organizations", OrganizationRoutes);
router.use("/users", UserRoutes);
router.use("/auth", AuthRoutes);
router.use("/onboarding", OnboardingRoutes);
router.use("/business-categories", BusinessCategoryRoutes);
router.use("/payments", PaymentRoutes);
router.use("/session", SessionRoutes);
router.use("/tenant", TenantRoutes);

// ============================================================
// 🛍️ Storefront Engine
//
// Public APIs consumed by the Storefront React application.
//
// Example:
//
// GET /api/v1/storefront/bootstrap
//
// Future:
//
// GET /storefront/products
// GET /storefront/collections
// POST /storefront/contact
// POST /storefront/cart
// ============================================================

router.use("/storefront", StorefrontRoutes);

// ============================================================
// 🏏 Cricket
// ============================================================

router.use("/cricket", CricketRoutes);

// ============================================================
// 🗳️ Election Management
// ============================================================

router.use("/elections", ElectionRoutes);
router.use("/candidates", CandidateRoutes);
router.use("/voters", VoterRoutes);
router.use("/votes", VoteRoutes);
router.use("/results", ElectionResultRoutes);

// ============================================================
// 💬 Chat
// ============================================================

router.use("/chat", ChatRoutes);

export default router;
