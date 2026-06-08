import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBasketUser } from '../context/BasketUserContext';
import { defaultBaskets } from '../data/baskets';

const ADMIN_KEY = process.env.REACT_APP_BASKET_ADMIN_SECRET || 'elemental-admin';
const SESS = 'an_basket_admin_sess';

export default function BasketAdminPage() {
  const { catalog, setAdminCatalogPatch } = useBasketUser();
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESS) === '1');
  const [pwd, setPwd] = useState('');
  const [rows, setRows] = useState([]);

  useEffect(() => {
    setRows(catalog.map((c) => ({ ...c })));
  }, [catalog]);

  const login = (e) => {
    e.preventDefault();
    if (pwd === ADMIN_KEY) {
      sessionStorage.setItem(SESS, '1');
      setAuthed(true);
    }
  };

  const save = () => {
    const patches = rows.map((r) => ({
      id: r.id,
      price: Number(r.price),
      minInvestment: Number(r.minInvestment),
    }));
    setAdminCatalogPatch(patches);
    alert('Catalog patches saved to localStorage (API-ready payload).');
  };

  if (!authed) {
    return (
      <div className="an-glass-card" style={{ maxWidth: 400, margin: '3rem auto', padding: '1.5rem' }}>
        <h1 style={{ fontSize: '1.25rem' }}>Basket admin</h1>
        <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>Demo gate — set REACT_APP_BASKET_ADMIN_SECRET in production.</p>
        <form onSubmit={login}>
          <div className="an-form-group">
            <label htmlFor="ap">Password</label>
            <input id="ap" type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} autoComplete="off" />
          </div>
          <button type="submit" className="an-btn-primary">
            Unlock admin
          </button>
        </form>
        <Link to="/invest/baskets" style={{ display: 'block', marginTop: 16, fontSize: '0.85rem' }}>
          ← Back
        </Link>
      </div>
    );
  }

  return (
    <section style={{ paddingTop: '1rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Basket administration</h1>
      <p className="an-muted">No-code-style panel: pricing & floors persisted client-side for this build.</p>

      <div style={{ overflowX: 'auto', marginTop: '1.25rem' }} className="an-glass-card">
        <table style={{ width: '100%', fontSize: '0.85rem', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ padding: 12 }}>Basket</th>
              <th style={{ padding: 12 }}>Price (₹)</th>
              <th style={{ padding: 12 }}>Min inv (₹)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <td style={{ padding: 12 }}>
                  {r.symbol} {r.name}
                </td>
                <td style={{ padding: 12 }}>
                  <input
                    type="number"
                    value={r.price}
                    onChange={(e) => {
                      const v = e.target.value;
                      setRows((prev) => prev.map((x, i) => (i === idx ? { ...x, price: v } : x)));
                    }}
                    style={{ width: 100 }}
                  />
                </td>
                <td style={{ padding: 12 }}>
                  <input
                    type="number"
                    value={r.minInvestment}
                    onChange={(e) => {
                      const v = e.target.value;
                      setRows((prev) => prev.map((x, i) => (i === idx ? { ...x, minInvestment: v } : x)));
                    }}
                    style={{ width: 100 }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 16, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button type="button" className="an-btn-primary" onClick={save}>
          Save changes
        </button>
        <button
          type="button"
          className="an-btn-ghost"
          onClick={() => {
            setAdminCatalogPatch([]);
            setRows(defaultBaskets.map((d) => ({ ...d })));
          }}
        >
          Reset overrides
        </button>
        <Link className="an-btn-ghost" to="/invest/baskets">
          Exit
        </Link>
      </div>

      <p style={{ fontSize: '0.75rem', opacity: 0.65, marginTop: 24 }}>
        Future: users table, coupons, research CMS, rebalance push — wire to PostgreSQL + role-based API.
      </p>
    </section>
  );
}
