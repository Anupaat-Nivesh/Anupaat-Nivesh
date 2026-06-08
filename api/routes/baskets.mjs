import { Router } from 'express';
import {
  loadBasketMaster,
  getPublicAnalytics,
  getPrivateHoldings,
  refreshAllBasketAnalytics,
} from '../services/basketAnalyticsEngine.mjs';

const router = Router();
const ADMIN_KEY = process.env.BASKET_ADMIN_SECRET || process.env.REACT_APP_BASKET_ADMIN_SECRET || 'elemental-admin';
const CRON_SECRET = process.env.CRON_SECRET || process.env.BASKET_CRON_SECRET;

function isAuthorizedCron(req) {
  if (!CRON_SECRET) return false;
  const auth = req.headers.authorization || '';
  const bearer = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  const header = req.headers['x-cron-secret'];
  const query = req.query.secret;
  return bearer === CRON_SECRET || header === CRON_SECRET || query === CRON_SECRET;
}

router.get('/master', (_req, res) => {
  const master = loadBasketMaster();
  const publicBaskets = master.baskets.map((b) => ({
    id: b.id,
    code: b.code,
    name: b.name,
    fullName: b.fullName,
    riskLevel: b.riskLevel,
    horizonYears: b.horizonYears,
    expectedReturn: b.expectedReturn,
    price: b.price,
    fundCount: b.fundCount,
    assetAllocation: b.assetAllocation,
    portfolioConstruction: b.portfolioConstruction,
    sectors: b.sectors,
    anScore: b.anScore,
  }));
  res.json({ baskets: publicBaskets });
});

/** Vercel Cron — must be registered before /:id routes */
router.get('/cron/refresh', async (req, res) => {
  if (!isAuthorizedCron(req)) {
    return res.status(401).json({ error: 'Unauthorized cron' });
  }
  try {
    const result = await refreshAllBasketAnalytics();
    res.json({
      ok: true,
      updated: Object.keys(result.baskets),
      updatedAt: result.updatedAt,
    });
  } catch (e) {
    console.error('Cron basket refresh failed:', e);
    res.status(500).json({ error: e.message || 'Refresh failed' });
  }
});

router.post('/refresh', async (req, res) => {
  const key = req.headers['x-basket-admin-key'] || req.body?.key;
  if (key !== ADMIN_KEY && !isAuthorizedCron(req)) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  try {
    const ids = req.body?.basketIds;
    const result = await refreshAllBasketAnalytics({ basketIds: ids });
    res.json({ ok: true, updated: Object.keys(result.baskets) });
  } catch (e) {
    console.error('Basket refresh failed:', e);
    res.status(500).json({ error: e.message || 'Refresh failed' });
  }
});

router.get('/:id/analytics', async (req, res) => {
  try {
    const data = await getPublicAnalytics(req.params.id);
    if (!data) {
      return res.status(404).json({
        error: 'Analytics not computed yet. Daily refresh runs at 11 PM IST via GitHub Actions / Vercel Cron.',
      });
    }
    res.json(data);
  } catch (e) {
    console.error('Analytics read failed:', e);
    res.status(500).json({ error: 'Failed to load analytics' });
  }
});

router.get('/:id/holdings', (req, res) => {
  const key = req.headers['x-basket-admin-key'] || req.query.key;
  if (key !== ADMIN_KEY) {
    return res.status(403).json({ error: 'Unlock required' });
  }
  const holdings = getPrivateHoldings(req.params.id);
  if (!holdings) return res.status(404).json({ error: 'Basket not found' });
  res.json({ basketId: req.params.id, holdings });
});

export default router;
