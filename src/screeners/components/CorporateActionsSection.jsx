import React, { useEffect, useState } from 'react';
import FilterInfoButton from '../../shared/marketInsights/FilterInfoButton';
import {
  fetchCorporateActions,
  NSE_CORPORATE_ACTIONS_URL,
} from '../services/corporateActionsApi';
import '../../shared/marketInsights/market-insights-filters.css';
import '../../shared/marketInsights/screener-context-filters.css';

const CA_SECTION_INFO =
  'Upcoming splits, bonus issues, and dividends from NSE India (ex-date basis). Verify on the exchange before acting.';

function SectionIcon({ tone }) {
  return (
    <span className={`scr-ca__card-icon scr-ca__card-icon--${tone}`} aria-hidden="true">
      {tone === 'split' && (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M4 18l6-8 4 5 6-11"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {tone === 'bonus' && (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="4" y="9" width="16" height="11" rx="1.5" stroke="currentColor" strokeWidth="2" />
          <path d="M12 9V20M4 13h16" stroke="currentColor" strokeWidth="2" />
          <path
            d="M12 9c-2.5 0-4-1.5-4-3.5S9.5 3 12 5c2.5-2 4-1.5 4 0.5S14.5 9 12 9z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {tone === 'dividend' && (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          <path
            d="M12 8v8M9 10.5h6M9 13.5h4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      )}
    </span>
  );
}

function CalendarIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2 6.5h12M5 1.5v2.5M11 1.5v2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ActionCard({ id, tone, title, items, loading, emptyLabel }) {
  return (
    <article id={id} className={`scr-ca__card scr-ca__card--${tone}`}>
      <header className="scr-ca__card-head">
        <div className="scr-ca__card-title-wrap">
          <SectionIcon tone={tone} />
          <h3 className="scr-ca__card-title">{title}</h3>
        </div>
        <a
          className="scr-ca__view-all"
          href={NSE_CORPORATE_ACTIONS_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          View All
          <ChevronRight />
        </a>
      </header>

      <div className="scr-ca__list mi-card-scroll">
        {loading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="scr-ca__item scr-ca__item--skeleton" aria-hidden="true">
              <div className="scr-ca__sk-line scr-ca__sk-line--lg" />
              <div className="scr-ca__sk-line scr-ca__sk-line--sm" />
              <div className="scr-ca__sk-pill" />
              <div className="scr-ca__sk-box" />
            </div>
          ))}

        {!loading && items.length === 0 && (
          <p className="scr-ca__empty">{emptyLabel}</p>
        )}

        {!loading &&
          items.map((row) => (
            <div key={`${row.symbol}-${row.exDate}-${row.subject}`} className="scr-ca__item">
              <div className="scr-ca__item-row">
                <div className="scr-ca__company-name" title={row.companyName}>
                  {row.companyName}
                </div>
                <div className="scr-ca__tag-wrap">
                  <span className={`scr-ca__tag scr-ca__tag--${tone}`}>
                    {row.tag || row.valueTag}
                  </span>
                  {row.kind === 'dividend' && row.perShareLabel && (
                    <span className="scr-ca__per-share">{row.perShareLabel}</span>
                  )}
                </div>
              </div>

              <div className="scr-ca__symbol">{row.symbol}</div>

              {row.kind === 'dividend' && row.dividendType && (
                <div className="scr-ca__div-type">
                  <span className="scr-ca__div-dot" aria-hidden="true" />
                  {row.dividendType}
                </div>
              )}

              <div className="scr-ca__date-pill">
                <CalendarIcon />
                <span>{row.exDate}</span>
              </div>

              {row.kind === 'dividend' ? (
                row.payoutNote && <p className="scr-ca__payout">{row.payoutNote}</p>
              ) : (
                row.description && <p className="scr-ca__note">{row.description}</p>
              )}
            </div>
          ))}
      </div>
    </article>
  );
}

export default function CorporateActionsSection() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState({ splits: [], bonuses: [], dividends: [] });
  const [fetchedAt, setFetchedAt] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetchCorporateActions(5);
        if (cancelled) return;
        setData({
          splits: res.splits || [],
          bonuses: res.bonuses || [],
          dividends: res.dividends || [],
        });
        setFetchedAt(res.fetchedAt || Date.now());
        if (!res.ok) setError(res.error || 'Could not load corporate actions');
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Could not load corporate actions');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="scr-ca" id="corporate-actions" aria-labelledby="scr-ca-heading">
      <div className="scr-ca__head">
        <div className="scr-ca__head-left">
          <span className="scr-ca__head-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="#fff" strokeWidth="2" />
              <path d="M12 7v5l3 2.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <h2 id="scr-ca-heading" className="scr-ca__title">
            Corporate Actions
          </h2>
        </div>
        <div className="scr-ca__head-right">
          {fetchedAt && !loading && !error && (
            <span className="scr-ca__meta">
              Live · NSE ·{' '}
              {new Date(fetchedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          <FilterInfoButton text={CA_SECTION_INFO} label="About corporate actions data" variant="i" align="end" />
        </div>
      </div>

      {error && (
        <p className="scr-ca__error" role="alert">
          {error}. Try again later or see{' '}
          <a href={NSE_CORPORATE_ACTIONS_URL} target="_blank" rel="noopener noreferrer">
            NSE corporate actions
          </a>
          .
        </p>
      )}

      <div className="scr-ca__grid">
        <ActionCard
          id="corporate-actions-split"
          tone="split"
          title="Split Stock Data"
          items={data.splits}
          loading={loading}
          emptyLabel="No upcoming splits in the current window."
        />
        <ActionCard
          id="corporate-actions-bonus"
          tone="bonus"
          title="Bonus Stock Data"
          items={data.bonuses}
          loading={loading}
          emptyLabel="No upcoming bonus issues in the current window."
        />
        <ActionCard
          id="corporate-actions-dividend"
          tone="dividend"
          title="Dividend Stock Data"
          items={data.dividends}
          loading={loading}
          emptyLabel="No upcoming dividends in the current window."
        />
      </div>
    </section>
  );
}
