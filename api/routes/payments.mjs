/**
 * Payment Routes
 * Express-compatible route handlers
 * Preserves 100% of original business logic from api/payments/*.js
 */

import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { appendPaymentToSheet } from '../services/sheets.mjs';

const router = express.Router();

/**
 * Create Razorpay Order
 * POST /api/payments/create-order
 * Original logic from api/payments/create-order.js
 */
router.post('/create-order', async (req, res) => {
    try {
        const { amount, currency = 'INR', userData, bookingData, notes } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ error: "Amount is required and must be greater than 0" });
        }

        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            console.error("❌ Razorpay keys not configured");
            return res.status(500).json({ error: "Payment service configuration error" });
        }

        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        // Prepare notes for Razorpay order
        // Store userData and bookingData as JSON strings so webhook can access them
        const orderNotes = {
            service: notes?.service || 'consulting_session',
            bookingReference: bookingData?.bookingReference || notes?.bookingReference || 'N/A',
            userEmail: userData?.email || 'N/A',
            ...notes,
        };

        // Store full userData and bookingData as JSON strings for webhook access
        if (userData) {
            orderNotes.userData = JSON.stringify(userData);
        }
        if (bookingData) {
            orderNotes.bookingData = JSON.stringify(bookingData);
        }

        const order = await razorpay.orders.create({
            amount: amount * 100, // Convert to paise
            currency: currency,
            receipt: `receipt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            notes: orderNotes
        });

        console.log('📝 Order notes stored:', {
            bookingReference: orderNotes.bookingReference,
            hasUserData: !!orderNotes.userData,
            hasBookingData: !!orderNotes.bookingData
        });

        console.log('✅ Razorpay order created:', order.id);

        // Return in format expected by frontend
        return res.status(200).json({
            order_id: order.id,
            id: order.id,
            amount: order.amount,
            currency: order.currency,
            status: order.status,
            ...order
        });
    } catch (error) {
        console.error("Create order error:", error);
        return res.status(500).json({ error: "Order creation failed" });
    }
});

/**
 * Verify Payment
 * POST /api/payments/verify-payment
 * Original logic from api/payments/verify-payment.js
 */
router.post('/verify-payment', async (req, res) => {
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
                status: 'Paid',
                source: userData?.source || bookingData?.source || req.body.source || 'N/A'
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
});

/**
 * Razorpay Webhook Handler
 * POST /api/payments/webhook
 * GET /api/payments/webhook (for testing)
 * Original logic from api/payments/webhook.js
 */
router.get('/webhook', (req, res) => {
    return res.status(200).json({
        status: "Webhook endpoint is active",
        message: "This endpoint handles Razorpay webhook events",
        events: ["payment.captured", "payment.failed", "subscription.activated"],
        configured: !!process.env.RAZORPAY_WEBHOOK_SECRET
    });
});

router.post('/webhook', async (req, res) => {
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
        // Use req.rawBody if available (set by middleware), otherwise stringify
        let rawBody = req.rawBody || JSON.stringify(req.body);

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

        if (event === "subscription.activated") {
            console.log("✅ subscription.activated — acknowledge for premium sync pipeline");
            return res.status(200).json({
                success: true,
                message: "Subscription activation acknowledged"
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
});

export default router;

