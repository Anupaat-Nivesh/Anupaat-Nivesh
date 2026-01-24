import crypto from "crypto";
import { applyCors } from "../_cors.js";
import { appendPaymentToSheet } from "../services/sheets.js";

export default async function handler(req, res) {
  if (applyCors(req, res)) return;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Support both field name formats (razorpay_* and camelCase)
  const orderId = req.body.razorpay_order_id || req.body.order_id || req.body.orderId;
  const paymentId = req.body.razorpay_payment_id || req.body.payment_id || req.body.paymentId;
  const signature = req.body.razorpay_signature || req.body.signature;
  const { userData, bookingData, amount, currency } = req.body;

  if (!orderId || !paymentId || !signature) {
    return res.status(400).json({ 
      success: false,
      error: "Missing required fields: orderId, paymentId, signature"
    });
  }

  const body = `${orderId}|${paymentId}`;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature === signature) {
    // Log to Google Sheet
    await appendPaymentToSheet({
      paymentId,
      orderId,
      amount,
      currency,
      userData,
      bookingData,
      status: 'Verified'
    });

    return res.status(200).json({ success: true });
  }

  return res.status(400).json({ success: false });
}
