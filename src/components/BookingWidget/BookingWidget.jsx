import React, { useEffect } from 'react';
import './BookingWidget.css';

/**
 * Booking Widget Component
 * Supports Calendly and Google Booking integrations
 * TODO: Replace with actual Calendly URL or Google Booking embed
 */
const BookingWidget = ({ 
  type = 'calendly', // 'calendly' or 'google'
  calendlyUrl = null, // e.g., 'https://calendly.com/anupaat-nivesh/consultation'
  googleBookingUrl = null,
  title = "Book a Free Consultation",
  subtitle = "Schedule a time that works for you",
  userData = null // User data for prefill
}) => {
  // Get Calendly URL from environment or prop
  const defaultCalendlyUrl = process.env.REACT_APP_CALENDLY_CONSULTING_URL || 
                              process.env.REACT_APP_CALENDLY_URL || 
                              calendlyUrl || 
                              'https://calendly.com/anupaat-nivesh/consultation';
  
  // Build Calendly URL with prefill parameters
  const getCalendlyUrl = () => {
    if (!userData) return defaultCalendlyUrl;
    
    const params = new URLSearchParams();
    params.append('name', `${userData.firstName} ${userData.lastName}`);
    if (userData.email) params.append('email', userData.email);
    if (userData.phone) params.append('a1', userData.phone); // Custom field for phone
    
    // Add custom fields if Calendly supports them
    if (userData.age) params.append('a2', userData.age);
    if (userData.incomeRange) params.append('a3', userData.incomeRange);
    if (userData.primaryConcern) params.append('a4', userData.primaryConcern);
    
    return `${defaultCalendlyUrl}?${params.toString()}`;
  };

  useEffect(() => {
    if (type === 'calendly' && defaultCalendlyUrl) {
      // Load Calendly widget script
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.body.appendChild(script);

      return () => {
        // Cleanup
        const calendlyScript = document.querySelector('script[src*="calendly.com"]');
        if (calendlyScript) {
          calendlyScript.remove();
        }
      };
    }
  }, [type, defaultCalendlyUrl]);

  if (type === 'calendly' && defaultCalendlyUrl) {
    const calendlyUrlWithPrefill = getCalendlyUrl();
    
    return (
      <div className="booking-widget-container">
        <div className="booking-widget-header">
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
        <div 
          className="calendly-inline-widget" 
          data-url={calendlyUrlWithPrefill}
          style={{ minWidth: '320px', height: '630px' }}
        />
      </div>
    );
  }

  if (type === 'google' && googleBookingUrl) {
    return (
      <div className="booking-widget-container">
        <div className="booking-widget-header">
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
        <iframe
          src={googleBookingUrl}
          className="google-booking-iframe"
          title="Book a consultation"
          frameBorder="0"
        />
      </div>
    );
  }

  // Fallback: Simple form that sends booking request via EmailJS
  return (
    <div className="booking-widget-container">
      <div className="booking-widget-header">
        <h3>{title}</h3>
        <p>{subtitle}</p>
        <p className="booking-fallback-text">
          Please fill out the form below and we'll contact you to schedule a convenient time.
        </p>
      </div>
      <div className="booking-fallback-form">
        <p>For now, please use our <a href="/contact">Contact Form</a> or <a href="#portfolio-review">Lead Form</a> to request a consultation.</p>
        <p className="booking-note">
          <strong>Note:</strong> Calendly/Google Booking integration can be added by setting <code>REACT_APP_CALENDLY_URL</code> in environment variables.
        </p>
      </div>
    </div>
  );
};

export default BookingWidget;

