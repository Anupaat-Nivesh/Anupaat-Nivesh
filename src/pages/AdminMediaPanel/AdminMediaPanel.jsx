import React, { useCallback, useEffect, useState } from 'react';

import MediaCard from '../../components/MediaPresence/MediaCard';
import MediaViewerModal from '../../components/MediaPresence/MediaViewerModal';
import {
    mediaAdminCreate,
    mediaAdminDelete,
    mediaAdminList,
    mediaAuthLogin,
    mediaAuthLogout,
    mediaAuthMe,
} from '../../api/mediaApi';

import '../../components/MediaPresence/MediaPresence.css';
import './AdminMediaPanel.css';

const initialForm = {
    mediaUrl: '',
    descriptionPurpose: '',
    source: '',
    date: '',
};

const AdminMediaPanel = () => {
    const [authChecked, setAuthChecked] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');

    const [items, setItems] = useState([]);
    const [activeItem, setActiveItem] = useState(null);
    const [loadingList, setLoadingList] = useState(false);

    const [form, setForm] = useState(initialForm);
    const [files, setFiles] = useState([]);
    const [fileInputKey, setFileInputKey] = useState(0);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const loadItems = useCallback(async () => {
        setLoadingList(true);
        try {
            const list = await mediaAdminList();
            setItems(list);
        } catch (err) {
            setSubmitError(err.message || 'Failed to load media list.');
        } finally {
            setLoadingList(false);
        }
    }, []);

    useEffect(() => {
        let cancelled = false;
        const run = async () => {
            try {
                const me = await mediaAuthMe();
                if (!cancelled) {
                    setAuthenticated(Boolean(me?.authenticated));
                    if (me?.authenticated) await loadItems();
                }
            } catch {
                if (!cancelled) setAuthenticated(false);
            } finally {
                if (!cancelled) setAuthChecked(true);
            }
        };
        run();
        return () => {
            cancelled = true;
        };
    }, [loadItems]);

    const handleLogin = useCallback(
        async (event) => {
            event.preventDefault();
            setAuthError('');
            try {
                await mediaAuthLogin({ username, password });
                setAuthenticated(true);
                setPassword('');
                await loadItems();
            } catch (err) {
                setAuthError(err.message || 'Invalid credentials.');
            }
        },
        [loadItems, password, username]
    );

    const handleLogout = useCallback(async () => {
        await mediaAuthLogout();
        setAuthenticated(false);
        setItems([]);
    }, []);

    const handleSubmit = useCallback(
        async (event) => {
            event.preventDefault();
            setSubmitError('');
            setSubmitSuccess('');
            if (!files.length && !form.mediaUrl.trim()) {
                setSubmitError('Upload one or more files, or provide a media URL.');
                return;
            }
            if (!form.descriptionPurpose.trim()) {
                setSubmitError('Please add what this media is for.');
                return;
            }
            setSubmitting(true);
            try {
                await mediaAdminCreate({
                    files,
                    mediaUrl: form.mediaUrl.trim(),
                    source: form.source.trim(),
                    date: form.date.trim(),
                    descriptionPurpose: form.descriptionPurpose.trim(),
                });
                setForm(initialForm);
                setFiles([]);
                setFileInputKey((k) => k + 1);
                setSubmitSuccess('Media published. It should now reflect on the website.');
                await loadItems();
            } catch (err) {
                setSubmitError(err.message || 'Failed to publish media.');
            } finally {
                setSubmitting(false);
            }
        },
        [files, form, loadItems]
    );

    const handleDelete = useCallback(
        async (id) => {
            try {
                await mediaAdminDelete(id);
                if (activeItem?.id === id) setActiveItem(null);
                await loadItems();
            } catch (err) {
                setSubmitError(err.message || 'Delete failed.');
            }
        },
        [activeItem?.id, loadItems]
    );

    if (!authChecked) {
        return (
            <div className="admin-media-page">
                <div className="admin-media-page__box">
                    <p className="admin-media-page__text">Checking media admin access…</p>
                </div>
            </div>
        );
    }

    if (!authenticated) {
        return (
            <div className="admin-media-page">
                <div className="admin-media-page__box">
                    <h1 className="admin-media-page__title">Media admin login</h1>
                    <p className="admin-media-page__text">
                        Sign in with backend credentials to manage <code className="admin-media-page__code">/mediadata</code>.
                    </p>
                    <form className="admin-media-page__form" onSubmit={handleLogin}>
                        <label className="admin-media-page__label" htmlFor="admin-username">
                            Username
                        </label>
                        <input
                            id="admin-username"
                            className="admin-media-page__input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoComplete="username"
                        />
                        <label className="admin-media-page__label" htmlFor="admin-password">
                            Password
                        </label>
                        <input
                            id="admin-password"
                            type="password"
                            className="admin-media-page__input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                        />
                        {authError && (
                            <p className="admin-media-page__error" role="alert">
                                {authError}
                            </p>
                        )}
                        <button className="admin-media-page__submit" type="submit" disabled={!username || !password}>
                            Sign in
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-media-page">
            <div className="admin-media-page--wide">
                <div className="admin-media-page__toolbar">
                    <div>
                        <h1 className="admin-media-page__title">Media admin</h1>
                        <p className="admin-media-page__text" style={{ margin: 0 }}>
                            Upload 1–3 images for one story (stacked on the homepage), or one file / URL for
                            video or a single image. Title and copy are generated automatically.
                        </p>
                    </div>
                    <div className="admin-media-page__toolbar-actions">
                        <button type="button" className="admin-media-page__ghost" onClick={handleLogout}>
                            Sign out
                        </button>
                        <a className="admin-media-page__ghost admin-media-page__ghost--link" href="/">
                            View site
                        </a>
                    </div>
                </div>

                <section className="admin-media-page__section">
                    <h2 className="admin-media-page__h2">Publish media</h2>
                    <form className="admin-media-page__form" onSubmit={handleSubmit}>
                        <label className="admin-media-page__label" htmlFor="media-url">
                            YouTube / Shorts / image URL (optional if file uploaded)
                        </label>
                        <input
                            id="media-url"
                            className="admin-media-page__input"
                            value={form.mediaUrl}
                            onChange={(e) => setForm((prev) => ({ ...prev, mediaUrl: e.target.value }))}
                            placeholder="YouTube / Shorts, LinkedIn or X link, or direct image URL (.jpg …)"
                        />

                        <label className="admin-media-page__label" htmlFor="media-file">
                            Upload images or video (optional if URL provided) — select up to 3 images for one album
                        </label>
                        <input
                            key={fileInputKey}
                            id="media-file"
                            type="file"
                            className="admin-media-page__input"
                            accept="image/*,video/*"
                            multiple
                            onChange={(e) => {
                                const picked = Array.from(e.target.files || []).slice(0, 3);
                                setFiles(picked);
                            }}
                        />

                        <label className="admin-media-page__label" htmlFor="media-purpose">
                            What is this for? (required)
                        </label>
                        <textarea
                            id="media-purpose"
                            className="admin-media-page__input"
                            value={form.descriptionPurpose}
                            onChange={(e) => setForm((prev) => ({ ...prev, descriptionPurpose: e.target.value }))}
                            rows={4}
                            placeholder="Example: investor seminar recap, SIP education, market commentary..."
                        />

                        <label className="admin-media-page__label" htmlFor="media-source">
                            Source (optional)
                        </label>
                        <input
                            id="media-source"
                            className="admin-media-page__input"
                            value={form.source}
                            onChange={(e) => setForm((prev) => ({ ...prev, source: e.target.value }))}
                            placeholder="YouTube / Event / Community"
                        />

                        <label className="admin-media-page__label" htmlFor="media-date">
                            Date label (optional)
                        </label>
                        <input
                            id="media-date"
                            className="admin-media-page__input"
                            value={form.date}
                            onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
                            placeholder="May 2026 / Webinar Series"
                        />

                        {submitError && (
                            <p className="admin-media-page__error" role="alert">
                                {submitError}
                            </p>
                        )}
                        {submitSuccess && <p className="admin-media-page__success">{submitSuccess}</p>}

                        <button type="submit" className="admin-media-page__submit" disabled={submitting}>
                            {submitting ? 'Publishing…' : 'Publish media'}
                        </button>
                    </form>
                </section>

                <section className="admin-media-page__section">
                    <h2 className="admin-media-page__h2">Published media</h2>
                    {loadingList && <p className="admin-media-page__text">Loading…</p>}
                    {!loadingList && (
                        <div className="admin-media-page__preview">
                            {items.map((item) => (
                                <div key={item.id} className="admin-media-page__preview-cell">
                                    <MediaCard item={item} onItemClick={setActiveItem} />
                                    <button
                                        type="button"
                                        className="admin-media-page__submit admin-media-page__submit--secondary"
                                        onClick={() => handleDelete(item.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            {activeItem && (
                <MediaViewerModal
                    item={activeItem}
                    items={items}
                    onActiveItemChange={setActiveItem}
                    onClose={() => setActiveItem(null)}
                />
            )}
        </div>
    );
};

export default AdminMediaPanel;
