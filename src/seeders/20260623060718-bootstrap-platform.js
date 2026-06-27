import { v4 as uuidv4 } from "uuid";

import BUSINESS_CATEGORIES from "../seed-data/businessCategories.js";
import APPS from "../seed-data/apps.js";

export async function up(queryInterface) {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    const now = new Date();

    // =====================================================
    // BUSINESS CATEGORIES
    // =====================================================

    const existingCategories = await queryInterface.sequelize.query(
      `
      SELECT id,key
      FROM business_categories
      `,
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,
        transaction,
      },
    );

    const categoryMap = {};

    existingCategories.forEach((c) => {
      categoryMap[c.key] = c.id;
    });

    const categoriesToInsert = [];

    for (const category of BUSINESS_CATEGORIES) {
      if (categoryMap[category.key]) continue;

      const id = uuidv4();

      categoryMap[category.key] = id;

      categoriesToInsert.push({
        id,

        key: category.key,

        name: category.name,

        description: category.description,

        subdomain: category.subdomain,

        app_url: category.appUrl,

        icon: category.icon,

        is_active: category.isActive ?? true,

        created_at: now,

        updated_at: now,
      });
    }

    if (categoriesToInsert.length > 0) {
      await queryInterface.bulkInsert(
        "business_categories",

        categoriesToInsert,

        { transaction },
      );
    }

    // =====================================================
    // APP REGISTRY
    // =====================================================

    const existingApps = await queryInterface.sequelize.query(
      `
      SELECT id, app_key
      FROM app_registry
      `,
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,

        transaction,
      },
    );

    const existingAppKeys = new Set(existingApps.map((app) => app.app_key));

    const appsToInsert = [];

    for (const app of APPS) {
      if (existingAppKeys.has(app.appKey)) continue;

      const categoryId = categoryMap[app.category];

      if (!categoryId) {
        throw new Error(`Business category not found for app : ${app.appKey}`);
      }

      appsToInsert.push({
        id: uuidv4(),

        business_category_id: categoryId,

        name: app.name,

        app_key: app.appKey,

        base_url: app.baseUrl,

        frontend_url: app.frontendUrl,

        backend_url: app.backendUrl,

        version: app.version || "1.0.0",

        is_active: app.isActive ?? true,

        created_at: now,

        updated_at: now,
      });
    }

    if (appsToInsert.length > 0) {
      await queryInterface.bulkInsert(
        "app_registry",

        appsToInsert,

        { transaction },
      );
    }

    await transaction.commit();

    console.log("✅ bootstrap-platform completed");
  } catch (error) {
    await transaction.rollback();

    console.error("❌ bootstrap-platform failed");

    throw error;
  }
}

export async function down(queryInterface) {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    const appKeys = APPS.map((a) => a.appKey);

    await queryInterface.bulkDelete(
      "app_registry",

      {
        app_key: appKeys,
      },

      { transaction },
    );

    const categoryKeys = BUSINESS_CATEGORIES.map((c) => c.key);

    await queryInterface.bulkDelete(
      "business_categories",

      {
        key: categoryKeys,
      },

      { transaction },
    );

    await transaction.commit();

    console.log("↩️ bootstrap-platform rollback completed");
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
}
