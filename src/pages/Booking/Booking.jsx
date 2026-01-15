import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BookingWidget from '../../components/BookingWidget/BookingWidget';
import { getStoredUserData, storeBookingData, generateBookingReference } from '../../utils/bookingHandler';
import './Booking.css';

/**
 * Booking Page
 * Shows calendar widget for user to select time slot
 * After booking, redirects to payment page
 */
const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    // Get user data from location state or sessionStorage
    const stateUserData = location.state?.userData;
    const storedUserData = getStoredUserData();
    const data = stateUserData || storedUserData;

    if (!data) {
      // No user data found, redirect to form
      navigate('/consulting-session');
      return;
    }

    setUserData(data);

    // Listen for Calendly booking completion
    window.addEventListener('message', handleCalendlyEvent);
    
    // Load Calendly script if not already loaded
    if (!document.querySelector('script[src*="calendly.com"]')) {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.body.appendChild(script);
    }

    return () => {
      window.removeEventListener('message', handleCalendlyEvent);
    };
  }, [location, navigate]);

  const handleCalendlyEvent = (event) => {
    // Calendly sends events via postMessage
    if (event.data.event && event.data.event === 'calendly.event_scheduled') {
      const calendlyData = event.data.payload || {};
      
      // Extract booking data
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

      // Generate booking reference
      const bookingReference = generateBookingReference();

      // Store booking data
      const completeBookingData = {
        bookingReference,
        userData,
        bookingData: booking
      };

      storeBookingData(completeBookingData);
      setBookingData(completeBookingData);
      setBookingComplete(true);

      // Track booking completion
      if (window.gtag) {
        window.gtag('event', 'calendly_booking_complete', {
          'event_category': 'conversion',
          'event_label': 'consulting_session',
          'value': 1
        });
      }

      // Redirect to payment after a short delay
      setTimeout(() => {
        navigate('/payment', {
          state: {
            userData,
            bookingData: completeBookingData
          }
        });
      }, 2000);
    }
  };

  if (!userData) {
    return (
      <div className="booking-page">
        <div className="booking-loading">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (bookingComplete) {
    return (
      <div className="booking-page">
        <div className="booking-success">
          <div className="success-icon">✓</div>
          <h2>Booking Confirmed!</h2>
          <p>Redirecting to payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="booking-container">
        <div className="booking-header">
          <h1>Select Your Preferred Time</h1>
          <p>Choose a convenient time slot for your consulting session</p>
        </div>

        <div className="booking-info">
          <div className="info-item">
            <strong>Name:</strong> {userData.firstName} {userData.lastName}
          </div>
          <div className="info-item">
            <strong>Email:</strong> {userData.email}
          </div>
          <div className="info-item">
            <strong>Phone:</strong> {userData.phone}
          </div>
        </div>

        <div className="booking-widget-wrapper">
          <BookingWidget
            type="calendly"
            calendlyUrl={process.env.REACT_APP_CALENDLY_CONSULTING_URL}
            title="Book Your Consultation"
            subtitle="Select a date and time that works for you"
            userData={userData}
          />
        </div>

        <div className="booking-note">
          <p>After selecting your time slot, you'll be redirected to complete the payment.</p>
        </div>
      </div>
    </div>
  );
};

export default Booking;

