import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';

import MediaCard from './MediaCard';

function usePrefersReducedMotion() {
    const [reduced, setReduced] = useState(() => {
        if (typeof window === 'undefined' || !window.matchMedia) return false;
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    });

    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        const onChange = () => setReduced(mq.matches);
        mq.addEventListener('change', onChange);
        return () => mq.removeEventListener('change', onChange);
    }, []);

    return reduced;
}

const PAGINATION_BAR_CLASS = 'media-presence__swiper-pagination-bar';

/**
 * Featured media — Swiper: centered active slide, tap side card to center first,
 * pagination bar centered; smooth slide motion (no coverflow) for a cleaner modern feel.
 */
const MediaGallery = ({ items, onSelectItem }) => {
    const reducedMotion = usePrefersReducedMotion();
    const list = useMemo(() => (items?.length ? items : []), [items]);
    const listKey = useMemo(() => list.map((it) => it.id).join('|'), [list]);
    const swiperRef = useRef(null);

    const loopEnabled = list.length > 1;

    const handleSlideActivateClick = useCallback(
        (index) => {
            return (e) => {
                const sw = swiperRef.current;
                if (!sw || sw.destroyed) return;
                const realIdx = typeof sw.realIndex === 'number' ? sw.realIndex : sw.activeIndex;
                if (realIdx === index) return;
                e.preventDefault();
                e.stopPropagation();
                if (loopEnabled && typeof sw.slideToLoop === 'function') {
                    sw.slideToLoop(index);
                } else {
                    sw.slideTo(index);
                }
            };
        },
        [loopEnabled]
    );

    if (!list.length) return null;

    return (
        <div className="media-presence__gallery-wrap">
            <div className="media-presence__swiper-shell">
                <Swiper
                    key={listKey}
                    className="media-presence__swiper"
                    modules={[Pagination, Autoplay]}
                    slidesPerView="auto"
                    centeredSlides
                    centeredSlidesBounds={!loopEnabled}
                    spaceBetween={24}
                    loop={loopEnabled}
                    loopAdditionalSlides={loopEnabled ? Math.min(list.length, 3) : 0}
                    speed={reducedMotion ? 400 : 720}
                    watchOverflow={!loopEnabled}
                    slideToClickedSlide
                    grabCursor
                    navigation={false}
                    onSwiper={(instance) => {
                        swiperRef.current = instance;
                    }}
                    autoplay={
                        reducedMotion
                            ? false
                            : {
                                  delay: 3200,
                                  disableOnInteraction: false,
                                  pauseOnMouseEnter: true,
                              }
                    }
                    pagination={{
                        clickable: true,
                        dynamicBullets: list.length > 8,
                        horizontalClass: PAGINATION_BAR_CLASS,
                    }}
                >
                    {list.map((item, index) => (
                        <SwiperSlide key={item.id} className="media-presence__swiper-slide">
                            <div
                                className="media-presence__swiper-slide-scaler"
                                onClickCapture={handleSlideActivateClick(index)}
                            >
                                <MediaCard item={item} onItemClick={onSelectItem} />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default MediaGallery;
