import express from 'express';
import multer from 'multer';

import {
  buildYoutubeCanonicalUrl,
  fetchYoutubeOEmbed,
  generateEditorialCopy,
  isLikelyImageUrl,
  parseSocialPostUrl,
  parseYoutubeInput
} from '../services/mediaGenerator.mjs';
import {
  createMediaItem,
  deleteMediaItem,
  listAllMediaAdmin,
  listPublishedMedia,
  updateMediaItem
} from '../services/mediaDb.mjs';
import { saveUploadedMediaFile } from '../services/mediaStorageHostinger.mjs';
import {
  clearMediaAuthSession,
  getMediaSession,
  isMediaAuthConfigured,
  requireMediaAuth,
  setMediaAuthSession,
  verifyMediaCredentials
} from '../middleware/mediaAuth.mjs';
import { fetchOpenGraphPreview, mergeSocialPostDraftFromPreview } from '../services/openGraphPreview.mjs';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 80 * 1024 * 1024 }
});

/** Multi-image album: 2–3 photos under one title (images only). */
const MAX_GALLERY_PHOTOS = 3;

const router = express.Router();

function nowDateLabel() {
  return new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
}

function cleanPurpose(input) {
  return String(input || '').trim();
}

router.get('/public', async (req, res) => {
  try {
    const items = await listPublishedMedia();
    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch media' });
  }
});

router.post('/auth/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!isMediaAuthConfigured()) {
    return res.status(503).json({
      success: false,
      error: 'Media auth is not configured. Set MEDIA_ADMIN_USERNAME, MEDIA_ADMIN_PASSWORD_HASH, MEDIA_SESSION_SECRET.'
    });
  }
  const ok = await verifyMediaCredentials(username, password);
  if (!ok) {
    return res.status(401).json({ success: false, error: 'Invalid username/password' });
  }
  setMediaAuthSession(req);
  res.json({ success: true, username: String(username || '').trim() });
});

router.post('/auth/logout', (req, res) => {
  clearMediaAuthSession(req);
  req.session.destroy(() => {
    res.clearCookie('an_media_sid');
    res.json({ success: true });
  });
});

router.get('/auth/me', (req, res) => {
  const session = getMediaSession(req);
  res.json({
    success: true,
    authenticated: Boolean(session),
    username: session?.username || ''
  });
});

router.get('/admin/list', requireMediaAuth, async (req, res) => {
  try {
    const items = await listAllMediaAdmin();
    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch admin media' });
  }
});

