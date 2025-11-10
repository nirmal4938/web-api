import { sendMessageToAI } from "../services/AIService.js";

// POST /api/chat
export const createChatMessage = async (req, res) => {
  try {
    const { sessionId, message } = req.body;
    if (!sessionId || !message) {
      return res.status(400).json({ success: false, message: "sessionId & message required" });
    }

    const botMessageId = Date.now(); // unique ID for streaming
    res.status(200).json({ botMessageId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to create chat message" });
  }
};

// GET /api/chat/stream?sessionId=...&botMessageId=...&message=...
export const streamChat = async (req, res) => {
  try {
    const { sessionId, botMessageId, message } = req.query;
    if (!sessionId || !botMessageId || !message) {
      return res.status(400).json({ success: false, message: "sessionId, botMessageId, message required" });
    }

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    const aiReply = await sendMessageToAI(sessionId, message);

    const chunks = aiReply.match(/.{1,20}/g) || [aiReply];
    for (const chunk of chunks) {
      res.write(`data: ${chunk}\n\n`);
      await new Promise(r => setTimeout(r, 50));
    }

    res.write(`event: done\ndata: done\n\n`);
    res.end();
  } catch (err) {
    console.error("ChatController SSE Error:", err);
    res.status(500).json({ success: false, message: "AI streaming failed" });
  }
};
