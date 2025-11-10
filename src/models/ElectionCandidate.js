export default (sequelize, DataTypes) => {
  const ElectionCandidate = sequelize.define(
    "ElectionCandidate",
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      electionId: { type: DataTypes.UUID, allowNull: false, field: "election_id" },
      userId: { type: DataTypes.UUID, allowNull: true, field: "user_id" },
      fullName: { type: DataTypes.STRING, allowNull: false, field: "full_name" },
      gender: { type: DataTypes.ENUM("male", "female", "other"), allowNull: true },
      age: { type: DataTypes.INTEGER, allowNull: true, validate: { min: 18 } },
      partyName: { type: DataTypes.STRING, allowNull: true, field: "party_name" },
      partySymbol: { type: DataTypes.STRING, allowNull: true, field: "party_symbol" },
      constituency: { type: DataTypes.STRING, allowNull: false },
      profileImageUrl: { type: DataTypes.STRING, allowNull: true, field: "profile_image_url" },
      manifesto: { type: DataTypes.TEXT, allowNull: true },
      totalVotes: { type: DataTypes.INTEGER, defaultValue: 0, field: "total_votes" },
      status: { type: DataTypes.ENUM("pending", "approved", "rejected", "withdrawn"), defaultValue: "pending" },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: true, field: "is_active" },
      createdBy: { type: DataTypes.UUID, allowNull: true, field: "created_by" },
      updatedBy: { type: DataTypes.UUID, allowNull: true, field: "updated_by" },
    },
    {
      tableName: "election_candidates",
      timestamps: true,
      underscored: true,
      paranoid: true,
    }
  );

  ElectionCandidate.associate = (models) => {
    ElectionCandidate.belongsTo(models.Election, { foreignKey: "election_id", as: "election" });
    ElectionCandidate.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    ElectionCandidate.hasMany(models.Vote, { foreignKey: "candidate_id", as: "votes" });
  };

  return ElectionCandidate;
};
