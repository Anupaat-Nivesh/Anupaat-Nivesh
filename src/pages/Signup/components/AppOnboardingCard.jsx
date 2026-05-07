import React from 'react';
import { Link } from 'react-router-dom';
import {
    HiOutlineLightningBolt,
    HiOutlineDeviceMobile,
    HiOutlineChartBar,
} from 'react-icons/hi';

import SignupOptionCard from './SignupOptionCard';

import playStore from '../../../assets/google-play-badge.png';
import appStore from '../../../assets/apple-store-badge.svg';

/**
 * Option 1 — Self Onboarding (Recommended).
 *
 * Reuses the same store URLs and badge assets the existing OurApp page uses,
 * so any update there propagates here. The CTA navigates to /appdownload —
 * the existing smart device-redirect route.
 */
const FEATURES = [
    { icon: <HiOutlineLightningBolt size={18} />, label: 'Paperless KYC' },
    { icon: <HiOutlineDeviceMobile size={18} />, label: 'In-app SIP & lumpsum' },
    { icon: <HiOutlineChartBar size={18} />, label: 'Live portfolio tracking' },
];

const AppOnboardingCard = () => {
    const storeBadges = (
        <div className="signup-app-card__stores" aria-label="Available on app stores">
            <a
                href="https://play.google.com/store/apps/details?id=com.dwt.AnupaatNivesh"
                target="_blank"
                rel="noreferrer"
                aria-label="Get it on Google Play"
            >
                <img
                    src={playStore}
                    alt="Get it on Google Play"
                    className="signup-app-card__store-img"
                    loading="lazy"
                />
            </a>
            <a
                href="https://apps.apple.com/app/id6446801290"
                target="_blank"
                rel="noreferrer"
                aria-label="Download on the App Store"
            >
                <img
                    src={appStore}
                    alt="Download on the App Store"
                    className="signup-app-card__store-img"
                    loading="lazy"
                />
            </a>
        </div>
    );

    return (
        <SignupOptionCard
            accent="light"
            recommended
            optionLabel="Option 1"
            headingId="signup-option-app-title"
            aosDelay={0}
            title="Self Onboarding"
            subtitle="Recommended for self-starters & tech-savvy investors"
            description="Complete your onboarding digitally through our app."
            features={FEATURES}
            featuresAside={storeBadges}
            primaryCta={
                <Link
                    to="/appdownload"
                    className="signup-cta signup-cta--primary"
                    aria-label="Download the Anupaat Nivesh app"
                >
                    Download App
                </Link>
            }
        />
    );
};

export default AppOnboardingCard;
