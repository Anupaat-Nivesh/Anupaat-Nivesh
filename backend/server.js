/**
 * Anupaat Nivesh Backend API Server
 * Handles Razorpay payment processing and booking management
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Razorpay = require('razorpay');

const app = express();
const PORT = process.env.PORT || 8000;

// CORS configuration - allow both www and non-www domains
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://www.anupaatnivesh.com',
  'https://anupaatnivesh.com',
  'http://localhost:3000' // For local development
].filter(Boolean); // Remove undefined values

// Helper function to set CORS headers
const setCorsHeaders = (req, res) => {
  const origin = req.headers.origin;
  if (origin) {
    const isAllowed = allowedOrigins.length === 0 || allowedOrigins.includes(origin);
    if (isAllowed) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
  }
};

// Handle preflight OPTIONS requests explicitly (critical for Vercel)
app.options('*', (req, res) => {
  const origin = req.headers.origin;

  // Always set CORS headers for OPTIONS (preflight) requests
  if (origin) {
    // Check if origin is in allowed list
    const isAllowed = allowedOrigins.length === 0 || allowedOrigins.includes(origin);

    if (isAllowed) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
    }
  } else {
    // No origin header, allow it
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
  }

  res.status(204).end();
});

// CORS middleware for all other requests
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }

    // Check if origin is in allowed list or if allowedOrigins is empty (allow all)
    if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // Log for debugging
      console.log('CORS blocked origin:', origin);
      callback(null, true); // Allow all for now, can restrict later
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Length', 'Content-Type'],
  maxAge: 86400 // 24 hours
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'Anupaat Nivesh API',
    status: 'running',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      createOrder: '/api/payments/create-order',
      verifyPayment: '/api/payments/verify',
      createBooking: '/api/bookings'
    },
    documentation: 'See /api/health for service status'
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Anupaat Nivesh API'
  });
});

// Create Razorpay Order
app.post('/api/payments/create-order', async (req, res) => {
  // Set CORS headers explicitly for this endpoint
  setCorsHeaders(req, res);

  try {
    const { amount, currency = 'INR', userData, bookingData, notes } = req.body;

    // Validate required fields
    if (!amount || amount <= 0) {
      setCorsHeaders(req, res);
      return res.status(400).json({
        error: 'Invalid amount. Amount must be greater than 0.'
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
    res.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      status: order.status,
      created_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error creating Razorpay order:', error);
    res.status(500).json({
      error: 'Failed to create payment order',
      message: error.message
    });
  }
});

// Verify Payment
app.post('/api/payments/verify', async (req, res) => {
  // Set CORS headers explicitly for this endpoint
  setCorsHeaders(req, res);

  try {
    const { paymentId, orderId, signature, userData, bookingData } = req.body;

    // Validate required fields
    if (!paymentId || !orderId || !signature) {
      setCorsHeaders(req, res);
      return res.status(400).json({
        error: 'Missing required payment verification fields'
      });
    }

    // Verify payment signature using Razorpay
    const crypto = require('crypto');
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
    res.json({
      verified: true,
      paymentId,
      orderId,
      message: 'Payment verified successfully'
    });
  } catch (error) {
    console.error('❌ Error verifying payment:', error);
    setCorsHeaders(req, res);
    res.status(500).json({
      verified: false,
      error: 'Failed to verify payment',
      message: error.message
    });
  }
});

// Create Booking
app.post('/api/bookings', async (req, res) => {
  try {
    const { userData, bookingData, paymentData } = req.body;

    // Validate required fields
    if (!userData || !bookingData) {
      return res.status(400).json({
        error: 'Missing required booking data'
      });
    }

    // Generate booking ID
    const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // In production, save to database here
    // For now, just return success
    const booking = {
      booking_id: bookingId,
      bookingReference: bookingData.bookingReference,
      userData,
      bookingData,
      paymentData,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    console.log('✅ Booking created:', bookingId);

    res.status(201).json(booking);
  } catch (error) {
    console.error('❌ Error creating booking:', error);
    res.status(500).json({
      error: 'Failed to create booking',
      message: error.message
    });
  }
});

// Get Booking
app.get('/api/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // In production, fetch from database
    // For now, return placeholder
    res.json({
      booking_id: id,
      message: 'Booking retrieval not implemented yet'
    });
  } catch (error) {
    console.error('❌ Error fetching booking:', error);
    res.status(500).json({
      error: 'Failed to fetch booking',
      message: error.message
    });
  }
});

// Update Booking Status
app.put('/api/bookings/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        error: 'Status is required'
      });
    }

    // In production, update in database
    console.log(`✅ Booking ${id} status updated to: ${status}`);

    res.json({
      booking_id: id,
      status,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error updating booking status:', error);
    res.status(500).json({
      error: 'Failed to update booking status',
      message: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path
  });
});

// Export app for Vercel serverless functions
module.exports = app;

// Start server only when running locally (not on Vercel)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Anupaat Nivesh API Server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔑 Razorpay Key ID: ${process.env.RAZORPAY_KEY_ID ? '✅ Configured' : '❌ Missing'}`);
    console.log(`🔐 Razorpay Secret: ${process.env.RAZORPAY_KEY_SECRET ? '✅ Configured' : '❌ Missing'}`);
  });
}

