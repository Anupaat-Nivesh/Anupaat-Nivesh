import React, { useEffect } from 'react';
import './AppDownload.css';

const AppDownload = () => {
  useEffect(() => {
    redirectUser();
  }, []);

  const redirectUser = () => {
    const ua = navigator.userAgent.toLowerCase();
    
    const androidLink = "https://play.google.com/store/apps/details?id=com.dwt.AnupaatNivesh";
    const iosLink = "https://apps.apple.com/us/app/anupaat-nivesh/id6446801290";
    const fallback = "https://anupaatnivesh.com/ourApp";
    
    // Check for Android
    if (ua.includes("android")) {
      window.location.href = androidLink;
      return;
    }
    
    // Check for iOS (iPhone, iPad, iPod)
    if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ipod")) {
      window.location.href = iosLink;
      return;
    }
    
    // Fallback for desktop or other devices
    window.location.href = fallback;
  };

  return (
    <div className="app-download-container">
      <div className="app-download-content">
        <div className="app-logo">AN</div>
        <h1>Anupaat Nivesh App</h1>
        <p className="subtitle">Redirecting to app store...</p>
        <div className="spinner"></div>
        
        <div className="manual-links">
          <p>If you're not redirected automatically, choose your platform:</p>
          <div className="links">
            <a 
              href="https://play.google.com/store/apps/details?id=com.dwt.AnupaatNivesh" 
              className="link-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              Android
            </a>
            <a 
              href="https://apps.apple.com/us/app/anupaat-nivesh/id6446801290" 
              className="link-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              iOS
            </a>
            <a 
              href="https://anupaatnivesh.com/ourApp" 
              className="link-btn secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppDownload;

