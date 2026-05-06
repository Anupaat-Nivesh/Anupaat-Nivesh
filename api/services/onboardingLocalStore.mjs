import { mkdir, writeFile } from 'fs/promises';
import { extname, join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

function getUploadRoot() {
  if (process.env.ONBOARDING_UPLOAD_DIR) return process.env.ONBOARDING_UPLOAD_DIR;
  if (process.env.VERCEL === '1') return join('/tmp', 'anupaat-onboarding');
  return join(__dirname, '../../uploads/onboarding');
}

export async function saveSubmissionLocally(submissionId, payload, filesByField) {
  const root = getUploadRoot();
  const dir = join(root, submissionId);
  await mkdir(dir, { recursive: true });

  await writeFile(join(dir, 'submission.json'), JSON.stringify(payload, null, 2), 'utf8');

  const filesMeta = [];
  for (const [field, file] of Object.entries(filesByField)) {
    const ext = extname(file.originalname) || '';
    const filename = `${field}${ext}`;
    await writeFile(join(dir, filename), file.buffer);
    filesMeta.push({
      field,
      filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype
    });
  }

  return { filesMeta, storageDirectory: dir };
}
