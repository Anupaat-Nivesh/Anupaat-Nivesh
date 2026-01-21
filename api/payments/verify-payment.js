/**
 * Verify Razorpay Payment
 * Vercel Serverless Function
 * Handles POST requests to verify payment signatures
 */

const crypto = require('crypto');
const { setCorsHeaders, handleOptions } = require('../_cors');

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
    const { paymentId, orderId, signature, userData, bookingData } = req.body;

    // Validate required fields
    if (!paymentId || !orderId || !signature) {
      setCorsHeaders(req, res);
      return res.status(400).json({
        verified: false,
        error: 'Missing required payment verification fields'
      });
    }

    // Validate Razorpay secret is configured
    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error('❌ Razorpay secret not configured');
      setCorsHeaders(req, res);
      return res.status(500).json({
        verified: false,
        error: 'Payment service configuration error'
      });
    }

    // Verify payment signature using Razorpay algorithm
    const text = `${orderId}|${paymentId}`;
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    if (generatedSignature !== signature) {
      console.error('❌ Payment signature verification failed');
      setCorsHeaders(req, res);
      return res.status(400).json({
        verified: false,
        error: 'Invalid payment signature'
      });
    }

    console.log('✅ Payment verified successfully:', paymentId);

    // Payment is verified
    res.status(200).json({
      verified: true,
      paymentId,
      orderId,
      message: 'Payment verified successfully'
    });
  } catch (error) {
    console.error('❌ Error verifying payment:', error);
    
    // Set CORS headers even on error
    setCorsHeaders(req, res);
    
    res.status(500).json({
      verified: false,
      error: 'Failed to verify payment',
      message: error.message || 'Unknown error occurred'
    });
  }
};

