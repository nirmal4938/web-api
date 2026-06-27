// src/routes/OnboardingRoutes.js

import { Router } from "express";

import OnboardingController from "../controllers/OnboardingController.js";

const router = Router();

/**
 * ======================================================
 * POST /api/onboarding/register-business
 *
 * Creates:
 * 1. User
 * 2. Business
 * 3. UserBusiness
 * 4. Subscription
 *
 * Response:
 * - JWT Token
 * - User Info
 * - Business Info
 * ======================================================
 */

router.post("/register-business", OnboardingController.registerBusiness);

export default router;
