export default (sequelize, DataTypes) => {
  const Session = sequelize.define('Session', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, field: 'user_id' },
    token: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.ENUM('active', 'revoked', 'expired'), defaultValue: 'active' },
    ipAddress: { type: DataTypes.STRING, field: 'ip_address' },
    userAgent: { type: DataTypes.STRING, field: 'user_agent' },
    expiresAt: { type: DataTypes.DATE, field: 'expires_at' },
  }, {
    tableName: 'sessions',
    timestamps: true,
    underscored: true,
  });

  Session.associate = (models) => {
    Session.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  };

  return Session;
};
