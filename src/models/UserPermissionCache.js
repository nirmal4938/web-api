export default (sequelize, DataTypes) => {
  const UserPermissionCache = sequelize.define(
    "UserPermissionCache",
    {
      id: {
        type: DataTypes.UUID,

        defaultValue: DataTypes.UUIDV4,

        primaryKey: true,
      },

      userId: {
        type: DataTypes.UUID,

        allowNull: false,

        field: "user_id",
      },

      businessId: {
        type: DataTypes.UUID,

        allowNull: false,

        field: "business_id",
      },

      permissions: {
        type: DataTypes.JSONB,

        allowNull: false,

        defaultValue: [],
      },

      updatedAt: {
        type: DataTypes.DATE,

        defaultValue: DataTypes.NOW,

        field: "updated_at",
      },
    },
    {
      tableName: "user_permission_cache",

      timestamps: false,

      underscored: true,

      indexes: [
        {
          unique: true,

          fields: ["user_id", "business_id"],
        },
      ],
    },
  );

  UserPermissionCache.associate = (models) => {
    UserPermissionCache.belongsTo(models.User, {
      foreignKey: "user_id",

      as: "user",
    });

    UserPermissionCache.belongsTo(models.Business, {
      foreignKey: "business_id",

      as: "business",
    });
  };

  return UserPermissionCache;
};
