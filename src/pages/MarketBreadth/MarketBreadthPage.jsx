import React, { useEffect } from 'react';
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
      <iframe
        className="compass-embed-page__frame"
        src={MARKET_BREADTH_URL}
        title="Market Breadth screener"
        allow="clipboard-write"
      />
    </div>
  );
}
