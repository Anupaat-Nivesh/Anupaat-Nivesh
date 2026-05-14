import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { useBasketUser } from '../context/BasketUserContext';
import { futureBaskets } from '../data/baskets';

function MiniBars() {
  const h = [40, 65, 45, 80, 55, 90, 70, 95, 75, 100, 85, 110];
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 120, paddingTop: 8 }}>
      {h.map((height, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: `${height}%` }}
          transition={{ delay: i * 0.04, duration: 0.5, ease: 'easeOut' }}
          style={{
            flex: 1,
            borderRadius: 4,
            background: i % 3 === 0 ? 'linear-gradient(180deg,#00A676,#0B1F3A)' : 'rgba(0,166,118,0.35)',
            minHeight: 8,
          }}
        />
      ))}
    </div>
  );
}

export default function BasketLanding() {
  const { catalog } = useBasketUser();

  return (
    <>
      <section className="an-hero">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--an-emerald)', marginBottom: '0.75rem' }}
          >
            Portfolio Intelligence & Goal-Based Wealth
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            Invest with Strategy,
            <br />
            <span className="an-gold-text">Not Noise.</span>
          </motion.h1>
          <p className="an-muted" style={{ marginTop: '1rem' }}>
            Professionally curated mutual fund baskets designed for long-term wealth creation and intelligent risk
            management — the Elemental framework by Anupaat Nivesh.
          </p>
          <div className="an-hero-ctas">
            <a className="an-btn-primary" href="#baskets">
              Explore Baskets
            </a>
            <Link to="/invest/risk-profile" className="an-btn-ghost">
              Take Risk Profile Test
            </Link>
            <Link to="/invest/dashboard" className="an-btn-ghost">
              Start Investing
            </Link>
          </div>
          <div className="an-trust-row">
            <span className="an-trust-pill">SEBI-aligned research process</span>
            <span className="an-trust-pill">Risk-first rebalancing</span>
            <span className="an-trust-pill">
              AUM perspective <CountUp end={128} duration={2.2} suffix=" Cr+" />
            </span>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="an-glass-card"
          style={{ padding: '1.5rem', marginTop: '2rem' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Wealth preview</span>
            <span className="an-gold-text" style={{ fontWeight: 800 }}>
              +14.2%
            </span>
          </div>
          <MiniBars />
          <p style={{ fontSize: '0.75rem', opacity: 0.65, marginTop: 12, marginBottom: 0 }}>
            Illustrative trajectory — not a promise of returns.
          </p>
        </motion.div>
      </section>

      <section id="baskets">
        <h2 className="an-section-title">Featured Elemental Baskets</h2>
        <div className="an-basket-grid">
          {catalog.map((b, idx) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
            >
              <Link
                to={`/invest/basket/${b.id}`}
                className="an-basket-card an-glass-card"
                style={{ backgroundImage: b.cardGradient }}
              >
                <div
                  className="an-basket-card__glow"
                  style={{
                    background: `radial-gradient(circle at 30% 20%, ${b.glowColor}, transparent 55%)`,
                  }}
                />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>{b.symbol}</div>
                  <h3 style={{ margin: '0 0 0.25rem', fontWeight: 800, fontSize: '1.35rem' }}>{b.name}</h3>
                  <p style={{ fontSize: '0.8rem', opacity: 0.85, marginBottom: 12 }}>{b.tagline}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, fontSize: '0.75rem', marginBottom: 12 }}>
                    <span className="an-tag">{b.riskLevel}</span>
                    <span className="an-tag">{b.horizonYears}</span>
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: 4 }}>
                      <span>Volatility</span>
                      <span>{b.volatilityPct}%</span>
                    </div>
                    <div className="an-vol-bar">
                      <div className="an-vol-fill" style={{ width: `${b.volatilityPct}%` }} />
                    </div>
                  </div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                    Min ₹{b.minInvestment.toLocaleString('en-IN')} ·{' '}
                    <span className="an-gold-text" style={{ fontWeight: 700 }}>
                      ₹{b.price.toLocaleString('en-IN')}
                    </span>{' '}
                    {b.priceLabel}
                  </div>
                  <div style={{ marginTop: 14, fontWeight: 700, color: 'var(--an-emerald)' }}>View basket →</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: '2.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 12 }}>Coming soon</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {futureBaskets.map((f) => (
            <div key={f.id} className="an-glass-card" style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', opacity: 0.85 }}>
              {f.symbol} {f.name} — {f.tagline}
            </div>
          ))}
        </div>
      </section>

      <footer className="an-compliance">
        Mutual Fund investments are subject to market risks. Read all scheme-related documents carefully. Past
        performance is not indicative of future results. There are no guaranteed returns. Anupaat Nivesh is not
        responsible for execution of transactions — consult your advisor / RTA as applicable. AMFI registered ARN
        messaging to be inserted as per your compliance template.
      </footer>
    </>
  );
}
