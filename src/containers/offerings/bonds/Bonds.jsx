import React from 'react';
import OfferingProductHero from '../shared/OfferingProductHero';
import OfferingProductCards from '../shared/OfferingProductCards';
import { bondsData } from '../../../data';
import illustration from '../../../assets/illustrations/Man invests-01.svg';
import '../shared/offeringProduct.css';

const Bonds = () => {
  return (
    <div id="bonds" className="offering-product-container">
      <OfferingProductHero
        primaryHeading="Bonds &"
        focusWord="Debentures"
        subheading="Steady income through fixed-income instruments"
        description="Government and corporate bonds can provide predictable coupon income and help balance equity-heavy portfolios. We walk you through yields, credit quality, and tax implications before you invest."
        illustration={illustration}
        illustrationAlt="Bonds illustration"
      />
      <OfferingProductCards
        sectionTitle="Bond Investment Approach"
        sectionSubtitle="Income, credit quality, and portfolio fit"
        cardsData={bondsData}
      />
    </div>
  );
};

export default Bonds;
