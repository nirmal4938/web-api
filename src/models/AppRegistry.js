export default (sequelize, DataTypes) => {
  const AppRegistry = sequelize.define(
    "AppRegistry",
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

      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      appKey: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: "app_key",
      },

      baseUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "base_url",
      },

      frontendUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "frontend_url",
      },

      backendUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "backend_url",
      },

      version: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "1.0.0",
      },

      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: "is_active",
      },
    },
    {
      tableName: "app_registry",

      timestamps: true,

      underscored: true,
    },
  );

  AppRegistry.associate = (models) => {
    AppRegistry.belongsTo(models.BusinessCategory, {
      foreignKey: "business_category_id",
      as: "category",
    });
  };

  return AppRegistry;
};
