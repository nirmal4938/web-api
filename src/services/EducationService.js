// src/services/EducationService.js
import { db } from "../models/index.js";
import { getWhatsAppClient } from "./whatsappManager.js";

const { Business, Student, WhatsAppSession } = db;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class EducationService {
  /**
   * Resolves the target tenant business model context and bulk creates student listings
   */
  static async bulkCreateStudents(subdomain, studentList) {
    const business = await Business.findOne({ where: { slug: subdomain } });
    if (!business) {
      const error = new Error(
        "Active platform workspace profile matching host slug missing.",
      );
      error.statusCode = 404;
      throw error;
    }

    const formattedRecords = studentList.map((s) => ({
      businessId: business.id,
      fullName: s.fullName,
      className: s.className,
      parentPhone: String(s.parentPhone || "").replace(/\D/g, ""),
      amountDue: s.amountDue || 0.0,
      feeDueDate: s.feeDueDate || null,
    }));

    return await Student.bulkCreate(formattedRecords);
  }

  /**
   * Resolves active database status markers or triggers dynamic thread initializations
   */
  static async resolveWhatsAppStatus(subdomain) {
    const business = await Business.findOne({ where: { slug: subdomain } });
    if (!business) {
      const error = new Error(
        "Active matching tenant workspace mapping not found.",
      );
      error.statusCode = 404;
      throw error;
    }

    let sessionRecord = await WhatsAppSession.findOne({
      where: { businessId: business.id },
    });
    if (!sessionRecord) {
      sessionRecord = await WhatsAppSession.create({
        businessId: business.id,
        connectionStatus: "DISCONNECTED",
      });
    }

    if (sessionRecord.connectionStatus === "DISCONNECTED") {
      await WhatsAppSession.update(
        { connectionStatus: "AUTHENTICATING" },
        { where: { businessId: business.id } },
      );

      // Async call triggers worker thread lifecycle loops in the background
      getWhatsAppClient(subdomain, business.id).catch((err) =>
        console.error("Async client initialization breakdown:", err),
      );

      sessionRecord = await WhatsAppSession.findOne({
        where: { businessId: business.id },
      });
    }

    return {
      status: sessionRecord.connectionStatus,
      qrCodeText: sessionRecord.qrCode,
      lastConnectedAt: sessionRecord.lastConnectedAt,
    };
  }

  /**
   * Dispatches automated alerts via isolated background loops
   */
  static async triggerDefaulterBlast(subdomain) {
    const business = await Business.findOne({ where: { slug: subdomain } });
    if (!business) {
      const error = new Error(
        "Target coaching center tracking profile slug domain not found.",
      );
      error.statusCode = 404;
      throw error;
    }

    // Pull database entries matching due balance criteria
    const defaulters = await Student.findAll({
      where: {
        businessId: business.id,
        amountDue: { [db.Sequelize.Op.gt]: 0 },
      },
    });

    if (defaulters.length === 0) {
      return {
        message:
          "Zero outstanding student fee defaults located inside database cache.",
      };
    }

    // Launch connection pipeline stream reference
    const client = await getWhatsAppClient(subdomain, business.id);

    // Detached background runtime worker process flow loop execution
    (async () => {
      for (let student of defaulters) {
        try {
          let cleanPhone = student.parentPhone.replace(/\D/g, "");
          if (!cleanPhone.startsWith("91")) cleanPhone = `91${cleanPhone}`;

          const whatsappTargetId = `${cleanPhone}@c.us`;
          const textPayload = `Greetings from *${business.name}*.\n\nDear Parent, this is an automated reminder that the tuition fee for *${student.fullName}* (Class: ${student.className}) remains pending.\n\n🔹 *Amount Due:* ₹${student.amountDue}\n📅 *Due Date:* ${student.feeDueDate || "Immediate"}\n\nPlease disregard if already paid. Thank you!`;

          await client.sendMessage(whatsappTargetId, textPayload);
          console.log(
            `✉️ Automated message row dispatched dynamically via [${subdomain}] to ${student.fullName}`,
          );

          // Adaptive velocity limit throttle rule
          await sleep(Math.floor(Math.random() * (5000 - 3000 + 1)) + 3000);
        } catch (err) {
          console.error(
            `💥 Automated transmission skip error on instance ID ${student.id}:`,
            err.message,
          );
        }
      }
    })();

    return {
      message: `Dynamic data parsing complete. Worker queue loops triggered in background for ${defaulters.length} records.`,
    };
  }
}

export default EducationService;
