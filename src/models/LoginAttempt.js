export default (sequelize, DataTypes) => {
  const LoginAttempt = sequelize.define('LoginAttempt', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: true, field: 'user_id' },
    ipAddress: { type: DataTypes.STRING, field: 'ip_address' },
    userAgent: { type: DataTypes.STRING, field: 'user_agent' },
    status: { type: DataTypes.ENUM('success', 'failed', 'locked'), allowNull: false },
    attemptedAt: { type: DataTypes.DATE, field: 'attempted_at', defaultValue: DataTypes.NOW },
  }, {
    tableName: 'login_attempts',
    timestamps: false,
    underscored: true,
  });

  return LoginAttempt;
};
