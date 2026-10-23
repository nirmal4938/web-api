// src/routes/EducationRoutes.js
import { Router } from "express";
import EducationController from "../controllers/EducationController.js";

const router = Router();

// ============================================================
// 🏫 Data Ingestion & Roster Management
// ============================================================
// Add students via JSON bulk data seed payloads in Postman
router.post("/students/bulk-add", EducationController.bulkAddStudents);

// ============================================================
// 📱 WhatsApp Automation Engine Ports
// ============================================================
// Fetch live connection state and generate QR codes on-demand
router.get("/whatsapp/status", EducationController.getWhatsAppStatus);

// Trigger background broadcast loops reading defaulters straight from DB
router.post("/whatsapp/blast-defaulters", EducationController.blastDefaulters);

export default router;
