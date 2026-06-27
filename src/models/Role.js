export default (sequelize, DataTypes) => {
  const Role = sequelize.define(
    "Role",
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
      isSystemRole: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "is_system_role",
      },
      scope: {
        type: DataTypes.ENUM("platform", "business"),
        allowNull: false,
      },

      businessCategoryId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: "business_category_id",
      },

      slug: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },

      level: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
    },
    {
      tableName: "roles",
      timestamps: true,
      underscored: true,
    },
  );

  Role.associate = (models) => {
    // ✅ FIX: use DB field names as foreignKey/otherKey
    Role.belongsToMany(models.Permission, {
      through: models.RolePermission,
      foreignKey: "role_id",
      otherKey: "permission_id",
      as: "permissions",
    });
    Role.belongsTo(models.BusinessCategory, {
      foreignKey: "business_category_id",
      as: "businessCategory",
    });

    Role.belongsToMany(models.User, {
      through: models.UserRole,
      foreignKey: "role_id",
      otherKey: "user_id",
      as: "users",
    });
  };

  return Role;
};
