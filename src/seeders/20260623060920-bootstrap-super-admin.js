import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

const ADMIN_EMAIL = "admin@syncware.fun";

const ADMIN_NAME = "Platform Super Admin";

export async function up(queryInterface) {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    const now = new Date();

    const password = process.env.BOOTSTRAP_ADMIN_PASSWORD || "Admin@123";

    // =====================================================
    // USER
    // =====================================================

    const existingUser = await queryInterface.sequelize.query(
      `
        SELECT id
        FROM users
        WHERE email=:email
        LIMIT 1
        `,
      {
        replacements: {
          email: ADMIN_EMAIL,
        },

        type: queryInterface.sequelize.QueryTypes.SELECT,

        transaction,
      },
    );

    let adminUserId;

    if (existingUser.length > 0) {
      adminUserId = existingUser[0].id;
    } else {
      adminUserId = uuidv4();

      const hashedPassword = await bcrypt.hash(
        password,

        10,
      );

      await queryInterface.bulkInsert(
        "users",

        [
          {
            id: adminUserId,

            full_name: ADMIN_NAME,

            email: ADMIN_EMAIL,

            password: hashedPassword,

            auth_provider: "local",

            // phone: null,

            // avatar_url: null,

            is_active: true,

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
    // ROLE
    // =====================================================

    const roles = await queryInterface.sequelize.query(
      `
        SELECT id
        FROM roles
        WHERE slug='platform.super_admin'
        LIMIT 1
        `,
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,

        transaction,
      },
    );

    if (roles.length === 0) {
      throw new Error("platform.super_admin role not found");
    }

    const roleId = roles[0].id;

    // =====================================================
    // EXISTING USER ROLE
    // =====================================================

    const existingUserRole = await queryInterface.sequelize.query(
      `
        SELECT id
        FROM user_roles

        WHERE

        user_id=:userId

        AND

        role_id=:roleId

        LIMIT 1
        `,
      {
        replacements: {
          userId: adminUserId,

          roleId,
        },

        type: queryInterface.sequelize.QueryTypes.SELECT,

        transaction,
      },
    );

    if (existingUserRole.length === 0) {
      await queryInterface.bulkInsert(
        "user_roles",

        [
          {
            id: uuidv4(),

            user_id: adminUserId,

            role_id: roleId,

            scope: "platform",

            business_id: null,

            assigned_by: adminUserId,

            assigned_at: now,
          },
        ],

        {
          transaction,
        },
      );
    }

    await transaction.commit();

    console.log("✅ bootstrap-super-admin completed");

    console.log(`Email : ${ADMIN_EMAIL}`);

    console.log(`Password : ${password}`);
  } catch (error) {
    await transaction.rollback();

    console.error("❌ bootstrap-super-admin failed");

    throw error;
  }
}

export async function down(queryInterface) {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    const users = await queryInterface.sequelize.query(
      `
        SELECT id

        FROM users

        WHERE email=:email

        LIMIT 1
        `,
      {
        replacements: {
          email: ADMIN_EMAIL,
        },

        type: queryInterface.sequelize.QueryTypes.SELECT,

        transaction,
      },
    );

    if (users.length > 0) {
      const userId = users[0].id;

      await queryInterface.bulkDelete(
        "user_roles",

        {
          user_id: userId,
        },

        {
          transaction,
        },
      );

      await queryInterface.bulkDelete(
        "users",

        {
          id: userId,
        },

        {
          transaction,
        },
      );
    }

    await transaction.commit();

    console.log("↩️ bootstrap-super-admin rollback completed");
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
}
