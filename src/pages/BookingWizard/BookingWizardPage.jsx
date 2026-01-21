import React, { useEffect } from 'react';
import BookingWizard from '../../components/BookingWizard/BookingWizard';
import './BookingWizardPage.css';

/**
 * Booking Wizard Page
 * Main page wrapper for the booking wizard component
 */
const BookingWizardPage = () => {
  useEffect(() => {
    // Track page view
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: 'Booking Wizard',
        page_location: window.location.href
      });
    }
  }, []);

  return (
    <div className="booking-wizard-page">
      <BookingWizard />
    </div>
  );
};

export default BookingWizardPage;

