import express from 'express';
import multer from 'multer';
import {
  createClientFolder,
  getConfiguredParentFolderId,
  uploadFileToFolder,
} from '../services/drive.mjs';
import { INVALID_PAN_MESSAGE, isValidIndianPan } from '../utils/panValidation.mjs';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 12 * 1024 * 1024 }, // 12MB
});

const onboardingStore = new Map();

router.post('/create-folder', async (req, res) => {
  try {
    const { pan, parentFolderId, firstName, lastName, fullName } = req.body;
    const resolvedFirst =
      (firstName != null && String(firstName).trim() !== '') ? firstName : fullName;

    if (!pan || !resolvedFirst || !String(resolvedFirst).trim()) {
      return res.status(400).json({ error: 'PAN and first name are required' });
    }

    const fname = String(resolvedFirst).trim();
    if (/\s/.test(fname)) {
      return res.status(400).json({ error: 'First name must not contain spaces' });
    }

    const panNorm = String(pan).trim().toUpperCase();
    if (!isValidIndianPan(panNorm)) {
      return res.status(400).json({ error: INVALID_PAN_MESSAGE });
    }

    const resolvedParentFolderId = String(
      getConfiguredParentFolderId(parentFolderId) || ''
    ).trim();
    if (!resolvedParentFolderId) {
      return res.status(503).json({
        error: 'Google Drive parent folder is not configured',
        message:
          'Set GOOGLE_DRIVE_ONBOARDING_PARENT_FOLDER_ID (folder ID from the Drive URL). Share that folder with your service account email as Editor. Service accounts have no Drive quota unless files are created inside your folder or a Shared drive.',
      });
    }

    const folder = await createClientFolder({
      firstName: fname,
      lastName: lastName || '',
      pan: panNorm,
      parentFolderId: resolvedParentFolderId,
    });

    return res.status(200).json({
      success: true,
      ...folder,
      parentFolderId: resolvedParentFolderId,
    });
  } catch (error) {
    console.error('Create onboarding folder error:', error);
    return res.status(500).json({
      error: 'Failed to create onboarding folder',
      message: error.message,
    });
  }
});

router.post(
  '/upload',
  (req, res, next) => {
    upload.single('file')(req, res, (err) => {
      if (!err) return next();
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
          error: 'File too large',
          message:
            'This file exceeds the server upload limit. Try a smaller PDF/image or compress the file.',
        });
      }
      console.error('Multer error:', err);
      return res.status(400).json({
        error: 'Upload parse failed',
        message: err.message || 'Could not read uploaded file',
      });
    });
  },
  async (req, res) => {
    try {
      const { folderId, docType } = req.body;

      if (!folderId) {
        return res.status(400).json({ error: 'folderId is required' });
      }
      if (!req.file || !req.file.buffer?.length) {
        return res.status(400).json({
          error: 'file is required',
          message:
            'No file was received. On Vercel, uploads over ~4.5 MB fail before the server runs — use smaller files or host the API where larger bodies are allowed.',
        });
      }

      const uploaded = await uploadFileToFolder({ folderId, file: req.file });

      return res.status(200).json({
        success: true,
        docType: docType || 'unknown',
        ...uploaded,
      });
    } catch (error) {
      console.error('Onboarding upload error:', error);
      return res.status(500).json({
        error: 'Failed to upload document',
        message: error.message,
      });
    }
  }
);

router.post('/submit', async (req, res) => {
  try {
    const payload = req.body || {};
    const submissionId = `onb_${Date.now()}`;
    const submittedAt = new Date().toISOString();

    onboardingStore.set(submissionId, {
      ...payload,
      submissionId,
      submittedAt,
      status: 'submitted',
    });

    return res.status(200).json({
      success: true,
      submissionId,
      submittedAt,
      message: 'Onboarding submitted successfully',
    });
  } catch (error) {
    console.error('Onboarding submit error:', error);
    return res.status(500).json({
      error: 'Failed to submit onboarding',
      message: error.message,
    });
  }
});

export default router;
