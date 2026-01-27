import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateBookingReference, storeUserData, storeBookingData } from '../../utils/bookingHandler';
import { createRazorpayOrder, initializeRazorpayCheckout } from '../../services/paymentService';
import { buildCalendlyUrl, calendlyConfig } from '../../utils/calendlyConfig';
import paymentConfig, { formatAmountForDisplay } from '../../utils/paymentConfig';
import { saveCompleteBooking } from '../../services/bookingService';
import { sendAllNotifications } from '../../services/notificationService';
import './BookConsultationMobile.css';

/**
 * Mobile-First Consulting Booking Funnel
 * Standalone page for digital ads (Instagram, YouTube, WhatsApp)
 * Route: /book-consultation
 * 
 * Flow: Hero → What You Get → CTA → Form → Calendly → Payment → Success
 */
const BookConsultationMobile = () => {
  const navigate = useNavigate();
  const formRef = useRef();
  const formSectionRef = useRef();

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState('hero'); // hero, form, calendly, payment, success
  const [bookingReference, setBookingReference] = useState(null);
  const [userData, setUserData] = useState(null);

  // Track source for analytics
  const source = 'mobile-consulting-funnel';

  useEffect(() => {
    // Track page view
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: 'Mobile Consulting Booking',
        page_location: window.location.href,
        source: source
      });
    }
  }, []);

  // Scroll to form section
  const scrollToForm = () => {
    if (formSectionRef.current) {
      formSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setCurrentStep('form');
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Mobile number is required';
    } else if (formData.phone.length < 10) {
      newErrors.phone = 'Please enter a valid mobile number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle form submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors).find(key => errors[key]);
      if (firstErrorField) {
        const errorElement = formRef.current?.querySelector(`[name="${firstErrorField}"]`);
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          errorElement.focus();
        }
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // Split full name into first and last
      const nameParts = formData.fullName.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Generate booking reference
      const ref = generateBookingReference();
      setBookingReference(ref);

      // Prepare user data
      const userDataObj = {
        firstName,
        lastName,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        source: source
      };

      setUserData(userDataObj);

      // Store user data
      storeUserData(userDataObj);

      // Store initial booking data
      const bookingData = {
        bookingReference: ref,
        source: source,
        timestamp: new Date().toISOString()
      };
      storeBookingData(bookingData);

      // Log initial lead to Google Sheets (via backend if available)
      // This happens in the payment flow, but we can track form submission too
      if (window.gtag) {
        window.gtag('event', 'form_submit', {
          event_category: 'lead_generation',
          event_label: 'mobile_consulting_funnel',
          source: source
        });
      }

      // Move to Calendly step
      setCurrentStep('calendly');

      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Calendly booking completion
  const handleCalendlyComplete = () => {
    // Move to payment step
    setCurrentStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle payment
  const handlePayment = async () => {
    if (!userData || !bookingReference) {
      alert('Please complete the form first.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create Razorpay order
      // Note: createRazorpayOrder expects (userData, bookingData)
      const bookingDataForOrder = {
        bookingReference,
        source: source, // Ensure source is in bookingData for webhook access
        eventName: 'Consulting Session',
        amount: paymentConfig.consultingSessionPrice,
        currency: paymentConfig.currency || 'INR'
      };
      const orderData = await createRazorpayOrder(userData, bookingDataForOrder);

      // Initialize Razorpay checkout
      await initializeRazorpayCheckout({
        orderId: orderData.order_id,
        userData: {
          ...userData,
          source: source,
          bookingReference: bookingReference
        },
        onSuccess: async (paymentResponse) => {
          try {
            // Save complete booking
            const completeBooking = {
              bookingReference,
              userData: {
                ...userData,
                source: source
              },
              bookingData: {
                bookingReference,
                source: source,
                eventName: 'Consulting Session'
              },
              paymentData: {
                paymentId: paymentResponse.razorpay_payment_id,
                orderId: paymentResponse.razorpay_order_id,
                signature: paymentResponse.razorpay_signature,
                amount: paymentConfig.consultingSessionPrice,
                currency: paymentConfig.currency,
                timestamp: new Date().toISOString()
              },
              source: source // Add source at top level for Google Sheets
            };

            // Save booking to backend (includes Google Sheets logging)
            await saveCompleteBooking(completeBooking);

            // Send notifications
            await sendAllNotifications(completeBooking);

            // Track conversion
            if (window.gtag) {
              window.gtag('event', 'purchase', {
                event_category: 'ecommerce',
                event_label: 'mobile_consulting_funnel',
                value: paymentConfig.consultingSessionPrice,
                currency: 'INR',
                transaction_id: paymentResponse.razorpay_payment_id,
                source: source
              });
            }

            // Move to success step
            setCurrentStep('success');

          } catch (error) {
            console.error('Error after payment success:', error);
            // Still show success (payment is complete)
            setCurrentStep('success');
          }
        },
        onFailure: (error) => {
          console.error('Payment failed:', error);
          alert('Payment failed. Please try again.');
          setIsSubmitting(false);
        }
      });

    } catch (error) {
      console.error('Payment initialization error:', error);
      alert('Failed to initialize payment. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Render based on current step
  if (currentStep === 'success') {
    return (
      <div className="mobile-funnel-page">
        <div className="mobile-funnel-container">
          <div className="success-screen">
            <div className="success-icon">🎉</div>
            <h1>Payment Successful!</h1>
            <p className="success-message">
              Your consulting session has been confirmed.
            </p>
            
            {bookingReference && (
              <div className="booking-ref">
                <strong>Booking Reference:</strong>
                <span>{bookingReference}</span>
              </div>
            )}

            <div className="next-steps">
              <h3>What's Next?</h3>
              <ul>
                <li>Check your email for booking confirmation</li>
                <li>You'll receive WhatsApp confirmation shortly</li>
                <li>Prepare your financial documents</li>
              </ul>
            </div>

            <div className="success-ctas">
              <a
                href="https://wa.me/919501195200"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
              >
                💬 Contact Support
              </a>
              
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  const ua = navigator.userAgent.toLowerCase();
                  const androidLink = "https://play.google.com/store/apps/details?id=com.dwt.AnupaatNivesh";
                  const iosLink = "https://apps.apple.com/us/app/anupaat-nivesh/id6446801290";
                  
                  if (ua.includes("android")) {
                    window.location.href = androidLink;
                  } else if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ipod")) {
                    window.location.href = iosLink;
                  } else {
                    // Default to Android for other devices
                    window.location.href = androidLink;
                  }
                  
                  if (window.gtag) {
                    window.gtag('event', 'app_download_click', {
                      event_category: 'engagement',
                      event_label: 'success_screen',
                      source: source
                    });
                  }
                }}
                className="btn btn-app"
              >
                📱 Download Our App
              </a>
              
              <a
                href="https://anupaatnivesh.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-home"
                onClick={() => {
                  if (window.gtag) {
                    window.gtag('event', 'home_click', {
                      event_category: 'navigation',
                      event_label: 'success_screen',
                      source: source
                    });
                  }
                }}
              >
                🏠 Visit Home
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'payment') {
    return (
      <div className="mobile-funnel-page">
        <div className="mobile-funnel-container">
          <div className="payment-screen">
            <h2>Complete Payment</h2>
            <div className="payment-summary">
              <div className="summary-row">
                <span>Service:</span>
                <span>1-on-1 Financial Consulting</span>
              </div>
              <div className="summary-row">
                <span>Amount:</span>
                <span className="amount">{formatAmountForDisplay(paymentConfig.consultingSessionPrice)}</span>
              </div>
            </div>

            <button
              className="btn btn-primary btn-large"
              onClick={handlePayment}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : `Pay ${formatAmountForDisplay(paymentConfig.consultingSessionPrice)}`}
            </button>

            <p className="payment-note">
              Secure payment powered by Razorpay
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'calendly') {
    const calendlyUrl = buildCalendlyUrl(userData);
    const finalUrl = calendlyUrl 
      ? `${calendlyUrl}${calendlyUrl.includes('?') ? '&' : '?'}booking_ref=${encodeURIComponent(bookingReference)}`
      : '';

    return (
      <div className="mobile-funnel-page">
        <div className="mobile-funnel-container">
          <div className="calendly-screen">
            <h2>Select Your Time</h2>
            <p>Choose a convenient time for your consultation</p>

            {calendlyConfig.consultingUrl ? (
              <div className="calendly-container">
                <iframe
                  src={finalUrl}
                  width="100%"
                  height="600"
                  frameBorder="0"
                  title="Calendly Scheduling"
                  className="calendly-iframe"
                />
                <button
                  className="btn btn-secondary"
                  onClick={handleCalendlyComplete}
                >
                  Continue to Payment
                </button>
              </div>
            ) : (
              <div className="calendly-fallback">
                <p>Calendly integration not configured.</p>
                <button
                  className="btn btn-primary"
                  onClick={handleCalendlyComplete}
                >
                  Continue to Payment
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default: Hero + Form view
  return (
    <div className="mobile-funnel-page">
      <div className="mobile-funnel-container">
        {/* SECTION 1: HERO / VALUE */}
        {currentStep === 'hero' && (
          <section className="hero-section">
            <h1>1-on-1 Financial Consulting Session</h1>
            <p className="hero-subtext">
              Personalized guidance for your money, goals & investments
            </p>

            <div className="price-display">
              <div className="price-row">
                <span className="price-old">₹9,999</span>
                <span className="price-new">₹99</span>
              </div>
              <p className="price-label">Introductory Offer</p>
            </div>

            <div className="trust-badge">
              <span>✓</span> Secure payment • No product pushing
            </div>
          </section>
        )}

        {/* SECTION 2: WHAT YOU GET */}
        {currentStep === 'hero' && (
          <section className="benefits-section">
            <h2>What You Get</h2>
            <ul className="benefits-list">
              <li>
                <span className="benefit-icon">✓</span>
                <span>Personal financial health check</span>
              </li>
              <li>
                <span className="benefit-icon">✓</span>
                <span>Goal clarity & prioritization</span>
              </li>
              <li>
                <span className="benefit-icon">✓</span>
                <span>Real asset & investment review</span>
              </li>
              <li>
                <span className="benefit-icon">✓</span>
                <span>Actionable next steps</span>
              </li>
            </ul>
          </section>
        )}

        {/* SECTION 3: CTA */}
        {currentStep === 'hero' && (
          <>
            <section className="cta-section">
              <button
                className="btn btn-primary btn-large"
                onClick={scrollToForm}
              >
                Book My Session
              </button>
            </section>
            
            {/* Sticky CTA Button */}
            <div className="sticky-cta">
              <button
                className="btn btn-primary btn-large"
                onClick={scrollToForm}
              >
                Book My Session
              </button>
            </div>
          </>
        )}

        {/* SECTION 4: USER DETAILS FORM */}
        <section className="form-section" ref={formSectionRef}>
          <h2>Enter Your Details</h2>
          <form ref={formRef} onSubmit={handleFormSubmit}>
            <div className="form-group">
              <label htmlFor="fullName">Full Name *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className={errors.fullName ? 'error' : ''}
                required
              />
              {errors.fullName && <span className="error-text">{errors.fullName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
                className={errors.email ? 'error' : ''}
                required
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Mobile Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="10-digit mobile number"
                className={errors.phone ? 'error' : ''}
                maxLength="10"
                required
              />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-large"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Continue'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};


export default BookConsultationMobile;

