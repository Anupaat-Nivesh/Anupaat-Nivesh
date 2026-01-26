import React, { useEffect } from 'react';
import './ConsultingSession.css';
import ConsultingSessionForm from '../../components/ConsultingSessionForm/ConsultingSessionForm';
import ComplianceDisclaimer from '../../components/ComplianceDisclaimer/ComplianceDisclaimer';

/**
 * Consulting Session Page
 * Two-column layout: Overview on left, Form on right
 * Minimal steps for better user experience
 */
const ConsultingSession = () => {
  useEffect(() => {
    // Track page view
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: 'Consulting Session',
        page_location: window.location.href
      });
    }
  }, []);

  return (
    <div className="consulting-session-page">
      {/* Main Content Section - Form First, Then Overview */}
      <section className="consulting-main-section section__padding">
        <div className="container">
          {/* Header Section */}
          <div className="consulting-header-section">
            <div className="consulting-badge">Limited Time Offer</div>
            <h1 className="consulting-title">
              1-on-1 Financial Consulting Session
            </h1>
            
            <div className="consulting-price-section">
              <div className="price-comparison">
                <span className="price-old">₹9,999</span>
                <span className="price-new">₹99</span>
              </div>
              <div className="price-discount">Save 99% - Introductory Offer</div>
            </div>

            {/* Trust Badges */}
            <div className="consulting-trust-badges">
              <span>✓ AMFI Registered</span>
              <span>✓ BSE STAR MF</span>
              <span>✓ 8+ Years Experience</span>
            </div>
          </div>

          <div className="consulting-layout">
            {/* First: User Details Form - Priority */}
            <div className="consulting-form-column">
              <div className="form-column-header">
                <h2 className="form-column-title">
                  Book Your <span className="form-title-highlight">Session</span>
                </h2>
                <p className="form-column-description">
                  Fill in your details to get started. We'll schedule a convenient time for your consultation.
                </p>
              </div>
              <ConsultingSessionForm />
            </div>

            {/* Second: Overview & Benefits - After Form */}
            <div className="consulting-overview">
              {/* Why This Session */}
              <div className="overview-section">
                <h2 className="overview-section-title">
                  Why This <span className="section-heading-focus">Session</span>
                </h2>
                <div className="overview-content">
                  <div className="overview-item">
                    <div className="overview-icon">✓</div>
                    <div className="overview-item-content">
                      <h3>Expert Guidance</h3>
                      <p>Get advice from AMFI registered advisors with 8+ years of experience in financial planning.</p>
                    </div>
                  </div>
                  <div className="overview-item">
                    <div className="overview-icon">✓</div>
                    <div className="overview-item-content">
                      <h3>Personalized Approach</h3>
                      <p>Every session is tailored to your unique financial situation, goals, and risk tolerance.</p>
                    </div>
                  </div>
                  <div className="overview-item">
                    <div className="overview-icon">✓</div>
                    <div className="overview-item-content">
                      <h3>Actionable Insights</h3>
                      <p>Walk away with a clear action plan and next steps to achieve your financial goals.</p>
                    </div>
                  </div>
                  <div className="overview-item">
                    <div className="overview-icon">✓</div>
                    <div className="overview-item-content">
                      <h3>No Sales Pressure</h3>
                      <p>Pure advisory focus - we help you understand your options without pushing products.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* What's Covered */}
              <div className="overview-section">
                <h2 className="overview-section-title">
                  What's <span className="section-heading-focus">Covered</span>
                </h2>
                <div className="overview-content">
                  <div className="overview-item">
                    <div className="overview-icon">📊</div>
                    <div className="overview-item-content">
                      <h3>Financial Planning</h3>
                      <p>Comprehensive analysis of your financial situation and personalized planning strategies.</p>
                    </div>
                  </div>
                  <div className="overview-item">
                    <div className="overview-icon">📋</div>
                    <div className="overview-item-content">
                      <h3>Income-Expense Analysis</h3>
                      <p>Clear understanding of your cash flow and spending patterns for better financial control.</p>
                    </div>
                  </div>
                  <div className="overview-item">
                    <div className="overview-icon">💼</div>
                    <div className="overview-item-content">
                      <h3>Investment Planning</h3>
                      <p>Expert recommendations on investment options aligned with your risk profile and goals.</p>
                    </div>
                  </div>
                  <div className="overview-item">
                    <div className="overview-icon">🎯</div>
                    <div className="overview-item-content">
                      <h3>Goal Clarification</h3>
                      <p>Define and prioritize your financial goals with actionable steps to achieve them.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Disclaimer */}
      <section className="consulting-compliance">
        <ComplianceDisclaimer />
      </section>
    </div>
  );
};

export default ConsultingSession;

