import { google } from 'googleapis';
import { Readable } from 'stream';
import { buildOnboardingFolderName } from '../utils/onboardingFolderName.mjs';

/**
 * Service accounts have no personal Drive storage quota. Uploads must live under a
 * folder you own (shared with the SA as Editor) or under a Shared drive where the SA is a member.
 * `drive` scope is required for reliable writes into shared folders / Shared drives.
 */
function getDriveScopes() {
  const raw =
    process.env.GOOGLE_DRIVE_SCOPES ||
    'https://www.googleapis.com/auth/drive';
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function getDriveClient() {
  if (!process.env.GOOGLE_DRIVE_CREDENTIALS) {
    throw new Error('GOOGLE_DRIVE_CREDENTIALS is not configured');
  }

  const credentials = JSON.parse(process.env.GOOGLE_DRIVE_CREDENTIALS);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: getDriveScopes(),
  });

  return google.drive({ version: 'v3', auth });
}

export function getConfiguredParentFolderId(overrideParentFolderId) {
  return (
    overrideParentFolderId ||
    process.env.GOOGLE_DRIVE_ONBOARDING_PARENT_FOLDER_ID ||
    process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID ||
    ''
  );
}

export async function createClientFolder({ firstName, lastName, pan, parentFolderId }) {
  const drive = getDriveClient();
  const parentId = String(parentFolderId || '').trim();
  if (!parentId) {
    throw new Error(
      'Drive parent folder is not configured. Set GOOGLE_DRIVE_ONBOARDING_PARENT_FOLDER_ID to a folder in your Drive or Shared drive, and share that folder with this service account as Editor (service accounts have no storage quota on their own).'
    );
  }

  const folderName =
    buildOnboardingFolderName({ firstName, lastName, pan }) ||
    `ONBOARDING_${Date.now()}`;

  const metadata = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
    parents: [parentId],
  };

  const result = await drive.files.create({
    requestBody: metadata,
    fields: 'id,name,webViewLink',
    supportsAllDrives: true,
  });

  return {
    folderId: result.data.id,
    folderName: result.data.name,
    folderLink: result.data.webViewLink || '',
  };
}

export function formatDriveApiError(err) {
  const data = err?.response?.data;
  const primary = data?.error?.message;
  const nested = data?.error?.errors;
  if (primary && Array.isArray(nested) && nested[0]?.message) {
    return `${primary} (${nested[0].message})`;
  }
  if (primary) return primary;
  if (Array.isArray(nested) && nested[0]?.message) return nested[0].message;
  return err?.message || 'Drive API error';
}

export async function uploadFileToFolder({ folderId, file }) {
  const drive = getDriveClient();
  const mime =
    file.mimetype && file.mimetype !== 'application/octet-stream'
      ? file.mimetype
      : 'application/octet-stream';

  const media = {
    mimeType: mime,
    body: Readable.from(file.buffer),
  };

  try {
    const result = await drive.files.create({
      requestBody: {
        name: file.originalname,
        parents: [String(folderId).trim()],
      },
      media,
      fields: 'id,name,mimeType,size,webViewLink',
      supportsAllDrives: true,
    });

    return {
      fileId: result.data.id,
      name: result.data.name,
      mimeType: result.data.mimeType,
      size: result.data.size,
      link: result.data.webViewLink || '',
    };
  } catch (err) {
    const msg = formatDriveApiError(err);
    const wrapped = new Error(msg);
    wrapped.cause = err;
    throw wrapped;
  }
}
