import React from 'react';
import { Link } from 'react-router-dom';
import ScreenerHero from '../components/ScreenerHero';
import IndexTickerRow from '../components/IndexTickerRow';
import ScreenersHubQuickNav from '../components/ScreenersHubQuickNav';
import ScreenersHubExplore from '../components/ScreenersHubExplore';
import CorporateActionsSection from '../components/CorporateActionsSection';
import ScreenersHubLive from '../components/ScreenersHubLive';
import { marketIndices, heroThemes } from '../data/screenerStaticData';
import useScreenersHub from '../hooks/useScreenersHub';
import '../styles/screeners.css';

/** Matches on-page narrative: pulse → insights → deals → events → explore */
const HUB_NAV = [
  { href: '#quick-filters', label: 'Jump to' },
  { href: '#market-pulse', label: 'Market pulse' },
  { href: '#market-insights', label: 'Insights' },
  { href: '#bulk-block-deals', label: 'Deals' },
  { href: '#corporate-actions', label: 'Corp. actions' },
  { href: '#announcements', label: 'Filings' },
  { href: '#explore-screeners', label: 'Screeners' },
];

export default function ScreenersHub() {
  const { data } = useScreenersHub();

  return (
    <div className="scr-page">
      <div className="scr-hero-stage">
        <div className="scr-hero-carousel-bleed">
          <ScreenerHero themes={heroThemes} live={data?.heroCarousel} />
        </div>
        <div className="scr-hero-ticker-bleed">
          <IndexTickerRow indices={data?.indexStrip || marketIndices} />
        </div>
      </div>

      <div className="scr-page__body section__padding">
        <nav className="scr-subnav scr-subnav--wrap" aria-label="Screener categories">
          {HUB_NAV.map((item) => (
            <a key={item.href} href={item.href} className="scr-subnav__link">
              {item.label}
            </a>
          ))}
          <Link to="/screeners/sector-rotation" className="scr-subnav__link">
            Sector rotation dashboard
          </Link>
          <Link to="/invest/baskets" className="scr-subnav__link scr-subnav__link--cta">
            Mutual fund baskets →
          </Link>
        </nav>

        <ScreenersHubQuickNav />

        <ScreenersHubLive />

        <div className="scr-page__block scr-page__block--events">
          <CorporateActionsSection />
        </div>

        <ScreenersHubExplore />

        <aside className="scr-disclaimer">
          <strong>Data sources.</strong> Market breadth, indices, bulk/block deals, corporate actions, and
          filtered announcements are loaded live from NSE India via our API proxy. Party type (FII/DII/MF/promoter)
          is heuristic. Deal value in ₹ Cr = qty × avg price ÷ 10⁷. Delivery panels use deal-volume proxy, not
          exchange delivery %. See <code>docs/SCREENERS_ROADMAP.md</code>. Not investment advice.
        </aside>
      </div>
    </div>
  );
}
