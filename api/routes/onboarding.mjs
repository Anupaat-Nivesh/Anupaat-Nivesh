import express from 'express';
import multer from 'multer';
import {
  createClientFolder,
  getConfiguredParentFolderId,
  uploadFileToFolder,
} from '../services/drive.mjs';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 12 * 1024 * 1024 }, // 12MB
});

const onboardingStore = new Map();

router.post('/create-folder', async (req, res) => {
  try {
    const { pan, fullName, parentFolderId } = req.body;

    if (!pan || !fullName) {
      return res.status(400).json({ error: 'PAN and full name are required' });
    }

    const resolvedParentFolderId = getConfiguredParentFolderId(parentFolderId);
    const folder = await createClientFolder({
      pan,
      fullName,
      parentFolderId: resolvedParentFolderId || undefined,
    });

    return res.status(200).json({
      success: true,
      ...folder,
      parentFolderId: resolvedParentFolderId || null,
    });
  } catch (error) {
    console.error('Create onboarding folder error:', error);
    return res.status(500).json({
      error: 'Failed to create onboarding folder',
      message: error.message,
    });
  }
});

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { folderId, docType } = req.body;

    if (!folderId) {
      return res.status(400).json({ error: 'folderId is required' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'file is required' });
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
});

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
