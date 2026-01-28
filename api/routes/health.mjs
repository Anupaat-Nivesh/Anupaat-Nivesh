/**
 * Health Check Route
 * Express-compatible route handler
 * Preserves original functionality from api/health.js
 */

import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({ status: 'Backend is running' });
});

export default router;

