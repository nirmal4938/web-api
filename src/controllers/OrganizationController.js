// src/controllers/organizationController.js
// import { Organization } from '../models/Organization.js';
import { db } from '../models/index.js';


export const createOrganization = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Organization name is required' });
    }

    const organization = await db.Organization.create({
      name,
      description,
    });

    return res.status(201).json({
      success: true,
      organization,
    });
  } catch (error) {
    console.error('Error creating organization:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

export const getOrganizations = async (req, res) => {
  try {
    const organizations = await db.Organization.findAll();
    return res.status(200).json({
      success: true,
      organizations,
    });
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};