router.post('/admin/create', requireMediaAuth, upload.array('files', MAX_GALLERY_PHOTOS), async (req, res) => {
  try {
    const mediaUrl = String(req.body?.mediaUrl || '').trim();
    const sourceInput = String(req.body?.source || '').trim();
    const purpose = cleanPurpose(req.body?.descriptionPurpose);
    const date = String(req.body?.date || '').trim() || nowDateLabel();
    const files = Array.isArray(req.files) ? req.files : [];

    if (!purpose) {
      return res.status(400).json({ success: false, error: 'descriptionPurpose is required.' });
    }

    let draft = null;

    if (files.length > 0) {
      const images = files.filter((f) => /^image\//i.test(f.mimetype || ''));
      const videos = files.filter((f) => /^video\//i.test(f.mimetype || ''));

      if (files.length > MAX_GALLERY_PHOTOS) {
        return res.status(400).json({
          success: false,
          error: `You can attach at most ${MAX_GALLERY_PHOTOS} files per publish.`
        });
      }

      if (files.length > 1) {
        if (videos.length > 0 || images.length !== files.length) {
          return res.status(400).json({
            success: false,
            error: 'Multi-upload is for images only (2–3 photos per story). Use a single file for video.'
          });
        }
        const savedList = await Promise.all(images.map((f) => saveUploadedMediaFile(f)));
        const urls = savedList.map((s) => s.url).filter(Boolean);
        if (urls.length < 2) {
          return res.status(500).json({ success: false, error: 'Failed to save gallery images.' });
        }
        const primary = urls[0];
        const titleSeed = req.body?.title || files[0]?.originalname || 'Photo story';
        const generated = generateEditorialCopy({
          type: 'photo',
          title: titleSeed,
          source: sourceInput || 'Upload',
          date,
          purpose,
          photoCount: urls.length
        });

        draft = {
          type: 'photo',
          title: generated.title,
          thumbnail: primary,
          url: primary,
          photoUrls: urls,
          videoId: '',
          source: sourceInput || 'Upload',
          date,
          shortDescription: generated.shortDescription,
          articleContent: generated.articleContent,
          descriptionPurpose: purpose,
          status: 'published'
        };
      } else {
        const file = files[0];
        const saved = await saveUploadedMediaFile(file);
        const titleSeed = req.body?.title || file?.originalname || 'Uploaded media';
        const generated = generateEditorialCopy({
          type: saved.type,
          title: titleSeed,
          source: sourceInput || saved.source || 'Upload',
          date,
          purpose
        });

        draft = {
          type: saved.type,
          title: generated.title,
          thumbnail: saved.thumbnail || '',
          url: saved.url || '',
          videoId: '',
          source: sourceInput || saved.source || 'Upload',
          date,
          shortDescription: generated.shortDescription,
          articleContent: generated.articleContent,
          descriptionPurpose: purpose,
          status: 'published'
        };
      }
    } else if (mediaUrl) {
      const yt = parseYoutubeInput(mediaUrl);
      if (yt) {
        const canonical = buildYoutubeCanonicalUrl(yt.videoId, yt.isShort);
        const oembed = await fetchYoutubeOEmbed(canonical);
        const source = sourceInput || oembed?.author_name || (yt.isShort ? 'YouTube Shorts' : 'YouTube');
        const generated = generateEditorialCopy({
          type: yt.isShort ? 'youtubeShort' : 'youtube',
          title: oembed?.title || req.body?.title || (yt.isShort ? 'YouTube Short' : 'YouTube Video'),
          source,
          date,
          purpose,
          channelName: oembed?.author_name || ''
        });

        draft = {
          type: yt.isShort ? 'youtubeShort' : 'youtube',
          title: generated.title,
          thumbnail: '',
          url: canonical,
          videoId: yt.videoId,
          source,
          date,
          shortDescription: generated.shortDescription,
          articleContent: generated.articleContent,
          descriptionPurpose: purpose,
          status: 'published'
        };
      } else {
        const socialPost = parseSocialPostUrl(mediaUrl);
        if (socialPost) {
          const generated = generateEditorialCopy({
            type: 'socialPost',
            title: req.body?.title || (socialPost.platform === 'x' ? 'X post' : 'LinkedIn article'),
            source: sourceInput || (socialPost.platform === 'x' ? 'X' : 'LinkedIn'),
            date,
            purpose,
            socialPlatform: socialPost.platform
          });
          draft = {
            type: 'socialPost',
            title: generated.title,
            thumbnail: '',
            url: socialPost.url,
            videoId: '',
            source: sourceInput || (socialPost.platform === 'x' ? 'X' : 'LinkedIn'),
            date,
            shortDescription: generated.shortDescription,
            articleContent: generated.articleContent,
            descriptionPurpose: purpose,
            status: 'published'
          };
          if (socialPost.platform === 'linkedin' || socialPost.platform === 'x') {
            const preview = await fetchOpenGraphPreview(socialPost.url);
            draft = mergeSocialPostDraftFromPreview({
              draft,
              preview,
              purpose,
              platform: socialPost.platform
            });
          }
        } else if (isLikelyImageUrl(mediaUrl)) {
          const normalized = /^https?:\/\//i.test(mediaUrl) ? mediaUrl : `https://${mediaUrl}`;
          const generated = generateEditorialCopy({
            type: 'photo',
            title: req.body?.title || 'Image Feature',
            source: sourceInput || 'Web image',
            date,
            purpose
          });
          draft = {
            type: 'photo',
            title: generated.title,
            thumbnail: normalized,
            url: normalized,
            videoId: '',
            source: sourceInput || 'Web image',
            date,
            shortDescription: generated.shortDescription,
            articleContent: generated.articleContent,
            descriptionPurpose: purpose,
            status: 'published'
          };
        } else {
          return res.status(400).json({
            success: false,
            error:
              'Invalid mediaUrl. Use YouTube/Shorts, LinkedIn or X/Twitter link, or a direct image URL.'
          });
        }
      }
    } else {
      return res.status(400).json({ success: false, error: 'Provide either a file upload or mediaUrl.' });
    }

    const created = await createMediaItem(draft);
    res.status(201).json({ success: true, item: created });
  } catch (error) {
    console.error('Media create error:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to create media item' });
  }
});

router.put('/admin/:id', requireMediaAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await updateMediaItem(id, req.body || {});
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || 'Failed to update media item' });
  }
});

router.delete('/admin/:id', requireMediaAuth, async (req, res) => {
  try {
    await deleteMediaItem(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || 'Failed to delete media item' });
  }
});

export default router;
