import bcrypt from 'bcryptjs';

export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      organizationId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'organization_id',
      },
      departmentId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'department_id',
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'full_name',
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },

      // 🔐 Password is optional for OAuth users now
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      // 🌍 Identify authentication provider (local, google, github, etc.)
      authProvider: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'local',
        field: 'auth_provider',
      },

      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'is_active',
      },
      lastLoginAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'last_login_at',
      },
      deletedAt: {
        type: DataTypes.DATE,
        field: 'deleted_at',
      },
    },
    {
      tableName: 'users',
      timestamps: true,
      paranoid: true,
      underscored: true,

      hooks: {
        beforeCreate: async (user) => {
          if (user.password && !user.password.startsWith('$2b$')) {
            user.password = await bcrypt.hash(user.password, 10);
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed('password') && !user.password.startsWith('$2b$')) {
            user.password = await bcrypt.hash(user.password, 10);
          }
        },
      },
    }
  );

  // ✅ Instance method for password validation
  User.prototype.isValidPassword = async function (password) {
    if (!this.password) return false; // OAuth users don't have passwords
    return bcrypt.compare(password, this.password);
  };

  // ✅ Hide password automatically when converting to JSON
  User.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.password;
    return values;
  };

  // ✅ Associations
  User.associate = (models) => {
    User.belongsTo(models.Organization, {
      foreignKey: 'organization_id',
      as: 'organization',
    });

    User.belongsTo(models.Department, {
      foreignKey: 'department_id',
      as: 'department',
    });

    User.belongsToMany(models.Role, {
      through: models.UserRole,
      foreignKey: 'user_id',
      otherKey: 'role_id',
      as: 'roles',
    });

    User.hasMany(models.Session, {
      foreignKey: 'user_id',
      as: 'sessions',
    });

    User.hasMany(models.LoginAttempt, {
      foreignKey: 'user_id',
      as: 'loginAttempts',
    });

    User.hasMany(models.ApiKey, {
      foreignKey: 'user_id',
      as: 'apiKeys',
    });

    User.hasMany(models.Delegation, {
      foreignKey: 'delegate_id',
      as: 'delegations',
    });
  };

  return User;
};
