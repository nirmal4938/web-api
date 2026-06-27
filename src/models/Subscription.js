export default (sequelize, DataTypes) => {
  const Subscription = sequelize.define(
    "Subscription",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      businessId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "business_id",
      },

      plan: {
        type: DataTypes.ENUM("STARTER", "PRO", "ENTERPRISE"),
        allowNull: false,
        defaultValue: "STARTER",
      },

      status: {
        type: DataTypes.ENUM("TRIAL", "ACTIVE", "EXPIRED", "CANCELLED"),
        allowNull: false,
        defaultValue: "TRIAL",
      },

      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },

      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: "INR",
      },

      startsAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "starts_at",
      },

      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "expires_at",
      },
    },
    {
      tableName: "subscriptions",

      timestamps: true,

      underscored: true,
    },
  );

  Subscription.associate = (models) => {
    Subscription.belongsTo(models.Business, {
      foreignKey: "business_id",

      as: "business",
    });
  };

  return Subscription;
};
