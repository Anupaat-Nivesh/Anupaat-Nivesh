import React, { useEffect, useState } from 'react';
import './ConsultingSession.css';
import ConsultingSessionForm from '../../components/ConsultingSessionForm/ConsultingSessionForm';
import ComplianceDisclaimer from '../../components/ComplianceDisclaimer/ComplianceDisclaimer';

/**
 * Consulting Session Page
 * Two-column layout: Overview on left, Form on right
 * Minimal steps for better user experience
 */
const ConsultingSession = () => {
  const [sessionsLeft, setSessionsLeft] = useState(23); // Monthly cap

  useEffect(() => {
    // Track page view
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: 'Consulting Session',
        page_location: window.location.href
      });
    }

    // Calculate sessions left (mock - in production, fetch from backend)
    // This would typically come from your booking system
    const calculateSessionsLeft = () => {
      // Mock calculation - replace with actual API call
      const currentMonth = new Date().getMonth();
      const totalCapacity = 50; // Total sessions per month
      const bookedThisMonth = 27; // Mock - replace with actual count
      setSessionsLeft(Math.max(0, totalCapacity - bookedThisMonth));
    };

    calculateSessionsLeft();
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

            {/* Limited-Time Counter */}
            {sessionsLeft > 0 && (
              <div className="sessions-counter">
                <span className="counter-icon">⏰</span>
                <span className="counter-text">
                  <strong>{sessionsLeft} sessions left</strong> this month
                </span>
              </div>
            )}

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
              {/* Value Breakdown Section */}
              <div className="overview-section value-breakdown-section">
                <h2 className="overview-section-title">
                  What You Get in This <span className="section-heading-focus">Session</span>
                </h2>
                <div className="value-breakdown-grid">
                  <div className="value-item">
                    <div className="value-icon">🏥</div>
                    <h3>Personal Financial Health Check</h3>
                    <p>Complete assessment of your current financial status</p>
                  </div>
                  <div className="value-item">
                    <div className="value-icon">📊</div>
                    <h3>Real Asset & Liability Review</h3>
                    <p>Detailed analysis of what you own and owe</p>
                  </div>
                  <div className="value-item">
                    <div className="value-icon">🎯</div>
                    <h3>Goal Clarity & Prioritization</h3>
                    <p>Define and rank your financial objectives</p>
                  </div>
                  <div className="value-item">
                    <div className="value-icon">🗺️</div>
                    <h3>Actionable Investment Roadmap</h3>
                    <p>Step-by-step plan tailored to your goals</p>
                  </div>
                  <div className="value-item value-highlight">
                    <div className="value-icon">🚫</div>
                    <h3>No Product Pushing</h3>
                    <p>Pure advisory focus - we help you understand options without sales pressure</p>
                  </div>
                </div>
              </div>

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

      {/* Testimonials Section */}
      <section className="consulting-testimonials section__padding">
        <div className="container">
          <h2 className="testimonials-title">
            Trusted by <span className="section-heading-focus">Professionals</span>
          </h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p className="testimonial-text">
                  "The session helped me understand my financial position clearly. The advisor was patient, knowledgeable, and gave me a roadmap I could actually follow. No sales pitch, just genuine advice."
                </p>
                <div className="testimonial-author">
                  <div className="author-info">
                    <strong>Rajesh Kumar</strong>
                    <span>Software Engineer, Bangalore</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p className="testimonial-text">
                  "As someone new to investing, I was overwhelmed. This session broke everything down into simple steps. The advisor helped me prioritize my goals and create a realistic plan. Highly recommended!"
                </p>
                <div className="testimonial-author">
                  <div className="author-info">
                    <strong>Priya Sharma</strong>
                    <span>Marketing Manager, Mumbai</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="testimonial-card testimonial-authority">
              <div className="testimonial-content">
                <div className="authority-badge">15+ Years Combined Experience</div>
                <p className="testimonial-text">
                  Our team has worked with professionals across IT, Finance, Healthcare, and Education sectors, helping hundreds achieve their financial goals.
                </p>
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

