import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ConsultingSession.css';
import ConsultingSessionForm from '../../components/ConsultingSessionForm/ConsultingSessionForm';
import ComplianceDisclaimer from '../../components/ComplianceDisclaimer/ComplianceDisclaimer';

/**
 * Consulting Session Landing Page
 * High-conversion landing page for ₹99 consulting session offer
 */
const ConsultingSession = () => {
  useEffect(() => {
    // Track page view
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: 'Consulting Session Landing',
        page_location: window.location.href
      });
    }
  }, []);

  const scrollToForm = () => {
    const formSection = document.getElementById('consulting-form-section');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="consulting-session-page">
      {/* Hero Section */}
      <section className="consulting-hero">
        <div className="consulting-hero-content">
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
          <p className="consulting-subtitle">
            Get expert financial guidance tailored to your goals. This comprehensive session includes financial planning, income-expense clarity, investment planning, and goal clarification.
          </p>
          <button 
            className="btn btn-primary consulting-cta"
            onClick={scrollToForm}
          >
            Book Session for ₹99
          </button>
          <div className="consulting-trust-badges">
            <span>✓ AMFI Registered</span>
            <span>✓ BSE STAR MF</span>
            <span>✓ 8+ Years Experience</span>
          </div>
        </div>
      </section>

      {/* What's Included Section */}
      <section className="consulting-includes section__padding">
        <div className="container">
          <h2 className="section-title">
            What's <span className="section-heading-focus">Included</span>
          </h2>
          <div className="includes-grid">
            <div className="include-card">
              <div className="include-icon">📊</div>
              <h3>Financial Planning</h3>
              <p>Comprehensive analysis of your financial situation and personalized planning strategies.</p>
            </div>
            <div className="include-card">
              <div className="include-icon">📋</div>
              <h3>REAL Statement</h3>
              <p>Clear income-expense analysis to understand your cash flow and spending patterns.</p>
            </div>
            <div className="include-card">
              <div className="include-icon">💼</div>
              <h3>Investment Planning</h3>
              <p>Expert recommendations on investment options aligned with your risk profile and goals.</p>
            </div>
            <div className="include-card">
              <div className="include-icon">🎯</div>
              <h3>Goal Clarification</h3>
              <p>Define and prioritize your financial goals with actionable steps to achieve them.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="consulting-value section__padding">
        <div className="container">
          <h2 className="section-title">
            Why This <span className="section-heading-focus">Session</span>
          </h2>
          <div className="value-content">
            <div className="value-item">
              <h3>Expert Guidance</h3>
              <p>Get advice from AMFI registered advisors with 8+ years of experience in financial planning.</p>
            </div>
            <div className="value-item">
              <h3>Personalized Approach</h3>
              <p>Every session is tailored to your unique financial situation, goals, and risk tolerance.</p>
            </div>
            <div className="value-item">
              <h3>Actionable Insights</h3>
              <p>Walk away with a clear action plan and next steps to achieve your financial goals.</p>
            </div>
            <div className="value-item">
              <h3>No Sales Pressure</h3>
              <p>Pure advisory focus - we help you understand your options without pushing products.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="consulting-form-section" className="consulting-form-section section__padding">
        <div className="container">
          <h2 className="section-title">
            Book Your <span className="section-heading-focus">Session</span>
          </h2>
          <p className="section-description">
            Fill in your details to get started. We'll schedule a convenient time for your consultation.
          </p>
          <ConsultingSessionForm />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="consulting-faq section__padding">
        <div className="container">
          <h2 className="section-title">
            Frequently Asked <span className="section-heading-focus">Questions</span>
          </h2>
          <div className="faq-list">
            <div className="faq-item">
              <h3>What will I get from this session?</h3>
              <p>You'll receive a comprehensive financial analysis, income-expense clarity, personalized investment recommendations, and a clear action plan for your financial goals.</p>
            </div>
            <div className="faq-item">
              <h3>How long is the session?</h3>
              <p>The session typically lasts 60-90 minutes, giving us enough time to understand your situation and provide detailed guidance.</p>
            </div>
            <div className="faq-item">
              <h3>Is this a one-time payment?</h3>
              <p>Yes, ₹99 is a one-time payment for this introductory consulting session. There are no hidden charges or recurring fees.</p>
            </div>
            <div className="faq-item">
              <h3>What if I need to reschedule?</h3>
              <p>You can reschedule your session up to 24 hours before the scheduled time. Contact us via email or WhatsApp to reschedule.</p>
            </div>
            <div className="faq-item">
              <h3>Will I get a refund if I cancel?</h3>
              <p>Refunds are available if you cancel at least 48 hours before your scheduled session. Contact us for assistance.</p>
            </div>
            <div className="faq-item">
              <h3>Is this session suitable for beginners?</h3>
              <p>Absolutely! This session is designed for investors at all levels, from beginners to those looking to optimize their existing portfolio.</p>
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

