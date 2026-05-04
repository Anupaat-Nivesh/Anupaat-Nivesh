/**
 * Express Server Entry Point
 * Production-ready Express.js backend server
 * Compatible with Vercel deployment via vercel.json
 * 
 * Usage:
 *   Local: node server.mjs (or npm run server)
 *   Vercel: Automatically handled via vercel.json
 */

import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Import route handlers
import healthRouter from './api/routes/health.mjs';
import paymentsRouter from './api/routes/payments.mjs';

// Raw body middleware for webhook signature verification
const rawBodyMiddleware = express.raw({ type: 'application/json', limit: '10mb' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
  origin: [
    'https://www.anupaatnivesh.com',
    'https://anupaatnivesh.com',
    'http://localhost:3000',
    'https://anupaat-nivesh.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-razorpay-signature']
}));

// Body parser middleware (skip for webhook to preserve raw body)
app.use((req, res, next) => {
  if (req.path === '/api/payments/webhook' && req.method === 'POST') {
    // Use raw body for webhook signature verification
    return rawBodyMiddleware(req, res, (err) => {
      if (err) return next(err);
      // Store raw body string BEFORE parsing (for signature verification)
      req.rawBody = req.body.toString();
      // Parse JSON from raw body and attach to req.body
      try {
        req.body = JSON.parse(req.rawBody);
      } catch (e) {
        return next(new Error('Invalid JSON in webhook body'));
      }
      next();
    });
  }
  // For all other routes, use JSON parser
  express.json({ limit: '10mb' })(req, res, next);
});

app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api/health', healthRouter);
app.use('/api/payments', paymentsRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'Backend server is running',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      payments: {
        createOrder: '/api/payments/create-order',
        verifyPayment: '/api/payments/verify-payment',
        webhook: '/api/payments/webhook'
      }
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server (only if not in Vercel environment)
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`🚀 Express server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  });
}

// Export for Vercel serverless
export default app;

