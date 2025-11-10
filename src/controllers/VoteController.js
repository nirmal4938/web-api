// src/controllers/VoteController.js
import { db } from "../models/index.js";

const { Vote, ElectionCandidate, Voter } = db;

export const castVote = async (req, res) => {
  try {
    const { candidateId } = req.body;
    const userId = req.user.id;

    // 1️⃣ Check if the user has already voted
    const existingVote = await Vote.findOne({ where: { userId } });
    if (existingVote) {
      return res.status(400).json({ success: false, message: "You have already voted" });
    }

    // 2️⃣ Check candidate exists and is active
    const candidate = await ElectionCandidate.findOne({
      where: { id: candidateId, isActive: true },
    });
    if (!candidate) {
      return res.status(404).json({ success: false, message: "Candidate not found or inactive" });
    }

    // 3️⃣ Record vote
    const vote = await Vote.create({
      userId,
      candidateId,
      electionId: candidate.electionId,
    });

    // 4️⃣ Increment candidate's totalVotes safely
    await ElectionCandidate.increment("totalVotes", { by: 1, where: { id: candidateId } });

    return res.status(201).json({
      success: true,
      message: "Vote recorded successfully",
      vote,
    });
  } catch (error) {
    console.error("Error casting vote:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to cast vote",
      error: error.message,
    });
  }
};

export const getAllVotes = async (req, res) => {
  try {
    const votes = await Vote.findAll({
      include: [
        { model: ElectionCandidate, attributes: ["id", "fullName", "partyName"] },
        { model: Voter, attributes: ["id", "fullName"] },
      ],
    });
    res.status(200).json({ success: true, votes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getVoteById = async (req, res) => {
  try {
    const vote = await Vote.findByPk(req.params.id, {
      include: [
        { model: ElectionCandidate, attributes: ["id", "fullName", "partyName"] },
        { model: Voter, attributes: ["id", "fullName"] },
      ],
    });

    if (!vote)
      return res.status(404).json({ success: false, message: "Vote not found" });

    res.status(200).json({ success: true, vote });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateVote = async (req, res) => {
  try {
    const vote = await Vote.findByPk(req.params.id);
    if (!vote)
      return res.status(404).json({ success: false, message: "Vote not found" });

    // Optionally, restrict update to admin users
    await vote.update(req.body);
    res.status(200).json({ success: true, message: "Vote updated", vote });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteVote = async (req, res) => {
  try {
    const vote = await Vote.findByPk(req.params.id);
    if (!vote)
      return res.status(404).json({ success: false, message: "Vote not found" });

    await vote.destroy();
    res.status(200).json({ success: true, message: "Vote deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
