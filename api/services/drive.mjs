import { google } from 'googleapis';
import { Readable } from 'stream';

function getDriveClient() {
  if (!process.env.GOOGLE_DRIVE_CREDENTIALS) {
    throw new Error('GOOGLE_DRIVE_CREDENTIALS is not configured');
  }

  const credentials = JSON.parse(process.env.GOOGLE_DRIVE_CREDENTIALS);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive.file'],
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

export async function createClientFolder({ pan, fullName, parentFolderId }) {
  const drive = getDriveClient();
  const safePan = String(pan || '').trim().toUpperCase();
  const safeName = String(fullName || '')
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_]/g, '');
  const folderName = `${safePan}_${safeName}` || `ONBOARDING_${Date.now()}`;

  const metadata = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
  };

  if (parentFolderId) {
    metadata.parents = [parentFolderId];
  }

  const result = await drive.files.create({
    requestBody: metadata,
    fields: 'id,name,webViewLink',
  });

  return {
    folderId: result.data.id,
    folderName: result.data.name,
    folderLink: result.data.webViewLink || '',
  };
}

export async function uploadFileToFolder({ folderId, file }) {
  const drive = getDriveClient();
  const media = {
    mimeType: file.mimetype,
    body: Readable.from(file.buffer),
  };

  const result = await drive.files.create({
    requestBody: {
      name: file.originalname,
      parents: [folderId],
    },
    media,
    fields: 'id,name,mimeType,size,webViewLink',
  });

  return {
    fileId: result.data.id,
    name: result.data.name,
    mimeType: result.data.mimeType,
    size: result.data.size,
    link: result.data.webViewLink || '',
  };
}
