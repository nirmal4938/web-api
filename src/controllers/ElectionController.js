// src/controllers/ElectionController.js
import { db } from "../models/index.js";

const { Election } = db;

export const createElection = async (req, res) => {
  try {
    const { name, startDate, endDate, status, description } = req.body;

    const election = await Election.create({
      name,
      startDate,
      endDate,
      status,
      description,
    });

    res.status(201).json({ success: true, message: "Election created", election });
  } catch (error) {
    console.error("Error creating election:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllElections = async (req, res) => {
  try {
    const elections = await Election.findAll();
    res.status(200).json({ success: true, elections });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getElectionById = async (req, res) => {
  try {
    const election = await Election.findByPk(req.params.id);
    if (!election)
      return res.status(404).json({ success: false, message: "Election not found" });

    res.status(200).json({ success: true, election });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateElection = async (req, res) => {
  try {
    const { id } = req.params;
    const election = await Election.findByPk(id);
    if (!election)
      return res.status(404).json({ success: false, message: "Election not found" });

    await election.update(req.body);
    res.status(200).json({ success: true, message: "Election updated", election });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteElection = async (req, res) => {
  try {
    const { id } = req.params;
    const election = await Election.findByPk(id);
    if (!election)
      return res.status(404).json({ success: false, message: "Election not found" });

    await election.destroy();
    res.status(200).json({ success: true, message: "Election deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
