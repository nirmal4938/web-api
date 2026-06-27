import { sequelize, db } from "../models/index.js";
import slugify from "../utils/slugify.js";

const { User, Business, BusinessCategory, UserBusiness } = db;

class OnboardingService {
  static async registerBusiness(payload) {
    const transaction = await sequelize.transaction();

    try {
      const {
        fullName,
        email,
        password,
        businessCategoryId,
        businessName,
        phone,
        address,
      } = payload;

      // -----------------------------------
      // 1. VALIDATION
      // -----------------------------------
      if (!businessCategoryId) {
        throw new Error("Business category is required");
      }

      // -----------------------------------
      // 2. CHECK USER EXISTS
      // -----------------------------------
      const existingUser = await User.findOne({
        where: { email },
        transaction,
      });

      if (existingUser) {
        throw new Error("Email already registered");
      }

      // -----------------------------------
      // 3. CATEGORY
      // -----------------------------------
      const category = await BusinessCategory.findByPk(businessCategoryId, {
        transaction,
      });

      if (!category) {
        throw new Error("Invalid business category");
      }

      // -----------------------------------
      // 4. CREATE USER
      // -----------------------------------
      const user = await User.create(
        {
          fullName,
          email,
          password,
          authProvider: "local",
          isActive: true,
        },
        { transaction },
      );

      // -----------------------------------
      // 5. SLUG
      // -----------------------------------
      let slug = slugify(businessName);

      const existingBusiness = await Business.findOne({
        where: { slug },
        transaction,
      });

      if (existingBusiness) {
        slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
      }

      // -----------------------------------
      // 6. CREATE BUSINESS
      // -----------------------------------
      const business = await Business.create(
        {
          name: businessName,
          slug,
          ownerId: user.id,
          businessCategoryId: category.id,
          plan: "STARTER",
          status: "ACTIVE",
          address,
          country: "India",
          phone,
        },
        { transaction },
      );

      // -----------------------------------
      // 7. USER-BUSINESS MAP
      // -----------------------------------
      await UserBusiness.create(
        {
          userId: user.id,
          businessId: business.id,
          role: "OWNER",
          status: "active",
        },
        { transaction },
      );

      // -----------------------------------
      // 8. COMMIT
      // -----------------------------------
      await transaction.commit();

      // -----------------------------------
      // 9. RESPONSE (NO JWT HERE)
      // -----------------------------------
      return {
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
        },

        business: {
          id: business.id,
          name: business.name,
          slug: business.slug,
          phone: business.phone,
          address: business.address,
          category: {
            id: category.id,
            key: category.key,
            name: category.name,
            icon: category.icon,
            subdomain: category.subdomain,
            appUrl: category.appUrl,
          },
        },

        rbac: {
          role: "OWNER",
          permissions: ["ALL"],
        },
      };
    } catch (err) {
      await transaction.rollback();
      console.error("❌ Register Business Error:", err);
      throw err;
    }
  }
}

export default OnboardingService;
