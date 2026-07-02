// ============================================================
// SyncWare Storefront Engine
// Storefront Controller
// ============================================================
//
// Responsibilities
//
// • Receive HTTP request
// • Delegate bootstrap to Service
// • Return HTTP response
// • Forward unexpected errors
//
// No business logic belongs here.
//
// ============================================================

import storefrontService from "./storefront.service.js";

class StorefrontController {
  constructor() {
    this.bootstrap = this.bootstrap.bind(this);
  }

  /**
   * GET /api/storefront/bootstrap
   */
  async bootstrap(req, res, next) {
    try {
      const response = await storefrontService.bootstrap(req);

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export default new StorefrontController();
