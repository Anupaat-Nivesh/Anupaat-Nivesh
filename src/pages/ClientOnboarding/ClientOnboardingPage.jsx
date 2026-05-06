import React, { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClientOnboardingWizard from '../../components/ClientOnboarding/ClientOnboardingWizard';

/**
 * Standalone client onboarding (KYC-style wizard + document upload).
 * Route: /client-onboarding
 */
export default function ClientOnboardingPage() {
  useEffect(() => {
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: 'Client Onboarding',
        page_location: window.location.href
      });
    }
  }, []);

  return (
    <>
      <ClientOnboardingWizard />
      <ToastContainer className="toastContainer" position="top-right" />
    </>
  );
}
