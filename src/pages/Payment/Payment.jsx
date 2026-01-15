import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getStoredBookingData, getStoredUserData } from '../../utils/bookingHandler';
import { createRazorpayOrder, initializeRazorpayCheckout } from '../../services/paymentService';
import { saveCompleteBooking } from '../../services/bookingService';
import { sendAllNotifications } from '../../services/notificationService';
import paymentConfig, { formatAmountForDisplay } from '../../utils/paymentConfig';
import './Payment.css';

/**
 * Payment Page
 * Handles Razorpay payment integration
 */
const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get data from location state or sessionStorage
    const stateData = location.state;
    const storedBooking = getStoredBookingData();
    const storedUser = getStoredUserData();

    const finalUserData = stateData?.userData || storedUser;
    const finalBookingData = stateData?.bookingData || storedBooking;

    if (!finalUserData || !finalBookingData) {
      // Missing required data, redirect to form
      navigate('/consulting-session');
      return;
    }

    setUserData(finalUserData);
    setBookingData(finalBookingData);

    // Track payment page view
    if (window.gtag) {
      window.gtag('event', 'payment_page_view', {
        'event_category': 'conversion',
        'event_label': 'consulting_session',
        'value': paymentConfig.consultingSessionPrice
      });
    }
  }, [location, navigate]);

  const handlePayment = async () => {
    if (!userData || !bookingData) {
      setError('Missing booking information. Please start over.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Create Razorpay order
      const orderData = await createRazorpayOrder(userData, bookingData.bookingData);

      // Initialize Razorpay checkout
      await initializeRazorpayCheckout({
        orderId: orderData.order_id,
        userData,
        onSuccess: async (paymentResponse) => {
          try {
            // Save complete booking with payment data
            const completeBooking = {
              bookingReference: bookingData.bookingReference,
              userData,
              bookingData: bookingData.bookingData,
              paymentData: {
                paymentId: paymentResponse.razorpay_payment_id,
                orderId: paymentResponse.razorpay_order_id,
                signature: paymentResponse.razorpay_signature,
                amount: paymentConfig.consultingSessionPrice,
                currency: paymentConfig.currency,
                timestamp: new Date().toISOString()
              }
            };

            // Save booking to backend
            await saveCompleteBooking(completeBooking);

            // Send notifications
            await sendAllNotifications(completeBooking);

            // Track successful payment
            if (window.gtag) {
              window.gtag('event', 'purchase', {
                'event_category': 'ecommerce',
                'event_label': 'consulting_session',
                'value': paymentConfig.consultingSessionPrice,
                'currency': 'INR',
                'transaction_id': paymentResponse.razorpay_payment_id
              });
            }

            // Redirect to success page
            navigate('/payment-success', {
              state: {
                bookingData: completeBooking,
                paymentResponse
              }
            });
          } catch (error) {
            console.error('Error after payment success:', error);
            // Even if save fails, redirect to success (payment is complete)
            navigate('/payment-success', {
              state: {
                bookingData: {
                  bookingReference: bookingData.bookingReference,
                  userData,
                  bookingData: bookingData.bookingData,
                  paymentData: {
                    paymentId: paymentResponse.razorpay_payment_id,
                    orderId: paymentResponse.razorpay_order_id,
                    amount: paymentConfig.consultingSessionPrice,
                    currency: paymentConfig.currency
                  }
                },
                paymentResponse
              }
            });
          }
        },
        onFailure: (error) => {
          console.error('Payment failed:', error);
          setError(error.message || 'Payment failed. Please try again.');
          setIsProcessing(false);
          
          // Track payment failure
          if (window.gtag) {
            window.gtag('event', 'payment_failed', {
              'event_category': 'ecommerce',
              'event_label': 'consulting_session',
              'value': paymentConfig.consultingSessionPrice
            });
          }

          // Redirect to error page after delay
          setTimeout(() => {
            navigate('/payment-error', {
              state: {
                error: error.message || 'Payment failed',
                userData,
                bookingData
              }
            });
          }, 3000);
        }
      });
    } catch (error) {
      console.error('Payment initialization error:', error);
      setError(error.message || 'Failed to initialize payment. Please try again.');
      setIsProcessing(false);
    }
  };

  if (!userData || !bookingData) {
    return (
      <div className="payment-page">
        <div className="payment-loading">
          <p>Loading payment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="payment-header">
          <h1>Complete Your Payment</h1>
          <p>Secure payment powered by Razorpay</p>
        </div>

        <div className="payment-summary">
          <div className="summary-item">
            <span className="summary-label">Service:</span>
            <span className="summary-value">1-on-1 Financial Consulting Session</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Booking Reference:</span>
            <span className="summary-value">{bookingData.bookingReference}</span>
          </div>
          {bookingData.bookingData?.startTime && (
            <div className="summary-item">
              <span className="summary-label">Session Date:</span>
              <span className="summary-value">
                {new Date(bookingData.bookingData.startTime).toLocaleDateString('en-IN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          )}
          <div className="summary-item total">
            <span className="summary-label">Total Amount:</span>
            <span className="summary-value price">
              {formatAmountForDisplay(paymentConfig.consultingSessionPrice)}
            </span>
          </div>
        </div>

        {error && (
          <div className="payment-error">
            <p>{error}</p>
          </div>
        )}

        <div className="payment-actions">
          <button
            className="btn btn-primary payment-button"
            onClick={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : `Pay ${formatAmountForDisplay(paymentConfig.consultingSessionPrice)}`}
          </button>
          <p className="payment-note">
            You'll be redirected to Razorpay's secure payment gateway. We accept UPI, Credit/Debit Cards, and Net Banking.
          </p>
        </div>

        <div className="payment-security">
          <p>🔒 Your payment is secured by Razorpay</p>
          <p>We never store your card details</p>
        </div>
      </div>
    </div>
  );
};

export default Payment;

