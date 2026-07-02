// ============================================================
// SyncWare Storefront Engine
// Storefront Repository
// ============================================================
//
// Responsibilities
//
// • Interact with the database
// • Retrieve Storefront entities
// • Never contain business logic
// • Never know about Express
//
// Sprint-2
// --------
// PostgreSQL queries.
// ============================================================

import { db } from "../../models/index.js";

class StorefrontRepository {
  /**
   * ==========================================================
   * Find Storefront
   * ==========================================================
   *
   * Input
   *
   * {
   *   hostname,
   *   protocol,
   *   origin,
   *   ...
   * }
   *
   * Future
   *
   * hostname
   *      ↓
   * Extract slug
   *      ↓
   * SELECT *
   * FROM businesses
   * WHERE slug = ?
   *
   * ==========================================================
   */

  async findStorefront(context) {
    const slug = this.extractSlug(context.hostname);

    return this.findBusinessBySlug(slug, context.hostname);
  }

  /**
   * ==========================================================
   * Extract Tenant Slug
   * ==========================================================
   */

  extractSlug(hostname) {
    // --------------------------------------------
    // Local Development
    // --------------------------------------------

    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "rajmobiles";
    }

    // --------------------------------------------
    // *.syncware.fun
    // --------------------------------------------

    return hostname.split(".")[0];
  }

  /**
   * ==========================================================
   * Find Business By Slug
   * ==========================================================
   *
   * SELECT
   *      b.id,
   *      b.slug,
   *      b.name,
   *      b.status,
   *      bc.key,
   *      bc.name
   * FROM businesses b
   * JOIN business_categories bc
   *      ON bc.id = b.business_category_id
   * WHERE b.slug = ?
   *
   * ==========================================================
   */

  async findBusinessBySlug(slug, hostname) {
    try {
      const business = await db.Business.findOne({
        where: { slug },
        include: [
          {
            model: db.BusinessCategory,
            as: "category",
            attributes: ["key", "name"],
          },
        ],
      });

      if (!business) {
        return null;
      }

      // Normalize business object to match expected shape
      return {
        id: business.id,
        slug: business.slug,
        name: business.name,
        status: business.status, // This will be "ACTIVE", "INACTIVE", or "SUSPENDED"
        category: business.category.key, // Using the key as in the mock (e.g., "garments")
        hostname: hostname,
      };
    } catch (error) {
      // Log the error for debugging but return null to let service handle "not found" case
      // In production, you might want to throw an error, but the current contract expects null for not found
      // and service throws appropriate errors. We'll log and return null for any error to maintain contract.
      console.error("Error in storefront repository:", error);
      return null;
    }
  }
}

export default new StorefrontRepository();
