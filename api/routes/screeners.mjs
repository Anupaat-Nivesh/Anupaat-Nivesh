/**
 * Screeners hub — aggregated NSE market/deals/announcements data.
 * GET /api/screeners/hub
 */

import express from 'express';
import { buildScreenersHubPayload, fetchIndexStrip } from '../services/screenersData.mjs';
import { buildSectorRotationPayload } from '../services/sectorRotationData.mjs';

const router = express.Router();

const CACHE_TTL_MS = 90 * 1000;
let cache = { at: 0, payload: null };
let indicesCache = { at: 0, payload: null };
let sectorRotationCache = { at: 0, payload: null };

router.get('/indices', async (_req, res) => {
  const now = Date.now();
  if (indicesCache.payload && now - indicesCache.at < CACHE_TTL_MS) {
    return res.json({
      ok: true,
      cached: true,
      fetchedAt: indicesCache.at,
      indices: indicesCache.payload,
    });
  }
  try {
    const indices = await fetchIndexStrip();
    indicesCache = { at: now, payload: indices };
    res.json({ ok: true, cached: false, fetchedAt: now, indices });
  } catch (e) {
    console.error('screeners/indices:', e);
    res.status(502).json({ ok: false, error: e?.message || 'Failed to load indices' });
  }
});

router.get('/hub', async (_req, res) => {
  const now = Date.now();
  if (cache.payload && now - cache.at < CACHE_TTL_MS) {
    return res.json({
      ok: true,
      cached: true,
      fetchedAt: cache.at,
      source: 'NSE India',
      ...cache.payload,
    });
  }

  try {
    const payload = await buildScreenersHubPayload();
    cache = { at: now, payload };
    res.json({
      ok: true,
      cached: false,
      fetchedAt: now,
      source: 'NSE India',
      disclaimer:
        'Market breadth, indices, bulk/block deals, and filtered announcements from NSE India (unofficial API). Party classification is heuristic. Deal value (Cr) = quantity × weighted avg price ÷ 10⁷. Not investment advice.',
      ...payload,
    });
  } catch (e) {
    console.error('screeners/hub:', e);
    res.status(502).json({
      ok: false,
      error: e?.message || 'Failed to load screeners hub data',
    });
  }
});

router.get('/sector-rotation', async (_req, res) => {
  const now = Date.now();
  if (sectorRotationCache.payload && now - sectorRotationCache.at < CACHE_TTL_MS) {
    return res.json({
      ok: true,
      cached: true,
      fetchedAt: sectorRotationCache.at,
      source: 'NSE India',
      ...sectorRotationCache.payload,
    });
  }

  try {
    const payload = await buildSectorRotationPayload();
    sectorRotationCache = { at: now, payload };
    res.json({
      ok: true,
      cached: false,
      fetchedAt: now,
      source: 'NSE India',
      disclaimer:
        'Sector indices from NSE India. Relative rotation quadrants are derived (30D RS vs NIFTY 50 + momentum proxy). Not investment advice.',
      ...payload,
    });
  } catch (e) {
    console.error('screeners/sector-rotation:', e);
    res.status(502).json({
      ok: false,
      error: e?.message || 'Failed to load sector rotation data',
    });
  }
});

export default router;
