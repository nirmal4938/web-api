export default (sequelize, DataTypes) => {
  const Permission = sequelize.define(
    'Permission',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: DataTypes.TEXT,
      featureId: {
        type: DataTypes.UUID,
        field: 'feature_id',
        allowNull: true,
      },
      resourceId: {
        type: DataTypes.UUID,
        field: 'resource_id',
        allowNull: false,
      },
      action: {
        type: DataTypes.ENUM('create', 'read', 'update', 'delete', 'manage', 'assign'),
        allowNull: false,
      },
    },
    {
      tableName: 'permissions',
      timestamps: true,
      underscored: true,
    }
  );

  Permission.associate = (models) => {
    Permission.belongsTo(models.Resource, {
      foreignKey: 'resource_id',
      as: 'resource',
    });

    Permission.belongsTo(models.Feature, {
      foreignKey: 'feature_id',
      as: 'feature',
    });

    // ✅ FIX: match foreignKey/otherKey with Role’s definition
    Permission.belongsToMany(models.Role, {
      through: models.RolePermission,
      foreignKey: 'permission_id',
      otherKey: 'role_id',
      as: 'roles',
    });
  };

  return Permission;
};
