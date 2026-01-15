import React from 'react';
import './WhatsAppCTA.css';
import whatsappIcon from '../../assets/whatsapp.png';

/**
 * WhatsApp Sticky CTA Component
 * Displays a floating WhatsApp button for mobile users
 * TODO: Replace with actual WhatsApp business number from environment variables
 */
const WhatsAppCTA = () => {
  // TODO: Move to environment variable
  const whatsappNumber = process.env.REACT_APP_WHATSAPP_NUMBER || '919501195200'; // Format: country code + number without +
  const whatsappMessage = encodeURIComponent("Hi, I'm interested in learning more about Anupaat Nivesh's financial advisory services.");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-cta"
      aria-label="Chat with us on WhatsApp"
    >
      <img src={whatsappIcon} alt="WhatsApp" className="whatsapp-icon" />
      <span className="whatsapp-text">Chat with us</span>
    </a>
  );
};

export default WhatsAppCTA;

