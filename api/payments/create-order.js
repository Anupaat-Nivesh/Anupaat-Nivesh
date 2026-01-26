import Razorpay from "razorpay";
import { applyCors } from "../_cors.js";

export default async function handler(req, res) {
  if (applyCors(req, res)) return;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

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
      service: 'consulting_session',
      bookingReference: bookingData?.bookingReference || notes?.bookingReference || 'N/A',
      userEmail: userData?.email || 'N/A',
      ...notes
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
}
