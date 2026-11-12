import React, { useEffect } from 'react';
import { MARKET_COMPASS_URL } from '../../data/insightTools';
import './CompassLoginPage.css';

export default function CompassLoginPage() {
  useEffect(() => {
    const prev = document.title;
    document.title = 'MarketCompass login · Anupaat Nivesh';
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <div className="compass-embed-page">
      <iframe
        className="compass-embed-page__frame"
        src={MARKET_COMPASS_URL}
        title="MarketCompass login"
        allow="clipboard-write"
      />
    </div>
  );
}
