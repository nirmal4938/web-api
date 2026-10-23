import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;
import path from "path";
import WhatsAppSession from "../models/WhatsAppSession.js";

const activeClients = new Map();

export const getWhatsAppClient = async (tenantSubdomain, businessId) => {
  if (!tenantSubdomain || !businessId)
    throw new Error("Missing routing parameters.");

  if (activeClients.has(tenantSubdomain)) {
    return activeClients.get(tenantSubdomain);
  }

  const client = new Client({
    authStrategy: new LocalAuth({
      clientId: tenantSubdomain,
      dataPath: path.join("./whatsapp_sessions", `tenant_${tenantSubdomain}`),
    }),
    webVersionCache: {
      type: "remote",
      remotePath: "https://githubusercontent.com",
    },
    puppeteer: {
      handleSIGINT: false,
      executablePath:
        "C:\\Users\\kumar\\.cache\\puppeteer\\chrome\\win64-154.0.8037.57\\chrome-win64\\chrome.exe",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-extensions",
      ],
    },
  });

  // 1️⃣ Save QR code string straight to database when it changes
  client.on("qr", async (qr) => {
    console.log(`\n📸 New QR token generated for business: ${tenantSubdomain}`);
    await WhatsAppSession.upsert({
      businessId: businessId,
      qrCode: qr,
      connectionStatus: "QR_READY",
    });
  });

  // 2️⃣ Update connection status to live when authenticated successfully
  client.on("ready", async () => {
    console.log(`\n✅ Connected number line for business: ${tenantSubdomain}`);
    await WhatsAppSession.update(
      {
        connectionStatus: "CONNECTED",
        qrCode: null,
        lastConnectedAt: new Date(),
      },
      { where: { businessId: businessId } },
    );
  });

  client.on("disconnected", async () => {
    await WhatsAppSession.update(
      { connectionStatus: "DISCONNECTED", qrCode: null },
      { where: { businessId: businessId } },
    );
    activeClients.delete(tenantSubdomain);
  });

  client.initialize();
  activeClients.set(tenantSubdomain, client);
  return client;
};
