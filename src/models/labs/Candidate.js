// models/Candidate.js
export default (sequelize, DataTypes) => {
  const Candidate = sequelize.define(
    'Candidate',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'full_name',
      },
      party: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      gender: {
        type: DataTypes.ENUM('Male', 'Female', 'Other'),
        allowNull: true,
      },
      electionId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'election_id',
      },
      constituency: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'e.g., 41 Nirmali Vidhan Sabha',
      },
      symbol: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Candidate party symbol or image URL',
      },
      manifesto: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'is_active',
      },
    },
    {
      tableName: 'candidates',
      timestamps: true, // track createdAt and updatedAt
      underscored: true,
    }
  );

  // Associations
  Candidate.associate = (models) => {
    // Candidate belongs to Election
    Candidate.belongsTo(models.Election, {
      foreignKey: 'election_id',
      as: 'election',
    });

    // Candidate has many votes
    Candidate.hasMany(models.Vote, {
      foreignKey: 'candidate_id',
      as: 'votes',
    });
  };

  return Candidate;
};
