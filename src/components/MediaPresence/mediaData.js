/**
 * mediaData.js
 *
 * Central data source for the homepage "Media Presence" section.
 * Designed so non-engineers can add / remove items by editing this file only —
 * no markup changes required.
 *
 * Item shape:
 *   {
 *     id:          string  (required, unique)
 *     type:        'youtube' | 'article' | 'photo' | 'news'   (required)
 *     title:       string  (required)
 *     description: string  (optional, short caption)
 *     url:         string  (optional, external link — opens new tab)
 *     thumbnail:   string  (optional — required for article/photo/news;
 *                           for 'youtube' the videoId auto-resolves the thumb
 *                           if no thumbnail is supplied)
 *     videoId:     string  (required for 'youtube' — the 11-char YT id)
 *     source:      string  (optional, displayed as a badge — e.g. publisher)
 *     date:        string  (optional, free-form, e.g. 'Aug 2024')
 *   }
 *
 * Replace the seeded items below with real coverage. Local placeholder
 * thumbnails are pulled from existing site assets so the section renders
 * out of the box.
 */

import carousel1 from '../../assets/illustrations/carousel1-illustration.webp';
import carousel2 from '../../assets/illustrations/carousel2-illustration.webp';
import carousel3 from '../../assets/illustrations/carousel3-illustration.webp';
import carousel4 from '../../assets/illustrations/carousel4-illustration.webp';

/**
 * Build a YouTube thumbnail URL from a video id.
 * Covers the most common id length (11 chars). Falls back gracefully when
 * `videoId` isn't set.
 */
export const youtubeThumb = (videoId) =>
    videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '';

const mediaData = [
    {
        id: 'yt-investor-education-1',
        type: 'youtube',
        videoId: 'dQw4w9WgXcQ', // TODO: replace with real Anupaat Nivesh video id
        title: 'How to Build Long-Term Wealth with SIPs',
        description: 'Founder explains the discipline behind goal-based investing.',
        url: 'https://www.youtube.com/@anupaatnivesh',
        source: 'YouTube',
        date: 'Educational',
    },
    {
        id: 'yt-investor-education-2',
        type: 'youtube',
        videoId: 'dQw4w9WgXcQ', // TODO: replace with real video id
        title: 'पंचम Framework: 5 Styles of Investing',
        description: 'A short walkthrough of how we build portfolios.',
        url: 'https://www.youtube.com/@anupaatnivesh',
        source: 'YouTube',
    },
    {
        id: 'article-financial-times',
        type: 'article',
        title: 'Why Goal-Based Investing Matters in 2026',
        description: 'Long-form perspective on disciplined SIPs and tax-efficient investing.',
        thumbnail: carousel1,
        url: '#', // TODO: replace with real article URL
        source: 'Press',
        date: 'Featured',
    },
    {
        id: 'news-amfi-coverage',
        type: 'news',
        title: 'AMFI Registered MFD spotlight',
        description: 'Coverage of advisor-led mutual fund distribution.',
        thumbnail: carousel2,
        url: '#',
        source: 'News',
    },
    {
        id: 'photo-investor-meetup',
        type: 'photo',
        title: 'Investor Education Seminar',
        description: 'Live session on retirement and goal planning.',
        thumbnail: carousel3,
        source: 'Event',
    },
    {
        id: 'photo-public-event',
        type: 'photo',
        title: 'Community Awareness Event',
        description: 'On-ground financial literacy initiative.',
        thumbnail: carousel4,
        source: 'Community',
    },
];

export default mediaData;
