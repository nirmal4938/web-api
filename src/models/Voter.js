// models/voter.js
export default (sequelize, DataTypes) => {
  const Voter = sequelize.define(
    "Voter",
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      electionId: { type: DataTypes.UUID, allowNull: false, field: "election_id" },
      userId: { type: DataTypes.UUID, allowNull: false, field: "user_id" },
      voterIdNumber: { type: DataTypes.STRING, allowNull: true, field: "voter_id_number" },
      hasVoted: { type: DataTypes.BOOLEAN, defaultValue: false, field: "has_voted" },
      votedAt: { type: DataTypes.DATE, allowNull: true, field: "voted_at" },
    },
    {
      tableName: "voters",
      timestamps: true,
      underscored: true,
      paranoid: true,
    }
  );

  Voter.associate = (models) => {
    Voter.belongsTo(models.Election, { foreignKey: "election_id", as: "election" });
    Voter.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    // Optional: if you ever want to link Vote directly
    // Voter.hasOne(models.Vote, { foreignKey: "user_id", as: "vote" });
  };

  return Voter;
};
