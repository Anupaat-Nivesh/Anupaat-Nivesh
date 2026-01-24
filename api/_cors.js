const ALLOWED_ORIGINS = [
  'https://www.anupaatnivesh.com',
  'https://anupaatnivesh.com',
  'http://localhost:3000',
  'https://anupaat-nivesh.vercel.app' // Allow Vercel domain
];

export function applyCors(req, res) {
  const origin = req.headers.origin || req.headers.Origin;
  
  // Check if origin is allowed
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else if (!origin) {
    // Allow requests with no origin (like curl, Postman)
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
  
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return true;
  }

  return false;
}
