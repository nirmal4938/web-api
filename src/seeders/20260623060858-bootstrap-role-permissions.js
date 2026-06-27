import { v4 as uuidv4 } from "uuid";

import ROLE_PERMISSION_MATRIX from "../seed-data/rolePermissionMatrix.js";

export async function up(queryInterface) {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    const now = new Date();

    // =====================================================
    // ROLES
    // =====================================================

    const dbRoles = await queryInterface.sequelize.query(
      `
      SELECT id, slug
      FROM roles
      `,
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,
        transaction,
      },
    );

    const roleMap = {};

    dbRoles.forEach((role) => {
      roleMap[role.slug] = role.id;
    });

    // =====================================================
    // PERMISSIONS
    // =====================================================

    const dbPermissions = await queryInterface.sequelize.query(
      `
        SELECT
          id,
          slug,
          action,
          resource_id
        FROM permissions
        `,
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,

        transaction,
      },
    );

    const permissionMap = {};

    dbPermissions.forEach((permission) => {
      permissionMap[permission.slug] = permission.id;
    });

    // =====================================================
    // EXISTING ROLE PERMISSIONS
    // =====================================================

    const existing = await queryInterface.sequelize.query(
      `
        SELECT role_id, permission_id
        FROM role_permissions
        `,
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,

        transaction,
      },
    );

    const existingSet = new Set();

    existing.forEach((row) => {
      existingSet.add(`${row.role_id}:${row.permission_id}`);
    });

    // =====================================================
    // HELPERS
    // =====================================================

    function expandPermission(pattern) {
      // *

      if (pattern === "*") {
        return dbPermissions.map((p) => p.id);
      }

      // product:*

      if (pattern.endsWith(":*")) {
        const resource = pattern.replace(":*", "");

        return dbPermissions
          .filter((permission) => permission.slug.startsWith(`${resource}:`))
          .map((permission) => permission.id);
      }

      // product:create

      const permissionId = permissionMap[pattern];

      return permissionId ? [permissionId] : [];
    }

    // =====================================================
    // BUILD MAPPINGS
    // =====================================================

    const inserts = [];

    for (const [roleSlug, permissions] of Object.entries(
      ROLE_PERMISSION_MATRIX,
    )) {
      const roleId = roleMap[roleSlug];

      if (!roleId) {
        console.warn(`Role not found : ${roleSlug}`);

        continue;
      }

      const permissionIds = new Set();

      for (const pattern of permissions) {
        const ids = expandPermission(pattern);

        ids.forEach((id) => permissionIds.add(id));
      }

      for (const permissionId of permissionIds) {
        const key = `${roleId}:${permissionId}`;

        if (existingSet.has(key)) continue;

        inserts.push({
          id: uuidv4(),

          role_id: roleId,

          permission_id: permissionId,

          granted_by: null,

          granted_at: now,
        });
      }
    }

    // =====================================================
    // INSERT
    // =====================================================

    if (inserts.length > 0) {
      await queryInterface.bulkInsert(
        "role_permissions",

        inserts,

        {
          transaction,
        },
      );
    }

    await transaction.commit();

    console.log(
      `✅ bootstrap-role-permissions completed (${inserts.length} inserted)`,
    );
  } catch (error) {
    await transaction.rollback();

    console.error("❌ bootstrap-role-permissions failed");

    throw error;
  }
}

export async function down(queryInterface) {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    const roleSlugs = Object.keys(ROLE_PERMISSION_MATRIX);

    const roles = await queryInterface.sequelize.query(
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

    const roleIds = roles.map((role) => role.id);

    await queryInterface.bulkDelete(
      "role_permissions",

      {
        role_id: roleIds,
      },

      {
        transaction,
      },
    );

    await transaction.commit();

    console.log("↩️ bootstrap-role-permissions rollback completed");
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
}
