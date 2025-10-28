export default (sequelize, DataTypes) => {
  const RolePermission = sequelize.define('RolePermission', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    roleId: { type: DataTypes.UUID, field: 'role_id' },
    permissionId: { type: DataTypes.UUID, field: 'permission_id' },
    grantedBy: { type: DataTypes.UUID, field: 'granted_by' },
    grantedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'granted_at' },
  }, {
    tableName: 'role_permissions',
    timestamps: false,
    underscored: true,
  });

  return RolePermission;
};
