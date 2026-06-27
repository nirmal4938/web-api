export default (sequelize, DataTypes) => {
  const Feature = sequelize.define(
    "Feature",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      key: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      // ✅ FIX: matches DBML + seeder + existing DB
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "features",
      timestamps: true,
      underscored: true,
    },
  );

  Feature.associate = (models) => {
    Feature.hasMany(models.Permission, {
      foreignKey: "feature_id",
      as: "permissions",
      onDelete: "CASCADE",
    });
  };

  return Feature;
};
