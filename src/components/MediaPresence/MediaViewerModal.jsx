import React, { useCallback, useEffect, useId, useMemo, useRef } from 'react';
import { HiChevronLeft, HiChevronRight, HiOutlineExternalLink, HiX } from 'react-icons/hi';

import { youtubeThumb } from './mediaData';
import { getPhotoUrls } from './mediaItemUtils';
import { inferSocialPlatform, parseXStatusId } from './socialLinkUtils';

import './MediaViewerModal.css';

const embedParams = 'rel=0&modestbranding=1';

const buildYoutubeEmbedSrc = (videoId) =>
    videoId ? `https://www.youtube.com/embed/${videoId}?${embedParams}` : '';

/**
 * LinkedIn / X — left column: optional X embed (public posts) or clickable OG image, plus direct link.
 * Full copy stays in the right-hand article column (`articleContent`). LinkedIn does not allow a
 * reliable in-page embed for arbitrary Pulse/article URLs; users open the official post instead.
 */
const SocialPostMediaPane = ({ item }) => {
    const href = String(item.url || '').trim();
    const platform = inferSocialPlatform(href);
    const tweetId = platform === 'x' ? parseXStatusId(href) : null;
    const previewImg = String(item.thumbnail || '').trim();
    const showOgImg = /^https?:\/\//i.test(previewImg);

    const ctaLabel =
        platform === 'linkedin' ? 'Open on LinkedIn' : platform === 'x' ? 'Open post on X' : 'Open link';

    if (!href) {
        return <div className="media-viewer__media-fallback" role="status" />;
    }

    let displayUrl = href;
    try {
        const u = new URL(/^https?:\/\//i.test(href) ? href : `https://${href}`);
        displayUrl = `${u.hostname}${u.pathname.length > 48 ? `${u.pathname.slice(0, 44)}…` : u.pathname}`;
    } catch {
        /* keep full href */
    }

    return (
        <div className="media-viewer__social-post-pane">
            {tweetId ? (
                <div className="media-viewer__x-embed-shell">
                    <iframe
                        title="Embedded X post"
                        className="media-viewer__x-embed-frame"
                        src={`https://platform.twitter.com/embed/Tweet.html?id=${encodeURIComponent(
                            tweetId
                        )}&theme=dark&dnt=true`}
                        loading="lazy"
                        referrerPolicy="strict-origin-when-cross-origin"
                    />
                </div>
            ) : showOgImg ? (
                <a
                    className="media-viewer__social-hero-link"
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${ctaLabel} (preview image)`}
                >
                    <div className="media-viewer__og-preview-frame media-viewer__og-preview-frame--social-hero">
                        <img src={previewImg} alt="" className="media-viewer__og-preview-img" decoding="async" />
                    </div>
                </a>
            ) : (
                <div className="media-viewer__social-post-placeholder" aria-hidden="true" />
            )}

            <div className="media-viewer__social-post-actions">
                <a
                    href={href}
                    className={`media-viewer__social-post-cta media-viewer__social-post-cta--${platform || 'generic'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <HiOutlineExternalLink size={22} aria-hidden="true" />
                    <span>{ctaLabel}</span>
                </a>
                <p className="media-viewer__social-post-url" title={href}>
                    {displayUrl}
                </p>
            </div>
        </div>
    );
};

/**
 * Renders the primary media surface (YouTube, Short, image, or horizontal photo album).
 */
const MediaPane = ({ item }) => {
    const railRef = useRef(null);
    const albumWrapRef = useRef(null);
    const albumPausedRef = useRef(false);
    const urls = useMemo(() => getPhotoUrls(item), [item]);

    const thumb =
        item.thumbnail ||
        (item.type === 'youtube' || item.type === 'youtubeShort'
            ? youtubeThumb(item.videoId)
            : urls[0] || '');

    const slideStep = useCallback(() => {
        const rail = railRef.current;
        const fig = rail?.querySelector('.media-viewer__photo-figure');
        if (fig && rail) {
            const gap = 12;
            return fig.offsetWidth + gap;
        }
        return Math.max(280, Math.floor((rail?.clientWidth || 320) * 0.88));
    }, []);

    const scrollAlbum = useCallback(
        (dir) => {
            const el = railRef.current;
            if (!el) return;
            const atStart = el.scrollLeft <= 8;
            const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
            if (dir < 0 && atStart) {
                el.scrollTo({ left: Math.max(0, el.scrollWidth - el.clientWidth), behavior: 'smooth' });
                return;
            }
            if (dir > 0 && atEnd) {
                el.scrollTo({ left: 0, behavior: 'smooth' });
                return;
            }
            el.scrollBy({ left: dir * slideStep(), behavior: 'smooth' });
        },
        [slideStep]
    );

    useEffect(() => {
        if (item.type !== 'photo' || urls.length <= 1) return undefined;
        const el = railRef.current;
        if (el) el.scrollLeft = 0;
        return undefined;
    }, [item.id, item.type, urls.length]);

    useEffect(() => {
        if (item.type !== 'photo' || urls.length <= 1) return undefined;
        if (typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return undefined;
        }

        const wrap = albumWrapRef.current;
        if (!wrap) return undefined;

        const setPaused = (v) => {
            albumPausedRef.current = v;
        };
        const onEnter = () => setPaused(true);
        const onLeave = () => setPaused(false);
        const onFocusIn = () => setPaused(true);
        const onFocusOut = (e) => {
            if (!wrap.contains(e.relatedTarget)) setPaused(false);
        };

        wrap.addEventListener('mouseenter', onEnter);
        wrap.addEventListener('mouseleave', onLeave);
        wrap.addEventListener('focusin', onFocusIn);
        wrap.addEventListener('focusout', onFocusOut);

        const tick = () => {
            if (albumPausedRef.current) return;
            const el = railRef.current;
            if (!el) return;
            const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
            if (atEnd) {
                el.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                const fig = el.querySelector('.media-viewer__photo-figure');
                const gap = 12;
                const step = fig ? fig.offsetWidth + gap : Math.max(280, Math.floor(el.clientWidth * 0.88));
                el.scrollBy({ left: step, behavior: 'smooth' });
            }
        };

        const id = window.setInterval(tick, 2000);

        return () => {
            window.clearInterval(id);
            wrap.removeEventListener('mouseenter', onEnter);
            wrap.removeEventListener('mouseleave', onLeave);
            wrap.removeEventListener('focusin', onFocusIn);
            wrap.removeEventListener('focusout', onFocusOut);
        };
    }, [item.id, item.type, urls.length]);

    useEffect(() => {
        if (item.type !== 'photo' || urls.length <= 1) return undefined;
        const el = railRef.current;
        if (!el) return undefined;
        const onKey = (event) => {
            if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
            event.preventDefault();
            scrollAlbum(event.key === 'ArrowRight' ? 1 : -1);
        };
        el.addEventListener('keydown', onKey);
        return () => el.removeEventListener('keydown', onKey);
    }, [item.type, urls.length, scrollAlbum]);

    if (item.type === 'socialPost') {
        return <SocialPostMediaPane item={item} />;
    }

    if (item.type === 'youtube' || item.type === 'youtubeShort') {
        const src = buildYoutubeEmbedSrc(item.videoId);
        if (!src) {
            return <div className="media-viewer__media-fallback" role="status" />;
        }
        const isShort = item.type === 'youtubeShort';
        return (
            <div
                className={
                    isShort
                        ? 'media-viewer__embed media-viewer__embed--short'
                        : 'media-viewer__embed media-viewer__embed--video'
                }
            >
                <iframe
                    src={src}
                    title={item.title}
                    className="media-viewer__iframe"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                />
            </div>
        );
    }

    if (item.type === 'photo' && urls.length > 1) {
        return (
            <div ref={albumWrapRef} className="media-viewer__photo-rail-wrap">
                <div className="media-viewer__photo-carousel">
                    <div
                        ref={railRef}
                        className="media-viewer__photo-rail"
                        tabIndex={0}
                        role="region"
                        aria-label={`${item.title} — ${urls.length} photos in this album. Scroll horizontally or use the album controls below.`}
                    >
                        <div className="media-viewer__photo-track">
                            {urls.map((src, i) => (
                                <figure key={`${src}-${i}`} className="media-viewer__photo-figure">
                                    <img
                                        src={src}
                                        alt={`${item.title} — ${i + 1} of ${urls.length}`}
                                        className="media-viewer__image media-viewer__image--slide"
                                        decoding="async"
                                    />
                                </figure>
                            ))}
                        </div>
                    </div>
                    <div className="media-viewer__album-controls" role="group" aria-label="Album photo controls">
                        <p className="media-viewer__album-controls-kicker">This album</p>
                        <div className="media-viewer__album-controls-row">
                            <button
                                type="button"
                                className="media-viewer__photo-arrow media-viewer__photo-arrow--album media-viewer__photo-arrow--prev"
                                aria-label="Previous photo in this album"
                                onClick={() => scrollAlbum(-1)}
                            >
                                <HiChevronLeft className="media-viewer__photo-arrow-icon" size={28} aria-hidden="true" />
                            </button>
                            <span className="media-viewer__album-controls-meta">
                                <span className="media-viewer__album-controls-meta-count">{urls.length} photos</span>
                                <span className="media-viewer__album-controls-meta-autoplay">
                                    {' '}
                                    · auto every 2s (pauses on hover or focus)
                                </span>
                            </span>
                            <button
                                type="button"
                                className="media-viewer__photo-arrow media-viewer__photo-arrow--album media-viewer__photo-arrow--next"
                                aria-label="Next photo in this album"
                                onClick={() => scrollAlbum(1)}
                            >
                                <HiChevronRight className="media-viewer__photo-arrow-icon" size={28} aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (item.type === 'photo' && thumb) {
        return (
            <div className="media-viewer__image-wrap">
                <img src={thumb} alt={item.title} className="media-viewer__image" decoding="async" />
            </div>
        );
    }

    return <div className="media-viewer__media-fallback" role="status" />;
};

/**
 * MediaViewerModal — split layout viewer with keyboard support and focus management.
 */
const MediaViewerModal = ({ item, items, onActiveItemChange, onClose }) => {
    const titleId = useId();
    const closeRef = useRef(null);
    const panelRef = useRef(null);

    const list = useMemo(() => (Array.isArray(items) && items.length ? items : item ? [item] : []), [items, item]);

    const activeIndex = useMemo(() => list.findIndex((x) => x.id === item?.id), [list, item?.id]);

    const showItemNav = list.length > 1 && typeof onActiveItemChange === 'function';

    const goPrevItem = useCallback(() => {
        if (!onActiveItemChange || list.length < 2) return;
        const i = activeIndex >= 0 ? activeIndex : 0;
        const prev = i <= 0 ? list[list.length - 1] : list[i - 1];
        onActiveItemChange(prev);
    }, [activeIndex, list, onActiveItemChange]);

    const goNextItem = useCallback(() => {
        if (!onActiveItemChange || list.length < 2) return;
        const i = activeIndex >= 0 ? activeIndex : 0;
        const next = i >= list.length - 1 ? list[0] : list[i + 1];
        onActiveItemChange(next);
    }, [activeIndex, list, onActiveItemChange]);

    const handleKeyDown = useCallback(
        (event) => {
            if (event.key !== 'Tab' || !panelRef.current) return;

            const selector =
                'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
            const nodes = [...panelRef.current.querySelectorAll(selector)].filter(
                (el) => el.offsetParent !== null || el === document.activeElement
            );
            if (nodes.length === 0) return;

            const first = nodes[0];
            const last = nodes[nodes.length - 1];

            if (event.shiftKey) {
                if (document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                }
            } else if (document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        },
        []
    );

    useEffect(() => {
        if (!item) return undefined;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const onDocKey = (event) => {
            if (event.key === 'Escape') {
                onClose();
                return;
            }
            if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

            const target = event.target;
            if (target && typeof target.closest === 'function') {
                if (target.closest('.media-viewer__photo-rail')) return;
                if (target.closest('.media-viewer__album-controls')) return;
                if (target.closest('input, textarea, select, [contenteditable="true"]')) return;
            }

            if (!showItemNav) return;

            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                goPrevItem();
            } else if (event.key === 'ArrowRight') {
                event.preventDefault();
                goNextItem();
            }
        };
        document.addEventListener('keydown', onDocKey);

        const t = window.setTimeout(() => {
            closeRef.current?.focus();
        }, 0);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', onDocKey);
            window.clearTimeout(t);
        };
    }, [goNextItem, goPrevItem, item, onClose, showItemNav]);

    if (!item) return null;

    const article =
        item.articleContent ||
        item.description ||
        'Context for this appearance will appear here as our media library grows.';

    return (
        <div className="media-viewer" role="presentation">
            <div className="media-viewer__backdrop" onClick={onClose} aria-hidden="true" />

            <div
                ref={panelRef}
                className="media-viewer__panel"
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={handleKeyDown}
            >
                <button
                    ref={closeRef}
                    type="button"
                    className="media-viewer__close"
                    onClick={onClose}
                    aria-label="Close media viewer"
                >
                    <HiX className="media-viewer__close-icon" size={34} aria-hidden="true" />
                </button>

                <div className="media-viewer__split">
                    <div className="media-viewer__media-col">
                        {showItemNav && (
                            <>
                                <button
                                    type="button"
                                    className="media-viewer__item-nav media-viewer__item-nav--prev"
                                    onClick={goPrevItem}
                                    aria-label="Previous media item (loops to last)"
                                >
                                    <HiChevronLeft
                                        className="media-viewer__item-nav-icon"
                                        size={36}
                                        aria-hidden="true"
                                    />
                                </button>
                                <button
                                    type="button"
                                    className="media-viewer__item-nav media-viewer__item-nav--next"
                                    onClick={goNextItem}
                                    aria-label="Next media item (loops to first)"
                                >
                                    <HiChevronRight
                                        className="media-viewer__item-nav-icon"
                                        size={36}
                                        aria-hidden="true"
                                    />
                                </button>
                            </>
                        )}
                        <MediaPane item={item} />
                    </div>

                    <div className="media-viewer__article-col">
                        <header className="media-viewer__article-head">
                            <h2 id={titleId} className="media-viewer__title">
                                {item.title}
                            </h2>
                            {(item.source || item.date) && (
                                <p className="media-viewer__meta">
                                    {item.source}
                                    {item.source && item.date ? ' · ' : ''}
                                    {item.date}
                                </p>
                            )}
                        </header>
                        <div className="media-viewer__article-body">
                            <p className="media-viewer__article-text">{article}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MediaViewerModal;
