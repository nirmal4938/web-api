// ============================================================
// SyncWare Storefront Engine
// Storefront Service
// ============================================================
//
// Responsibilities
//
// • Orchestrate Storefront Bootstrap
// • Resolve Request Context
// • Resolve Storefront
// • Validate Storefront
// • Load Storefront Runtime
// • Build Bootstrap Response
//
// ============================================================
//
// The Service owns business logic.
//
// Database access belongs to:
// StorefrontRepository
//
// ============================================================

import storefrontRepository from "./storefront.repository.js";

class StorefrontService {
  /**
   * ==========================================================
   * Bootstrap Storefront
   * ==========================================================
   *
   * Request
   *      ↓
   * Resolve Request Context
   *      ↓
   * Resolve Storefront
   *      ↓
   * Validate Storefront
   *      ↓
   * Load Runtime
   *      ↓
   * Build Response
   *
   * ==========================================================
   */

  async bootstrap(req) {
    const context = this.resolveRequestContext(req);

    const storefront = await this.resolveStorefront(context);

    this.validateStorefront(storefront);

    const runtime = await this.loadStorefrontRuntime(storefront);

    return this.buildBootstrapResponse(runtime);
  }

  /**
   * ==========================================================
   * Resolve Request Context
   * ==========================================================
   */

  resolveRequestContext(req) {
    return {
      hostname: req.hostname,
      protocol: req.protocol,
      origin: req.get("origin"),
      userAgent: req.get("user-agent"),
      language: req.get("accept-language"),
      ip: req.ip,
    };
  }

  /**
   * ==========================================================
   * Resolve Storefront
   * ==========================================================
   *
   * Sprint-1
   * Repository returns mocked storefront.
   *
   * Sprint-2
   * Repository queries PostgreSQL.
   *
   * ==========================================================
   */

  async resolveStorefront(context) {
    return storefrontRepository.findStorefront(context);
  }

  /**
   * ==========================================================
   * Validate Storefront
   * ==========================================================
   */

  validateStorefront(storefront) {
    if (!storefront) {
      const error = new Error("Storefront not found.");

      error.statusCode = 404;
      error.code = "STORE_NOT_FOUND";

      throw error;
    }

    // Check if business is active; reject inactive and suspended businesses
    if (storefront.status !== "ACTIVE") {
      const error = new Error("Storefront is inactive.");

      error.statusCode = 403;
      error.code = "STORE_INACTIVE";

      throw error;
    }
  }

  /**
   * ==========================================================
   * Load Storefront Runtime
   * ==========================================================
   *
   * Eventually this method will aggregate:
   *
   * Business
   * Settings
   * Theme
   * Navigation
   * Home
   * Collections
   * Products
   * Offers
   * Reviews
   * SEO
   *
   * ==========================================================
   */

  async loadStorefrontRuntime(storefront) {
    return {
      business: storefront,

      settings: {},

      theme: {},

      navigation: {},

      home: {},

      collections: [],

      products: [],

      offers: [],

      reviews: [],

      seo: {},
    };
  }

  /**
   * ==========================================================
   * Build Bootstrap Response
   * ==========================================================
   */

  buildBootstrapResponse(runtime) {
    return {
      success: true,
      message: "Storefront bootstrap loaded successfully.",
      timestamp: new Date().toISOString(),
      data: runtime,
    };
  }
}

export default new StorefrontService();
