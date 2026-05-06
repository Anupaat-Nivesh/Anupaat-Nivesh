/**
 * Client onboarding route:
 * - accepts multipart metadata + files
 * - uploads files to Supabase Storage in production
 * - stores submission rows in Supabase Postgres
 * - notifies ops by Resend email
 * - falls back to local disk when cloud env vars are missing
 */

import express from 'express';
import multer from 'multer';
import { randomUUID } from 'crypto';
import {
  uploadFiles,
  isCloudStorageConfigured,
  saveSubmissionRecord
} from '../services/onboardingStorage.mjs';
import { notifyOnboardingSubmission } from '../services/onboardingNotifier.mjs';
import { saveSubmissionLocally } from '../services/onboardingLocalStore.mjs';

const DOCUMENT_FIELDS = [
  'panCard',
  'aadhaarFront',
  'aadhaarBack',
  'bankProof',
  'signature',
  'nomineeProof'
];

function allowedMime(mimetype, originalname) {
  const okTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/jpg',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];
  if (okTypes.includes(mimetype)) return true;
  return /\.(pdf|jpe?g|png|doc|docx|xls|xlsx)$/i.test(originalname || '');
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (allowedMime(file.mimetype, file.originalname)) cb(null, true);
    else cb(new Error('Unsupported file type. Use PDF, JPG, PNG, DOC, DOCX, XLS, or XLSX.'));
  }
});

const router = express.Router();

const fieldDefs = DOCUMENT_FIELDS.map((name) => ({ name, maxCount: 1 }));

router.post('/submit', (req, res, next) => {
  upload.fields(fieldDefs)(req, res, (err) => {
    if (err) {
      const status = err.message && err.message.includes('Unsupported') ? 400 : 400;
      return res.status(status).json({
        success: false,
        error: err.message || 'Upload failed'
      });
    }
    next();
  });
}, async (req, res) => {
  try {
    let metadata = {};
    if (req.body.metadata) {
      try {
        metadata =
          typeof req.body.metadata === 'string'
            ? JSON.parse(req.body.metadata)
            : req.body.metadata;
      } catch {
        return res.status(400).json({ success: false, error: 'Invalid metadata JSON' });
      }
    }

    const submissionId = randomUUID();
    const payload = {
      submissionId,
      receivedAt: new Date().toISOString(),
      ...metadata
    };

    const filesMeta = [];
    const files = req.files || {};

    const uploadInput = {};
    for (const field of DOCUMENT_FIELDS) {
      const arr = files[field];
      if (arr?.[0]) uploadInput[field] = arr[0];
    }

    const cloudConfigured = isCloudStorageConfigured();
    let storageResult;
    if (cloudConfigured) {
      storageResult = await uploadFiles(submissionId, uploadInput);
      filesMeta.push(...storageResult.filesMeta);
    } else {
      storageResult = await saveSubmissionLocally(submissionId, payload, uploadInput);
      filesMeta.push(...storageResult.filesMeta);
    }

    await saveSubmissionRecord({
      submissionId,
      payload,
      filesMeta,
      sourceIp: req.headers['x-forwarded-for'] || req.socket.remoteAddress || '',
      userAgent: req.headers['user-agent'] || ''
    });

    await notifyOnboardingSubmission({
      submissionId,
      payload,
      filesMeta
    });

    res.status(201).json({
      success: true,
      submissionId,
      message: 'Onboarding submission received',
      filesReceived: filesMeta.length,
      files: filesMeta,
      storageMode: cloudConfigured ? 'supabase' : 'local-fallback',
      storageDirectory: storageResult.storageDirectory || null,
      warning: cloudConfigured
        ? null
        : 'Cloud storage is not configured. Files are saved on local disk.'
    });
  } catch (e) {
    console.error('Onboarding submit error:', e);
    res.status(500).json({
      success: false,
      error: process.env.NODE_ENV === 'development' ? e.message : 'Upload failed'
    });
  }
});

export default router;
