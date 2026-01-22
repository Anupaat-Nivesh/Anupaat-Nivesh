export function applyCors(req, res) {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://www.anupaatnivesh.com"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return true;
  }

  return false;
}
