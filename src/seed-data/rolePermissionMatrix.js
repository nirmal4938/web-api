/**
 * RBAC Matrix
 *
 * Supported Wildcards:
 *
 * "*"                 => all permissions
 *
 * "product:*"
 *
 * "sale:*"
 *
 * "repair:*"
 *
 *
 * Seeder will expand wildcards.
 */

const ROLE_PERMISSION_MATRIX = {
  // =====================================================
  // PLATFORM
  // =====================================================

  "platform.super_admin": ["*"],

  "platform.admin": [
    "business_category:*",

    "business:*",

    "user:*",

    "subscription:*",

    "report:read",

    "setting:manage",
  ],

  "platform.support": [
    "user:read",

    "business:read",

    "subscription:read",

    "report:read",
  ],

  // =====================================================
  // MOBILE
  // =====================================================

  "mobile.owner": ["*"],

  "mobile.manager": [
    "product:*",

    "sale:*",

    "purchase:*",

    "customer:*",

    "supplier:*",

    "employee:*",

    "report:read",

    "setting:read",

    "subscription:read",

    "imei:*",

    "repair:*",
  ],

  "mobile.salesman": [
    "product:read",

    "sale:create",

    "sale:read",

    "sale:update",

    "customer:create",

    "customer:read",

    "customer:update",

    "report:read",
  ],

  "mobile.technician": [
    "repair:*",

    "imei:read",

    "imei:verify",

    "customer:read",
  ],

  // =====================================================
  // GARMENTS
  // =====================================================

  "garments.owner": ["*"],

  "garments.manager": [
    "product:*",

    "sale:*",

    "purchase:*",

    "customer:*",

    "supplier:*",

    "employee:*",

    "report:read",

    "setting:read",

    "subscription:read",

    "size:*",

    "alteration:*",
  ],

  "garments.cashier": [
    "sale:create",

    "sale:read",

    "sale:update",

    "customer:create",

    "customer:read",

    "report:read",
  ],

  "garments.salesman": [
    "product:read",

    "sale:create",

    "sale:read",

    "sale:update",

    "customer:create",

    "customer:read",

    "customer:update",

    "report:read",
  ],

  // =====================================================
  // PHARMACY
  // =====================================================

  "pharmacy.owner": ["*"],

  "pharmacy.manager": [
    "medicine:*",

    "sale:*",

    "purchase:*",

    "customer:*",

    "supplier:*",

    "employee:*",

    "report:read",

    "setting:read",

    "subscription:read",

    "prescription:*",
  ],

  "pharmacy.cashier": [
    "sale:create",

    "sale:read",

    "sale:update",

    "customer:create",

    "customer:read",

    "report:read",
  ],

  "pharmacy.pharmacist": [
    "medicine:create",

    "medicine:read",

    "medicine:update",

    "prescription:create",

    "prescription:read",

    "prescription:update",

    "prescription:approve",

    "customer:read",

    "report:read",
  ],
};

export default ROLE_PERMISSION_MATRIX;
