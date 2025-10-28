export default (sequelize, DataTypes) => {
  const Role = sequelize.define(
    'Role',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      organizationId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'organization_id',
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: DataTypes.TEXT,
      isSystemRole: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_system_role',
      },
    },
    {
      tableName: 'roles',
      timestamps: true,
      underscored: true,
    }
  );

  Role.associate = (models) => {
    Role.belongsTo(models.Organization, {
      foreignKey: 'organization_id',
      as: 'organization',
    });

    // ✅ FIX: use DB field names as foreignKey/otherKey
    Role.belongsToMany(models.Permission, {
      through: models.RolePermission,
      foreignKey: 'role_id',
      otherKey: 'permission_id',
      as: 'permissions',
    });

    Role.belongsToMany(models.User, {
      through: models.UserRole,
      foreignKey: 'role_id',
      otherKey: 'user_id',
      as: 'users',
    });
  };

  return Role;
};
