import { v4 as uuidv4 } from "uuid";

import RESOURCES from "../seed-data/resources.js";

export async function up(queryInterface) {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    const now = new Date();

    // =====================================================
    // EXISTING RESOURCES
    // =====================================================

    const existingResources = await queryInterface.sequelize.query(
      `
      SELECT id, slug
      FROM resources
      `,
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,

        transaction,
      },
    );

    const existingResourceSlugs = new Set(
      existingResources.map((resource) => resource.slug),
    );

    // =====================================================
    // PREPARE INSERTS
    // =====================================================

    const resourcesToInsert = [];

    for (const resource of RESOURCES) {
      if (existingResourceSlugs.has(resource.slug)) {
        continue;
      }

      resourcesToInsert.push({
        id: uuidv4(),

        slug: resource.slug,

        name: resource.name,

        type: resource.type || "entity",

        description: resource.description || null,

        created_at: now,

        updated_at: now,
      });
    }

    // =====================================================
    // INSERT
    // =====================================================

    if (resourcesToInsert.length > 0) {
      await queryInterface.bulkInsert(
        "resources",

        resourcesToInsert,

        {
          transaction,
        },
      );
    }

    await transaction.commit();

    console.log(
      `✅ bootstrap-resources completed (${resourcesToInsert.length} inserted)`,
    );
  } catch (error) {
    await transaction.rollback();

    console.error("❌ bootstrap-resources failed");

    throw error;
  }
}

export async function down(queryInterface) {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    const resourceSlugs = RESOURCES.map((resource) => resource.slug);

    await queryInterface.bulkDelete(
      "resources",

      {
        slug: resourceSlugs,
      },

      {
        transaction,
      },
    );

    await transaction.commit();

    console.log("↩️ bootstrap-resources rollback completed");
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
}
