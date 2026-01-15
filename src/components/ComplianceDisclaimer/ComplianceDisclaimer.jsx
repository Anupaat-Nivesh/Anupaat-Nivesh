import React from 'react';
import './ComplianceDisclaimer.css';

/**
 * Compliance Disclaimer Component
 * Displays risk disclaimers, SEBI/AMFI disclosures, and compliance information
 * Required for financial advisory websites in India
 */
const ComplianceDisclaimer = () => {
  return (
    <section className="compliance-disclaimer">
      <div className="container">
        <h3 className="disclaimer-title">Important Disclosures & Risk Warnings</h3>
        
        <div className="disclaimer-content">
          <div className="disclaimer-item">
            <h4>Risk Disclaimer</h4>
            <p>
              Mutual fund investments are subject to market risks. Please read all scheme related documents carefully. 
              Past performance does not guarantee future results. The value of investments may go up or down, and you 
              may get back less than what you invested.
            </p>
          </div>

          <div className="disclaimer-item">
            <h4>SEBI Registration</h4>
            <p>
              Anupaat Nivesh is registered with SEBI as an Investment Advisor. Registration does not guarantee 
              performance or returns. Investors are advised to make their own independent evaluation and seek 
              professional advice before making investment decisions.
            </p>
          </div>

          <div className="disclaimer-item">
            <h4>AMFI Registration</h4>
            <p>
              We are registered with AMFI (Association of Mutual Funds in India) as a Mutual Fund Distributor. 
              AMFI Registration Number: [To be updated with actual registration number]
            </p>
          </div>

          <div className="disclaimer-item">
            <h4>BSE STAR MF</h4>
            <p>
              We are empaneled with BSE STAR MF platform for seamless mutual fund transactions. All transactions 
              are processed through BSE's secure infrastructure.
            </p>
          </div>

          <div className="disclaimer-item">
            <h4>No Guaranteed Returns</h4>
            <p>
              We do not guarantee any returns on investments. All investment recommendations are based on 
              individual risk profiling and financial goals. Returns are market-linked and subject to various 
              factors beyond our control.
            </p>
          </div>

          <div className="disclaimer-item">
            <h4>Privacy & Data Protection</h4>
            <p>
              Your personal and financial information is kept confidential and used only for providing advisory 
              services. We comply with all applicable data protection laws. Please read our{' '}
              <a href="/privacy-policy">Privacy Policy</a> for details.
            </p>
          </div>
        </div>

        <div className="disclaimer-footer">
          <p>
            <strong>Note:</strong> This website is for informational purposes only and does not constitute 
            investment advice. Please consult with a qualified financial advisor before making any investment decisions.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ComplianceDisclaimer;

