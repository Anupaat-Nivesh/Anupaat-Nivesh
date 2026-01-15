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
        <h1>Payment Failed</h1>
        <p className="error-message">{error}</p>

        <div className="error-actions">
          <button
            className="btn btn-primary error-retry"
            onClick={handleRetry}
          >
            Try Again
          </button>
          <Link to="/consulting-session" className="btn btn-secondary">
            Start Over
          </Link>
        </div>

        <div className="error-help">
          <h3>Need Help?</h3>
          <p>If you continue to experience issues, please contact us:</p>
          <div className="help-contacts">
            <a href="tel:+919501195200" className="help-link">
              📞 +91 95011 95200
            </a>
            <a href="mailto:contact@anupaatnivesh.com" className="help-link">
              ✉️ contact@anupaatnivesh.com
            </a>
            <a
              href="https://wa.me/919501195200"
              target="_blank"
              rel="noopener noreferrer"
              className="help-link"
            >
              💬 WhatsApp
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

