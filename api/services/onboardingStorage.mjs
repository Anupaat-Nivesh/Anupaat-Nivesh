import { createClient } from '@supabase/supabase-js';

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'onboarding-documents';
const TABLE = process.env.SUPABASE_ONBOARDING_TABLE || 'onboarding_submissions';

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export function isCloudStorageConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function safeBase(name) {
  return String(name || 'file')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .slice(0, 120);
}

export async function uploadFiles(submissionId, filesByField) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    throw new Error('Supabase is not configured');
  }

  const filesMeta = [];
  for (const [field, file] of Object.entries(filesByField)) {
    const filename = `${field}-${Date.now()}-${safeBase(file.originalname)}`;
    const storagePath = `onboarding/${submissionId}/${filename}`;

    const { error } = await supabase.storage.from(BUCKET).upload(storagePath, file.buffer, {
      contentType: file.mimetype || 'application/octet-stream',
      upsert: false
    });

    if (error) {
      throw new Error(`Failed to upload ${field}: ${error.message}`);
    }

    filesMeta.push({
      field,
      originalName: file.originalname,
      filename,
      size: file.size,
      mimetype: file.mimetype,
      bucket: BUCKET,
      path: storagePath
    });
  }

  return { filesMeta };
}

export async function saveSubmissionRecord({
  submissionId,
  payload,
  filesMeta,
  sourceIp,
  userAgent
}) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return null;
  }

  const row = {
    submission_id: submissionId,
    received_at: new Date().toISOString(),
    payload,
    files: filesMeta,
    source_ip: String(sourceIp || ''),
    user_agent: String(userAgent || '')
  };

  const { error } = await supabase.from(TABLE).insert(row);
  if (error) {
    throw new Error(`Failed to save submission record: ${error.message}`);
  }
  return row;
}
