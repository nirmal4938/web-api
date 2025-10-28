// models/Delegation.js
export default (sequelize, DataTypes) => {
  const Delegation = sequelize.define(
    'Delegation',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      delegatorId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'delegator_id',
      },
      delegateId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'delegate_id',
      },
      roleId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'role_id',
      },
      startAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'start_at',
        defaultValue: DataTypes.NOW,
      },
      endAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'end_at',
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: 'delegations',
      timestamps: false,
      underscored: true,
    }
  );

  // 🔗 Associations
  Delegation.associate = (models) => {
    // User who gives delegation
    Delegation.belongsTo(models.User, {
      as: 'delegator',
      foreignKey: 'delegator_id',
    });

    // User who receives delegation
    Delegation.belongsTo(models.User, {
      as: 'delegate',
      foreignKey: 'delegate_id',
    });

    // Role assigned via delegation
    Delegation.belongsTo(models.Role, {
      as: 'role',
      foreignKey: 'role_id',
    });
  };

  return Delegation;
};
