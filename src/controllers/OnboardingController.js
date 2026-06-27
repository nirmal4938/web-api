// src/controllers/OnboardingController.js

import OnboardingService from "../services/OnboardingService.js";

class OnboardingController {
  /**
   * ======================================================
   * POST /api/onboarding/register-business
   *
   * Creates:
   * - User
   * - Business
   * - UserBusiness
   * - Subscription
   *
   * Returns:
   * - JWT Token
   * - User
   * - Business
   * ======================================================
   */
  static async registerBusiness(req, res) {
    try {
      const payload = req.body;

      const result = await OnboardingService.registerBusiness(payload);

      return res.status(201).json({
        success: true,

        message: "Business created successfully",

        data: result,
      });
    } catch (err) {
      console.error("❌ Register Business Error:", err);

      return res.status(err.statusCode || 500).json({
        success: false,

        message: err.message || "Something went wrong",

        error: process.env.NODE_ENV === "development" ? err.stack : undefined,
      });
    }
  }
}

export default OnboardingController;
