export default (sequelize, DataTypes) => {
  const UserRole = sequelize.define(
    'UserRole',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: { type: DataTypes.UUID, field: 'user_id' },
      roleId: { type: DataTypes.UUID, field: 'role_id' },
      assignedBy: { type: DataTypes.UUID, field: 'assigned_by' },
      assignedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'assigned_at',
      },
    },
    {
      tableName: 'user_roles',
      timestamps: false,
      underscored: true,
    }
  );

  // ✅ Add associations here
  UserRole.associate = (models) => {
    UserRole.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
    UserRole.belongsTo(models.Role, {
      foreignKey: 'role_id',
      as: 'role',
    });
  };

  return UserRole;
};
