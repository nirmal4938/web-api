export default (sequelize, DataTypes) => {
  const ElectionResult = sequelize.define(
    "ElectionResult",
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      electionId: { type: DataTypes.UUID, allowNull: false, field: "election_id" },
      totalVoters: { type: DataTypes.INTEGER, defaultValue: 0, field: "total_voters" },
      totalVotesCast: { type: DataTypes.INTEGER, defaultValue: 0, field: "total_votes_cast" },
      turnoutPercentage: { type: DataTypes.FLOAT, defaultValue: 0, field: "turnout_percentage" },
      winnerCandidateId: { type: DataTypes.UUID, allowNull: true, field: "winner_candidate_id" },
      declaredAt: { type: DataTypes.DATE, allowNull: true, field: "declared_at" },
    },
    {
      tableName: "election_results",
      timestamps: true,
      underscored: true,
    }
  );

  ElectionResult.associate = (models) => {
    ElectionResult.belongsTo(models.Election, { foreignKey: "election_id", as: "election" });
    ElectionResult.belongsTo(models.ElectionCandidate, { foreignKey: "winner_candidate_id", as: "winner" });
  };

  return ElectionResult;
};
