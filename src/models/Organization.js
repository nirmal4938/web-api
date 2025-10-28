// models/Organization.js
export default (sequelize, DataTypes) => {
  const Organization = sequelize.define(
    'Organization',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: 'Organization name is required' } },
      },
      domain: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      createdAt: { type: DataTypes.DATE, field: 'created_at', defaultValue: DataTypes.NOW },
      updatedAt: { type: DataTypes.DATE, field: 'updated_at', defaultValue: DataTypes.NOW },
    },
    {
      tableName: 'organizations',
      timestamps: true,
      underscored: true,
    }
  );

  Organization.associate = (models) => {
    Organization.hasMany(models.Department, { foreignKey: 'organization_id', as: 'departments' });
    Organization.hasMany(models.User, { foreignKey: 'organization_id', as: 'users' });
  };

  return Organization;
};
