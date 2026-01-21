/**
 * Health Check Endpoint
 * Vercel Serverless Function
 */

const { setCorsHeaders, handleOptions } = require('./_cors');

module.exports = async (req, res) => {
  // Handle OPTIONS preflight
  if (handleOptions(req, res)) {
    return;
  }

  // Set CORS headers
  setCorsHeaders(req, res);

  // Return health status
  res.status(200).json({
    status: 'Backend is running',
    timestamp: new Date().toISOString(),
    service: 'Anupaat Nivesh API'
  });
};

