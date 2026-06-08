import { getApiBaseUrl } from '../../api/config';

export function screenersHubUrl() {
  const base = getApiBaseUrl();
  return base ? `${base}/api/screeners/hub` : '/api/screeners/hub';
}

export function sectorRotationUrl() {
  const base = getApiBaseUrl();
  return base ? `${base}/api/screeners/sector-rotation` : '/api/screeners/sector-rotation';
}

export async function fetchScreenersHub() {
  const res = await fetch(screenersHubUrl(), { headers: { Accept: 'application/json' } });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export async function fetchSectorRotation() {
  const res = await fetch(sectorRotationUrl(), { headers: { Accept: 'application/json' } });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}
