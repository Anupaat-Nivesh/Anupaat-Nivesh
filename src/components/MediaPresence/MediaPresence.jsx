import React, { useEffect, useMemo, useState } from 'react';

import MediaGallery from './MediaGallery';
import MediaViewerModal from './MediaViewerModal';
import mediaData from './mediaData';
import { mediaPublicList } from '../../api/mediaApi';

import './MediaPresence.css';

/**
 * MediaPresence
 *
 * Public homepage media gallery: Swiper (same behaviour stack as Testimonials); opens viewer on card tap.
 * Content is driven by `mediaData.js` (update via repo / internal admin tool).
 */
const MediaPresence = ({ items = mediaData }) => {
    const [activeItem, setActiveItem] = useState(null);
    const [liveItems, setLiveItems] = useState([]);
    const [didLoadLive, setDidLoadLive] = useState(false);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            try {
                const result = await mediaPublicList();
                if (!cancelled && Array.isArray(result) && result.length > 0) {
                    setLiveItems(result);
                }
            } catch {
                // Static fallback keeps homepage resilient.
            } finally {
                if (!cancelled) setDidLoadLive(true);
            }
        };
        load();
        return () => {
            cancelled = true;
        };
    }, []);

    const finalItems = useMemo(() => {
        if (liveItems.length > 0) return liveItems;
        if (didLoadLive) return items;
        return items;
    }, [didLoadLive, items, liveItems]);

    if (!finalItems.length) return null;

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

            <MediaGallery items={finalItems} onSelectItem={setActiveItem} />

            {activeItem && (
                <MediaViewerModal
                    item={activeItem}
                    items={finalItems}
                    onActiveItemChange={setActiveItem}
                    onClose={() => setActiveItem(null)}
                />
            )}
        </section>
    );
};

export default MediaPresence;
