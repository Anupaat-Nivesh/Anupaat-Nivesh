import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { updateSEO } from '../../utils/seo';

import SignupHero from './components/SignupHero';
import AppOnboardingCard from './components/AppOnboardingCard';
import AssistedOnboardingCard from './components/AssistedOnboardingCard';
import TrustSection from './components/TrustSection';
import SignupFAQSection from './components/SignupFAQSection';

import './Signup.css';

/**
 * SignupPage
 *
 * Two-path onboarding chooser:
 *   1. Self Onboarding      -> /appdownload (smart device redirect)
 *   2. Assisted Onboarding  -> /onboarding   (in-app embedded Apps Script form)
 *
 * Reuses existing CSS variables, the section utility classes, the Faq
 * accordion component and shared app-store assets so we never duplicate
 * marketing content.
 */
const SignupPage = () => {
    const [showStickyCta, setShowStickyCta] = useState(false);
    const heroRef = useRef(null);

    useEffect(() => {
        updateSEO({
            title: 'Sign Up — Start Your Investment Journey',
            description:
                'Sign up with Anupaat Nivesh — choose between self onboarding via app or assisted onboarding with our team. AMFI registered mutual fund distributor.',
            keywords:
                'sign up, anupaat nivesh signup, mutual fund onboarding, self onboarding, assisted onboarding, KYC',
            canonical: '/signup',
            ogType: 'website',
        });
    }, []);

    // Mobile sticky CTA: surface the recommended action when the hero leaves
    // the viewport. Uses IntersectionObserver — no scroll listeners.
    useEffect(() => {
        if (!heroRef.current || typeof IntersectionObserver === 'undefined') {
            return undefined;
        }

        const observer = new IntersectionObserver(
            ([entry]) => setShowStickyCta(!entry.isIntersecting),
            { threshold: 0, rootMargin: '0px' }
        );
        observer.observe(heroRef.current);

        return () => observer.disconnect();
    }, []);

    return (
        <main
            className={`signup-page${showStickyCta ? ' signup-page--show-sticky' : ''}`}
            id="signup"
        >
            <div ref={heroRef}>
                <SignupHero />
            </div>

            <section
                className="signup-options home-section section__padding"
                aria-labelledby="signup-options-title"
            >
                <div className="signup-options__header" data-aos="fade-up">
                    <h2 id="signup-options-title">
                        Choose your <span className="section-heading-focus">onboarding</span>
                    </h2>
                </div>

                <div className="signup-options__grid">
                    <AppOnboardingCard />
                    <AssistedOnboardingCard />
                </div>

                <TrustSection />
            </section>

            <SignupFAQSection />

            {/* Mobile-only sticky CTA — surfaces the recommended path */}
            <Link
                to="/appdownload"
                className="signup-mobile-cta"
                aria-label="Download the Anupaat Nivesh app"
                aria-hidden={!showStickyCta}
                tabIndex={showStickyCta ? 0 : -1}
            >
                Download App
            </Link>
        </main>
    );
};

export default SignupPage;
