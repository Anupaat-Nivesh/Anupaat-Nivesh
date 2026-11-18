import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MARKET_BREADTH_URL } from '../../data/insightTools';
import '../MarketDeploymentIntelligence/CompassLoginPage.css';

export default function MarketBreadthPage() {
  useEffect(() => {
    const prev = document.title;
    document.title = 'Market Breadth · Anupaat Nivesh';
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <div className="compass-embed-page">
      <div className="compass-embed-bar" role="navigation" aria-label="Market Breadth">
        <div className="compass-embed-bar__inner">
          <Link to="/screeners" className="compass-embed-bar__back">
            ← Screeners
          </Link>
          <p className="compass-embed-bar__title">
            Market Breadth <span aria-hidden="true">·</span> Anupaat Nivesh
          </p>
          <Link to="/screeners/sector-rotation" className="compass-embed-bar__next">
            Sector Rotation →
          </Link>
        </div>
      </div>
      <iframe
        className="compass-embed-page__frame"
        src={MARKET_BREADTH_URL}
        title="Market Breadth screener"
        allow="clipboard-write"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
