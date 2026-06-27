// src/seeders/20260623060936-bootstrap-demo-business.js

import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

const DEMO = {
  business: {
    name: "Raj Mobiles",

    slug: "rajmobiles",

    domain: "rajmobiles.mobile.syncware.fun",

    categoryKey: "mobile",

    plan: "STARTER",

    status: "ACTIVE",

    city: "Patna",

    state: "Bihar",

    country: "India",

    timezone: "Asia/Kolkata",

    phone: "9999999999",

    email: "info@rajmobiles.com",
  },

  owner: {
    fullName: "Raj Kumar",

    email: "owner@rajmobiles.com",

    password: process.env.DEMO_OWNER_PASSWORD || "Owner@123",
  },

  subscription: {
    plan: "STARTER",

    status: "ACTIVE",

    amount: 0,

    currency: "INR",
  },
};

export async function up(queryInterface) {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    const now = new Date();

    // =====================================================
    // CATEGORY
    // =====================================================

    const categories = await queryInterface.sequelize.query(
      `
        SELECT id

        FROM business_categories

        WHERE key=:key

        LIMIT 1
        `,
      {
        replacements: {
          key: DEMO.business.categoryKey,
        },

        type: queryInterface.sequelize.QueryTypes.SELECT,

        transaction,
      },
    );

    if (categories.length === 0) {
      throw new Error(`Category not found : ${DEMO.business.categoryKey}`);
    }

    const businessCategoryId = categories[0].id;

    // =====================================================
    // OWNER
    // =====================================================

    let ownerId;

    const existingOwner = await queryInterface.sequelize.query(
      `
        SELECT id

        FROM users

        WHERE email=:email

        LIMIT 1
        `,
      {
        replacements: {
          email: DEMO.owner.email,
        },

        type: queryInterface.sequelize.QueryTypes.SELECT,

        transaction,
      },
    );

    if (existingOwner.length > 0) {
      ownerId = existingOwner[0].id;
    } else {
      ownerId = uuidv4();

      const hashedPassword = await bcrypt.hash(
        DEMO.owner.password,

        10,
      );

      await queryInterface.bulkInsert(
        "users",

        [
          {
            id: ownerId,

            full_name: DEMO.owner.fullName,

            email: DEMO.owner.email,

            password: hashedPassword,

            auth_provider: "local",

            is_active: true,

            // phone: null,

            // avatar_url: null,

            last_login_at: null,

            deleted_at: null,

            created_at: now,

            updated_at: now,
          },
        ],

        {
          transaction,
        },
      );
    }

    // =====================================================
    // BUSINESS
    // =====================================================

    let businessId;

    const existingBusiness = await queryInterface.sequelize.query(
      `
        SELECT id

        FROM businesses

        WHERE slug=:slug

        LIMIT 1
        `,
      {
        replacements: {
          slug: DEMO.business.slug,
        },

        type: queryInterface.sequelize.QueryTypes.SELECT,

        transaction,
      },
    );

    if (existingBusiness.length > 0) {
      businessId = existingBusiness[0].id;
    } else {
      businessId = uuidv4();

      await queryInterface.bulkInsert(
        "businesses",

        [
          {
            id: businessId,

            business_category_id: businessCategoryId,

            owner_id: ownerId,

            name: DEMO.business.name,

            slug: DEMO.business.slug,

            domain: DEMO.business.domain,

            plan: DEMO.business.plan,

            status: DEMO.business.status,

            city: DEMO.business.city,

            state: DEMO.business.state,

            country: DEMO.business.country,

            timezone: DEMO.business.timezone,

            phone: DEMO.business.phone,

            email: DEMO.business.email,

            logo_url: null,

            address: null,

            gst_number: null,

            created_at: now,

            updated_at: now,
          },
        ],

        {
          transaction,
        },
      );
    }

    // =====================================================
    // USER BUSINESS
    // =====================================================

    const memberships = await queryInterface.sequelize.query(
      `
        SELECT id

        FROM user_businesses

        WHERE

        user_id=:userId

        AND

        business_id=:businessId

        LIMIT 1
        `,
      {
        replacements: {
          userId: ownerId,

          businessId,
        },

        type: queryInterface.sequelize.QueryTypes.SELECT,

        transaction,
      },
    );

    if (memberships.length === 0) {
      await queryInterface.bulkInsert(
        "user_businesses",

        [
          {
            id: uuidv4(),

            user_id: ownerId,

            business_id: businessId,

            is_default: true,

            joined_at: now,
          },
        ],

        {
          transaction,
        },
      );
    }

    // =====================================================
    // MOBILE OWNER ROLE
    // =====================================================

    const roles = await queryInterface.sequelize.query(
      `
        SELECT id

        FROM roles

        WHERE slug='mobile.owner'

        LIMIT 1
        `,
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,

        transaction,
      },
    );

    if (roles.length > 0) {
      const roleId = roles[0].id;

      const userRoles = await queryInterface.sequelize.query(
        `
          SELECT id

          FROM user_roles

          WHERE

          user_id=:userId

          AND

          role_id=:roleId

          AND

          business_id=:businessId

          LIMIT 1
          `,
        {
          replacements: {
            userId: ownerId,

            roleId,

            businessId,
          },

          type: queryInterface.sequelize.QueryTypes.SELECT,

          transaction,
        },
      );

      if (userRoles.length === 0) {
        await queryInterface.bulkInsert(
          "user_roles",

          [
            {
              id: uuidv4(),

              user_id: ownerId,

              role_id: roleId,

              scope: "business",

              business_id: businessId,

              assigned_by: ownerId,

              assigned_at: now,
            },
          ],

          {
            transaction,
          },
        );
      }
    }

    // =====================================================
    // SUBSCRIPTION
    // =====================================================

    const subscriptions = await queryInterface.sequelize.query(
      `
        SELECT id

        FROM subscriptions

        WHERE business_id=:businessId

        LIMIT 1
        `,
      {
        replacements: {
          businessId,
        },

        type: queryInterface.sequelize.QueryTypes.SELECT,

        transaction,
      },
    );
    if (subscriptions.length === 0) {
      const now = new Date();

      const expiresAt = new Date(now);
      expiresAt.setDate(expiresAt.getDate() + 30);
      await queryInterface.bulkInsert(
        "subscriptions",

        [
          {
            id: uuidv4(),

            business_id: businessId,

            plan: DEMO.subscription.plan,

            status: DEMO.subscription.status,

            amount: DEMO.subscription.amount,

            currency: DEMO.subscription.currency,

            starts_at: now,

            expires_at: expiresAt,

            created_at: now,

            updated_at: now,
          },
        ],

        {
          transaction,
        },
      );
    }

    await transaction.commit();

    console.log("✅ bootstrap-demo-business completed");
  } catch (error) {
    await transaction.rollback();

    console.error("❌ bootstrap-demo-business failed");

    throw error;
  }
}

export async function down(queryInterface) {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    await queryInterface.bulkDelete(
      "subscriptions",

      {},

      { transaction },
    );

    await queryInterface.bulkDelete(
      "user_roles",

      {},

      { transaction },
    );

    await queryInterface.bulkDelete(
      "user_businesses",

      {},

      { transaction },
    );

    await queryInterface.bulkDelete(
      "businesses",

      {
        slug: "rajmobiles",
      },

      {
        transaction,
      },
    );

    await queryInterface.bulkDelete(
      "users",

      {
        email: "owner@rajmobiles.com",
      },

      {
        transaction,
      },
    );

    await transaction.commit();

    console.log("↩️ bootstrap-demo-business rollback completed");
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
}
