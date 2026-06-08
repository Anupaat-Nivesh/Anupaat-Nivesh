import React from 'react';
import { Link } from 'react-router-dom';
import { formatNav, formatReturnPct, formatAumCr, formatInceptionDate } from '../../utils/mfMetrics';

function StatIcon() {
  return (
    <span className="an-fund-metric-icon" aria-hidden="true">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="17" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 2v4M16 2v4M3 10h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function InfoHint({ title }) {
  return (
    <span className="an-fund-info-hint" title={title} aria-label={title}>
      ⓘ
    </span>
  );
}

export default function FundDetailSidebar({
  profile,
  displayCagr,
  cagrPeriod,
  onCagrPeriodChange,
  schemeDocLabel,
  schemeDocumentUrl,
}) {
  const navPositive = profile.navChange1d == null || profile.navChange1d >= 0;
  const cagrNegative = displayCagr != null && displayCagr < 0;

  return (
    <aside className="an-fund-sidebar">
      <div className="an-fund-metric-card an-fund-metric-card--nav">
        <div className="an-fund-metric-card__head">
          <StatIcon />
          <span className="an-fund-metric-card__label">Current NAV</span>
        </div>
        <div className="an-fund-metric-card__value-row">
          <span className="an-fund-metric-card__value an-fund-metric-card__value--nav">
            {formatNav(profile.latestNav)}
          </span>
          {profile.navChange1d != null && (
            <span
              className={`an-fund-change-pill ${navPositive ? 'an-fund-change-pill--up' : 'an-fund-change-pill--down'}`}
            >
              {formatReturnPct(profile.navChange1d)}
            </span>
          )}
        </div>
        {(profile.navDate || profile.latestNavDate) && (
          <span className="an-fund-metric-card__hint">
            as on {profile.navDate || formatInceptionDate(profile.latestNavDate)}
          </span>
        )}
      </div>

      <div className="an-fund-metric-card">
        <div className="an-fund-metric-card__head an-fund-metric-card__head--split">
          <div className="an-fund-metric-card__head-left">
            <StatIcon />
            <span className="an-fund-metric-card__label">CAGR</span>
          </div>
          <select
            className="an-fund-metric-select"
            value={cagrPeriod}
            onChange={(e) => onCagrPeriodChange(e.target.value)}
            aria-label="CAGR period"
          >
            <option value="1y">1 Year</option>
            <option value="3y">3 Year</option>
            <option value="5y">5 Year</option>
            <option value="max">Max</option>
          </select>
        </div>
        <span
          className={`an-fund-metric-card__value ${cagrNegative ? 'an-fund-metric-card__value--neg' : 'an-fund-metric-card__value--pos'}`}
        >
          {displayCagr != null ? formatReturnPct(displayCagr) : '—'}
        </span>
      </div>

      <div className="an-fund-metric-card an-fund-metric-card--grid">
        <div className="an-fund-metric-mini">
          <span className="an-fund-metric-mini__label">Min. investment</span>
          <strong>₹100</strong>
        </div>
        <div className="an-fund-metric-mini">
          <span className="an-fund-metric-mini__label">AUM</span>
          <strong>{formatAumCr(profile.aumCr)}</strong>
        </div>
        <div className="an-fund-metric-mini">
          <span className="an-fund-metric-mini__label">
            Exit load <InfoHint title="Refer to scheme factsheet for exit load structure" />
          </span>
          <strong>{profile.exitLoad || '—'}</strong>
        </div>
        <div className="an-fund-metric-mini">
          <span className="an-fund-metric-mini__label">
            Expense ratio <InfoHint title="Total expense ratio as reported by AMC when available" />
          </span>
          <strong>{profile.expenseRatio != null ? `${profile.expenseRatio}%` : '—'}</strong>
        </div>
      </div>

      <div className="an-fund-sidebar-links">
        <Link to="/invest/funds" className="an-fund-sidebar-link">
          <span aria-hidden="true">⊞</span> Compare
        </Link>
        {schemeDocumentUrl && (
          <a
            href={schemeDocumentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="an-fund-sidebar-link"
          >
            <span aria-hidden="true">↓</span> {schemeDocLabel}
          </a>
        )}
      </div>

      <div className="an-fund-sidebar-cta">
        <Link to="/book-consultation" className="an-fund-cta-btn an-fund-cta-btn--primary">
          Book consultation
        </Link>
        <Link to="/invest/baskets" className="an-fund-cta-btn an-fund-cta-btn--secondary">
          Explore baskets
        </Link>
      </div>
    </aside>
  );
}
