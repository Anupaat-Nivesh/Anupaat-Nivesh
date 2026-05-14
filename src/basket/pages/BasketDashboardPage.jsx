import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBasketUser } from '../context/BasketUserContext';
import { getBasketById } from '../data/baskets';

export default function BasketDashboardPage() {
  const { catalog, unlockedIds, premium, riskProfile, goals, hasAccess } = useBasketUser();
  const unlocked = catalog.filter((b) => hasAccess(b.id));

  return (
    <section style={{ paddingTop: '1rem' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Wealth dashboard</h1>
      <p className="an-muted">Portfolio intelligence snapshot — dummy aggregates for UX.</p>

      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', marginTop: '1.25rem' }}>
        {[
          { k: 'Net worth (demo)', v: '₹42.8L', d: '+0.62% today' },
          { k: 'Risk health', v: '78/100', d: 'Balanced drift' },
          { k: 'Goals funded', v: `${goals.length} active`, d: 'Goal GPS' },
          { k: 'Premium', v: premium ? 'Active' : 'Free', d: premium ? '₹499/mo' : 'Unlock baskets' },
        ].map((card, i) => (
          <motion.div
            key={card.k}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="an-glass-card"
            style={{ padding: '1rem' }}
          >
            <div style={{ fontSize: '0.7rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{card.k}</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, marginTop: 6 }}>{card.v}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--an-emerald)', marginTop: 4 }}>{card.d}</div>
          </motion.div>
        ))}
      </div>

      <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginTop: '2rem' }}>Your baskets</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {catalog.map((b) => {
          const access = hasAccess(b.id);
          return (
            <div key={b.id} className="an-glass-card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
              <div>
                <span style={{ fontSize: '1.5rem', marginRight: 8 }}>{b.symbol}</span>
                <strong>{b.name}</strong>
                <div style={{ fontSize: '0.8rem', opacity: 0.75 }}>Illustrative YTD +{b.metrics.cagr3y}%</div>
              </div>
              {access ? (
                <Link className="an-btn-primary" to={`/invest/basket/${b.id}`} style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                  Open analytics
                </Link>
              ) : (
                <Link className="an-btn-ghost" to={`/invest/basket/${b.id}`} style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                  Preview & unlock
                </Link>
              )}
            </div>
          );
        })}
      </div>

      <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginTop: '2rem' }}>SIP calendar</h2>
      <div className="an-glass-card" style={{ padding: '1rem', fontSize: '0.85rem' }}>
        <p style={{ margin: '0 0 8px', opacity: 0.85 }}>Upcoming debits (demo)</p>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          <li>5th — {getBasketById(catalog, 'water')?.name || 'WATER'} SIP ₹10,000</li>
          <li>12th — {getBasketById(catalog, 'fire')?.name || 'FIRE'} SIP ₹15,000</li>
          <li>20th — Emergency liquid SIP ₹5,000</li>
        </ul>
      </div>

      <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginTop: '2rem' }}>Rebalance & risk</h2>
      <div className="an-glass-card" style={{ padding: '1rem', fontSize: '0.9rem' }}>
        <p>
          Unlocked baskets: <strong>{unlocked.length}</strong> of {catalog.length}. IDs: {unlockedIds.join(', ') || '—'}
        </p>
        <p style={{ opacity: 0.85 }}>
          Next quarterly review window: <strong>Apr 15 – Apr 22</strong>. Drift monitors are within policy for unlocked
          sleeves.
        </p>
      </div>

      {riskProfile && (
        <div className="an-glass-card" style={{ padding: '1rem', marginTop: '1rem', fontSize: '0.9rem' }}>
          <strong>Last risk profile:</strong> score {riskProfile.score} → recommended{' '}
          <Link to={`/invest/basket/${riskProfile.recommendedId}`}>{riskProfile.recommendedId?.toUpperCase()}</Link>
        </div>
      )}

      <div style={{ marginTop: '2rem', display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        <Link to="/invest/goals" className="an-btn-primary">
          Goal GPS
        </Link>
        <Link to="/invest/risk-profile" className="an-btn-ghost">
          Retake risk test
        </Link>
        <Link to="/invest/admin" className="an-btn-ghost" style={{ opacity: 0.6 }}>
          Admin
        </Link>
      </div>
    </section>
  );
}
