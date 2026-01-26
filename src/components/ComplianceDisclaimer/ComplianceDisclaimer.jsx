import React from 'react';
import { Link } from 'react-router-dom';
import './ComplianceDisclaimer.css';

/**
 * ComplianceDisclaimer Component
 * 
 * Displays compliance and risk disclosure information.
 * Includes AMFI/SEBI registration references, BSE STAR MF mention,
 * and privacy policy link.
 * 
 * Ensures:
 * - No return guarantees
 * - No stock tips
 * - Neutral, compliant language
 * - Clear risk disclosure
 */
const ComplianceDisclaimer = () => {
  return (
    <section className="compliance-disclaimer section__padding">
      <div className="compliance-disclaimer__container">
        <div className="compliance-disclaimer__content">
          <h3 className="compliance-disclaimer__title">Important Disclosures</h3>

          <div className="compliance-disclaimer__statements">
            <p className="compliance-disclaimer__statement">
              <strong>Investments are subject to market risks.</strong> Please read all scheme related documents carefully before investing.
            </p>

            <p className="compliance-disclaimer__statement">
              Past performance is not indicative of future results. We do not guarantee any returns or provide any assurance of profits.
            </p>

            <p className="compliance-disclaimer__statement">
              We are an <strong>AMFI Registered Mutual Fund Distributor</strong> and provide advisory services in compliance with SEBI regulations.
            </p>

            <p className="compliance-disclaimer__statement">
              All investments are executed through <strong>BSE STAR MF</strong> platform, ensuring transparency and security.
            </p>

            <p className="compliance-disclaimer__statement">
              We do not provide stock tips, trading recommendations, or guaranteed returns. Our services focus on goal-based financial planning and mutual fund investments.
            </p>
          </div>

          <div className="compliance-disclaimer__links">
            <Link
              to="/privacy-policy"
              className="compliance-disclaimer__link"
            >
              Privacy Policy
            </Link>
            <span className="compliance-disclaimer__separator">|</span>
            <span className="compliance-disclaimer__text">
              AMFI Registration No: [ARN – 347085]
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComplianceDisclaimer;

