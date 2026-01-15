import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import './WhatsAppCTA.css';

/**
 * WhatsAppCTA Component
 * 
 * Sticky floating WhatsApp button for financial advisory inquiries.
 * Opens WhatsApp with a pre-filled message for financial planning guidance.
 * 
 * Configuration:
 * - REACT_APP_WHATSAPP_NUMBER: WhatsApp number in international format (e.g., 919876543210)
 * - Message: Pre-filled message for user convenience
 * 
 * Features:
 * - Fixed bottom-right position
 * - Mobile-first design
 * - Minimum 48px x 48px tap target
 * - Smooth hover/tap animations
 * - Accessible with ARIA labels
 * - Hidden on very small screens if overlapping
 */
const WhatsAppCTA = () => {
  // Get WhatsApp number from environment variable
  // Clean the number: remove spaces, +, -, and other non-digit characters
  // Fallback to default number if env var not loaded (for development/testing)
  const rawNumber = process.env.REACT_APP_WHATSAPP_NUMBER || '919501185200';
  const whatsappNumber = rawNumber ? rawNumber.replace(/[\s\+\-\(\)]/g, '') : '919501185200';
  
  // Default message for financial planning guidance
  const defaultMessage = 'Hi, I want guidance for my financial planning.';
  
  // Encode message for URL
  const encodedMessage = encodeURIComponent(defaultMessage);
  
  // Construct WhatsApp URL
  // Format: https://wa.me/{number}?text={message}
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
  
  return (
    <a
      href={whatsappUrl}
      className="whatsapp-cta"
      aria-label="Chat with us on WhatsApp for financial planning guidance"
      target="_blank"
      rel="noopener noreferrer"
    >
      <FaWhatsapp className="whatsapp-cta__icon" />
      <span className="whatsapp-cta__tooltip">Chat with us</span>
    </a>
  );
};

export default WhatsAppCTA;

