export default (sequelize, DataTypes) => {
  const BusinessCategory = sequelize.define(
    "BusinessCategory",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      key: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      description: {
        type: DataTypes.TEXT,
      },

      subdomain: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      appUrl: {
        type: DataTypes.STRING,
        field: "app_url",
      },

      icon: {
        type: DataTypes.STRING,
      },

      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: "is_active",
      },
    },
    {
      tableName: "business_categories",

      timestamps: true,

      underscored: true,
    },
  );

  BusinessCategory.associate = (models) => {
    BusinessCategory.hasMany(models.Business, {
      foreignKey: "business_category_id",

      as: "businesses",
    });
  };

  return BusinessCategory;
};
