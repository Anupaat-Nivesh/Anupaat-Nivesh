import React from 'react';
import OfferingProductHero from '../shared/OfferingProductHero';
import OfferingProductCards from '../shared/OfferingProductCards';
import { fixedDepositData } from '../../../data';
import illustration from '../../../assets/illustrations/investment-01.svg';
import '../shared/offeringProduct.css';

const FixedDeposits = () => {
  return (
    <div id="fixed-deposits" className="offering-product-container">
      <OfferingProductHero
        primaryHeading="Fixed"
        focusWord="Deposits"
        subheading="Capital preservation with predictable returns"
        description="Fixed deposits remain a cornerstone of conservative investing in India. We help you compare bank and NBFC options on safety, tenure, and post-tax yield — so your idle cash works without surprises."
        illustration={illustration}
        illustrationAlt="Fixed deposits illustration"
      />
      <OfferingProductCards
        sectionTitle="Fixed Deposit Solutions"
        sectionSubtitle="Safety, tenure, and yield — matched to your goals"
        cardsData={fixedDepositData}
      />
    </div>
  );
};

export default FixedDeposits;
