/**
 * Create Razorpay Order
 * Vercel Serverless Function
 * Handles POST requests to create payment orders
 */

const Razorpay = require('razorpay');
const { setCorsHeaders, handleOptions } = require('../_cors');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

module.exports = async (req, res) => {
  // Handle OPTIONS preflight
  if (handleOptions(req, res)) {
    return;
  }

  // Set CORS headers
  setCorsHeaders(req, res);

  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      allowedMethods: ['POST', 'OPTIONS']
    });
  }

  try {
    const { amount, currency = 'INR', userData, bookingData, notes } = req.body;

    // Validate required fields
    if (!amount || amount <= 0) {
      return res.status(400).json({
        error: 'Invalid amount. Amount must be greater than 0.'
      });
    }

    // Validate Razorpay configuration
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error('❌ Razorpay keys not configured');
      return res.status(500).json({
        error: 'Payment service configuration error'
      });
    }

    // Convert amount to paise (Razorpay requires amount in smallest currency unit)
    const amountInPaise = Math.round(amount * 100);

    // Create order options
    const options = {
      amount: amountInPaise,
      currency: currency,
      receipt: `receipt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      notes: {
        service: 'consulting_session',
        bookingReference: bookingData?.bookingReference || 'N/A',
        userEmail: userData?.email || 'N/A',
        ...notes
      }
    };

    // Create order with Razorpay
    const order = await razorpay.orders.create(options);

    console.log('✅ Razorpay order created:', order.id);

    // Return order details
    res.status(200).json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      status: order.status,
      created_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error creating Razorpay order:', error);
    
    // Set CORS headers even on error
    setCorsHeaders(req, res);
    
    res.status(500).json({
      error: 'Failed to create payment order',
      message: error.message || 'Unknown error occurred'
    });
  }
};

