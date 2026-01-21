import React, { useEffect, useCallback } from 'react';
import { buildCalendlyUrl, validateCalendlyConfig } from '../../utils/calendlyConfig';
import './BookingWidget.css';

/**
 * Booking Widget Component
 * Supports Calendly and Google Booking integrations
 * Uses centralized Calendly configuration
 */
const BookingWidget = ({ 
  type = 'calendly', // 'calendly' or 'google'
  calendlyUrl = null, // Override Calendly URL (optional)
  googleBookingUrl = null,
  title = "Book a Free Consultation",
  subtitle = "Schedule a time that works for you",
  userData = null, // User data for prefill
  showHeader = true // Show header section (default true for backward compatibility)
}) => {
  // Validate Calendly configuration
  useEffect(() => {
    if (type === 'calendly') {
      validateCalendlyConfig();
    }
  }, [type]);
  
  // Build Calendly URL with prefill parameters using config utility
  const getCalendlyUrl = useCallback(() => {
    // Priority: prop > REACT_APP_CALENDLY_CONSULTING_URL > REACT_APP_CALENDLY_URL > config utility
    const propUrl = calendlyUrl;
    const envConsultingUrl = process.env.REACT_APP_CALENDLY_CONSULTING_URL;
    const envUrl = process.env.REACT_APP_CALENDLY_URL;
    const configUrl = buildCalendlyUrl(userData);
    
    const urlToUse = propUrl || envConsultingUrl || envUrl || configUrl;
    
    if (!urlToUse || urlToUse.trim() === '') {
      console.warn('Calendly URL not found. Checked:', {
        propUrl,
        envConsultingUrl,
        envUrl,
        configUrl
      });
      return '';
    }

    // Return base URL without query params (we'll use prefill in initInlineWidget)
    return urlToUse;
  }, [calendlyUrl, userData]);
  
  const defaultCalendlyUrl = getCalendlyUrl();

  // Load and initialize Calendly widget using JavaScript API
  useEffect(() => {
    if (type === 'calendly' && defaultCalendlyUrl) {
      const containerId = 'calendly-inline-widget-container';
      let isMounted = true;
      
      // Function to initialize Calendly widget
      const initCalendly = () => {
        if (!isMounted) return;
        
        if (window.Calendly && window.Calendly.initInlineWidget) {
          const container = document.getElementById(containerId);
          if (container && isMounted) {
            // Clear any existing content
            container.innerHTML = '';
            
            // Prepare prefill data
            const prefillData = userData ? {
              name: userData.firstName && userData.lastName 
                ? `${userData.firstName} ${userData.lastName}` 
                : undefined,
              email: userData.email || undefined,
              customAnswers: {
                a1: userData.phone || undefined,
                a2: userData.age || undefined,
                a3: userData.incomeRange || undefined,
                a4: userData.primaryConcern || undefined,
              }
            } : undefined;
            
            // Initialize inline widget using JavaScript API
            try {
              window.Calendly.initInlineWidget({
                url: defaultCalendlyUrl,
                parentElement: container,
                prefill: prefillData,
                // Ensure full booking flow is visible on one screen
                utm: {},
                hideEventTypeDetails: false,
                hideLandingPageDetails: false,
              });
            } catch (error) {
              console.error('Error initializing Calendly widget:', error);
            }
          }
        }
      };

      // Check if Calendly is already loaded
      if (window.Calendly && window.Calendly.initInlineWidget) {
        // Small delay to ensure DOM is ready
        setTimeout(initCalendly, 50);
        return () => {
          isMounted = false;
        };
      }

      // Check if script is already in DOM
      if (document.querySelector('script[src*="calendly.com"]')) {
        // Script exists, wait for it to load
        const checkInterval = setInterval(() => {
          if (window.Calendly && window.Calendly.initInlineWidget) {
            clearInterval(checkInterval);
            initCalendly();
          }
        }, 100);
        
        // Cleanup after 5 seconds if still not loaded
        const timeout = setTimeout(() => clearInterval(checkInterval), 5000);
        
        return () => {
          isMounted = false;
          clearInterval(checkInterval);
          clearTimeout(timeout);
        };
      }

      // Load Calendly widget script
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      script.onload = () => {
        if (isMounted) {
          // Wait a bit for Calendly to fully initialize
          setTimeout(initCalendly, 100);
        }
      };
      script.onerror = () => {
        console.error('Failed to load Calendly widget script');
      };
      document.body.appendChild(script);

      return () => {
        isMounted = false;
      };
    }
  }, [type, defaultCalendlyUrl, userData]);

  // Show error state if Calendly URL is not configured
  if (type === 'calendly' && !defaultCalendlyUrl) {
    return (
      <div className="booking-widget-container">
        <div className="booking-widget-header">
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
        <div className="booking-widget-error">
          <p>⚠️ Calendly is not configured.</p>
          <p>Please set <code>REACT_APP_CALENDLY_CONSULTING_URL</code> in your <code>.env</code> file and restart the dev server.</p>
          <div className="booking-note" style={{ marginTop: '1.5rem' }}>
            <p><strong>Current values checked:</strong></p>
            <ul style={{ textAlign: 'left', marginTop: '1rem', paddingLeft: '2rem' }}>
              <li>Prop URL: {calendlyUrl || 'Not provided'}</li>
              <li>REACT_APP_CALENDLY_CONSULTING_URL: {process.env.REACT_APP_CALENDLY_CONSULTING_URL || 'Not set'}</li>
              <li>REACT_APP_CALENDLY_URL: {process.env.REACT_APP_CALENDLY_URL || 'Not set'}</li>
            </ul>
            <p style={{ marginTop: '1.5rem' }}>
              <strong>Note:</strong> After updating <code>.env</code>, you must restart the development server for changes to take effect.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'calendly' && defaultCalendlyUrl) {
    return (
      <div className={`booking-widget-container ${!showHeader ? 'booking-widget-fullscreen' : ''}`}>
        {showHeader && (
          <div className="booking-widget-header">
            <h3>{title}</h3>
            <p>{subtitle}</p>
          </div>
        )}
        <div className="calendly-widget-wrapper">
          <div 
            id="calendly-inline-widget-container"
            className="calendly-inline-widget-container"
          />
        </div>
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

