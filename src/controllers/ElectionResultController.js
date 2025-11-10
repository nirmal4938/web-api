// src/controllers/ElectionResultController.js
import { db } from "../models/index.js";
import { Sequelize } from "sequelize";

const { ElectionResult, Vote, Candidate, Election } = db;

export const getAllResults = async (req, res) => {
  try {
    const results = await ElectionResult.findAll({
      include: [{ model: Election, attributes: ["id", "name", "status"] }],
    });
    res.status(200).json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getResultByElectionId = async (req, res) => {
  try {
    const { electionId } = req.params;
    const result = await ElectionResult.findOne({ where: { electionId } });
    if (!result)
      return res.status(404).json({ success: false, message: "Result not found" });

    res.status(200).json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const calculateElectionResult = async (req, res) => {
  try {
    const { electionId } = req.params;

    // aggregate votes by candidate
    const votes = await Vote.findAll({
      include: [{ model: Candidate, attributes: ["id", "name", "party"], where: { electionId } }],
      attributes: [
        "candidateId",
        [Sequelize.fn("COUNT", Sequelize.col("candidateId")), "voteCount"],
      ],
      group: ["candidateId", "Candidate.id"],
    });

    if (!votes.length)
      return res.status(404).json({ success: false, message: "No votes found for this election" });

    const resultData = votes.map(v => ({
      electionId,
      candidateId: v.candidateId,
      totalVotes: v.dataValues.voteCount,
    }));

    await ElectionResult.destroy({ where: { electionId } });
    const newResults = await ElectionResult.bulkCreate(resultData);

    res.status(200).json({
      success: true,
      message: "Election results calculated successfully",
      results: newResults,
    });
  } catch (error) {
    console.error("Error calculating result:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
