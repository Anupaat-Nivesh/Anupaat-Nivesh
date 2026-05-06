import { buildApiUrl, API_ENDPOINTS } from '../api/config';

/**
 * POST full onboarding payload: JSON metadata + file fields expected by the API.
 */
export async function submitOnboarding(metadata, filesByField) {
  const fd = new FormData();
  fd.append('metadata', JSON.stringify(metadata));

  Object.entries(filesByField).forEach(([key, file]) => {
    if (file instanceof File) {
      fd.append(key, file);
    }
  });

  const url = buildApiUrl(API_ENDPOINTS.ONBOARDING.SUBMIT);
  const res = await fetch(url, {
    method: 'POST',
    body: fd
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Submission failed (${res.status})`);
  }
  return data;
}
