import React, { useMemo, useState } from "react";
import "./Onboarding.css";

const DEFAULT_ONBOARDING_URL =
  "https://script.google.com/macros/s/AKfycbyz7TLi26OXU1aPSgIopz95dEbXYrkTHKRD51tWf8Zc4EgBahsY7-evXMs6-E7U_pcL7Q/exec?v=10";

function Onboarding() {
  const [isLoading, setIsLoading] = useState(true);
  const [showFallback, setShowFallback] = useState(false);

  const onboardingUrl = useMemo(() => {
    const envUrl = process.env.REACT_APP_ONBOARDING_WEBAPP_URL;
    return envUrl && envUrl.trim() ? envUrl.trim() : DEFAULT_ONBOARDING_URL;
  }, []);

  const handleFrameLoad = () => {
    setIsLoading(false);
  };

  const handleFallback = () => {
    setShowFallback(true);
    setIsLoading(false);
  };

  return (
    <main className="onboarding-shell">
      <header className="onboarding-header">
        <div className="onboarding-brand">Anupaat Nivesh</div>
        <p className="onboarding-subtitle">Secure Onboarding</p>
      </header>

      <section className="onboarding-content">
        {isLoading && (
          <div className="onboarding-loader" role="status" aria-live="polite">
            <div className="onboarding-spinner" />
            <p>Preparing your onboarding form...</p>
          </div>
        )}

        {showFallback ? (
          <div className="onboarding-fallback">
            <h1>Open secure onboarding</h1>
            <p>
              We could not embed the onboarding form in this browser. Please
              continue in a new tab.
            </p>
            <a href={onboardingUrl} target="_blank" rel="noopener noreferrer">
              Open Onboarding
            </a>
          </div>
        ) : (
          <iframe
            className="onboarding-frame"
            title="Anupaat Nivesh Onboarding"
            src={onboardingUrl}
            onLoad={handleFrameLoad}
            referrerPolicy="strict-origin-when-cross-origin"
          />
        )}
      </section>

      {isLoading && (
        <button
          className="onboarding-fallback-toggle"
          type="button"
          onClick={handleFallback}
        >
          Having trouble loading?
        </button>
      )}
    </main>
  );
}

export default Onboarding;
