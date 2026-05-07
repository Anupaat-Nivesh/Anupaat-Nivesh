import React, { useCallback, useEffect, useState } from 'react';
import { HiX } from 'react-icons/hi';

import MediaCard from './MediaCard';
import mediaData from './mediaData';

import './MediaPresence.css';

/**
 * MediaPresence
 *
 * Modern social-proof grid that surfaces media coverage, videos, articles
 * and event photos. Data lives entirely in `mediaData.js` so adding or
 * removing items requires no markup changes.
 *
 * UX:
 *  - Desktop / tablet: responsive masonry-feel grid.
 *  - Mobile:           horizontal snap scroller — minimal scrolling fatigue.
 *  - Photo cards:      open in a lightweight, accessible lightbox modal.
 *  - Video / article:  open in a new tab (no embedded iframes for perf).
 */
const MediaPresence = ({ items = mediaData }) => {
    const [activePhoto, setActivePhoto] = useState(null);

    const handlePhotoOpen = useCallback((item) => setActivePhoto(item), []);
    const handlePhotoClose = useCallback(() => setActivePhoto(null), []);

    // Lock background scroll + close on ESC while the lightbox is open
    useEffect(() => {
        if (!activePhoto) return undefined;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const onKey = (event) => {
            if (event.key === 'Escape') handlePhotoClose();
        };
        document.addEventListener('keydown', onKey);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', onKey);
        };
    }, [activePhoto, handlePhotoClose]);

    if (!items.length) return null;

    return (
        <section
            className="media-presence section__padding section__margin"
            aria-labelledby="media-presence-title"
        >
            <div className="media-presence__header" data-aos="fade-up">
                <span className="media-presence__eyebrow">Featured &amp; Trusted</span>
                <h2 id="media-presence-title">
                    As Seen Across <span className="section-heading-focus">Platforms</span>
                </h2>
                <p className="media-presence__lede">
                    Education, media coverage and on-ground events that build investor confidence.
                </p>
            </div>

            <ul className="media-presence__grid">
                {items.map((item) => (
                    <li key={item.id} className="media-presence__item">
                        <MediaCard item={item} onPhotoClick={handlePhotoOpen} />
                    </li>
                ))}
            </ul>

            {activePhoto && (
                <div
                    className="media-lightbox"
                    role="dialog"
                    aria-modal="true"
                    aria-label={activePhoto.title}
                    onClick={handlePhotoClose}
                >
                    <button
                        type="button"
                        className="media-lightbox__close"
                        onClick={handlePhotoClose}
                        aria-label="Close photo"
                    >
                        <HiX size={22} />
                    </button>
                    <figure
                        className="media-lightbox__figure"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <img
                            src={activePhoto.thumbnail}
                            alt={activePhoto.title}
                            className="media-lightbox__image"
                        />
                        <figcaption className="media-lightbox__caption">
                            <strong>{activePhoto.title}</strong>
                            {activePhoto.description && <span>{activePhoto.description}</span>}
                        </figcaption>
                    </figure>
                </div>
            )}
        </section>
    );
};

export default MediaPresence;
