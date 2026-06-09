import React from 'react';
import ScreenerCardGrid from './ScreenerCardGrid';
import { stockScreeners, mutualFundScreeners } from '../data/screenerStaticData';

/**
 * Exploratory screener catalog — placed after live NSE data (discovery, not session pulse).
 */
export default function ScreenersHubExplore() {
  return (
    <div className="scr-explore-screeners" id="explore-screeners">
      <header className="scr-hub-group__intro scr-explore-screeners__intro">
        <h2 id="explore-screeners-heading" className="scr-hub-group__title">
          Explore screeners
        </h2>
        <p className="scr-hub-group__desc">
          Pre-built stock and mutual fund screens. Live deal tables and indices above refresh from NSE;
          these cards open filtered views or the MF explorer.
        </p>
      </header>
      <ScreenerCardGrid
        sectionId="stock-screeners"
        title="Stock screeners"
        iconTone="purple"
        items={stockScreeners}
      />
      <ScreenerCardGrid
        sectionId="mf-screeners"
        title="Mutual fund screeners"
        iconTone="brand"
        items={mutualFundScreeners}
      />
    </div>
  );
}
