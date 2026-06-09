import React from 'react';
import OfferingProductHero from '../shared/OfferingProductHero';
import OfferingProductCards from '../shared/OfferingProductCards';
import { unlistedStocksData } from '../../../data';
import illustration from '../../../assets/illustrations/stock market-01.svg';
import '../shared/offeringProduct.css';

const UnlistedStocks = () => {
  return (
    <div id="unlisted-stocks" className="offering-product-container">
      <OfferingProductHero
        primaryHeading="Unlisted"
        focusWord="Stocks"
        subheading="Access pre-IPO and private market opportunities"
        description="Unlisted equity can offer growth exposure before a company goes public, but liquidity is limited and valuations can be opaque. We help you assess opportunities with a research-led, risk-aware lens."
        illustration={illustration}
        illustrationAlt="Unlisted stocks illustration"
      />
      <OfferingProductCards
        sectionTitle="Why Consider Unlisted Equity"
        sectionSubtitle="Growth potential with eyes open on liquidity and valuation"
        cardsData={unlistedStocksData}
      />
    </div>
  );
};

export default UnlistedStocks;
