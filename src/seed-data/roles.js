export default {
  // =====================================================
  // PLATFORM
  // =====================================================

  platform: [
    {
      slug: "platform.super_admin",

      name: "Platform Super Admin",

      scope: "platform",

      description: "Full platform access",

      level: 100,

      isSystemRole: true,
    },

    {
      slug: "platform.admin",

      name: "Platform Admin",

      scope: "platform",

      description: "Platform administrator",

      level: 90,

      isSystemRole: true,
    },

    {
      slug: "platform.support",

      name: "Platform Support",

      scope: "platform",

      description: "Support team",

      level: 70,

      isSystemRole: true,
    },
  ],

  // =====================================================
  // MOBILE
  // =====================================================

  mobile: [
    {
      slug: "mobile.owner",

      name: "Owner",

      scope: "business",

      description: "Business owner",

      level: 100,

      isSystemRole: true,
    },

    {
      slug: "mobile.manager",

      name: "Manager",

      scope: "business",

      description: "Store manager",

      level: 80,

      isSystemRole: true,
    },

    {
      slug: "mobile.salesman",

      name: "Salesman",

      scope: "business",

      description: "Sales staff",

      level: 50,

      isSystemRole: true,
    },

    {
      slug: "mobile.technician",

      name: "Technician",

      scope: "business",

      description: "Repair technician",

      level: 50,

      isSystemRole: true,
    },
  ],

  // =====================================================
  // GARMENTS
  // =====================================================

  garments: [
    {
      slug: "garments.owner",

      name: "Owner",

      scope: "business",

      description: "Business owner",

      level: 100,

      isSystemRole: true,
    },

    {
      slug: "garments.manager",

      name: "Manager",

      scope: "business",

      description: "Store manager",

      level: 80,

      isSystemRole: true,
    },

    {
      slug: "garments.cashier",

      name: "Cashier",

      scope: "business",

      description: "Billing staff",

      level: 50,

      isSystemRole: true,
    },

    {
      slug: "garments.salesman",

      name: "Salesman",

      scope: "business",

      description: "Sales staff",

      level: 50,

      isSystemRole: true,
    },
  ],

  // =====================================================
  // PHARMACY
  // =====================================================

  pharmacy: [
    {
      slug: "pharmacy.owner",

      name: "Owner",

      scope: "business",

      description: "Business owner",

      level: 100,

      isSystemRole: true,
    },

    {
      slug: "pharmacy.manager",

      name: "Manager",

      scope: "business",

      description: "Store manager",

      level: 80,

      isSystemRole: true,
    },

    {
      slug: "pharmacy.cashier",

      name: "Cashier",

      scope: "business",

      description: "Cash counter",

      level: 50,

      isSystemRole: true,
    },

    {
      slug: "pharmacy.pharmacist",

      name: "Pharmacist",

      scope: "business",

      description: "Licensed pharmacist",

      level: 60,

      isSystemRole: true,
    },
  ],
};
