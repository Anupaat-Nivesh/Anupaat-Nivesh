import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PhoneInput, { isPossiblePhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import emailjs from '@emailjs/browser';
import * as config from '../contact/Config';
import { storeUserData, storeBookingData, generateBookingReference, getStoredUserData } from '../../utils/bookingHandler';
import { createRazorpayOrder, initializeRazorpayCheckout } from '../../services/paymentService';
import { saveCompleteBooking } from '../../services/bookingService';
import { sendAllNotifications } from '../../services/notificationService';
import paymentConfig, { formatAmountForDisplay } from '../../utils/paymentConfig';
import { isBackendAvailable } from '../../api/config';
import BookingWidget from '../BookingWidget/BookingWidget';
import './BookingWizard.css';

/**
 * Booking Wizard Component
 * Multi-step booking flow with progress indicator and side content
 * Steps: 1. User Details → 2. Calendar Selection → 3. Payment
 */
const BookingWizard = () => {
  const navigate = useNavigate();
  const formRef = useRef();

  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // Form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    incomeRange: '',
    primaryConcern: ''
  });

  // Booking and payment data
  const [bookingData, setBookingData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState({});
  const [paymentError, setPaymentError] = useState(null);
  const [backendAvailable, setBackendAvailable] = useState(false);

  const incomeRanges = [
    'Less than ₹10 Lac',
    '₹10-20 Lac',
    '₹20-30 Lac',
    '₹30-50 Lac',
    'Above ₹50 Lac'
  ];

  const primaryConcerns = [
    'Retirement Planning',
    'Child Education',
    'Wealth Creation',
    'Tax Saving',
    'Debt Management',
    'First Crore Goal',
    'Portfolio Review',
    'Other'
  ];

  // Check if user data exists in session (for step 2)
  useEffect(() => {
    const storedUser = getStoredUserData();
    if (storedUser && currentStep === 1) {
      setFormData(storedUser);
    }
  }, []);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 968);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 968);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check backend availability
  useEffect(() => {
    const backendStatus = isBackendAvailable();
    setBackendAvailable(backendStatus);
    
    if (!backendStatus && currentStep === 3 && process.env.NODE_ENV === 'development') {
      setPaymentError(
        'Payment processing requires a backend server. ' +
        'Please configure REACT_APP_API_BASE_URL in .env file and start your backend server.'
      );
    }
  }, [currentStep]);

  const handleCalendlyEvent = React.useCallback((event) => {
    if (event.data.event && event.data.event === 'calendly.event_scheduled') {
      const calendlyData = event.data.payload || {};
      
      const booking = {
        calendlyEventId: calendlyData.event?.uuid || '',
        calendlyEventUri: calendlyData.event?.uri || '',
        calendlyInviteeUri: calendlyData.invitee?.uri || '',
        startTime: calendlyData.event?.start_time || '',
        endTime: calendlyData.event?.end_time || '',
        timezone: calendlyData.event?.timezone || 'Asia/Kolkata',
        location: calendlyData.event?.location?.location || 'Online',
        eventName: calendlyData.event?.name || 'Consulting Session'
      };

      const bookingReference = generateBookingReference();
      const completeBookingData = {
        bookingReference,
        userData: formData,
        bookingData: booking
      };

      storeBookingData(completeBookingData);
      setBookingData(completeBookingData);

      // Track booking completion
      if (window.gtag) {
        window.gtag('event', 'calendly_booking_complete', {
          'event_category': 'conversion',
          'event_label': 'consulting_session',
          'value': 1
        });
      }

      // Move to payment step
      setTimeout(() => {
        setCurrentStep(3);
      }, 1000);
    }
  }, [formData]);

  // Listen for Calendly booking completion (step 2 → step 3)
  useEffect(() => {
    if (currentStep === 2) {
      const messageHandler = (event) => handleCalendlyEvent(event);
      window.addEventListener('message', messageHandler);

      return () => {
        window.removeEventListener('message', messageHandler);
      };
    }
  }, [currentStep, handleCalendlyEvent]);

  // Send admin notification
  const sendAdminNotification = async (userData) => {
    try {
      const userDetails = `
Name: ${userData.firstName} ${userData.lastName}
Email: ${userData.email}
Phone: ${userData.phone || 'Not provided'}
Age: ${userData.age || 'Not provided'}
Annual Income Range: ${userData.incomeRange || 'Not provided'}
Primary Concern: ${userData.primaryConcern || 'Not provided'}
      `.trim();

      const templateParams = {
        user_name: 'Anupaat Nivesh Team',
        user_email: process.env.REACT_APP_ADMIN_EMAIL || 'info@anupaatnivesh.com',
        user_phone: userData.phone || 'Not provided',
        message: `New user registered for Financial Planning Session:

${userDetails}

Please follow up with this user for their booking.`,
        subject: 'New User Registration - Financial Planning Session',
        service_type: 'Consulting Session Registration'
      };

      await emailjs.send(
        config.emailJSserviceID,
        config.emailJStemplateID,
        templateParams,
        config.emailJSKey
      );
    } catch (error) {
      console.error('Error sending admin notification:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error[name]) {
      setError(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhoneChange = (value) => {
    setFormData(prev => ({ ...prev, phone: value || '' }));
    if (error.phone) {
      setError(prev => ({ ...prev, phone: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!config.validEmailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!isPossiblePhoneNumber(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }
    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else {
      const ageNum = parseInt(formData.age, 10);
      if (isNaN(ageNum) || ageNum < 18 || ageNum > 100) {
        newErrors.age = 'Age must be between 18 and 100';
      }
    }
    if (!formData.incomeRange) {
      newErrors.incomeRange = 'Please select your income range';
    }
    if (!formData.primaryConcern) {
      newErrors.primaryConcern = 'Please select your primary concern';
    }

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStep1Submit = async (e) => {
    e.preventDefault();

    if (!validateStep1()) {
      return;
    }

    setIsProcessing(true);

    try {
      storeUserData(formData);
      sendAdminNotification(formData).catch(err => {
        console.error('Failed to send admin notification:', err);
      });

      if (window.gtag) {
        window.gtag('event', 'consulting_form_submit', {
          'event_category': 'conversion',
          'event_label': formData.primaryConcern,
          'value': 1
        });
      }

      setCurrentStep(2);
    } catch (error) {
      console.error('Form submission error:', error);
      setError({ submit: 'Something went wrong. Please try again.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = async () => {
    if (!formData || !bookingData) {
      setPaymentError('Missing booking information. Please start over.');
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      const orderData = await createRazorpayOrder(formData, bookingData.bookingData);

      await initializeRazorpayCheckout({
        orderId: orderData.order_id,
        userData: formData,
        onSuccess: async (paymentResponse) => {
          try {
            const completeBooking = {
              bookingReference: bookingData.bookingReference,
              userData: formData,
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

            await saveCompleteBooking(completeBooking);
            await sendAllNotifications(completeBooking);

            if (window.gtag) {
              window.gtag('event', 'purchase', {
                'event_category': 'ecommerce',
                'event_label': 'consulting_session',
                'value': paymentConfig.consultingSessionPrice,
                'currency': 'INR',
                'transaction_id': paymentResponse.razorpay_payment_id
              });
            }

            navigate('/payment-success', {
              state: {
                bookingData: completeBooking,
                paymentResponse
              }
            });
          } catch (error) {
            console.error('Error after payment success:', error);
            navigate('/payment-success', {
              state: {
                bookingData: {
                  bookingReference: bookingData.bookingReference,
                  userData: formData,
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
          setPaymentError(error.message || 'Payment failed. Please try again.');
          setIsProcessing(false);

          if (window.gtag) {
            window.gtag('event', 'payment_failed', {
              'event_category': 'ecommerce',
              'event_label': 'consulting_session',
              'value': paymentConfig.consultingSessionPrice
            });
          }
        }
      });
    } catch (error) {
      console.error('Payment initialization error:', error);
      let errorMessage = error.message || 'Failed to initialize payment. Please try again.';
      
      if (error.message && error.message.includes('Backend API')) {
        errorMessage = 'Payment processing requires a backend server. Please contact support or try again later.';
      } else if (error.message && error.message.includes('network')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      }
      
      setPaymentError(errorMessage);
      setIsProcessing(false);
    }
  };

  const goToStep = (step) => {
    if (step < currentStep && step >= 1) {
      setCurrentStep(step);
    }
  };

  return (
    <div className="booking-wizard">
      {/* Progress Bar */}
      <div className="wizard-progress">
        <div className="progress-bar-container">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
        <div className="progress-steps">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`progress-step ${step === currentStep ? 'active' : ''} ${step < currentStep ? 'completed' : ''}`}
              onClick={() => goToStep(step)}
            >
              <div className="step-number">{step < currentStep ? '✓' : step}</div>
              <div className="step-label">
                {step === 1 && 'Your Details'}
                {step === 2 && 'Select Time'}
                {step === 3 && 'Payment'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="wizard-container">
        {/* Main Content */}
        <div className="wizard-main">
          {/* Step 1: User Details Form */}
          {currentStep === 1 && (
            <div className="wizard-step step-1">
              <div className="step-header">
                <h2>Tell Us About Yourself</h2>
                <p>We'll use this information to personalize your session</p>
              </div>

              <form ref={formRef} onSubmit={handleStep1Submit} className="wizard-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name *</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter your first name"
                      className={error.firstName ? 'error' : ''}
                      required
                    />
                    {error.firstName && <span className="error-message">{error.firstName}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName">Last Name *</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter your last name"
                      className={error.lastName ? 'error' : ''}
                      required
                    />
                    {error.lastName && <span className="error-message">{error.lastName}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="abc@example.com"
                      className={error.email ? 'error' : ''}
                      required
                    />
                    {error.email && <span className="error-message">{error.email}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone Number *</label>
                    <div className="mobile-number__input-container">
                      <PhoneInput
                        className="phoneInput"
                        placeholder="Enter phone number"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        defaultCountry="IN"
                        international
                        countryCallingCodeEditable={false}
                      />
                    </div>
                    {error.phone && <span className="error-message">{error.phone}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="age">Age *</label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="Enter your age"
                      min="18"
                      max="100"
                      className={error.age ? 'error' : ''}
                      required
                    />
                    {error.age && <span className="error-message">{error.age}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="incomeRange">Annual Income Range *</label>
                    <select
                      id="incomeRange"
                      name="incomeRange"
                      value={formData.incomeRange}
                      onChange={handleChange}
                      className={error.incomeRange ? 'error' : ''}
                      required
                    >
                      <option value="">Select annual income range</option>
                      {incomeRanges.map((range, index) => (
                        <option key={index} value={range}>{range}</option>
                      ))}
                    </select>
                    {error.incomeRange && <span className="error-message">{error.incomeRange}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="primaryConcern">Primary Financial Concern *</label>
                  <select
                    id="primaryConcern"
                    name="primaryConcern"
                    value={formData.primaryConcern}
                    onChange={handleChange}
                    className={error.primaryConcern ? 'error' : ''}
                    required
                  >
                    <option value="">Select your primary concern</option>
                    {primaryConcerns.map((concern, index) => (
                      <option key={index} value={concern}>{concern}</option>
                    ))}
                  </select>
                  {error.primaryConcern && <span className="error-message">{error.primaryConcern}</span>}
                </div>

                {error.submit && (
                  <div className="error-message submit-error">{error.submit}</div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary wizard-button"
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Continue to Time Selection'}
                </button>
              </form>
            </div>
          )}

          {/* Step 2: Calendar Selection */}
          {currentStep === 2 && (
            <div className="wizard-step step-2">
              <div className="step-header">
                <h2>Select Your Preferred Time</h2>
                <p>Choose a convenient time slot for your consulting session</p>
              </div>

              <div className="user-info-summary">
                <div className="info-item">
                  <strong>Name:</strong> {formData.firstName} {formData.lastName}
                </div>
                <div className="info-item">
                  <strong>Email:</strong> {formData.email}
                </div>
                <div className="info-item">
                  <strong>Phone:</strong> {formData.phone}
                </div>
              </div>

              <div className="booking-widget-wrapper">
                <BookingWidget
                  type="calendly"
                  calendlyUrl={process.env.REACT_APP_CALENDLY_CONSULTING_URL}
                  title="Book Your Consultation"
                  subtitle="Select a date and time that works for you"
                  userData={formData}
                />
              </div>

              <div className="step-note">
                <p>After selecting your time slot, you'll proceed to payment.</p>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {currentStep === 3 && bookingData && (
            <div className="wizard-step step-3">
              <div className="step-header">
                <h2>Complete Your Payment</h2>
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

              {paymentError && (
                <div className="payment-error">
                  <p>{paymentError}</p>
                </div>
              )}

              <div className="payment-actions">
                <button
                  className="btn btn-primary wizard-button payment-button"
                  onClick={handlePayment}
                  disabled={isProcessing || (!backendAvailable && process.env.NODE_ENV === 'development')}
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
          )}
        </div>

        {/* Side Content Panel */}
        <div className="wizard-sidebar">
          <div className="sidebar-content">
            <div className="sidebar-header">
              <h3>Financial Planning Session</h3>
              <div className="price-display">
                <span className="price-old">₹9,999</span>
                <span className="price-new">₹99</span>
                <span className="price-discount">Save 99%</span>
              </div>
            </div>

            {/* Collapsible content for mobile */}
            {!isMobile && (
              <>
                <div className="sidebar-section">
                  <h4>What's Included</h4>
                  <ul className="sidebar-list">
                    <li>✓ Comprehensive Financial Planning</li>
                    <li>✓ Income-Expense Analysis</li>
                    <li>✓ Investment Recommendations</li>
                    <li>✓ Goal Clarification & Roadmap</li>
                    <li>✓ Personalized Action Plan</li>
                  </ul>
                </div>

                <div className="sidebar-section">
                  <h4>Session Details</h4>
                  <div className="session-details">
                    <div className="detail-item">
                      <span className="detail-icon">⏱️</span>
                      <span>Duration: 60-90 minutes</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">💻</span>
                      <span>Format: Online (Video Call)</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">📅</span>
                      <span>Flexible Scheduling</span>
                    </div>
                  </div>
                </div>

                <div className="sidebar-section">
                  <h4>Why Choose Us</h4>
                  <ul className="sidebar-list">
                    <li>✓ AMFI Registered Advisor</li>
                    <li>✓ 8+ Years Experience</li>
                    <li>✓ ₹25 Cr+ AUM Managed</li>
                    <li>✓ 500+ Happy Clients</li>
                    <li>✓ No Sales Pressure</li>
                  </ul>
                </div>
              </>
            )}

            {/* Always show user summary on desktop, or if it's the current step on mobile */}
            {(currentStep > 1 && formData) && (
              <div className="sidebar-section user-summary">
                <h4>Your Information</h4>
                <div className="user-summary-content">
                  <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                  <p><strong>Email:</strong> {formData.email}</p>
                  <p><strong>Phone:</strong> {formData.phone}</p>
                </div>
              </div>
            )}
            
            {/* Always show booking summary */}
            {currentStep === 3 && bookingData?.bookingData?.startTime && (
              <div className="sidebar-section booking-summary">
                <h4>Your Booking</h4>
                <div className="booking-summary-content">
                  <p>
                    <strong>Date & Time:</strong><br />
                    {new Date(bookingData.bookingData.startTime).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingWizard;
