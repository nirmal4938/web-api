// src/controllers/CandidateController.js
import { db } from "../models/index.js";

const { ElectionCandidate, Election } = db;

// ✅ Create single or multiple candidates
export const createCandidate = async (req, res) => {
  try {
    let candidates = req.body; // Expect an array for bulk insert

    if (!Array.isArray(candidates)) {
      // wrap single candidate in array
      candidates = [candidates];
    }

    // Validate electionId exists for each candidate
    for (const c of candidates) {
      if (!c.electionId) {
        return res.status(400).json({ success: false, message: "electionId is required" });
      }

      const election = await Election.findByPk(c.electionId);
      if (!election) {
        return res.status(404).json({ success: false, message: `Election not found for id ${c.electionId}` });
      }
    }

    // Bulk insert
    const insertedCandidates = await ElectionCandidate.bulkCreate(candidates, { returning: true });

    res.status(201).json({
      success: true,
      message: `${insertedCandidates.length} candidate(s) added successfully`,
      candidates: insertedCandidates
    });

  } catch (error) {
    console.error("Error creating candidate(s):", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get all candidates
export const getAllCandidates = async (req, res) => {
  try {
    const candidates = await ElectionCandidate.findAll({
      include: [{ model: Election, attributes: ["id", "name"], as: "election" }],
    });
    res.status(200).json({ success: true, candidates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get candidate by ID
export const getCandidateById = async (req, res) => {
  try {
    const candidate = await ElectionCandidate.findByPk(req.params.id, {
      include: [{ model: Election, attributes: ["id", "name"], as: "election" }],
    });
    if (!candidate)
      return res.status(404).json({ success: false, message: "Candidate not found" });

    res.status(200).json({ success: true, candidate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update candidate
export const updateCandidate = async (req, res) => {
  try {
    const candidate = await ElectionCandidate.findByPk(req.params.id);
    if (!candidate)
      return res.status(404).json({ success: false, message: "Candidate not found" });

    await candidate.update(req.body);
    res.status(200).json({ success: true, message: "Candidate updated", candidate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete candidate
export const deleteCandidate = async (req, res) => {
  try {
    const candidate = await ElectionCandidate.findByPk(req.params.id);
    if (!candidate)
      return res.status(404).json({ success: false, message: "Candidate not found" });

    await candidate.destroy();
    res.status(200).json({ success: true, message: "Candidate deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
