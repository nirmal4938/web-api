export default (sequelize, DataTypes) => {
  const BusinessCategoryRole = sequelize.define(
    "BusinessCategoryRole",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      businessCategoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "business_category_id",
      },

      roleId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "role_id",
      },
    },
    {
      tableName: "business_category_roles",

      timestamps: true,

      createdAt: "created_at",

      updatedAt: false,

      underscored: true,

      indexes: [
        {
          unique: true,

          fields: ["business_category_id", "role_id"],
        },
      ],
    },
  );

  BusinessCategoryRole.associate = (models) => {
    BusinessCategoryRole.belongsTo(models.BusinessCategory, {
      foreignKey: "business_category_id",

      as: "businessCategory",
    });

    BusinessCategoryRole.belongsTo(models.Role, {
      foreignKey: "role_id",

      as: "role",
    });
  };

  return BusinessCategoryRole;
};
