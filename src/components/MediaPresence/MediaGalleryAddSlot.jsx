import React, { useCallback, useRef, useState } from 'react';
import { HiOutlineCloudUpload, HiOutlineLink } from 'react-icons/hi';

import {
    buildMediaItemFromImageFile,
    buildMediaItemFromImageUrl,
    buildMediaItemFromYoutubeUrl,
    parseYoutubeInput,
    isProbablyImageUrl,
} from './mediaParseUtils';

/**
 * Compact add strip: paste YouTube / image URL or upload an image file.
 * Detection + editorial scaffolding run client-side (see mediaParseUtils).
 */
const MediaGalleryAddSlot = ({ onAdd }) => {
    const [url, setUrl] = useState('');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const fileRef = useRef(null);

    const resetForm = useCallback(() => {
        setUrl('');
        setError('');
        if (fileRef.current) fileRef.current.value = '';
    }, []);

    const handleSubmitUrl = useCallback(async () => {
        const raw = url.trim();
        if (!raw || !onAdd) return;
        setBusy(true);
        setError('');
        try {
            if (parseYoutubeInput(raw)) {
                const item = await buildMediaItemFromYoutubeUrl(raw);
                if (item) {
                    onAdd(item);
                    resetForm();
                } else setError('Could not read that YouTube link.');
            } else if (isProbablyImageUrl(raw)) {
                const item = buildMediaItemFromImageUrl(raw);
                if (item) {
                    onAdd(item);
                    resetForm();
                } else setError('That does not look like a direct image URL.');
            } else {
                setError('Paste a YouTube or YouTube Shorts link, a direct image URL (.jpg, .png, .webp, .gif), or upload an image.');
            }
        } catch {
            setError('Something went wrong. Try again.');
        } finally {
            setBusy(false);
        }
    }, [url, onAdd, resetForm]);

    const handleFile = useCallback(
        async (event) => {
            const file = event.target.files?.[0];
            if (!file || !onAdd) return;
            setBusy(true);
            setError('');
            try {
                const item = await buildMediaItemFromImageFile(file);
                onAdd(item);
                resetForm();
            } catch (e) {
                setError(e?.message || 'Upload failed.');
            } finally {
                setBusy(false);
            }
        },
        [onAdd, resetForm]
    );

    return (
        <div className="media-add-slot" data-aos="fade-up">
            <div className="media-add-slot__inner">
                <span className="media-add-slot__label">
                    <HiOutlineCloudUpload size={18} aria-hidden="true" />
                    Add media
                </span>
                <p className="media-add-slot__hint">
                    We detect YouTube videos &amp; Shorts, direct image links, or local image uploads—then draft gallery copy
                    you can refine later.
                </p>
                <div className="media-add-slot__row">
                    <div className="media-add-slot__field">
                        <HiOutlineLink className="media-add-slot__field-icon" size={18} aria-hidden="true" />
                        <input
                            type="url"
                            name="media-url"
                            autoComplete="off"
                            className="media-add-slot__input"
                            placeholder="Paste YouTube, Shorts, or image URL…"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleSubmitUrl();
                                }
                            }}
                            disabled={busy}
                            aria-label="Media URL"
                        />
                    </div>
                    <button
                        type="button"
                        className="media-add-slot__btn media-add-slot__btn--primary"
                        onClick={handleSubmitUrl}
                        disabled={busy || !url.trim()}
                    >
                        {busy ? 'Working…' : 'Add URL'}
                    </button>
                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        className="media-add-slot__file"
                        onChange={handleFile}
                        disabled={busy}
                        aria-label="Upload image"
                    />
                    <button
                        type="button"
                        className="media-add-slot__btn"
                        onClick={() => fileRef.current?.click()}
                        disabled={busy}
                    >
                        Upload image
                    </button>
                </div>
                {error && (
                    <p className="media-add-slot__error" role="alert">
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
};

export default MediaGalleryAddSlot;
