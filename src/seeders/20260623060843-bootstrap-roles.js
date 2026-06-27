import { v4 as uuidv4 } from "uuid";

import ROLES from "../seed-data/roles.js";
import BUSINESS_CATEGORIES from "../seed-data/businessCategories.js";

export async function up(queryInterface) {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    const now = new Date();

    // =====================================================
    // BUSINESS CATEGORIES
    // =====================================================

    const dbCategories = await queryInterface.sequelize.query(
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

    dbCategories.forEach((c) => {
      categoryMap[c.key] = c.id;
    });

    // =====================================================
    // EXISTING ROLES
    // =====================================================

    const dbRoles = await queryInterface.sequelize.query(
      `
        SELECT id,slug
        FROM roles
        `,
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,

        transaction,
      },
    );

    const roleMap = {};

    dbRoles.forEach((r) => {
      roleMap[r.slug] = r.id;
    });

    const rolesToInsert = [];

    // =====================================================
    // INSERT ROLES
    // =====================================================

    for (const [categoryKey, roles] of Object.entries(ROLES)) {
      for (const role of roles) {
        if (roleMap[role.slug]) continue;

        const id = uuidv4();

        roleMap[role.slug] = id;

        rolesToInsert.push({
          id,

          scope: role.scope,

          business_category_id:
            role.scope === "platform" ? null : categoryMap[categoryKey],

          name: role.name,

          slug: role.slug,

          description: role.description || null,

          level: role.level,

          is_system_role: role.isSystemRole ?? true,

          created_at: now,

          updated_at: now,
        });
      }
    }

    if (rolesToInsert.length > 0) {
      await queryInterface.bulkInsert(
        "roles",

        rolesToInsert,

        {
          transaction,
        },
      );
    }

    // =====================================================
    // REFRESH ROLE MAP
    // =====================================================

    const refreshedRoles = await queryInterface.sequelize.query(
      `
        SELECT id,slug
        FROM roles
        `,
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,

        transaction,
      },
    );

    refreshedRoles.forEach((r) => {
      roleMap[r.slug] = r.id;
    });

    // =====================================================
    // EXISTING BUSINESS CATEGORY ROLES
    // =====================================================

    const existingMappings = await queryInterface.sequelize.query(
      `
        SELECT
          business_category_id,
          role_id
        FROM business_category_roles
        `,
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,

        transaction,
      },
    );

    const mappingSet = new Set();

    existingMappings.forEach((m) => {
      mappingSet.add(`${m.business_category_id}:${m.role_id}`);
    });

    const mappingsToInsert = [];

    // =====================================================
    // CATEGORY ROLE MAPPINGS
    // =====================================================

    for (const category of BUSINESS_CATEGORIES) {
      const categoryRoles = ROLES[category.key] || [];

      for (const role of categoryRoles) {
        const businessCategoryId = categoryMap[category.key];

        const roleId = roleMap[role.slug];

        if (!businessCategoryId || !roleId) continue;

        const key = `${businessCategoryId}:${roleId}`;

        if (mappingSet.has(key)) continue;

        mappingsToInsert.push({
          id: uuidv4(),

          business_category_id: businessCategoryId,

          role_id: roleId,

          created_at: now,
        });
      }
    }

    if (mappingsToInsert.length > 0) {
      await queryInterface.bulkInsert(
        "business_category_roles",

        mappingsToInsert,

        {
          transaction,
        },
      );
    }

    await transaction.commit();

    console.log(
      `✅ bootstrap-roles completed
Roles : ${rolesToInsert.length}
Mappings : ${mappingsToInsert.length}`,
    );
  } catch (error) {
    await transaction.rollback();

    console.error("❌ bootstrap-roles failed");

    throw error;
  }
}

export async function down(queryInterface) {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    const roleSlugs = [];

    Object.values(ROLES).forEach((roles) => {
      roles.forEach((role) => {
        roleSlugs.push(role.slug);
      });
    });

    const dbRoles = await queryInterface.sequelize.query(
      `
        SELECT id
        FROM roles
        WHERE slug IN (:roleSlugs)
        `,
      {
        replacements: {
          roleSlugs,
        },

        type: queryInterface.sequelize.QueryTypes.SELECT,

        transaction,
      },
    );

    const roleIds = dbRoles.map((r) => r.id);

    await queryInterface.bulkDelete(
      "business_category_roles",

      {
        role_id: roleIds,
      },

      {
        transaction,
      },
    );

    await queryInterface.bulkDelete(
      "roles",

      {
        slug: roleSlugs,
      },

      {
        transaction,
      },
    );

    await transaction.commit();

    console.log("↩️ bootstrap-roles rollback completed");
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
}
