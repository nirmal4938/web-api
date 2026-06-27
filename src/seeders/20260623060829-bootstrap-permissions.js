import { v4 as uuidv4 } from "uuid";

import RESOURCES from "../seed-data/resources.js";
import FEATURES from "../seed-data/features.js";
import PERMISSION_ACTIONS from "../seed-data/permissionActions.js";
import CUSTOM_PERMISSIONS from "../seed-data/customPermissions.js";

/**
 * Resource -> Feature mapping
 */
const RESOURCE_FEATURE_MAP = {
  product: "inventory",

  sale: "sales",

  purchase: "purchase",

  customer: "customers",

  supplier: "suppliers",

  employee: "employees",

  report: "reports",

  setting: "settings",

  subscription: "subscriptions",

  imei: "imei_verification",

  repair: "repairs",

  size: "sizes",

  alteration: "alterations",

  medicine: "medicines",

  prescription: "prescriptions",
};

export async function up(queryInterface) {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    const now = new Date();

    // =====================================================
    // RESOURCES
    // =====================================================

    const dbResources = await queryInterface.sequelize.query(
      `
      SELECT id, slug
      FROM resources
      `,
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,

        transaction,
      },
    );

    const resourceMap = {};

    dbResources.forEach((r) => {
      resourceMap[r.slug] = r.id;
    });

    // =====================================================
    // FEATURES
    // =====================================================

    const dbFeatures = await queryInterface.sequelize.query(
      `
      SELECT id,key
      FROM features
      `,
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,

        transaction,
      },
    );

    const featureMap = {};

    dbFeatures.forEach((f) => {
      featureMap[f.key] = f.id;
    });

    // =====================================================
    // EXISTING PERMISSIONS
    // =====================================================

    const existingPermissions = await queryInterface.sequelize.query(
      `
      SELECT slug
      FROM permissions
      `,
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,

        transaction,
      },
    );

    const existingSlugs = new Set(existingPermissions.map((p) => p.slug));

    const permissionsToInsert = [];

    // =====================================================
    // CRUD PERMISSIONS
    // =====================================================

    for (const resource of RESOURCES) {
      const resourceId = resourceMap[resource.slug];

      const featureKey = RESOURCE_FEATURE_MAP[resource.slug];

      const featureId = featureMap[featureKey];

      if (!resourceId) continue;

      for (const action of PERMISSION_ACTIONS) {
        const slug = `${resource.slug}:${action}`;

        if (existingSlugs.has(slug)) continue;

        permissionsToInsert.push({
          id: uuidv4(),

          name: `${action} ${resource.name}`,

          slug,

          description: `${action} ${resource.name}`,

          resource_id: resourceId,

          feature_id: featureId || null,

          action,

          created_at: now,

          updated_at: now,
        });
      }
    }

    // =====================================================
    // CUSTOM PERMISSIONS
    // =====================================================

    for (const permission of CUSTOM_PERMISSIONS) {
      const slug = `${permission.resource}:${permission.action}`;

      if (existingSlugs.has(slug)) continue;

      permissionsToInsert.push({
        id: uuidv4(),

        name: permission.name,

        slug,

        description: permission.description,

        resource_id: resourceMap[permission.resource],

        feature_id: featureMap[permission.feature],

        action: permission.action,

        created_at: now,

        updated_at: now,
      });
    }

    // =====================================================
    // INSERT
    // =====================================================

    if (permissionsToInsert.length > 0) {
      await queryInterface.bulkInsert(
        "permissions",

        permissionsToInsert,

        {
          transaction,
        },
      );
    }

    await transaction.commit();

    console.log(
      `✅ bootstrap-permissions completed (${permissionsToInsert.length} inserted)`,
    );
  } catch (error) {
    await transaction.rollback();

    console.error("❌ bootstrap-permissions failed");

    throw error;
  }
}

export async function down(queryInterface) {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    const slugs = [];

    // CRUD

    for (const resource of RESOURCES) {
      for (const action of PERMISSION_ACTIONS) {
        slugs.push(`${resource.slug}:${action}`);
      }
    }

    // CUSTOM

    for (const permission of CUSTOM_PERMISSIONS) {
      slugs.push(`${permission.resource}:${permission.action}`);
    }

    await queryInterface.bulkDelete(
      "permissions",

      {
        slug: slugs,
      },

      {
        transaction,
      },
    );

    await transaction.commit();

    console.log("↩️ bootstrap-permissions rollback completed");
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
}
