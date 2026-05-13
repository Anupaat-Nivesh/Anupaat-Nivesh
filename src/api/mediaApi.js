import { apiDelete, apiGet, apiPost, apiPut } from './client';

const MEDIA_BASE = '/api/media';

export const mediaPublicList = async () => {
  const response = await apiGet(`${MEDIA_BASE}/public`);
  return response.items || [];
};

export const mediaAuthMe = async () => apiGet(`${MEDIA_BASE}/auth/me`);
export const mediaAuthLogin = async (payload) => apiPost(`${MEDIA_BASE}/auth/login`, payload);
export const mediaAuthLogout = async () => apiPost(`${MEDIA_BASE}/auth/logout`, {});

export const mediaAdminList = async () => {
  const response = await apiGet(`${MEDIA_BASE}/admin/list`);
  return response.items || [];
};

export const mediaAdminCreate = async ({
  files = [],
  file,
  mediaUrl,
  source,
  date,
  descriptionPurpose,
  title
}) => {
  const form = new FormData();
  const fileList = Array.isArray(files) && files.length ? files : file ? [file] : [];
  fileList.forEach((f) => {
    if (f) form.append('files', f);
  });
  if (mediaUrl) form.append('mediaUrl', mediaUrl);
  if (source) form.append('source', source);
  if (date) form.append('date', date);
  if (title) form.append('title', title);
  form.append('descriptionPurpose', descriptionPurpose || '');
  return apiPost(`${MEDIA_BASE}/admin/create`, form);
};

export const mediaAdminUpdate = async (id, payload) => apiPut(`${MEDIA_BASE}/admin/${id}`, payload);
export const mediaAdminDelete = async (id) => apiDelete(`${MEDIA_BASE}/admin/${id}`);

export default {
  mediaPublicList,
  mediaAuthMe,
  mediaAuthLogin,
  mediaAuthLogout,
  mediaAdminList,
  mediaAdminCreate,
  mediaAdminUpdate,
  mediaAdminDelete
};
