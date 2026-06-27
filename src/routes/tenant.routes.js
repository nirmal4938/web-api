import { authenticateJWT } from "../middlewares/AuthMiddleware.js";
import express from "express";
import { db } from "../models/index.js";

const router = express.Router();

router.post("/bootstrap", authenticateJWT, async (req, res) => {
  try {
    const user = req.user;
    const { businessId } = req.body;

    if (!businessId) {
      return res.status(400).json({
        success: false,
        message: "businessId required",
      });
    }

    console.log("🚀 [BOOTSTRAP] user:", user.id);
    console.log("🏢 [BOOTSTRAP] businessId:", businessId);

    // -----------------------------------
    // 1. BUSINESS VALIDATION
    // -----------------------------------
    const business = await db.Business.findOne({
      where: {
        id: businessId,
        ownerId: user.id,
      },
      include: [
        {
          model: db.BusinessCategory,
          as: "category",
        },
      ],
    });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    // -----------------------------------
    // 2. RBAC FIX (ALIAS SAFE QUERY)
    // -----------------------------------
    const userRoles = await db.UserRole.findAll({
      where: { userId: user.id },
      include: [
        {
          model: db.Role,
          as: "role", // ✅ FIX: REQUIRED ALIAS
          include: [
            {
              model: db.Permission,
              as: "permissions", // ✅ FIX: REQUIRED ALIAS (if defined)
            },
          ],
        },
      ],
    });

    const roles = userRoles.map((ur) => ({
      role: ur.role?.name || "UNKNOWN",
      permissions: (ur.role?.permissions || []).map((p) => p.name),
    }));

    const flatPermissions = [...new Set(roles.flatMap((r) => r.permissions))];

    console.log("🔐 [BOOTSTRAP] roles:", roles);

    // -----------------------------------
    // 3. RESPONSE
    // -----------------------------------
    return res.json({
      success: true,

      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },

      business: {
        id: business.id,
        name: business.name,
        slug: business.slug,
        subdomain: business.category?.subdomain,
      },

      rbac: {
        roles,
        permissions: flatPermissions,
        globalRole: user.globalRole || "USER",
      },
    });
  } catch (err) {
    console.error("❌ bootstrap error:", err);

    return res.status(500).json({
      success: false,
      message: "bootstrap failed",
    });
  }
});

export default router;

// const router = express.Router();
// // routes/authRoutes.js

// router.get("/tenant/bootstrap", authenticateJWT, async (req, res) => {
//   try {
//     const user = req.user;

//     const businesses = await db.Business.findAll({
//       where: { ownerId: user.id },
//       include: [
//         {
//           model: db.BusinessCategory,
//           as: "category",
//         },
//       ],
//     });

//     const roles = await db.UserRole.findAll({
//       where: { userId: user.id },
//       include: [
//         {
//           model: db.Role,
//           include: [db.Permission],
//         },
//       ],
//     });

//     const defaultBusiness = businesses[0];

//     return res.json({
//       user: {
//         id: user.id,
//         email: user.email,
//         fullName: user.fullName,
//       },

//       businesses: businesses.map((b) => ({
//         id: b.id,
//         name: b.name,
//         slug: b.slug,
//         categoryId: b.businessCategoryId,
//       })),

//       activeBusiness: defaultBusiness?.id,

//       rbac: roles.map((r) => ({
//         role: r.role.name,
//         permissions: r.role.permissions.map((p) => p.name),
//       })),
//     });
//   } catch (err) {
//     return res.status(500).json({ message: "bootstrap failed" });
//   }
// });
