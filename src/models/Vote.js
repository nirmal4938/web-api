// models/vote.js
export default (sequelize, DataTypes) => {
  const Vote = sequelize.define(
    "Vote",
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
      candidateId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "candidate_id",
      },
      electionId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "election_id",
      },
    },
    {
      tableName: "votes",
      timestamps: true,
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ["user_id"], // ensures one vote per user
        },
      ],
    }
  );

  Vote.associate = (models) => {
    Vote.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    Vote.belongsTo(models.ElectionCandidate, { foreignKey: "candidate_id", as: "candidate" });
    Vote.belongsTo(models.Election, { foreignKey: "election_id", as: "election" });
  };

  return Vote;
};
