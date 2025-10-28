// src/routes/organizationRoutes.js
import express from 'express';
import { createOrganization, getOrganizations } from '../controllers/OrganizationController.js';

const router = express.Router();

router.post('/', createOrganization);
router.get('/', getOrganizations);

export default router;
