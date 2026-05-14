import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Pie, Line, Bar } from 'react-chartjs-2';
import { useBasketUser } from '../context/BasketUserContext';
import { getBasketById } from '../data/baskets';
import { openBasketCheckout } from '../services/basketPayment';
import { validatePaymentConfig } from '../../utils/paymentConfig';
import { isBackendAvailable } from '../../api/config';

function sipCorpus(monthly, years, annualPct) {
  const r = annualPct / 100 / 12;
  const n = years * 12;
  if (r === 0) return monthly * n;
  return Math.round(monthly * ((1 + r) ** n - 1) / r);
}

export default function BasketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { catalog, hasAccess, unlockBasket, user, setUser, darkMode } = useBasketUser();
  const basket = useMemo(() => getBasketById(catalog, id), [catalog, id]);
  const [sipMonthly, setSipMonthly] = useState(10000);
  const [sipYears, setSipYears] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [paying, setPaying] = useState(false);
  const [err, setErr] = useState(null);

  const paid = basket && hasAccess(basket.id);
  const chartText = darkMode ? '#e8ecf2' : '#1a2433';
  const chartGrid = darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(11,31,58,0.08)';

  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  if (!basket) {
    return (
      <div style={{ padding: '3rem 0', textAlign: 'center' }}>
        <p>Basket not found.</p>
        <Link to="/invest">Back to discover</Link>
      </div>
    );
  }

  const allocSlices = paid ? basket.allocationFull : basket.allocationPreviewFree;

  const pieData = {
    labels: allocSlices.map((x) => x.name || x.label),
    datasets: [
      {
        data: allocSlices.map((x) => x.pct),
        backgroundColor: allocSlices.map((x) => x.color),
        borderWidth: 0,
      },
    ],
  };

  const lineData = {
    labels: basket.performanceLine.map((_, i) => (i % 6 === 0 ? `M${i + 1}` : '')),
    datasets: [
      {
        label: 'Illustrative basket trajectory',
        data: basket.performanceLine.map((p) => p.v),
        borderColor: '#00A676',
        backgroundColor: 'rgba(0,166,118,0.15)',
        fill: true,
        tension: 0.35,
        pointRadius: 0,
      },
    ],
  };

  const drawdownData = {
    labels: basket.drawdownHistory.map((_, i) => (i % 6 === 0 ? `${i + 1}` : '')),
    datasets: [
      {
        label: 'Drawdown % (illustrative)',
        data: basket.drawdownHistory.map((p, i) => 100 - p.v + (i % 7) * 0.1),
        borderColor: '#e63946',
        backgroundColor: 'rgba(230,57,70,0.08)',
        fill: true,
        tension: 0.3,
        pointRadius: 0,
      },
    ],
  };

  const barData = {
    labels: basket.rollingReturns.map((r) => r.period),
    datasets: [
      { label: '25th pct', data: basket.rollingReturns.map((r) => r.p25), backgroundColor: 'rgba(91,140,255,0.6)' },
      { label: 'Median', data: basket.rollingReturns.map((r) => r.p50), backgroundColor: '#00A676' },
      { label: '75th pct', data: basket.rollingReturns.map((r) => r.p75), backgroundColor: 'rgba(201,162,39,0.7)' },
    ],
  };

  const commonOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: chartText } },
    },
    scales: {
      x: { ticks: { color: chartText, maxRotation: 0 }, grid: { color: chartGrid } },
      y: { ticks: { color: chartText }, grid: { color: chartGrid } },
    },
  };

  const pieOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: chartText, boxWidth: 10, font: { size: 11 } } },
    },
  };

  const startPay = async () => {
    setErr(null);
    if (!form.email || !form.phone) {
      setErr('Email and phone are required for invoice and payment.');
      return;
    }
    if (!validatePaymentConfig()) {
      setErr('Payment keys not configured. Set REACT_APP_RAZORPAY_KEY_ID.');
      return;
    }
    if (!isBackendAvailable() && process.env.NODE_ENV === 'production') {
      setErr('API base URL missing. Set REACT_APP_API_BASE_URL.');
      return;
    }
    const userData = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      source: 'elemental_basket',
    };
    setUser(userData);
    setPaying(true);
    try {
      await openBasketCheckout({
        basket,
        userData,
        onSuccess: (res) => {
          unlockBasket(basket.id);
          setPaying(false);
          setModalOpen(false);
          navigate('/invest/payment-success', {
            state: { basketId: basket.id, paymentId: res.razorpay_payment_id },
          });
        },
        onFailure: (e) => {
          setPaying(false);
          if (e?.message !== 'Payment cancelled') setErr(e?.message || 'Payment failed');
        },
      });
    } catch (e) {
      setPaying(false);
      setErr(e?.message || 'Could not start checkout');
    }
  };

  const corpus = sipCorpus(sipMonthly, sipYears, basket.metrics.cagr3y);

  return (
    <>
      <section style={{ paddingTop: '1.5rem' }}>
        <div style={{ fontSize: '3rem', lineHeight: 1 }}>{basket.symbol}</div>
        <h1 style={{ fontSize: 'clamp(1.75rem,4vw,2.5rem)', fontWeight: 800, margin: '0.5rem 0' }}>{basket.name}</h1>
        <p className="an-muted" style={{ marginBottom: 12 }}>
          {basket.tagline}
        </p>
        <div style={{ marginBottom: 16 }}>
          {basket.tags.map((t) => (
            <span key={t} className="an-tag">
              {t}
            </span>
          ))}
        </div>
        <div className="an-glass-card" style={{ padding: '1rem 1.25rem', display: 'inline-block', marginBottom: 20 }}>
          <div className="an-gold-text" style={{ fontSize: '1.75rem', fontWeight: 800 }}>
            ₹{basket.price.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>{basket.priceLabel}</div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {!paid && (
            <button type="button" className="an-btn-primary an-btn-gold" onClick={() => setModalOpen(true)}>
              Unlock Basket
            </button>
          )}
          <a className="an-btn-ghost" href="#factsheet" onClick={(e) => e.preventDefault()}>
            Download Factsheet
          </a>
          {paid && (
            <>
              <span className="an-btn-primary" style={{ cursor: 'default' }}>
                Invest Now
              </span>
              <span className="an-btn-ghost" style={{ cursor: 'default' }}>
                Start SIP
              </span>
            </>
          )}
        </div>
      </section>

      <section className="an-glass-card" style={{ padding: '1.25rem', marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 12 }}>Portfolio visualization</h2>
        <div style={{ display: 'grid', gap: '1.25rem', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))' }}>
          <div style={{ height: 240 }}>
            <Pie data={pieData} options={pieOpts} />
          </div>
          <div>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 8 }}>Risk score</h3>
            <div className="an-vol-bar" style={{ height: 10 }}>
              <div className="an-vol-fill" style={{ width: `${basket.riskScore}%` }} />
            </div>
            <p style={{ fontSize: '0.8rem', opacity: 0.75, marginTop: 8 }}>Model score {basket.riskScore}/100 — illustrative.</p>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, margin: '16px 0 8px' }}>Market cap</h3>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: '0.85rem', opacity: 0.9 }}>
              {basket.marketCap.map((m) => (
                <li key={m.label}>
                  {m.label}: {m.pct}%
                </li>
              ))}
            </ul>
          </div>
        </div>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: 20 }}>Sector allocation</h3>
        <ul style={{ columns: 2, fontSize: '0.8rem', opacity: 0.9 }}>
          {basket.sectors.map((s) => (
            <li key={s.label} style={{ marginBottom: 4 }}>
              {s.label}: {s.pct}%
            </li>
          ))}
        </ul>
      </section>

      <section className="an-glass-card" style={{ padding: '1.25rem', marginTop: '1.25rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 8 }}>Funds & overlap</h2>
        {!paid && (
          <p style={{ fontSize: '0.8rem', color: 'var(--an-risk)', marginBottom: 8 }}>
            Exact schemes and weights unlock after purchase.
          </p>
        )}
        <div className={!paid ? 'an-blur-lock' : ''}>
          <table style={{ width: '100%', fontSize: '0.8rem', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', opacity: 0.7 }}>
                <th style={{ padding: '6px 0' }}>Scheme</th>
                <th>%</th>
                <th>Overlap</th>
              </tr>
            </thead>
            <tbody>
              {basket.funds.map((f) => (
                <tr key={f.scheme}>
                  <td style={{ padding: '6px 0' }}>{f.scheme}</td>
                  <td>{f.pct}%</td>
                  <td>{f.overlap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="an-glass-card" style={{ padding: '1.25rem', marginTop: '1.25rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 12 }}>Why this basket</h2>
        <div style={{ display: 'grid', gap: 12, fontSize: '0.9rem', lineHeight: 1.55 }}>
          <p>
            <strong>Allocation:</strong> {basket.whyBasket.allocation}
          </p>
          <p>
            <strong>Market positioning:</strong> {basket.whyBasket.market}
          </p>
          <p>
            <strong>Risk framework:</strong> {basket.whyBasket.framework}
          </p>
          <p>
            <strong>Ideal investor:</strong> {basket.whyBasket.ideal}
          </p>
          <p style={{ color: 'var(--an-risk)' }}>
            <strong>Who should avoid:</strong> {basket.whyBasket.avoid}
          </p>
          <p>
            <strong>Outlook:</strong> {basket.whyBasket.outlook}
          </p>
        </div>
      </section>

      <section className="an-glass-card" style={{ padding: '1.25rem', marginTop: '1.25rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 12 }}>Performance analytics</h2>
        <div style={{ height: 220, marginBottom: 20 }}>
          <Line data={lineData} options={{ ...commonOpts, plugins: { ...commonOpts.plugins, legend: { display: false } } }} />
        </div>
        <div style={{ height: 200, marginBottom: 20 }}>
          <Line data={drawdownData} options={{ ...commonOpts, plugins: { ...commonOpts.plugins, legend: { display: false } } }} />
        </div>
        <div style={{ height: 200 }}>
          <Bar data={barData} options={commonOpts} />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 16, fontSize: '0.85rem' }}>
          <span>CAGR (3Y): {basket.metrics.cagr3y}%</span>
          <span>CAGR (5Y): {basket.metrics.cagr5y}%</span>
          <span>Sharpe: {basket.metrics.sharpe}</span>
          <span>Max DD: {basket.metrics.maxDrawdown}%</span>
          <span>Beta: {basket.metrics.beta}</span>
        </div>
      </section>

      <section className="an-glass-card" style={{ padding: '1.25rem', marginTop: '1.25rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 12 }}>SIP simulation</h2>
        <div className="an-form-group">
          <label htmlFor="sipm">Monthly SIP (₹)</label>
          <input
            id="sipm"
            type="number"
            min={500}
            step={500}
            value={sipMonthly}
            onChange={(e) => setSipMonthly(Number(e.target.value))}
          />
        </div>
        <div className="an-form-group">
          <label htmlFor="sipy">Years</label>
          <input id="sipy" type="number" min={1} max={30} value={sipYears} onChange={(e) => setSipYears(Number(e.target.value))} />
        </div>
        <p style={{ fontSize: '0.9rem' }}>
          Illustrative corpus at ~{basket.metrics.cagr3y}% CAGR assumption:{' '}
          <strong className="an-gold-text">₹{corpus.toLocaleString('en-IN')}</strong>
        </p>
      </section>

      <section className="an-glass-card" style={{ padding: '1.25rem', marginTop: '1.25rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 12 }}>Rebalancing engine</h2>
        <p style={{ fontSize: '0.9rem' }}>
          Last rebalance: <strong>{basket.rebalance.lastDate}</strong> · Next review: {basket.rebalance.nextDue} · Drift:{' '}
          {basket.rebalance.driftPct}% · <span style={{ color: 'var(--an-emerald)' }}>{basket.rebalance.status}</span>
        </p>
        <ul style={{ fontSize: '0.85rem', opacity: 0.9 }}>
          {basket.rebalance.log.map((l) => (
            <li key={l.date}>
              {l.date}: {l.change}
            </li>
          ))}
        </ul>
      </section>

      <section className="an-glass-card" style={{ padding: '1.25rem', marginTop: '1.25rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 12 }}>Research & insights</h2>
        <div style={{ display: 'grid', gap: 12 }}>
          {basket.research.map((r) => (
            <div key={r.title} style={{ borderLeft: '3px solid var(--an-emerald)', paddingLeft: 12 }}>
              <div style={{ fontSize: '0.7rem', opacity: 0.65 }}>{r.date}</div>
              <div style={{ fontWeight: 700 }}>{r.title}</div>
              <p style={{ fontSize: '0.85rem', margin: '6px 0 0', opacity: 0.85 }}>{r.excerpt}</p>
            </div>
          ))}
        </div>
      </section>

      <p id="factsheet" className="an-compliance" style={{ marginTop: '1.5rem' }}>
        Factsheet download wires to your document store — placeholder in this build. All charts use curated dummy data
        for UX demonstration.
      </p>

      {!paid && (
        <div className="an-sticky-cta an-hide-md">
          <div className="an-sticky-cta-inner">
            <button type="button" className="an-btn-primary an-btn-gold" onClick={() => setModalOpen(true)}>
              Unlock {basket.name} — ₹{basket.price.toLocaleString('en-IN')}
            </button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="an-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !paying && setModalOpen(false)}
            role="presentation"
          >
            <motion.div
              className="an-modal"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ marginTop: 0 }}>Unlock {basket.symbol} {basket.name}</h3>
              <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                Enter details for Razorpay checkout, invoice, and confirmations (email / WhatsApp via your ops
                pipeline).
              </p>
              {['firstName', 'lastName', 'email', 'phone'].map((field) => (
                <div key={field} className="an-form-group">
                  <label htmlFor={field}>{field === 'phone' ? 'Phone' : field.replace(/^\w/, (c) => c.toUpperCase())}</label>
                  <input
                    id={field}
                    type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                    value={form[field]}
                    onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                  />
                </div>
              ))}
              {err && <p style={{ color: 'var(--an-risk)', fontSize: '0.85rem' }}>{err}</p>}
              <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                <button type="button" className="an-btn-ghost" disabled={paying} onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="button" className="an-btn-primary an-btn-gold" disabled={paying} onClick={startPay}>
                  {paying ? 'Opening…' : 'Pay with Razorpay'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
