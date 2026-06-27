export default (sequelize, DataTypes) => {
  const UserBusiness = sequelize.define(
    "UserBusiness",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "user_id",
      },
      businessId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "business_id",
      },

      isDefault: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "is_default",
      },
      joinedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: "joined_at",
      },
    },

    {
      tableName: "user_businesses",
      timestamps: false,
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ["user_id", "business_id"],
        },
      ],
    },
  );

  UserBusiness.associate = (models) => {
    UserBusiness.belongsTo(models.User, {
      foreignKey: "user_id",

      as: "user",
    });

    UserBusiness.belongsTo(models.Business, {
      foreignKey: "business_id",

      as: "business",
    });
  };

  return UserBusiness;
};
