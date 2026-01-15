import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './ThankYou.css';

/**
 * Thank You Page Component
 * Shown after successful form submission
 * Provides next steps and soft CTAs
 */
const ThankYou = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const formType = searchParams.get('type') || 'consultation'; // 'consultation' or 'portfolio_review'
  const goal = searchParams.get('goal') || '';

  useEffect(() => {
    // Track conversion
    if (window.gtag) {
      window.gtag('event', 'form_submission_success', {
        'event_category': 'conversion',
        'event_label': formType,
        'value': 1
      });
    }
  }, [formType]);

  const getThankYouMessage = () => {
    if (formType === 'portfolio_review') {
      return {
        title: 'Thank You for Your Interest!',
        message: 'We\'ve received your portfolio review request. Our team will analyze your current investments and get back to you within 24 hours with personalized recommendations.',
        nextSteps: [
          'Check your email for confirmation',
          'Our advisor will review your portfolio',
          'You\'ll receive personalized recommendations',
          'Schedule a call to discuss your plan'
        ]
      };
    }
    return {
      title: 'Thank You for Contacting Us!',
      message: 'We\'ve received your consultation request. Our team will get back to you within 24 hours to schedule a convenient time for your free consultation.',
      nextSteps: [
        'Check your email for confirmation',
        'Our team will contact you within 24 hours',
        'Schedule a convenient time for consultation',
        'Get personalized financial guidance'
      ]
    };
  };

  const thankYouContent = getThankYouMessage();

  return (
    <div className="thank-you-page">
      <div className="thank-you-container">
        <div className="thank-you-icon">✓</div>
        <h1>{thankYouContent.title}</h1>
        <p className="thank-you-message">{thankYouContent.message}</p>

        {goal && (
          <div className="goal-badge">
            <strong>Your Goal:</strong> {goal}
          </div>
        )}

        <div className="next-steps">
          <h3>What Happens Next?</h3>
          <ul>
            {thankYouContent.nextSteps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ul>
        </div>

        <div className="thank-you-ctas">
          <Link to="/" className="btn btn-primary">Back to Home</Link>
          <Link to="/calculators" className="btn btn-secondary">Explore Calculators</Link>
          <a 
            href="https://wa.me/919501195200" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            Chat on WhatsApp
          </a>
        </div>

        <div className="thank-you-resources">
          <h3>While You Wait, Explore:</h3>
          <div className="resource-links">
            <Link to="/mutual-funds">Mutual Funds</Link>
            <Link to="/equity-basket">Equity Baskets</Link>
            <Link to="/faqs">FAQs</Link>
            <Link to="/about">About Us</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;

