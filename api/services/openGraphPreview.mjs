/**
 * Best-effort Open Graph scrape for LinkedIn and X/Twitter URLs.
 * Platforms often return login or bot walls; callers should tolerate null previews.
 */

function decodeBasicEntities(raw) {
  return String(raw || '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function pickMeta(html, prop) {
  const esc = prop.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re1 = new RegExp(`<meta[^>]+property=["']${esc}["'][^>]+content=["']([^"']*)["']`, 'i');
  const re2 = new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+property=["']${esc}["']`, 'i');
  const m = html.match(re1) || html.match(re2);
  return m ? decodeBasicEntities(m[1]) : '';
}

function clip(s, max) {
  const t = String(s || '').trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd()}…`;
}

function assertPublicSocialUrl(raw) {
  const target = String(raw || '').trim();
  if (!target) return null;
  let href = target;
  if (!/^https?:\/\//i.test(href)) href = `https://${href}`;
  let u;
  try {
    u = new URL(href);
  } catch {
    return null;
  }
  if (u.protocol !== 'https:') return null;
  const h = u.hostname.replace(/^www\./, '').toLowerCase();
  const ok =
    h === 'linkedin.com' ||
    h.endsWith('.linkedin.com') ||
    h === 'x.com' ||
    h === 'twitter.com' ||
    h === 'mobile.x.com' ||
    h === 'mobile.twitter.com';
  if (!ok) return null;
  return u.toString();
}

/**
 * @returns {Promise<{ title: string, description: string, image: string } | null>}
 */
export async function fetchOpenGraphPreview(url) {
  const target = assertPublicSocialUrl(url);
  if (!target) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch(target, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    const html = await res.text();
    if (!html || html.length < 200) return null;

    let title = pickMeta(html, 'og:title').trim();
    title = title.replace(/\s*[\|\u2013-]\s*LinkedIn\s*$/i, '').trim();
    title = title.replace(/\s*[\|\u2013-]\s*X\s*(\(@[^)]+\))?\s*$/i, '').trim();
    const description = pickMeta(html, 'og:description').trim();
    const image = pickMeta(html, 'og:image').trim();

    if (!title && !description && !image) return null;
    return {
      title: title || '',
      description: description || '',
      image: image || ''
    };
  } catch {
    clearTimeout(timer);
    return null;
  }
}

export function mergeSocialPostDraftFromPreview({ draft, preview, purpose, platform }) {
  if (!preview) return draft;
  const next = { ...draft };
  const origin =
    platform === 'linkedin' ? 'LinkedIn' : platform === 'x' ? 'X' : 'the original post';

  if (preview.title) {
    const t = clip(preview.title, 280);
    if (t) next.title = t;
  }
  if (preview.description) {
    next.shortDescription = clip(preview.description, 318);
    const extra =
      platform === 'linkedin'
        ? 'For tables, examples, and the latest version of this piece, open the original on LinkedIn.'
        : `For full context, replies, and updates, open on ${origin}.`;
    next.articleContent = clip(`${preview.description.trim()}\n\n${extra}`, 3500);
    const purposeNote = purpose ? `\n\n— Editor note (from publish form): ${clip(purpose, 600)}` : '';
    next.inlineArticleContent = clip(`${preview.description.trim()}${purposeNote}`, 12000);
  }
  if (preview.image && /^https?:\/\//i.test(preview.image)) {
    next.thumbnail = clip(preview.image, 2000);
  }
  return next;
}
