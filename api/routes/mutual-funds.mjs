/**
 * Mutual fund enrichment — mfdata.in + mfapi.in
 * GET  /api/mutual-funds/enrich/:schemeCode
 * POST /api/mutual-funds/enrich/bulk  { schemeCodes: string[] }
 * GET  /api/mutual-funds/profile/:schemeCode
 */

import express from 'express';
import {
  getSchemeEnrichment,
  enrichSchemesBulk,
  buildFundProfile,
} from '../services/mfEnrichment.mjs';

const router = express.Router();

router.get('/enrich/:schemeCode', async (req, res) => {
  try {
    const data = await getSchemeEnrichment(req.params.schemeCode);
    res.json({ ok: true, ...data });
  } catch (e) {
    console.error('mutual-funds/enrich:', e);
    res.status(502).json({ ok: false, error: e?.message || 'Enrichment failed' });
  }
});

router.post('/enrich/bulk', async (req, res) => {
  const codes = req.body?.schemeCodes || req.body?.scheme_codes || [];
  if (!Array.isArray(codes) || !codes.length) {
    return res.status(400).json({ ok: false, error: 'schemeCodes array required' });
  }
  if (codes.length > 100) {
    return res.status(400).json({ ok: false, error: 'Max 100 scheme codes per request' });
  }

  try {
    const map = await enrichSchemesBulk(codes);
    const schemes = Object.fromEntries(map.entries());
    const available = Object.values(schemes).some((s) => s?.enrichmentAvailable);
    res.json({
      ok: true,
      enrichmentAvailable: available,
      source: available ? 'mfdata.in' : null,
      schemes,
    });
  } catch (e) {
    console.error('mutual-funds/enrich/bulk:', e);
    res.status(502).json({ ok: false, error: e?.message || 'Bulk enrichment failed' });
  }
});

router.get('/profile/:schemeCode', async (req, res) => {
  try {
    const profile = await buildFundProfile(req.params.schemeCode);
    res.json({ ok: true, profile });
  } catch (e) {
    console.error('mutual-funds/profile:', e);
    res.status(502).json({ ok: false, error: e?.message || 'Could not load fund profile' });
  }
});

export default router;
