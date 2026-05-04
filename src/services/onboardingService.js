import { buildApiUrl, isBackendAvailable } from '../api/config';
import { apiPost } from '../api/client';

const ONBOARDING_ENDPOINTS = {
  CREATE_FOLDER: '/api/onboarding/create-folder',
  SUBMIT: '/api/onboarding/submit',
  UPLOAD: '/api/onboarding/upload',
};

export const createOnboardingFolder = async ({
  pan,
  firstName,
  lastName,
  taxStatus,
  parentFolderId,
}) => {
  if (!isBackendAvailable()) {
    throw new Error('Backend API is required. Configure REACT_APP_API_BASE_URL');
  }
  return apiPost(ONBOARDING_ENDPOINTS.CREATE_FOLDER, {
    pan,
    firstName,
    lastName,
    taxStatus,
    parentFolderId,
  });
};

export const uploadOnboardingDocument = async ({ folderId, docType, file }) => {
  if (!isBackendAvailable()) {
    throw new Error('Backend API is required. Configure REACT_APP_API_BASE_URL');
  }

  const formData = new FormData();
  formData.append('folderId', folderId);
  formData.append('docType', docType);
  formData.append('file', file);

  const response = await fetch(buildApiUrl(ONBOARDING_ENDPOINTS.UPLOAD), {
    method: 'POST',
    body: formData,
  });

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await response.json()
    : { error: await response.text() };

  if (!response.ok) {
    throw new Error(data.message || data.error || 'Upload failed');
  }

  return data;
};

export const submitOnboarding = async (payload) => {
  if (!isBackendAvailable()) {
    throw new Error('Backend API is required. Configure REACT_APP_API_BASE_URL');
  }
  return apiPost(ONBOARDING_ENDPOINTS.SUBMIT, payload);
};
