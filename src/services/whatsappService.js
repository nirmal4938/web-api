import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;
import qrcode from "qrcode-terminal";

// Initialize the WhatsApp client with version caching explicitly forced
const whatsappClient = new Client({
  authStrategy: new LocalAuth({
    dataPath: "./whatsapp_auth_session",
  }),
  // 👇 FORCE A MODERN STABLE REMOTE WEB VERSION TEMPLATE
  webVersionCache: {
    type: "remote",
    remotePath:
      "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.3000.1014590669-alpha.html",
  },
  puppeteer: {
    handleSIGINT: false,
    executablePath:
      "C:\\Users\\kumar\\.cache\\puppeteer\\chrome\\win64-154.0.8037.57\\chrome-win64\\chrome.exe",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-extensions"],
  },
});

// Print QR code directly into your console
whatsappClient.on("qr", (qr) => {
  console.log(
    "\n🔥 ACTION REQUIRED: SCAN THIS NEW QR CODE WITH YOUR WHATSAPP TO LINK DEMO:",
  );
  qrcode.generate(qr, { small: true });
});

// Confirm connection
whatsappClient.on("ready", () => {
  console.log(
    "\n✅ WhatsApp Client is securely authenticated and ready to route messages!",
  );
});

whatsappClient.on("auth_failure", (msg) => {
  console.error("❌ WhatsApp Authentication failure:", msg);
});

whatsappClient.on("disconnected", (reason) => {
  console.log("⚠️ WhatsApp Client was disconnected:", reason);
});

// Initialize client
whatsappClient.initialize();

export default whatsappClient;
