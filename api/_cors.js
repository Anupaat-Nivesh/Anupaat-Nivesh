/**
 * CORS Utility for Vercel Serverless Functions
 * Handles CORS headers for all API endpoints
 */

const ALLOWED_ORIGINS = [
  'https://anupaatnivesh.com',
  'https://www.anupaatnivesh.com',
  'http://localhost:3000' // For local development
];

/**
 * Set CORS headers on response
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
function setCorsHeaders(req, res) {
  const origin = req.headers.origin || req.headers.Origin;
  
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
  }
}

/**
 * Handle OPTIONS preflight request
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {boolean} True if OPTIONS was handled
 */
function handleOptions(req, res) {
  if (req.method === 'OPTIONS') {
    setCorsHeaders(req, res);
    res.status(204).end();
    return true;
  }
  return false;
}

module.exports = {
  setCorsHeaders,
  handleOptions,
  ALLOWED_ORIGINS
};

