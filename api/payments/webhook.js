import crypto from "crypto";
import { appendPaymentToSheet } from "../services/sheets.js";

/**
 * Razorpay Webhook Handler
 * Handles server-to-server payment verification
 * Events: payment.captured, payment.failed
 * 
 * Vercel Configuration:
 * - This endpoint should be configured in Razorpay Dashboard
 * - URL: https://your-domain.vercel.app/api/payments/webhook
 * - Events: payment.captured, payment.failed
 * - Set RAZORPAY_WEBHOOK_SECRET in Vercel environment variables
 */
export default async function handler(req, res) {
  // Allow GET for testing/health check
  if (req.method === "GET") {
    return res.status(200).json({ 
      status: "Webhook endpoint is active",
      message: "This endpoint handles Razorpay webhook events",
      events: ["payment.captured", "payment.failed"],
      configured: !!process.env.RAZORPAY_WEBHOOK_SECRET
    });
  }

  // Handle OPTIONS for CORS preflight
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-razorpay-signature");
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.error("❌ Razorpay webhook secret not configured");
      return res.status(500).json({ 
        error: "Webhook configuration error",
        message: "RAZORPAY_WEBHOOK_SECRET environment variable is not set"
      });
    }

    // Get raw body for signature verification
    // Vercel automatically parses JSON, but we need the raw string for signature
    let rawBody;
    if (typeof req.body === 'string') {
      rawBody = req.body;
    } else {
      // If body is already parsed, stringify it
      // Note: This might not work for signature verification if Razorpay uses raw body
      // In production, you may need to configure Vercel to pass raw body
      rawBody = JSON.stringify(req.body);
    }

    // Verify webhook signature
    const signature = req.headers["x-razorpay-signature"] || req.headers["X-Razorpay-Signature"];
    
    if (!signature) {
      console.error("❌ Missing webhook signature");
      return res.status(400).json({ error: "Missing signature header" });
    }

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.error("❌ Invalid webhook signature");
      return res.status(400).json({ error: "Invalid signature" });
    }

    const event = req.body.event;
    const payload = req.body.payload || req.body;

    console.log(`📥 Webhook received: ${event}`);
    console.log('📦 Webhook payload structure:', {
      hasPayload: !!payload,
      payloadKeys: payload ? Object.keys(payload) : [],
      event: event
    });

    // Handle payment.captured event
    if (event === "payment.captured") {
      // Try multiple possible payload structures
      let payment = payload.payment?.entity || payload.payment?.payment?.entity || payload.payment;
      let order = payload.order?.entity || payload.order?.order?.entity || payload.order;

      // If still not found, check if payment/order are at root level
      if (!payment && req.body.payment) {
        payment = req.body.payment.entity || req.body.payment;
      }
      if (!order && req.body.order) {
        order = req.body.order.entity || req.body.order;
      }

      console.log('🔍 Extracted data:', {
        hasPayment: !!payment,
        hasOrder: !!order,
        paymentId: payment?.id,
        orderId: order?.id
      });

      if (!payment || !order) {
        console.error("❌ Missing payment or order data in webhook");
        console.error("📋 Full webhook body:", JSON.stringify(req.body, null, 2));
        console.error("📋 Payload structure:", JSON.stringify(payload, null, 2));
        return res.status(400).json({ 
          error: "Invalid webhook payload",
          received: {
            event: event,
            hasPayload: !!payload,
            payloadKeys: payload ? Object.keys(payload) : []
          }
        });
      }

      // Extract payment details
      const paymentId = payment.id;
      const orderId = order.id;
      const amount = payment.amount / 100; // Convert from paise to rupees
      const currency = payment.currency || "INR";
      const status = payment.status === "captured" ? "Confirmed" : "Paid";

      // Extract user data from order notes
      const notes = order.notes || {};
      let userData = null;
      let bookingData = null;
      let bookingReference = "N/A";

      try {
        if (notes.userData) {
          userData = typeof notes.userData === 'string' ? JSON.parse(notes.userData) : notes.userData;
        }
        if (notes.bookingData) {
          bookingData = typeof notes.bookingData === 'string' ? JSON.parse(notes.bookingData) : notes.bookingData;
        }
        bookingReference = notes.bookingReference || bookingData?.bookingReference || notes.bookingReference || "N/A";
      } catch (parseError) {
        console.warn('⚠️ Error parsing notes:', parseError.message);
        // Continue with null values
      }

      // Extract source from userData, bookingData, or notes
      const source = userData?.source || bookingData?.source || notes.source || 'N/A';

      // Log to Google Sheet
      try {
        const sheetData = {
          paymentId,
          orderId,
          amount,
          currency,
          userData,
          bookingData,
          bookingReference,
          status: "Confirmed (Webhook)",
          source: source // Include source for Google Sheets
        };

        console.log('📊 Logging to Google Sheet:', {
          paymentId,
          orderId,
          amount,
          hasUserData: !!userData,
          hasBookingData: !!bookingData,
          bookingReference,
          source: source
        });

        await appendPaymentToSheet(sheetData);
        console.log("✅ Payment confirmed via webhook and logged to Google Sheet");
      } catch (sheetError) {
        console.error("⚠️ Failed to log webhook payment to Google Sheet:", sheetError);
        console.error("Error details:", {
          message: sheetError.message,
          stack: sheetError.stack
        });
        // Don't fail the webhook if sheet logging fails
      }

      return res.status(200).json({ 
        success: true, 
        message: "Payment captured and logged" 
      });
    }

    // Handle payment.failed event
    if (event === "payment.failed") {
      // Try multiple possible payload structures
      let payment = payload.payment?.entity || payload.payment?.payment?.entity || payload.payment;
      let order = payload.order?.entity || payload.order?.order?.entity || payload.order;

      // If still not found, check if payment/order are at root level
      if (!payment && req.body.payment) {
        payment = req.body.payment.entity || req.body.payment;
      }
      if (!order && req.body.order) {
        order = req.body.order.entity || req.body.order;
      }

      console.log('🔍 Failed payment data:', {
        hasPayment: !!payment,
        hasOrder: !!order,
        paymentId: payment?.id,
        orderId: order?.id
      });

      if (payment && order) {
        const paymentId = payment.id;
        const orderId = order.id;
        const amount = payment.amount / 100;
        const currency = payment.currency || "INR";

        // Extract user data from order notes
        const notes = order.notes || {};
        let userData = null;
        let bookingData = null;
        let bookingReference = "N/A";

        try {
          if (notes.userData) {
            userData = typeof notes.userData === 'string' ? JSON.parse(notes.userData) : notes.userData;
          }
          if (notes.bookingData) {
            bookingData = typeof notes.bookingData === 'string' ? JSON.parse(notes.bookingData) : notes.bookingData;
          }
          bookingReference = notes.bookingReference || bookingData?.bookingReference || notes.bookingReference || "N/A";
        } catch (parseError) {
          console.warn('⚠️ Error parsing notes:', parseError.message);
          // Continue with null values
        }

        // Extract source from userData, bookingData, or notes
        const source = userData?.source || bookingData?.source || notes.source || 'N/A';

        // Log failed payment to Google Sheet
        try {
          await appendPaymentToSheet({
            paymentId,
            orderId,
            amount,
            currency,
            userData,
            bookingData,
            bookingReference,
            status: "Failed",
            source: source // Include source for Google Sheets
          });
          console.log("⚠️ Payment failed logged to Google Sheet");
        } catch (sheetError) {
          console.error("⚠️ Failed to log failed payment to Google Sheet:", sheetError.message);
        }
      }

      return res.status(200).json({ 
        success: true, 
        message: "Payment failure logged" 
      });
    }

    // Handle other events (optional)
    console.log(`ℹ️ Unhandled webhook event: ${event}`);
    return res.status(200).json({ 
      success: true, 
      message: "Event received but not processed" 
    });

  } catch (error) {
    console.error("❌ Webhook processing error:", error);
    return res.status(500).json({ 
      error: "Webhook processing failed",
      message: error.message 
    });
  }
}

