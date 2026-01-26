import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './PaymentError.css';

/**
 * Payment Error Page
 * Shown when payment fails or is cancelled
 */
const PaymentError = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const error = location.state?.error || 'Payment failed';
  const userData = location.state?.userData;
  const bookingData = location.state?.bookingData;

  useEffect(() => {
    // Track payment error
    if (window.gtag) {
      window.gtag('event', 'payment_error', {
        'event_category': 'ecommerce',
        'event_label': 'consulting_session',
        'error_message': error
      });
    }
  }, [error]);

  const handleRetry = () => {
    if (userData && bookingData) {
      // Retry payment with existing data
      navigate('/payment', {
        state: {
          userData,
          bookingData
        }
      });
    } else {
      // Start over
      navigate('/consulting-session');
    }
  };

  return (
    <div className="payment-error-page">
      <div className="error-container">
        <div className="error-icon">✗</div>
        <h1>Payment Didn't Go Through</h1>
        
        <div className="error-reassurance">
          <p className="reassurance-message">
            <strong>Don't worry — no money was deducted.</strong>
          </p>
          <p className="error-message">
            {error.includes('Failed to create payment order') 
              ? 'We encountered an issue setting up your payment. This could be due to a temporary network issue or server problem.'
              : error}
          </p>
        </div>

        <div className="error-actions">
          <button
            className="btn btn-primary error-retry"
            onClick={handleRetry}
          >
            🔄 Retry Payment
          </button>
          <Link to="/consulting-session" className="btn btn-secondary">
            Start Over
          </Link>
        </div>

        <div className="error-help">
          <h3>Need Immediate Help?</h3>
          <p>Our team is here to assist you. Reach out via WhatsApp for instant support:</p>
          <a
            href="https://wa.me/919501195200?text=Hi, I'm having trouble with payment. Can you help?"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp"
          >
            💬 Get Help on WhatsApp
          </a>
          
          <div className="help-contacts">
            <a href="tel:+919501195200" className="help-link">
              📞 +91 95011 95200
            </a>
            <a href="mailto:contact@anupaatnivesh.com" className="help-link">
              ✉️ contact@anupaatnivesh.com
            </a>
          </div>
        </div>

        <div className="error-note">
          <p>
            <strong>Note:</strong> Your booking slot is reserved for 15 minutes. 
            If payment is not completed within this time, the slot will be released.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentError;

