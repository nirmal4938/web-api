import dotenv from "dotenv";
dotenv.config();
import Razorpay from "razorpay";
import crypto from "crypto";
import { db } from "../models/index.js"; // Sequelize models
import { v4 as uuidv4 } from "uuid";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Create Razorpay Order (step 1)
 * ---------------------------------
 * 1️⃣ Create Razorpay order
 * 2️⃣ Save order info in DB with status = 'pending'
 */
export const createOrder = async (req, res) => {
  try {
    const { amount, currency = "INR", userId, organizationId } = req.body;

    if (!amount) return res.status(400).json({ message: "Amount is required" });

    // Create order in Razorpay
    const order = await razorpay.orders.create({
      amount: amount * 100, // ₹ → paise
      currency,
      receipt: `receipt_${Date.now()}`,
    });

    // Save pending payment in DB
    await db.payments.create({
      id: uuidv4(),
      user_id: userId,
      organization_id: organizationId,
      order_id: order.id,
      amount,
      currency,
      status: "pending",
      created_at: new Date(),
      updated_at: new Date(),
    });

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("❌ Error creating order:", error);
    res.status(500).json({ message: "Failed to create order", error });
  }
};

/**
 * Verify Payment (step 2)
 * ---------------------------------
 * 1️⃣ Verify Razorpay signature
 * 2️⃣ If valid → update payment record in DB
 * 3️⃣ Send success to frontend
 */
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing payment details" });
    }

    // Generate signature for verification
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    // Compare signatures
    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    // ✅ Signature verified → update DB
    await db.payments.update(
      {
        payment_id: razorpay_payment_id,
        status: "paid",
        updated_at: new Date(),
      },
      { where: { order_id: razorpay_order_id } }
    );

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    });
  } catch (error) {
    console.error("❌ Error verifying payment:", error);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
};

/**
 * Optional: Handle Razorpay Webhook (step 3)
 * ---------------------------------
 * Razorpay sends a webhook after payment success/failure.
 * This ensures you capture payments even if frontend fails.
 */
export const handleWebhook = async (req, res) => {
  try {
    const payload = req.body;
    const signature = req.headers["x-razorpay-signature"];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    const expectedSig = crypto
      .createHmac("sha256", webhookSecret)
      .update(JSON.stringify(payload))
      .digest("hex");

    if (signature !== expectedSig) {
      return res.status(400).json({ success: false, message: "Invalid webhook signature" });
    }

    const { event, payload: data } = payload;

    // Save webhook log
    await db.razorpay_webhooks.create({
      id: uuidv4(),
      event_type: event,
      payload,
      received_at: new Date(),
      processed: false,
    });

    // Optionally update payment based on webhook
    if (event === "payment.captured") {
      const payment = data.payment.entity;
      await db.payments.update(
        {
          payment_id: payment.id,
          status: "paid",
          updated_at: new Date(),
        },
        { where: { order_id: payment.order_id } }
      );
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    res.status(500).json({ success: false, message: "Webhook failed" });
  }
};
