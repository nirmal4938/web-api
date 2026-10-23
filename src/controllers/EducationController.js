// src/controllers/EducationController.js
import EducationService from "../services/EducationService.js";

class EducationController {
  /**
   * Bulk add student records linked to the context business tenant
   */
  static async bulkAddStudents(req, res) {
    try {
      const subdomain = req.tenant?.subdomain;
      const { studentList } = req.body;

      if (!studentList || !Array.isArray(studentList)) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Missing or invalid payload parameter: studentList array.",
          });
      }

      const result = await EducationService.bulkCreateStudents(
        subdomain,
        studentList,
      );

      return res.status(201).json({
        success: true,
        message: `Successfully seeded student records into the database.`,
        data: result,
      });
    } catch (err) {
      console.error("❌ Bulk Add Students Error:", err);
      return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal data seeding exception.",
      });
    }
  }

  /**
   * Fetch live WhatsApp device engine linkage status or request new QR token string cache updates
   */
  static async getWhatsAppStatus(req, res) {
    try {
      const subdomain = req.tenant?.subdomain;
      const result = await EducationService.resolveWhatsAppStatus(subdomain);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      console.error("❌ WhatsApp Status Engine Error:", err);
      return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Failed processing status handshake context.",
      });
    }
  }

  /**
   * Trigger non-blocking asynchronous automated loop broadcast alert messages
   */
  static async blastDefaulters(req, res) {
    try {
      const subdomain = req.tenant?.subdomain;
      const result = await EducationService.triggerDefaulterBlast(subdomain);

      return res.status(202).json({
        success: true,
        message: result.message,
      });
    } catch (err) {
      console.error("❌ Defaulter Messaging Blast Error:", err);
      return res.status(err.statusCode || 500).json({
        success: false,
        message:
          err.message || "Failed initializing automated reminder streams.",
      });
    }
  }
}

export default EducationController;
