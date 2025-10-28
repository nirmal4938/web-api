import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

export async function up(queryInterface) {
  const now = new Date();

  // 1️⃣ Create Organization
  const orgId = uuidv4();
  await queryInterface.bulkInsert("organizations", [
    {
      id: orgId,
      name: "System",
      domain: "system.local",
      created_at: now,
      updated_at: now,
    },
  ]);

  // 2️⃣ Create Roles
  const roles = [
    { id: uuidv4(), name: "SuperAdmin", description: "Full system access", organization_id: orgId },
    { id: uuidv4(), name: "OrgAdmin", description: "Organization admin with limited control", organization_id: orgId },
    { id: uuidv4(), name: "User", description: "Basic user", organization_id: orgId },
  ].map((r) => ({ ...r, created_at: now, updated_at: now }));

  await queryInterface.bulkInsert("roles", roles);

  // 3️⃣ Create Resources
  const resources = [
    { id: uuidv4(), name: "User", type: "core", description: "User management" },
    { id: uuidv4(), name: "Project", type: "core", description: "Project management" },
    { id: uuidv4(), name: "Invoice", type: "finance", description: "Invoice and billing" },
    { id: uuidv4(), name: "Settings", type: "system", description: "System configuration" },
  ].map((r) => ({ ...r, created_at: now, updated_at: now }));

  await queryInterface.bulkInsert("resources", resources);

  // 4️⃣ Create Permissions (resource-action pairs)
  const actions = ["create", "read", "update", "delete"];
  const permissions = [];

  for (const resource of resources) {
    for (const action of actions) {
      permissions.push({
        id: uuidv4(),
        name: `${resource.name.toLowerCase()}:${action}`,
        description: `${action} ${resource.name}`,
        resource_id: resource.id,
        action,
        created_at: now,
        updated_at: now,
      });
    }
  }

  await queryInterface.bulkInsert("permissions", permissions);

  // 5️⃣ Role-Permission Mapping (SuperAdmin gets all permissions)
  const superAdminRole = roles.find((r) => r.name === "SuperAdmin");
  const rolePermissions = permissions.map((p) => ({
    id: uuidv4(),
    role_id: superAdminRole.id,
    permission_id: p.id,
    granted_at: now,
  }));

  await queryInterface.bulkInsert("role_permissions", rolePermissions);

  // 6️⃣ Create Bootstrap Admin User
  const passwordHash = await bcrypt.hash("Admin@123", 10);
  const adminUserId = uuidv4();

  await queryInterface.bulkInsert("users", [
    {
      id: adminUserId,
      organization_id: orgId,
      full_name: "System Admin",
      email: "admin@system.local",
      password: passwordHash,
      is_active: true,
      created_at: now,
      updated_at: now,
    },
  ]);

  // 7️⃣ User-Role Mapping (admin → SuperAdmin)
  await queryInterface.bulkInsert("user_roles", [
    {
      id: uuidv4(),
      user_id: adminUserId,
      role_id: superAdminRole.id,
      assigned_at: now,
    },
  ]);

  console.log("✅ RBAC initialization seeder completed successfully!");
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete("user_roles", null, {});
  await queryInterface.bulkDelete("users", null, {});
  await queryInterface.bulkDelete("role_permissions", null, {});
  await queryInterface.bulkDelete("permissions", null, {});
  await queryInterface.bulkDelete("resources", null, {});
  await queryInterface.bulkDelete("roles", null, {});
  await queryInterface.bulkDelete("organizations", null, {});
}
