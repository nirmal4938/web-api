export default (sequelize, DataTypes) => {
  const Business = sequelize.define(
    "Business",
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

      slug: {
        type: DataTypes.STRING,

        unique: true,

        allowNull: false,
      },

      ownerId: {
        type: DataTypes.UUID,

        allowNull: false,

        field: "owner_id",
      },

      businessCategoryId: {
        type: DataTypes.UUID,

        allowNull: false,

        field: "business_category_id",
      },

      plan: {
        type: DataTypes.ENUM(
          "STARTER",

          "PRO",

          "ENTERPRISE",
        ),

        defaultValue: "STARTER",
      },

      status: {
        type: DataTypes.ENUM("ACTIVE", "INACTIVE", "SUSPENDED"),

        defaultValue: "ACTIVE",
      },

      logoUrl: {
        type: DataTypes.STRING,

        field: "logo_url",
      },

      address: {
        type: DataTypes.TEXT,
      },

      city: {
        type: DataTypes.STRING,
      },

      state: {
        type: DataTypes.STRING,
      },

      country: {
        type: DataTypes.STRING,

        defaultValue: "India",
      },

      phone: {
        type: DataTypes.STRING,
      },

      email: {
        type: DataTypes.STRING,
      },
      domain: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
      },

      timezone: {
        type: DataTypes.STRING,
        defaultValue: "Asia/Kolkata",
      },

      gstNumber: {
        type: DataTypes.STRING,

        field: "gst_number",
      },
    },

    {
      tableName: "businesses",

      timestamps: true,

      underscored: true,
    },
  );

  Business.associate = (models) => {
    Business.belongsTo(models.User, {
      foreignKey: "owner_id",
      as: "owner",
    });
    Business.hasMany(models.UserRole, {
      foreignKey: "business_id",
      as: "userRoles",
    });

    Business.hasOne(models.Subscription, {
      foreignKey: "business_id",
      as: "subscription",
    });

    Business.belongsTo(models.BusinessCategory, {
      foreignKey: "business_category_id",

      as: "category",
    });

    Business.belongsToMany(models.User, {
      through: models.UserBusiness,
      foreignKey: "business_id",

      otherKey: "user_id",

      as: "members",
    });
  };

  return Business;
};
