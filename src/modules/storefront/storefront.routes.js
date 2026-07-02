// ============================================================
// SyncWare Storefront Engine
// Storefront Routes
// ============================================================
//
// Base URL
//
// /api/v1/storefront
//
// Public APIs consumed by the Storefront React application.
//
// Current
//
// GET /bootstrap
//
// Future
//
// GET  /products
// GET  /collections
// GET  /offers
// GET  /reviews
// POST /contact
// POST /cart
// POST /wishlist
//
// ============================================================

import { Router } from "express";

import storefrontController from "./storefront.controller.js";

const router = Router();

/**
 * ============================================================
 * Bootstrap Storefront
 * ============================================================
 *
 * Loads the complete Storefront Runtime.
 *
 * The backend automatically resolves the business
 * using the incoming hostname.
 *
 * Example:
 *
 * radhe-krishna-garments.syncware.fun
 *              ↓
 *          business
 *              ↓
 *        Complete Bootstrap
 *
 * GET /api/v1/storefront/bootstrap
 *
 * ============================================================
 */

router.get("/bootstrap", storefrontController.bootstrap);

/**
 * ============================================================
 * Future Public APIs
 * ============================================================
 */

// router.get("/products", storefrontController.products);

// router.get("/collections", storefrontController.collections);

// router.get("/offers", storefrontController.offers);

// router.get("/reviews", storefrontController.reviews);

// router.post("/contact", storefrontController.contact);

// router.post("/cart", storefrontController.cart);

// router.post("/wishlist", storefrontController.wishlist);

export default router;
