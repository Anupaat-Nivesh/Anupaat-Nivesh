import React from 'react';
import {
    HiOutlinePlay,
    HiOutlineNewspaper,
    HiOutlinePhotograph,
    HiOutlineExternalLink,
    HiOutlineSpeakerphone,
} from 'react-icons/hi';

import { youtubeThumb } from './mediaData';

/**
 * Type → label + icon for the corner badge.
 * Centralised so the layout stays consistent across all media types.
 */
const TYPE_META = {
    youtube: {
        label: 'Video',
        icon: <HiOutlinePlay size={14} aria-hidden="true" />,
    },
    article: {
        label: 'Article',
        icon: <HiOutlineNewspaper size={14} aria-hidden="true" />,
    },
    news: {
        label: 'News',
        icon: <HiOutlineSpeakerphone size={14} aria-hidden="true" />,
    },
    photo: {
        label: 'Photo',
        icon: <HiOutlinePhotograph size={14} aria-hidden="true" />,
    },
};

/**
 * MediaCard
 *
 * Single reusable card that handles every media type defined in mediaData.js.
 * - YouTube + article + news: opens external link in a new tab.
 * - Photo: triggers the parent-supplied lightbox via `onPhotoClick`.
 *
 * The whole card is one tap target. We pick the wrapping element based on
 * intent: <a> for external, <button> for the lightbox, plain <div> when
 * there's no action.
 */
const MediaCard = ({ item, onPhotoClick }) => {
    const meta = TYPE_META[item.type] || TYPE_META.article;

    const thumbnail =
        item.thumbnail ||
        (item.type === 'youtube' ? youtubeThumb(item.videoId) : '');

    // Choose the wrapping element based on action affordance
    const isPhoto = item.type === 'photo';
    const hasExternalUrl = !isPhoto && item.url && item.url !== '#';

    const innerMarkup = (
        <>
            <div className="media-card__thumb-wrap">
                {thumbnail ? (
                    <img
                        src={thumbnail}
                        alt={item.title}
                        className="media-card__thumb"
                        loading="lazy"
                    />
                ) : (
                    <div className="media-card__thumb media-card__thumb--placeholder" aria-hidden="true" />
                )}

                {item.type === 'youtube' && (
                    <span className="media-card__play" aria-hidden="true">
                        <HiOutlinePlay size={28} />
                    </span>
                )}

                <span className={`media-card__badge media-card__badge--${item.type}`}>
                    {meta.icon}
                    <span>{meta.label}</span>
                </span>

                {hasExternalUrl && (
                    <span className="media-card__external" aria-hidden="true">
                        <HiOutlineExternalLink size={14} />
                    </span>
                )}
            </div>

            <div className="media-card__body">
                {item.source && <span className="media-card__source">{item.source}</span>}
                <h3 className="media-card__title">{item.title}</h3>
                {item.description && (
                    <p className="media-card__description">{item.description}</p>
                )}
            </div>
        </>
    );

    if (isPhoto) {
        return (
            <button
                type="button"
                className="media-card media-card--photo"
                onClick={() => onPhotoClick && onPhotoClick(item)}
                aria-label={`Open photo: ${item.title}`}
                data-aos="fade-up"
            >
                {innerMarkup}
            </button>
        );
    }

    if (hasExternalUrl) {
        return (
            <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="media-card"
                aria-label={`${meta.label}: ${item.title} (opens in new tab)`}
                data-aos="fade-up"
            >
                {innerMarkup}
            </a>
        );
    }

    return (
        <div className="media-card media-card--static" data-aos="fade-up">
            {innerMarkup}
        </div>
    );
};

export default MediaCard;
