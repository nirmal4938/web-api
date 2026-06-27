export default [
  // ------------------------------------------------
  // SALES
  // ------------------------------------------------

  {
    resource: "sale",

    action: "approve",

    feature: "sales",

    name: "Approve Sales",

    description: "Approve sales transactions",
  },

  {
    resource: "sale",

    action: "export",

    feature: "sales",

    name: "Export Sales",

    description: "Export sales data",
  },

  {
    resource: "sale",

    action: "import",

    feature: "sales",

    name: "Import Sales",

    description: "Import sales data",
  },

  // ------------------------------------------------
  // INVENTORY
  // ------------------------------------------------

  {
    resource: "product",

    action: "import",

    feature: "inventory",

    name: "Import Products",

    description: "Bulk import products",
  },

  {
    resource: "product",

    action: "export",

    feature: "inventory",

    name: "Export Products",

    description: "Export products",
  },

  // ------------------------------------------------
  // MOBILE
  // ------------------------------------------------

  {
    resource: "imei",

    action: "verify",

    feature: "imei_verification",

    name: "Verify IMEI",

    description: "Verify IMEI using CEIR",
  },

  {
    resource: "repair",

    action: "close",

    feature: "repairs",

    name: "Close Repair",

    description: "Close repair order",
  },

  {
    resource: "repair",

    action: "approve",

    feature: "repairs",

    name: "Approve Repair",

    description: "Approve repair",
  },

  // ------------------------------------------------
  // PHARMACY
  // ------------------------------------------------

  {
    resource: "prescription",

    action: "approve",

    feature: "prescriptions",

    name: "Approve Prescription",

    description: "Approve prescriptions",
  },

  // ------------------------------------------------
  // SETTINGS
  // ------------------------------------------------

  {
    resource: "setting",

    action: "manage",

    feature: "settings",

    name: "Manage Settings",

    description: "Manage business settings",
  },

  {
    resource: "subscription",

    action: "manage",

    feature: "subscriptions",

    name: "Manage Subscription",

    description: "Manage subscription",
  },
];
