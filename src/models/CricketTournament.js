export default (sequelize, DataTypes) => {
  const CricketTournament = sequelize.define("CricketTournament", {
    name: { type: DataTypes.STRING, allowNull: false },
    year: DataTypes.INTEGER,
    country: DataTypes.STRING,
    description: DataTypes.TEXT,
    wikipediaUrl: {
      type: DataTypes.STRING,
      field: "wikipedia_url" // 👈 maps correctly
    },
    image: DataTypes.STRING,
  }, {
    tableName: "cricket_tournaments", // 👈 ensures Sequelize uses your exact table
    timestamps: true, // uses createdAt/updatedAt automatically
    underscored: true // 👈 makes created_at & updated_at match your SQL columns
  });

  return CricketTournament;
};