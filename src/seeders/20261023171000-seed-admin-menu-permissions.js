import { v4 as uuidv4 } from "uuid";

import CUSTOM_PERMISSIONS from "../seed-data/customPermissions.js";
import RESOURCES from "../seed-data/resources.js";

const ADMIN_RESOURCE_SLUG = "admin";
const SUPER_ADMIN_ROLE_SLUG = "platform.super_admin";

const ADMIN_PERMISSIONS = CUSTOM_PERMISSIONS.filter(
  (permission) => permission.resource === ADMIN_RESOURCE_SLUG,
);

export async function up(queryInterface) {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    const now = new Date();
    const [adminResource] = await queryInterface.sequelize.query(
      `
        SELECT id
        FROM resources
        WHERE slug=:slug
        LIMIT 1
        `,
      {
        replacements: { slug: ADMIN_RESOURCE_SLUG },
        type: queryInterface.sequelize.QueryTypes.SELECT,
        transaction,
      },
    );

    let resourceId = adminResource?.id;

    if (!resourceId) {
      const resource = RESOURCES.find(
        (item) => item.slug === ADMIN_RESOURCE_SLUG,
      );

      if (!resource) {
        throw new Error(`Resource not configured: ${ADMIN_RESOURCE_SLUG}`);
      }

      resourceId = uuidv4();
      await queryInterface.bulkInsert(
        "resources",
        [
          {
            id: resourceId,
            slug: resource.slug,
            name: resource.name,
            type: resource.type || "entity",
            description: resource.description || null,
            created_at: now,
            updated_at: now,
          },
        ],
        { transaction },
      );
    }

    const [role] = await queryInterface.sequelize.query(
      `
        SELECT id
        FROM roles
        WHERE slug=:slug
        LIMIT 1
        `,
      {
        replacements: { slug: SUPER_ADMIN_ROLE_SLUG },
        type: queryInterface.sequelize.QueryTypes.SELECT,
        transaction,
      },
    );

    if (!role) {
      throw new Error(`Role not found: ${SUPER_ADMIN_ROLE_SLUG}`);
    }

    const existingPermissions = await queryInterface.sequelize.query(
      `
        SELECT id, slug
        FROM permissions
        WHERE slug IN (:slugs)
        `,
      {
        replacements: { slugs: ADMIN_PERMISSIONS.map(({ slug }) => slug) },
        type: queryInterface.sequelize.QueryTypes.SELECT,
        transaction,
      },
    );
    const permissionIds = new Map(
      existingPermissions.map((permission) => [permission.slug, permission.id]),
    );

    const permissionsToInsert = ADMIN_PERMISSIONS.filter(
      (permission) => !permissionIds.has(permission.slug),
    ).map((permission) => {
      const id = uuidv4();
      permissionIds.set(permission.slug, id);

      return {
        id,
        name: permission.name,
        slug: permission.slug,
        description: permission.description,
        resource_id: resourceId,
        feature_id: null,
        action: permission.action,
        created_at: now,
        updated_at: now,
      };
    });

    if (permissionsToInsert.length > 0) {
      await queryInterface.bulkInsert("permissions", permissionsToInsert, {
        transaction,
      });
    }

    const existingRolePermissions = await queryInterface.sequelize.query(
      `
        SELECT permission_id
        FROM role_permissions
        WHERE role_id=:roleId
        `,
      {
        replacements: { roleId: role.id },
        type: queryInterface.sequelize.QueryTypes.SELECT,
        transaction,
      },
    );
    const existingPermissionIds = new Set(
      existingRolePermissions.map(({ permission_id }) => permission_id),
    );
    const rolePermissionsToInsert = [...permissionIds.values()]
      .filter((permissionId) => !existingPermissionIds.has(permissionId))
      .map((permissionId) => ({
        id: uuidv4(),
        role_id: role.id,
        permission_id: permissionId,
        granted_by: null,
        granted_at: now,
      }));

    if (rolePermissionsToInsert.length > 0) {
      await queryInterface.bulkInsert(
        "role_permissions",
        rolePermissionsToInsert,
        { transaction },
      );
    }

    await transaction.commit();
    console.log(
      `✅ admin-menu-permissions completed (${permissionsToInsert.length} permissions, ${rolePermissionsToInsert.length} role grants inserted)`,
    );
  } catch (error) {
    await transaction.rollback();
    console.error("❌ admin-menu-permissions failed");
    throw error;
  }
}

export async function down(queryInterface) {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    const slugs = ADMIN_PERMISSIONS.map(({ slug }) => slug);
    const permissions = await queryInterface.sequelize.query(
      `
        SELECT id
        FROM permissions
        WHERE slug IN (:slugs)
        `,
      {
        replacements: { slugs },
        type: queryInterface.sequelize.QueryTypes.SELECT,
        transaction,
      },
    );
    const permissionIds = permissions.map(({ id }) => id);

    if (permissionIds.length > 0) {
      await queryInterface.bulkDelete(
        "role_permissions",
        { permission_id: permissionIds },
        { transaction },
      );
      await queryInterface.bulkDelete(
        "permissions",
        { id: permissionIds },
        { transaction },
      );
    }

    const resources = await queryInterface.sequelize.query(
      `
        SELECT id
        FROM resources
        WHERE slug=:slug
        LIMIT 1
        `,
      {
        replacements: { slug: ADMIN_RESOURCE_SLUG },
        type: queryInterface.sequelize.QueryTypes.SELECT,
        transaction,
      },
    );

    if (resources.length > 0) {
      const remainingPermissions = await queryInterface.sequelize.query(
        `
          SELECT id
          FROM permissions
          WHERE resource_id=:resourceId
          LIMIT 1
          `,
        {
          replacements: { resourceId: resources[0].id },
          type: queryInterface.sequelize.QueryTypes.SELECT,
          transaction,
        },
      );

      if (remainingPermissions.length === 0) {
        await queryInterface.bulkDelete(
          "resources",
          { id: resources[0].id },
          { transaction },
        );
      }
    }

    await transaction.commit();
    console.log("↩️ admin-menu-permissions rollback completed");
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
