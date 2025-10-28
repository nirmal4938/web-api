// models/Department.js
export default (sequelize, DataTypes) => {
  const Department = sequelize.define(
    'Department',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      organizationId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'organization_id',
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: 'Department name is required' } },
      },
      createdAt: { type: DataTypes.DATE, field: 'created_at', defaultValue: DataTypes.NOW },
      updatedAt: { type: DataTypes.DATE, field: 'updated_at', defaultValue: DataTypes.NOW },
    },
    {
      tableName: 'departments',
      timestamps: true,
      underscored: true,
    }
  );

  Department.associate = (models) => {
    Department.belongsTo(models.Organization, { foreignKey: 'organization_id', as: 'organization' });
    Department.hasMany(models.User, { foreignKey: 'department_id', as: 'users' });
  };

  return Department;
};
