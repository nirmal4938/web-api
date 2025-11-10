export default (sequelize, DataTypes) => {
  const Election = sequelize.define(
    "Election",
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
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "start_date",
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "end_date",
      },
      status: {
        type: DataTypes.ENUM("draft", "ongoing", "completed", "cancelled"),
        defaultValue: "draft",
      },
      createdBy: {
        type: DataTypes.UUID,
        allowNull: true,
        field: "created_by",
      },
      updatedBy: {
        type: DataTypes.UUID,
        allowNull: true,
        field: "updated_by",
      },
    },
    {
      tableName: "elections",
      timestamps: true,
      underscored: true,
      paranoid: true,
    }
  );

  Election.associate = (models) => {
    Election.hasMany(models.ElectionCandidate, {
      foreignKey: "election_id",
      as: "candidates",
    });
    Election.hasMany(models.Voter, {
      foreignKey: "election_id",
      as: "voters",
    });
    Election.hasMany(models.Vote, {
      foreignKey: "election_id",
      as: "votes",
    });
    Election.hasOne(models.ElectionResult, {
      foreignKey: "election_id",
      as: "result",
    });
  };

  return Election;
};
