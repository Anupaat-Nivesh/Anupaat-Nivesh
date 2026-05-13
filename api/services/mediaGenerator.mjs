const YT_ID_RE = /^[a-zA-Z0-9_-]{11}$/;

function titleCase(input = '') {
  return String(input)
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

export function parseYoutubeInput(raw) {
  const trimmed = String(raw || '').trim();
  if (!trimmed) return null;

  if (YT_ID_RE.test(trimmed)) {
    return { videoId: trimmed, isShort: false };
  }

  let href = trimmed;
  if (!/^https?:\/\//i.test(href)) href = `https://${href}`;

  try {
    const u = new URL(href);
    const host = u.hostname.replace(/^www\./, '');

    if (host === 'youtu.be') {
      const id = u.pathname.split('/').filter(Boolean)[0]?.split('?')[0];
      if (id && YT_ID_RE.test(id)) return { videoId: id, isShort: false };
    }

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (u.pathname.startsWith('/shorts/')) {
        const id = u.pathname.split('/')[2]?.split('?')[0];
        if (id && YT_ID_RE.test(id)) return { videoId: id, isShort: true };
      }
      const v = u.searchParams.get('v');
      if (v && YT_ID_RE.test(v)) return { videoId: v, isShort: false };

      const embed = u.pathname.match(/^\/embed\/([^/?]+)/);
      if (embed?.[1] && YT_ID_RE.test(embed[1])) return { videoId: embed[1], isShort: false };
    }
  } catch {
    return null;
  }
  return null;
}

export function parseSocialPostUrl(raw) {
  const trimmed = String(raw || '').trim();
  if (!trimmed) return null;
  const href = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const u = new URL(href);
    const host = u.hostname.replace(/^www\./, '').toLowerCase();
    if (host === 'linkedin.com' || host.endsWith('.linkedin.com')) {
      return { platform: 'linkedin', url: u.toString() };
    }
    if (
      host === 'x.com' ||
      host === 'twitter.com' ||
      host === 'mobile.x.com' ||
      host === 'mobile.twitter.com'
    ) {
      return { platform: 'x', url: u.toString() };
    }
  } catch {
    return null;
  }
  return null;
}

export function isLikelyImageUrl(raw) {
  const trimmed = String(raw || '').trim();
  if (!trimmed) return false;
  const normalized = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  return /^https?:\/\/.+\.(png|jpe?g|webp|gif)(\?[^#]*)?$/i.test(normalized);
}

export async function fetchYoutubeOEmbed(pageUrl) {
  const endpoint = `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(pageUrl)}`;
  try {
    const response = await fetch(endpoint);
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

export function buildYoutubeCanonicalUrl(videoId, isShort = false) {
  if (isShort) return `https://www.youtube.com/shorts/${videoId}`;
  return `https://www.youtube.com/watch?v=${videoId}`;
}

function clip(input = '', max = 90) {
  const s = String(input || '').trim();
  if (s.length <= max) return s;
  return `${s.slice(0, max - 1).trimEnd()}…`;
}

function inferSourceLabel(type, source, socialPlatform) {
  if (source) return source;
  if (type === 'socialPost') {
    if (socialPlatform === 'linkedin') return 'LinkedIn';
    if (socialPlatform === 'x') return 'X';
    return 'Social';
  }
  if (type === 'youtubeShort') return 'YouTube Shorts';
  if (type === 'youtube') return 'YouTube';
  return 'Media';
}

export function generateEditorialCopy({
  type,
  title,
  source,
  date,
  purpose,
  channelName,
  photoCount,
  socialPlatform
}) {
  const normalizedType = type || 'photo';
  const headline = titleCase(title || (normalizedType === 'youtubeShort' ? 'YouTube Short' : 'Media Feature'));
  const when = date || new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
  const src = inferSourceLabel(normalizedType, source, socialPlatform);
  const objective = clip(purpose || 'Investor awareness and confidence building', 120);
  const who = channelName ? `in collaboration with ${channelName}` : 'through our investor communication channels';
  const multiPhotos = normalizedType === 'photo' && Number(photoCount) > 1;

  const shortDescription = multiPhotos
    ? `${Number(photoCount)} photos — ${clip(headline, 72)}`
    : normalizedType === 'socialPost'
      ? `${socialPlatform === 'x' ? 'X post' : 'LinkedIn article'} — ${clip(headline, 68)}`
      : normalizedType === 'youtubeShort'
        ? `Quick market insight: ${clip(headline, 70)}`
        : normalizedType === 'youtube'
          ? `Deep-dive video: ${clip(headline, 70)}`
          : `Event snapshot: ${clip(headline, 70)}`;

  const starter = multiPhotos
    ? 'This short sequence of frames belongs to one moment—so the story reads with context, not a single cropped highlight.'
    : normalizedType === 'socialPost'
      ? 'This entry links to a public post or article we want clients and prospects to read in full on the native platform—context, tone, and thread intact.'
      : normalizedType === 'youtubeShort'
        ? 'This short clip distills one practical investment takeaway for busy professionals.'
        : normalizedType === 'youtube'
          ? 'This long-form media appearance explains the discipline behind our advisory process.'
          : normalizedType === 'videoFile'
            ? 'This recorded moment captures a real client-facing conversation from the field.'
            : 'This visual captures a meaningful investor education or community touchpoint.';

  const articleContent = `${starter} It was published under ${src} (${when}) ${who}. The intent behind this piece is clear: ${objective}. Instead of generic commentary, the narrative links market context to actionable behaviour—how to stay consistent, manage risk honestly, and make decisions that match real goals. We include this in the gallery as evidence of operating rhythm, not just promotion: regular education, transparent communication, and continuity between what we teach publicly and how we manage private mandates. If this topic maps to your own journey, use it as a conversation starter during onboarding so we can translate the same framework into a plan aligned with your timeline, liquidity needs, and risk comfort.`;

  return {
    title: headline,
    shortDescription,
    articleContent: articleContent.trim()
  };
}
