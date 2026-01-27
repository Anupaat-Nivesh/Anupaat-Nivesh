import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { formatBookingDate } from '../../utils/bookingHandler';
import { formatAmountForDisplay } from '../../utils/paymentConfig';
import { clearBookingData, clearUserData } from '../../utils/bookingHandler';
import { buildCalendlyUrl, calendlyConfig } from '../../utils/calendlyConfig';
import './PaymentSuccess.css';

/**
 * Payment Success Page
 * Shown after successful payment
 * Displays booking confirmation and next steps
 */
const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state?.bookingData;
  const paymentResponse = location.state?.paymentResponse;
  const [countdown, setCountdown] = useState(5);
  const [showRedirect, setShowRedirect] = useState(false);

  useEffect(() => {
    // Clear stored data after successful payment
    clearBookingData();
    clearUserData();

    // Track conversion
    if (window.gtag) {
      window.gtag('event', 'purchase_success', {
        'event_category': 'ecommerce',
        'event_label': 'consulting_session',
        'value': bookingData?.paymentData?.amount || 99,
        'currency': 'INR',
        'transaction_id': paymentResponse?.razorpay_payment_id
      });
    }

    // Redirect to landing page if no booking data
    if (!bookingData) {
      setTimeout(() => {
        navigate('/consulting-session');
      }, 3000);
      return;
    }

    // Auto-redirect to Calendly after showing success message
    if (calendlyConfig.consultingUrl && bookingData?.bookingReference) {
      setShowRedirect(true);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            // Build Calendly URL with booking reference
            const calendlyUrl = buildCalendlyUrl(bookingData.userData);
            const finalUrl = `${calendlyUrl}${calendlyUrl.includes('?') ? '&' : '?'}booking_ref=${encodeURIComponent(bookingData.bookingReference)}`;
            window.location.href = finalUrl;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [bookingData, paymentResponse, navigate]);

  if (!bookingData) {
    return (
      <div className="payment-success-page">
        <div className="success-container">
          <div className="success-icon">✓</div>
          <h1>Payment Successful!</h1>
          <p>Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-success-page">
      <div className="success-container">
        <div className="success-icon">✓</div>
        <h1>Payment Successful!</h1>
        <p className="success-message">
          Your consulting session has been confirmed. We've sent a confirmation email to your registered email address.
        </p>

        <div className="booking-details">
          <h2>Booking Details</h2>
          
          <div className="detail-item">
            <span className="detail-label">Booking Reference:</span>
            <span className="detail-value">{bookingData.bookingReference}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Name:</span>
            <span className="detail-value">
              {bookingData.userData.firstName} {bookingData.userData.lastName}
            </span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Email:</span>
            <span className="detail-value">{bookingData.userData.email}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Phone:</span>
            <span className="detail-value">{bookingData.userData.phone}</span>
          </div>

          {bookingData.bookingData?.startTime && (
            <div className="detail-item">
              <span className="detail-label">Session Date & Time:</span>
              <span className="detail-value">
                {formatBookingDate(bookingData.bookingData.startTime)}
              </span>
            </div>
          )}

          <div className="detail-item">
            <span className="detail-label">Amount Paid:</span>
            <span className="detail-value price">
              {formatAmountForDisplay(bookingData.paymentData.amount)}
            </span>
          </div>

          {paymentResponse?.razorpay_payment_id && (
            <div className="detail-item">
              <span className="detail-label">Payment ID:</span>
              <span className="detail-value">{paymentResponse.razorpay_payment_id}</span>
            </div>
          )}
        </div>

        {showRedirect && calendlyConfig.consultingUrl && (
          <div className="calendly-redirect-notice">
            <div className="redirect-icon">📅</div>
            <h3>Next Step: Book Your Session</h3>
            <p>You'll be redirected to Calendly in {countdown} seconds to schedule your session.</p>
            <a
              href={`${buildCalendlyUrl(bookingData.userData)}${buildCalendlyUrl(bookingData.userData).includes('?') ? '&' : '?'}booking_ref=${encodeURIComponent(bookingData.bookingReference)}`}
              className="btn btn-primary btn-large"
              onClick={(e) => {
                e.preventDefault();
                const url = `${buildCalendlyUrl(bookingData.userData)}${buildCalendlyUrl(bookingData.userData).includes('?') ? '&' : '?'}booking_ref=${encodeURIComponent(bookingData.bookingReference)}`;
                window.location.href = url;
              }}
            >
              Book Your Session Now →
            </a>
          </div>
        )}

        <div className="next-steps">
          <h3>What Happens Next?</h3>
          <ul>
            <li>Schedule your session using the Calendly link above</li>
            <li>Check your email for confirmation and session details</li>
            <li>You'll receive a calendar invite once scheduled</li>
            <li>Our advisor will contact you 24 hours before the session</li>
            <li>Prepare your financial documents and questions</li>
          </ul>
        </div>

        <div className="success-ctas">
          {!showRedirect && (
            <>
          <Link to="/" className="btn btn-primary">Back to Home</Link>
          <Link to="/calculators" className="btn btn-secondary">Explore Calculators</Link>
            </>
          )}
          <a
            href="https://wa.me/919501195200"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            Chat on WhatsApp
          </a>
        </div>

        <div className="success-resources">
          <h3>While You Wait, Explore:</h3>
          <div className="resource-links">
            <Link to="/mutual-funds">Mutual Funds</Link>
            <Link to="/equity-basket">Equity Baskets</Link>
            <Link to="/faqs">FAQs</Link>
            <Link to="/about">About Us</Link>
          </div>
        </div>

        <div className="success-note">
          <p>
            <strong>Note:</strong> If you need to reschedule or cancel your session, please contact us at least 24 hours in advance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;

