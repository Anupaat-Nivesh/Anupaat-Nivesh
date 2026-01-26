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
    // Log to Google Sheet with all required fields
    try {
      const sheetData = {
        paymentId,
        orderId,
        amount: amount || bookingData?.amount || req.body.amount || 99,
        currency: currency || req.body.currency || 'INR',
        userData: userData || req.body.userData,
        bookingData: bookingData || req.body.bookingData || {},
        bookingReference: bookingData?.bookingReference || req.body.bookingReference || 'N/A',
        status: 'Paid'
      };
      
      console.log('📝 Attempting to log payment to Google Sheet:', {
        paymentId,
        orderId,
        hasUserData: !!sheetData.userData,
        hasBookingData: !!sheetData.bookingData,
        bookingReference: sheetData.bookingReference
      });
      
      await appendPaymentToSheet(sheetData);
      console.log('✅ Payment details logged to Google Sheet successfully');
    } catch (sheetError) {
      console.error('⚠️ Failed to log payment to Google Sheet:', sheetError);
      console.error('Error details:', {
        message: sheetError.message,
        code: sheetError.code,
        hasCredentials: !!process.env.GOOGLE_SHEETS_CREDENTIALS,
        hasSheetId: !!process.env.GOOGLE_SHEET_ID,
        sheetId: process.env.GOOGLE_SHEET_ID || 'NOT SET'
      });
      // Don't block payment verification if sheet logging fails
      // But log the error for debugging
    }

    return res.status(200).json({ success: true, verified: true });
  }

  return res.status(400).json({ success: false });
}
