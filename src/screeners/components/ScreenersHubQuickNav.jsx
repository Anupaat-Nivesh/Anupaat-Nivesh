import React from 'react';
import ScreenerCardGrid from './ScreenerCardGrid';
import { liveHubNavCards } from '../data/screenerNavCards';

/**
 * Jump links to live hub sections — placed right after subnav for wayfinding.
 */
export default function ScreenersHubQuickNav() {
  return (
    <div className="scr-quick-nav" id="quick-filters">
      <header className="scr-quick-nav__intro">
        <h2 id="quick-filters-heading" className="scr-quick-nav__title">
          Jump to live data
        </h2>
        <p className="scr-quick-nav__desc">
          Shortcuts to NSE-backed sections below. Start with market pulse, then drill into deals or
          corporate actions.
        </p>
      </header>
      <ScreenerCardGrid
        sectionId="live-data-shortcuts"
        title="On this page"
        iconTone="green"
        meta="NSE · cached ~90s"
        items={liveHubNavCards}
      />
    </div>
  );
}
