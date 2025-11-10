// src/controllers/VoterController.js
import { db } from "../models/index.js";

const { Voter, Election, User } = db;

export const registerVoter = async (req, res) => {
  try {
    const { userId, electionId } = req.body;

    const existing = await Voter.findOne({ where: { userId, electionId } });
    if (existing)
      return res.status(400).json({ success: false, message: "Voter already registered" });

    const voter = await Voter.create({ userId, electionId });
    res.status(201).json({ success: true, message: "Voter registered", voter });
  } catch (error) {
    console.error("Error registering voter:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllVoters = async (req, res) => {
  try {
    const voters = await Voter.findAll({
      include: [
        { model: User, attributes: ["id", "fullName", "email"] },
        { model: Election, attributes: ["id", "name"] },
      ],
    });
    res.status(200).json({ success: true, voters });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getVoterById = async (req, res) => {
  try {
    const voter = await Voter.findByPk(req.params.id);
    if (!voter)
      return res.status(404).json({ success: false, message: "Voter not found" });

    res.status(200).json({ success: true, voter });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateVoter = async (req, res) => {
  try {
    const voter = await Voter.findByPk(req.params.id);
    if (!voter)
      return res.status(404).json({ success: false, message: "Voter not found" });

    await voter.update(req.body);
    res.status(200).json({ success: true, message: "Voter updated", voter });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteVoter = async (req, res) => {
  try {
    const voter = await Voter.findByPk(req.params.id);
    if (!voter)
      return res.status(404).json({ success: false, message: "Voter not found" });

    await voter.destroy();
    res.status(200).json({ success: true, message: "Voter deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
