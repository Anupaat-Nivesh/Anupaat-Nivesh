/**
 * Detect LinkedIn / X (Twitter) URLs for gallery items of type `socialPost`.
 */

export function inferSocialPlatform(url) {
    const raw = String(url || '').trim();
    if (!raw) return null;
    try {
        const normalized = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
        const u = new URL(normalized);
        const host = u.hostname.replace(/^www\./, '').toLowerCase();
        if (host === 'linkedin.com' || host.endsWith('.linkedin.com')) return 'linkedin';
        if (host === 'x.com' || host === 'twitter.com' || host === 'mobile.x.com' || host === 'mobile.twitter.com') {
            return 'x';
        }
    } catch {
        return null;
    }
    return null;
}

/**
 * Numeric status id from an X / Twitter post URL, for optional embed iframe.
 * @returns {string | null}
 */
export function parseXStatusId(raw) {
    const str = String(raw || '').trim();
    if (!str) return null;
    try {
        const normalized = /^https?:\/\//i.test(str) ? str : `https://${str}`;
        const u = new URL(normalized);
        const host = u.hostname.replace(/^www\./, '').toLowerCase();
        if (!['x.com', 'twitter.com', 'mobile.x.com', 'mobile.twitter.com'].includes(host)) return null;
        const parts = u.pathname.split('/').filter(Boolean);
        const si = parts.indexOf('status');
        if (si < 0) return null;
        const id = parts[si + 1]?.split('?')[0];
        return id && /^\d{5,32}$/.test(id) ? id : null;
    } catch {
        return null;
    }
}
