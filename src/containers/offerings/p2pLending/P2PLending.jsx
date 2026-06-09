import React from 'react';
import OfferingProductHero from '../shared/OfferingProductHero';
import OfferingProductCards from '../shared/OfferingProductCards';
import { p2pLendingData } from '../../../data';
import illustration from '../../../assets/illustrations/finance-01.svg';
import '../shared/offeringProduct.css';

const P2PLending = () => {
  return (
    <div id="p2p-lending" className="offering-product-container">
      <OfferingProductHero
        primaryHeading="P2P"
        focusWord="Lending"
        subheading="Earn yield by lending to verified borrowers"
        description="Peer-to-peer lending can offer higher yields than traditional savings, but comes with credit and liquidity risk. We help you evaluate RBI-regulated platforms, diversification strategies, and fit within your overall financial plan."
        illustration={illustration}
        illustrationAlt="P2P lending illustration"
      />
      <OfferingProductCards
        sectionTitle="How We Approach P2P Lending"
        sectionSubtitle="Consultation-first — understand risk before you allocate"
        cardsData={p2pLendingData}
      />
    </div>
  );
};

export default P2PLending;
