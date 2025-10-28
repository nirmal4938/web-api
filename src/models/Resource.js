export default (sequelize, DataTypes) => {
  const Resource = sequelize.define(
    'Resource',
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
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: 'resources',
      timestamps: true,
      underscored: true,
    }
  );

  Resource.associate = (models) => {
    // A resource can have multiple permissions linked to it
    Resource.hasMany(models.Permission, {
      foreignKey: 'resource_id',
      as: 'permissions',
      onDelete: 'CASCADE',
    });

    // Optional: If you use attributes per resource
    // Resource.hasMany(models.ResourceAttribute, {
    //   foreignKey: 'resource_id',
    //   as: 'attributes',
    //   onDelete: 'CASCADE',
    // });
  };

  return Resource;
};
