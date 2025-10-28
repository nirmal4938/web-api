// models/feature.js
export default (sequelize, DataTypes) => {
  const Feature = sequelize.define(
    'Feature',
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
        comment: 'e.g., device, user, plant',
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'features',
      timestamps: true,
      underscored: true,
    }
  );

  Feature.associate = (models) => {
    // A Feature has many Permissions
    Feature.hasMany(models.Permission, {
      foreignKey: 'feature_id',
      as: 'permissions',
      onDelete: 'CASCADE',
    });
  };

  return Feature;
};
