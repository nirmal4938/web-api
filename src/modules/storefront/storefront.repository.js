// ============================================================
// SyncWare Storefront Engine
// Storefront Repository
// ============================================================
//
// Responsibilities
//
// • Resolve tenant from hostname
// • Query PostgreSQL
// • Return normalized business object
//
// This layer NEVER knows about Express.
//
// ============================================================

import { db } from "../../models/index.js";

const DEVELOPMENT_SLUG =
  process.env.STOREFRONT_DEVELOPMENT_SLUG || "rajmobiles";

class StorefrontRepository {
  // ==========================================================
  // Public
  // ==========================================================

  async findStorefront(context) {
    const hostname = this.normalizeHostname(context.hostname);

    const slug = this.resolveSlug(hostname);

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🏪 Storefront Resolution");
    console.log("Hostname :", hostname);
    console.log("Slug     :", slug);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    if (!slug) {
      return null;
    }

    return this.findBusinessBySlug(slug, hostname);
  }

  // ==========================================================
  // Hostname Helpers
  // ==========================================================

  normalizeHostname(hostname) {
    if (!hostname) {
      return "";
    }

    return hostname
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .split(":")[0];
  }

  resolveSlug(hostname) {
    if (this.isDevelopmentHost(hostname)) {
      return DEVELOPMENT_SLUG;
    }

    return this.extractSubdomain(hostname);
  }

  isDevelopmentHost(hostname) {
    return (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.startsWith("192.168.") ||
      hostname.startsWith("10.") ||
      hostname.endsWith(".local")
    );
  }

  /**
   * Examples
   *
   * raj.syncware.fun
   * → raj
   *
   * abc.syncware.fun
   * → abc
   *
   * demo.shop.syncware.fun
   * → demo
   *
   * syncware.fun
   * → null
   *
   * web-api-qzo8.onrender.com
   * → null
   */

  extractSubdomain(hostname) {
    const parts = hostname.split(".");

    // ignore root domains
    if (parts.length < 3) {
      return null;
    }

    return parts[0];
  }

  // ==========================================================
  // Database
  // ==========================================================

  async findBusinessBySlug(slug, hostname) {
    try {
      console.log(`🔍 Looking for business "${slug}"`);

      const business = await db.Business.findOne({
        where: {
          slug,
          status: "ACTIVE",
        },

        include: [
          {
            model: db.BusinessCategory,
            as: "category",
            attributes: ["id", "key", "name"],
          },
        ],
      });

      if (!business) {
        console.log(`❌ Business "${slug}" not found`);
        return null;
      }

      console.log(`✅ Business resolved → ${business.name} (${business.slug})`);

      return this.mapBusiness(business, hostname);
    } catch (error) {
      console.error("❌ StorefrontRepository.findBusinessBySlug");
      console.error(error);

      throw error;
    }
  }

  // ==========================================================
  // Mapper
  // ==========================================================

  mapBusiness(business, hostname) {
    return {
      id: business.id,
      slug: business.slug,
      name: business.name,
      hostname,
      domain: business.domain,
      status: business.status,
      plan: business.plan,
      logoUrl: business.logoUrl,
      phone: business.phone,
      email: business.email,
      timezone: business.timezone,
      address: business.address,
      city: business.city,
      state: business.state,
      country: business.country,
      category: {
        id: business.category?.id,
        key: business.category?.key,
        name: business.category?.name,
      },
      createdAt: business.createdAt,
      updatedAt: business.updatedAt,
    };
  }
}

export default new StorefrontRepository();
