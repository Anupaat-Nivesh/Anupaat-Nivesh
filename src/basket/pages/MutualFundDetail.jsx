import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import InvestSubNav from '../components/InvestSubNav';
import FundNavChart from '../components/invest/FundNavChart';
import FundDetailSidebar from '../components/invest/FundDetailSidebar';
import FundCompositionSection from '../components/invest/FundCompositionSection';
import FundReturnsStrip from '../components/invest/FundReturnsStrip';
import Riskometer from '../components/invest/Riskometer';
import { fetchFullSchemeProfile } from '../services/mfApi';
import {
  formatInceptionDate,
  inferFundCategory,
  categoryLabel,
  fundQualityScore,
  starsFromScore,
} from '../utils/mfMetrics';
import { resolveSchemeDocumentLink } from '../utils/amcLinks';
import '../styles/basket-screener.css';
import '../styles/fund-detail.css';

function fundHouseInitials(fundHouse = '') {
  const words = fundHouse.replace(/\bmutual fund\b/i, '').trim().split(/\s+/).filter(Boolean);
  if (!words.length) return 'M';
  if (words.length === 1) return words[0].slice(0, 1).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export default function MutualFundDetail() {
  const { schemeCode } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cagrPeriod, setCagrPeriod] = useState('1y');

  function computeRiskScore(navSeries) {
    if (!Array.isArray(navSeries) || navSeries.length < 15) return null;
    const window = navSeries.slice(-70);
    const returns = [];
    for (let i = 1; i < window.length; i += 1) {
      const a = window[i - 1]?.nav;
      const b = window[i]?.nav;
      if (!a || !b || a <= 0) continue;
      returns.push(b / a - 1);
    }
    if (returns.length < 10) return null;
    const mean = returns.reduce((s, r) => s + r, 0) / returns.length;
    const variance = returns.reduce((s, r) => s + (r - mean) * (r - mean), 0) / returns.length;
    const stdev = Math.sqrt(variance);
    const annualVol = stdev * Math.sqrt(252);
    return Math.round(Math.max(0, Math.min(100, (annualVol / 0.4) * 100)));
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const p = await fetchFullSchemeProfile(schemeCode);
        if (!cancelled) setProfile(p);
      } catch (e) {
        if (!cancelled) setError(e.message || 'Could not load fund');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [schemeCode]);

  const displayCagr = useMemo(() => {
    if (!profile) return null;
    if (cagrPeriod === '3y') return profile.cagr3y;
    if (cagrPeriod === '5y') return profile.cagr5y;
    if (cagrPeriod === 'max') return profile.cagrTillDate;
    return profile.cagr1y;
  }, [profile, cagrPeriod]);

  const qualityScore = profile ? fundQualityScore(profile) : null;
  const stars = starsFromScore(qualityScore);
  const riskScore = useMemo(() => computeRiskScore(profile?.navSeries), [profile]);
  const managerSearch = useMemo(() => {
    const q = [profile?.schemeName, profile?.fundHouse, 'fund manager'].filter(Boolean).join(' ');
    return `https://www.google.com/search?q=${encodeURIComponent(q)}`;
  }, [profile?.fundHouse, profile?.schemeName]);
  const primaryManager = profile?.composition?.managers?.[0] || profile?.managers?.[0] || null;
  const schemeDocument = useMemo(
    () => resolveSchemeDocumentLink({ factsheetUrl: profile?.factsheetUrl, fundHouse: profile?.fundHouse }),
    [profile?.factsheetUrl, profile?.fundHouse]
  );
  const schemeDocLabel = useMemo(() => {
    const url = schemeDocument.url || '';
    if (schemeDocument.source === 'factsheet' && /\.pdf(\?|$)/i.test(url)) return 'Factsheet (PDF)';
    if (schemeDocument.source === 'factsheet') return 'Factsheet';
    return 'AMC documents';
  }, [schemeDocument]);

  if (loading) {
    return (
      <div className="an-invest-sharp an-fund-detail-page">
        <InvestSubNav />
        <p className="an-sb-muted">Loading fund details…</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="an-invest-sharp an-fund-detail-page">
        <InvestSubNav />
        <p className="an-sb-muted" style={{ color: 'var(--color-primary)' }}>
          {error || 'Fund not found'}
        </p>
        <Link to="/invest/funds" className="an-btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
          Back to fund explorer
        </Link>
      </div>
    );
  }

  const cat = profile.category || inferFundCategory(profile.schemeName, profile.schemeCategory);
  const planLine = [profile.planTags, categoryLabel(cat)].filter(Boolean).join(' · ');

  return (
    <div className="an-invest-sharp an-fund-detail-page">
      <InvestSubNav />

      <nav className="an-fund-breadcrumb">
        <Link to="/invest/funds">Fund explorer</Link>
        <span aria-hidden="true">/</span>
        <span>{profile.schemeName}</span>
      </nav>

      <section className="an-fund-detail-hero">
        <header className="an-fund-detail-hero__header">
          <div className="an-fund-detail-hero__logo" aria-hidden="true">
            {fundHouseInitials(profile.fundHouse)}
          </div>
          <div>
            <h1 className="an-fund-detail-hero__title">{profile.schemeName}</h1>
            <p className="an-fund-detail-hero__tags">{planLine}</p>
            <p className="an-fund-detail-hero__category">{profile.fundHouse}</p>
          </div>
        </header>

        <div className="an-fund-detail-hero__body">
          <FundDetailSidebar
            profile={profile}
            displayCagr={displayCagr}
            cagrPeriod={cagrPeriod}
            onCagrPeriodChange={setCagrPeriod}
            schemeDocLabel={schemeDocLabel}
            schemeDocumentUrl={schemeDocument.url}
          />

          <FundNavChart
            key={profile.schemeCode}
            navSeries={profile.navSeries}
            inceptionDate={profile.inceptionDate}
          />
        </div>
      </section>

      <div className="an-fund-detail-below">
        <FundReturnsStrip
          profile={profile}
          activePeriod={cagrPeriod}
          onPeriodChange={setCagrPeriod}
        />

        <section className="an-sb-card an-fund-snapshot">
          <div className="an-fund-snapshot__top">
            <div className="an-fund-snapshot__risk">
              <Riskometer score={riskScore} label="Risk involved" />
            </div>
            <div className="an-fund-snapshot__meta">
              <div className="an-fund-snapshot__manager">
                <span className="an-fund-snapshot__label">Fund manager</span>
                {primaryManager ? (
                  <p>
                    <strong>{primaryManager.name}</strong>
                    {primaryManager.tenureYears != null && (
                      <span className="an-sb-muted"> · {primaryManager.tenureYears.toFixed(1)} yrs</span>
                    )}
                  </p>
                ) : (
                  <p>
                    <a href={managerSearch} target="_blank" rel="noopener noreferrer">
                      Search manager details
                    </a>
                  </p>
                )}
              </div>
              {stars > 0 && (
                <div>
                  <span className="an-fund-snapshot__label">Our rating (NAV-based)</span>
                  <span className="an-fund-rating an-fund-rating--lg">
                    {'★'.repeat(stars)}
                    <span className="an-fund-rating__dim">{'★'.repeat(5 - stars)}</span>
                  </span>
                  <span className="an-fund-rating-score">Score {qualityScore}</span>
                </div>
              )}
              <div className="an-fund-snapshot__links">
                <a href={schemeDocument.url} target="_blank" rel="noopener noreferrer">
                  {schemeDocLabel}
                </a>
                <a href="#fund-disclaimer">Disclaimer</a>
              </div>
            </div>
          </div>

          <div className="an-fund-snapshot__facts">
            <div>
              <span className="an-fund-snapshot__label">Lock-in period</span>
              <strong>{profile.lockInPeriod || 'N/A'}</strong>
            </div>
            <div>
              <span className="an-fund-snapshot__label">Scheme type</span>
              <strong>{profile.schemeType || '—'}</strong>
            </div>
            <div>
              <span className="an-fund-snapshot__label">ISIN</span>
              <strong className="an-fund-mono">{profile.isinGrowth || '—'}</strong>
            </div>
            <div>
              <span className="an-fund-snapshot__label">Data as on</span>
              <strong>{profile.navDate || formatInceptionDate(profile.latestNavDate) || '—'}</strong>
            </div>
          </div>
        </section>

        <FundCompositionSection
          schemeCode={profile.schemeCode}
          categoryId={cat}
          composition={profile.composition}
        />

        <p className="an-fund-benchmark-note">{profile.benchmarkNote}</p>
      </div>

      <p id="fund-disclaimer" className="an-compliance" style={{ marginTop: '1.5rem' }}>
        Data: mfapi.in (NAV), mfdata.in (AUM, holdings, managers when available). Past performance is not
        indicative of future results. Not investment advice.
      </p>
    </div>
  );
}
