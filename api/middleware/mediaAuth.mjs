import bcrypt from 'bcryptjs';

const SESSION_KEY = 'mediaAdmin';

function configuredUsername() {
  return String(process.env.MEDIA_ADMIN_USERNAME || '').trim();
}

function configuredPasswordHash() {
  return String(process.env.MEDIA_ADMIN_PASSWORD_HASH || '').trim();
}

export function isMediaAuthConfigured() {
  return Boolean(configuredUsername() && configuredPasswordHash() && process.env.MEDIA_SESSION_SECRET);
}

export async function verifyMediaCredentials(username, password) {
  const user = configuredUsername();
  const hash = configuredPasswordHash();
  if (!user || !hash) return false;
  if (String(username || '').trim() !== user) return false;
  return bcrypt.compare(String(password || ''), hash);
}

export function setMediaAuthSession(req) {
  req.session[SESSION_KEY] = {
    username: configuredUsername(),
    loginAt: Date.now()
  };
}

export function clearMediaAuthSession(req) {
  if (req.session) delete req.session[SESSION_KEY];
}

export function getMediaSession(req) {
  return req.session?.[SESSION_KEY] || null;
}

export function requireMediaAuth(req, res, next) {
  const session = getMediaSession(req);
  if (!session) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
  next();
}
