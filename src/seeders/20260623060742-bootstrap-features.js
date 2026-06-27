import { v4 as uuidv4 } from "uuid";

import FEATURES from "../seed-data/features.js";

export async function up(queryInterface) {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    const now = new Date();

    // =====================================================
    // EXISTING FEATURES
    // =====================================================

    const existingFeatures = await queryInterface.sequelize.query(
      `
      SELECT id, key
      FROM features
      `,
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,

        transaction,
      },
    );

    const existingFeatureKeys = new Set(
      existingFeatures.map((feature) => feature.key),
    );

    // =====================================================
    // PREPARE INSERTS
    // =====================================================

    const featuresToInsert = [];

    for (const feature of FEATURES) {
      if (existingFeatureKeys.has(feature.key)) {
        continue;
      }

      featuresToInsert.push({
        id: uuidv4(),

        key: feature.key,

        name: feature.name,

        description: feature.description || null,

        created_at: now,

        updated_at: now,
      });
    }

    // =====================================================
    // INSERT
    // =====================================================

    if (featuresToInsert.length > 0) {
      await queryInterface.bulkInsert(
        "features",

        featuresToInsert,

        {
          transaction,
        },
      );
    }

    await transaction.commit();

    console.log(
      `✅ bootstrap-features completed (${featuresToInsert.length} inserted)`,
    );
  } catch (error) {
    await transaction.rollback();

    console.error("❌ bootstrap-features failed");

    throw error;
  }
}

export async function down(queryInterface) {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    const featureKeys = FEATURES.map((feature) => feature.key);

    await queryInterface.bulkDelete(
      "features",

      {
        key: featureKeys,
      },

      {
        transaction,
      },
    );

    await transaction.commit();

    console.log("↩️ bootstrap-features rollback completed");
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
}
