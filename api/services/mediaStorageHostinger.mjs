import { mkdir, writeFile } from 'fs/promises';
import { extname, join } from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const IMAGE_MIME_RE = /^image\//i;
const VIDEO_MIME_RE = /^video\//i;

function sanitizeBase(input = 'file') {
  return String(input)
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .slice(0, 120);
}

export function getMediaUploadDir() {
  if (process.env.MEDIA_UPLOAD_DIR) return process.env.MEDIA_UPLOAD_DIR;
  if (process.env.VERCEL === '1') return join('/tmp', 'anupaat-media');
  return join(__dirname, '../../uploads/media');
}

export function getPublicMediaBaseUrl() {
  const fromEnv = process.env.MEDIA_FILES_BASE_URL;
  if (fromEnv) return fromEnv.replace(/\/+$/, '');
  return '/media-files';
}

export async function saveUploadedMediaFile(file) {
  if (!file) return null;
  const root = getMediaUploadDir();
  await mkdir(root, { recursive: true });

  const ext = extname(file.originalname || '') || '';
  const filename = `${Date.now()}-${sanitizeBase(file.originalname || 'upload')}${ext}`;
  const fullPath = join(root, filename);

  await writeFile(fullPath, file.buffer);

  const isImage = IMAGE_MIME_RE.test(file.mimetype || '');
  const isVideo = VIDEO_MIME_RE.test(file.mimetype || '');
  const type = isImage ? 'photo' : isVideo ? 'videoFile' : 'photo';
  const publicUrl = `${getPublicMediaBaseUrl()}/${filename}`;

  return {
    type,
    source: 'Upload',
    url: publicUrl,
    thumbnail: isImage ? publicUrl : '',
    filename,
    mimetype: file.mimetype || '',
    size: file.size || 0
  };
}
