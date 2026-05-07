import React from 'react';
import { Link } from 'react-router-dom';
import {
    HiOutlineDocumentText,
    HiOutlineUserGroup,
    HiOutlineShieldCheck,
} from 'react-icons/hi';

import SignupOptionCard from './SignupOptionCard';

/**
 * Option 2 — Assisted Onboarding.
 *
 * Routes to the existing /onboarding route which embeds the Apps Script
 * upload form inside our branded shell, preserving all current upload
 * functionality.
 */
const FEATURES = [
    { icon: <HiOutlineDocumentText size={18} />, label: 'Secure document upload' },
    { icon: <HiOutlineUserGroup size={18} />, label: 'Dedicated relationship manager' },
    { icon: <HiOutlineShieldCheck size={18} />, label: 'KYC compliant handling' },
];

const AssistedOnboardingCard = () => {
    return (
        <SignupOptionCard
            accent="dark"
            optionLabel="Option 2"
            headingId="signup-option-assisted-title"
            aosDelay={120}
            title="Assisted Onboarding"
            subtitle="Get support from our onboarding team"
            description="Upload your documents and our team will assist you."
            features={FEATURES}
            primaryCta={
                <Link
                    to="/onboarding"
                    className="signup-cta signup-cta--primary signup-cta--on-dark"
                    aria-label="Start assisted onboarding"
                >
                    Start Assisted Onboarding
                </Link>
            }
        />
    );
};

export default AssistedOnboardingCard;
