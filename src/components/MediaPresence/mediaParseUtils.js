/**
 * Client-side parsing + editorial scaffolding for user-added media.
 * YouTube titles use oEmbed when the browser allows it; otherwise safe fallbacks.
 */

const IMAGE_URL_RE = /^https?:\/\/.+\.(png|jpe?g|webp|gif)(\?[^#]*)?$/i;
const YT_ID_RE = /^[a-zA-Z0-9_-]{11}$/;

export function isProbablyImageUrl(str) {
    const s = str?.trim();
    if (!s) return false;
    if (IMAGE_URL_RE.test(s)) return true;
    const withProto = /^https?:\/\//i.test(s) ? s : `https://${s}`;
    return IMAGE_URL_RE.test(withProto);
}

/**
 * @returns {{ videoId: string, isShort: boolean } | null}
 */
export function parseYoutubeInput(raw) {
    const trimmed = raw?.trim();
    if (!trimmed) return null;

    if (YT_ID_RE.test(trimmed)) {
        return { videoId: trimmed, isShort: false };
    }

    let href = trimmed;
    if (!/^https?:\/\//i.test(href)) {
        href = `https://${href}`;
    }

    try {
        const u = new URL(href);
        const host = u.hostname.replace(/^www\./, '');

        if (host === 'youtu.be') {
            const id = u.pathname.split('/').filter(Boolean)[0]?.split('?')[0];
            if (id && YT_ID_RE.test(id)) return { videoId: id, isShort: false };
        }

        if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'www.youtube.com') {
            if (u.pathname.startsWith('/shorts/')) {
                const id = u.pathname.split('/')[2]?.split('?')[0];
                if (id && YT_ID_RE.test(id)) return { videoId: id, isShort: true };
            }
            const v = u.searchParams.get('v');
            if (v && YT_ID_RE.test(v)) return { videoId: v, isShort: false };
            const embed = u.pathname.match(/^\/embed\/([^/?]+)/);
            if (embed?.[1] && YT_ID_RE.test(embed[1])) {
                return { videoId: embed[1], isShort: false };
            }
        }
    } catch {
        return null;
    }
    return null;
}

export async function fetchYoutubeOEmbed(pageUrl) {
    const endpoint = `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(pageUrl)}`;
    try {
        const res = await fetch(endpoint);
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}

function buildYoutubeCanonicalUrl(videoId, isShort) {
    if (isShort) return `https://www.youtube.com/shorts/${videoId}`;
    return `https://www.youtube.com/watch?v=${videoId}`;
}

/**
 * ~100–140 words editorial tone from available metadata (no remote LLM).
 */
export function generateEditorialCopy({ type, title, source, date, channelName }) {
    const headline = title?.trim() || 'Featured media';
    const src = source || 'Curated library';
    const when = date || 'Recent';
    const who = channelName || '';

    let shortDescription;
    if (type === 'youtubeShort') {
        shortDescription = `Short-form insight: ${headline.slice(0, 72)}${headline.length > 72 ? '…' : ''}`;
    } else if (type === 'youtube') {
        shortDescription = `Video moment — ${headline.slice(0, 70)}${headline.length > 70 ? '…' : ''}`;
    } else {
        shortDescription = `Visual proof point — ${headline.slice(0, 70)}${headline.length > 70 ? '…' : ''}`;
    }

    const articleIntro =
        type === 'youtubeShort'
            ? 'This vertical clip is designed for busy investors who want the thesis before the spreadsheet.'
            : type === 'youtube'
              ? 'This recording captures how we translate markets and behaviour into decisions clients can sustain.'
              : 'This still anchors a real moment—education, community, or coverage—that rarely fits inside a ticker.';

    const articleBody = who
        ? ` The piece is associated with ${who}, reinforcing credibility beyond our own voice.`
        : ' We keep it in the gallery because social proof should feel specific, not decorative.';

    const articleContent = `${articleIntro} ${articleBody} ${headline} sits in our ${src} line-up (${when}) as a reminder that wealth work happens in public rooms as well as private reviews. When you open the viewer, treat the narrative as context: what question were we answering, who was in the room, and what changed after. That discipline—story plus evidence—is how we prefer to earn attention in a noisy advice market. If something here sparks a parallel in your own plan, bring it to onboarding and we will map it to your goals, risk budget, and timeline without turning it into a product pitch. We archive these moments so prospective clients can see continuity between what we say in education channels and how we steward portfolios once mandates begin. The gallery is intentionally editorial: fewer headlines, more meaning per frame.`;

    return { shortDescription, articleContent: articleContent.trim(), title: headline };
}

export function newLocalId(prefix = 'user') {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return `${prefix}-${crypto.randomUUID()}`;
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function formatAddedDate() {
    try {
        return new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
        return 'Added';
    }
}

/**
 * @returns {Promise<object>} media item shape for gallery + viewer
 */
export async function buildMediaItemFromYoutubeUrl(rawUrl) {
    const parsed = parseYoutubeInput(rawUrl);
    if (!parsed) return null;

    const { videoId, isShort } = parsed;
    const canonical = buildYoutubeCanonicalUrl(videoId, isShort);
    const oembed = await fetchYoutubeOEmbed(canonical);
    const titleFromApi = oembed?.title?.trim();
    const channel = oembed?.author_name?.trim();

    const type = isShort ? 'youtubeShort' : 'youtube';
    const baseTitle = titleFromApi || (isShort ? 'YouTube Short' : 'YouTube video');
    const { shortDescription, articleContent, title } = generateEditorialCopy({
        type,
        title: baseTitle,
        source: channel || 'YouTube',
        date: formatAddedDate(),
        channelName: channel,
    });

    return {
        id: newLocalId('yt'),
        type,
        title,
        videoId,
        url: canonical,
        source: channel || 'YouTube',
        date: formatAddedDate(),
        shortDescription,
        articleContent,
    };
}

export function buildMediaItemFromImageUrl(url) {
    const trimmed = url?.trim();
    if (!trimmed) return null;
    const normalized = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    if (!isProbablyImageUrl(trimmed)) return null;

    const { shortDescription, articleContent, title } = generateEditorialCopy({
        type: 'photo',
        title: 'Linked image',
        source: 'Web image',
        date: formatAddedDate(),
    });

    return {
        id: newLocalId('img'),
        type: 'photo',
        title,
        thumbnail: normalized,
        url: normalized,
        source: 'Web image',
        date: formatAddedDate(),
        shortDescription,
        articleContent,
    };
}

export function buildMediaItemFromImageFile(file) {
    return new Promise((resolve, reject) => {
        if (!file || !file.type?.startsWith('image/')) {
            reject(new Error('Please choose an image file.'));
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = reader.result;
            const baseName = (file.name || 'upload').replace(/\.[^.]+$/, '') || 'Your upload';
            const { shortDescription, articleContent, title } = generateEditorialCopy({
                type: 'photo',
                title: baseName.replace(/[-_]+/g, ' '),
                source: 'Your upload',
                date: formatAddedDate(),
            });
            resolve({
                id: newLocalId('up'),
                type: 'photo',
                title,
                thumbnail: dataUrl,
                url: dataUrl,
                source: 'Your upload',
                date: formatAddedDate(),
                shortDescription,
                articleContent,
            });
        };
        reader.onerror = () => reject(new Error('Could not read the file.'));
        reader.readAsDataURL(file);
    });
}
