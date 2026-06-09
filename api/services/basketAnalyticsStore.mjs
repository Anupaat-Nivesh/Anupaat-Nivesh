/**
 * Basket analytics persistence.
 * - Local / GitHub Actions: api/data/basketAnalytics.json (committed, bundled on Vercel deploy)
 * - Vercel Cron: optional Supabase JSON cache (writable on serverless)
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '../data');
const ANALYTICS_PATH = join(DATA_DIR, 'basketAnalytics.json');
const CACHE_ROW_ID = 'latest';
const TABLE = process.env.SUPABASE_BASKET_ANALYTICS_TABLE || 'basket_analytics_cache';

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export function isSupabaseAnalyticsConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function readFileAnalytics() {
  if (!existsSync(ANALYTICS_PATH)) return { baskets: {} };
  return JSON.parse(readFileSync(ANALYTICS_PATH, 'utf8'));
}

function writeFileAnalytics(data) {
  if (process.env.VERCEL === '1') return false;
  mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(ANALYTICS_PATH, JSON.stringify(data, null, 2));
  return true;
}

async function readSupabaseAnalytics() {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from(TABLE)
    .select('payload, updated_at')
    .eq('id', CACHE_ROW_ID)
    .maybeSingle();
  if (error) {
    console.warn('Supabase basket analytics read:', error.message);
    return null;
  }
  if (!data?.payload) return null;
  return { ...data.payload, _supabaseUpdatedAt: data.updated_at };
}

async function writeSupabaseAnalytics(store) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return false;
  const { error } = await supabase.from(TABLE).upsert({
    id: CACHE_ROW_ID,
    payload: store,
    updated_at: new Date().toISOString(),
  });
  if (error) {
    console.warn('Supabase basket analytics write:', error.message);
    return false;
  }
  return true;
}

/** Prefer freshest source: Supabase cache if newer than bundled file, else file. */
export async function loadBasketAnalyticsStore() {
  const fileData = readFileAnalytics();
  const fileUpdated = fileData.updatedAt ? new Date(fileData.updatedAt).getTime() : 0;

  if (!isSupabaseAnalyticsConfigured()) return fileData;

  try {
    const remote = await readSupabaseAnalytics();
    if (!remote) return fileData;
    const remoteUpdated = remote._supabaseUpdatedAt
      ? new Date(remote._supabaseUpdatedAt).getTime()
      : remote.updatedAt
        ? new Date(remote.updatedAt).getTime()
        : 0;
    delete remote._supabaseUpdatedAt;
    return remoteUpdated >= fileUpdated ? remote : fileData;
  } catch (e) {
    console.warn('loadBasketAnalyticsStore:', e.message);
    return fileData;
  }
}

export function loadBasketAnalyticsStoreSync() {
  return readFileAnalytics();
}

export async function saveBasketAnalyticsStore(data) {
  const wroteFile = writeFileAnalytics(data);
  const wroteSupabase = await writeSupabaseAnalytics(data);
  return { wroteFile, wroteSupabase };
}

export function getAnalyticsPath() {
  return ANALYTICS_PATH;
}
