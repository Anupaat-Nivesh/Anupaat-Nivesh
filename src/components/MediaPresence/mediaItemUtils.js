/**
 * Normalise photo URLs for gallery cards and the viewer.
 * Supports optional `photoUrls` (2+) from API/static data; otherwise single `thumbnail` / `url`.
 */
export function getPhotoUrls(item) {
    if (!item || item.type !== 'photo') return [];
    if (Array.isArray(item.photoUrls)) {
        const list = item.photoUrls.map((u) => (typeof u === 'string' ? u.trim() : '')).filter(Boolean);
        if (list.length) return list;
    }
    const primary = item.thumbnail || item.url;
    if (typeof primary === 'string' && primary.trim()) return [primary.trim()];
    return [];
}

export function isPhotoAlbum(item) {
    return item?.type === 'photo' && getPhotoUrls(item).length > 1;
}
