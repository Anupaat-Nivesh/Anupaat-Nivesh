import React from 'react';
import {
    HiOutlineUserGroup,
    HiOutlineSparkles,
    HiOutlineDeviceMobile,
    HiOutlineTrendingUp,
} from 'react-icons/hi';

import './TrustHighlights.css';

/**
 * TrustHighlights
 *
 * Compact credibility block that replaces the verbose About paragraphs on
 * the homepage. The standalone /about page still renders the full About
 * component — this is purely the "homepage merge" view.
 *
 * Reuses existing site tokens & utilities:
 *   - .section__padding, .section-heading-focus
 *   - --color-primary, --color-primary-light, --color-text, --color-subtext
 *   - data-aos animations (matches the rest of the site)
 */
const HIGHLIGHTS = [
    {
        icon: <HiOutlineUserGroup size={26} aria-hidden="true" />,
        title: 'Investor-First Philosophy',
        text: 'Unbiased advice. Skin in the game. Always your goals first.',
    },
    {
        icon: <HiOutlineSparkles size={26} aria-hidden="true" />,
        title: 'Personalized Guidance',
        text: 'A dedicated advisor for your goals, risk profile and timeline.',
    },
    {
        icon: <HiOutlineDeviceMobile size={26} aria-hidden="true" />,
        title: 'Tech-Enabled Onboarding',
        text: 'Paperless KYC, in-app SIPs and real-time portfolio tracking.',
    },
    {
        icon: <HiOutlineTrendingUp size={26} aria-hidden="true" />,
        title: 'Long-Term Approach',
        text: 'Disciplined investing aimed at compounding wealth over decades.',
    },
];

const TrustHighlights = () => {
    return (
        <section
            className="trust-highlights section__padding section__margin"
            aria-labelledby="trust-highlights-title"
            id="about"
        >
            <div className="trust-highlights__header" data-aos="fade-up">
                <span className="trust-highlights__eyebrow">About Anupaat Nivesh</span>
                <h2 id="trust-highlights-title">
                    Built Around <span className="section-heading-focus">Trust</span> &amp; Long-Term Wealth Creation
                </h2>
                <p className="trust-highlights__lede">
                    AMFI-registered. BSE Star MF. Advisor-led, technology-enabled.
                </p>
            </div>

            <ul className="trust-highlights__grid">
                {HIGHLIGHTS.map(({ icon, title, text }, index) => (
                    <li
                        key={title}
                        className="trust-highlight"
                        data-aos="fade-up"
                        data-aos-delay={index * 80}
                    >
                        <span className="trust-highlight__icon" aria-hidden="true">
                            {icon}
                        </span>
                        <h3 className="trust-highlight__title">{title}</h3>
                        <p className="trust-highlight__text">{text}</p>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default TrustHighlights;
