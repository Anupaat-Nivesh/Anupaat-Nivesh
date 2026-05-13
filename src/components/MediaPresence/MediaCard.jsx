import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { HiOutlineExternalLink, HiOutlinePhotograph, HiOutlinePlay } from 'react-icons/hi';

import { youtubeThumb } from './mediaData';
import { getPhotoUrls } from './mediaItemUtils';
import { inferSocialPlatform } from './socialLinkUtils';

const TYPE_META = {
    youtube: {
        label: 'Video',
        icon: <HiOutlinePlay size={14} aria-hidden="true" />,
    },
    youtubeShort: {
        label: 'Short',
        icon: <HiOutlinePlay size={14} aria-hidden="true" />,
    },
    photo: {
        label: 'Photo',
        icon: <HiOutlinePhotograph size={14} aria-hidden="true" />,
    },
    socialPost: {
        label: 'Social',
        icon: <HiOutlineExternalLink size={14} aria-hidden="true" />,
    },
};

/**
 * MediaCard — gallery thumbnail: visual-first, minimal copy.
 * Opens the parent viewer via `onItemClick` for all supported types.
 */
const MediaCard = ({ item, onItemClick }) => {
    /** When natural aspect is tall, bias `object-fit: cover` toward the top (faces). */
    const [autoPortraitCrop, setAutoPortraitCrop] = useState(false);

    useEffect(() => {
        setAutoPortraitCrop(false);
    }, [item.id]);

    const photoUrls = getPhotoUrls(item);
    const multiPhoto = item.type === 'photo' && photoUrls.length > 1;
    const socialPlatform = item.type === 'socialPost' ? inferSocialPlatform(item.url || '') : null;
    const baseMeta = TYPE_META[item.type] || TYPE_META.photo;
    const meta =
        multiPhoto
            ? { label: 'Album', icon: baseMeta.icon }
            : item.type === 'socialPost' && socialPlatform === 'linkedin'
              ? { label: 'LinkedIn', icon: <HiOutlineExternalLink size={14} aria-hidden="true" /> }
              : item.type === 'socialPost' && socialPlatform === 'x'
                ? { label: 'X', icon: <HiOutlineExternalLink size={14} aria-hidden="true" /> }
                : item.type === 'socialPost'
                  ? { label: 'Social', icon: TYPE_META.socialPost.icon }
                  : baseMeta;

    const thumbnail =
        item.thumbnail ||
        (item.type === 'youtube' || item.type === 'youtubeShort' ? youtubeThumb(item.videoId) : '') ||
        (item.type === 'photo' ? item.url || '' : '');

    const showPlay = item.type === 'youtube' || item.type === 'youtubeShort';
    const snippet = item.shortDescription;

    const isSocialOgPreview =
        item.type === 'socialPost' &&
        Boolean(thumbnail) &&
        /^https?:\/\//i.test(String(thumbnail));

    const socialThumbClass =
        item.type === 'socialPost' && !item.thumbnail
            ? socialPlatform === 'linkedin'
                ? 'media-card__thumb-wrap--social media-card__thumb-wrap--social-linkedin'
                : socialPlatform === 'x'
                  ? 'media-card__thumb-wrap--social media-card__thumb-wrap--social-x'
                  : 'media-card__thumb-wrap--social media-card__thumb-wrap--social-generic'
            : '';

    const handleActivate = () => {
        if (onItemClick) onItemClick(item);
    };

    const thumbFocus = item.thumbFocus;

    const singleThumbClassName = useMemo(() => {
        const parts = ['media-card__thumb'];
        if (thumbFocus === 'top') parts.push('media-card__thumb--focus-top');
        else if (thumbFocus === 'bottom') parts.push('media-card__thumb--focus-bottom');
        else if (thumbFocus === 'center') parts.push('media-card__thumb--focus-center');
        else if (autoPortraitCrop) parts.push('media-card__thumb--focus-portrait-auto');
        return parts.join(' ');
    }, [thumbFocus, autoPortraitCrop]);

    const onSingleImageLoad = useCallback(
        (e) => {
            if (multiPhoto || thumbFocus) return;
            const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
            if (!w || !h) return;
            const tall = h / w > 1.08;
            setAutoPortraitCrop((prev) => (prev === tall ? prev : tall));
        },
        [multiPhoto, thumbFocus]
    );

    const innerMarkup = (
        <>
            <div
                className={
                    multiPhoto
                        ? 'media-card__thumb-wrap media-card__thumb-wrap--stack'
                        : isSocialOgPreview
                          ? 'media-card__thumb-wrap media-card__thumb-wrap--social-preview'
                          : socialThumbClass
                            ? `media-card__thumb-wrap ${socialThumbClass}`
                            : 'media-card__thumb-wrap'
                }
            >
                {multiPhoto ? (
                    <>
                        {photoUrls.slice(0, 3).map((src, i) => {
                            const focusCls =
                                thumbFocus === 'top'
                                    ? ' media-card__thumb--focus-top'
                                    : thumbFocus === 'bottom'
                                      ? ' media-card__thumb--focus-bottom'
                                      : thumbFocus === 'center'
                                        ? ' media-card__thumb--focus-center'
                                        : '';
                            return (
                                <div
                                    key={`${src}-${i}`}
                                    className={`media-card__stack-cell media-card__stack-cell--${i}`}
                                >
                                    <img
                                        src={src}
                                        alt=""
                                        className={`media-card__thumb media-card__thumb--stack-inner${focusCls}`}
                                        loading="lazy"
                                    />
                                </div>
                            );
                        })}
                        <span className="media-card__stack-pill" aria-hidden="true">
                            {photoUrls.length}
                        </span>
                    </>
                ) : thumbnail ? (
                    <img
                        src={thumbnail}
                        alt=""
                        className={singleThumbClassName}
                        loading="lazy"
                        onLoad={onSingleImageLoad}
                    />
                ) : item.type === 'socialPost' ? (
                    <span className="media-card__social-placeholder" aria-hidden="true">
                        <HiOutlineExternalLink size={44} />
                    </span>
                ) : (
                    <div className="media-card__thumb media-card__thumb--placeholder" aria-hidden="true" />
                )}

                {showPlay && (
                    <span className="media-card__play" aria-hidden="true">
                        <HiOutlinePlay size={28} />
                    </span>
                )}

                <span
                    className={`media-card__badge media-card__badge--${item.type}${
                        item.type === 'socialPost' && socialPlatform === 'x' ? ' media-card__badge--social-x' : ''
                    }`}
                >
                    {meta.icon}
                    <span>{meta.label}</span>
                </span>
            </div>

            <div className="media-card__body">
                {item.source && <span className="media-card__source">{item.source}</span>}
                <h3 className="media-card__title">{item.title}</h3>
                {snippet && (
                    <p className="media-card__snippet">{snippet}</p>
                )}
            </div>
        </>
    );

    if (!onItemClick) {
        return (
            <div className="media-card media-card--static" data-aos="fade-up">
                {innerMarkup}
            </div>
        );
    }

    return (
        <button
            type="button"
            className="media-card media-card--interactive"
            onClick={handleActivate}
            aria-label={`Open ${meta.label}: ${item.title}`}
            data-aos="fade-up"
        >
            {innerMarkup}
        </button>
    );
};

export default MediaCard;
