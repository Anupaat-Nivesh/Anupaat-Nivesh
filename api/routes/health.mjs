/**
 * Health Check Route
 * Express-compatible route handler
 * Preserves original functionality from api/health.js
 */

import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    status: 'Backend is running',
    /** Helps debug split deploy (Hostinger → Vercel): should match your site’s browser origin */
    requestOrigin: req.headers.origin || null,
  });
});

export default router;

