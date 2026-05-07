import React from 'react';

/**
 * Generic shell for an onboarding option card on /signup.
 *
 * Refined for the simplification pass:
 *  - Prominent "Option N" pill
 *  - Floating "Recommended" ribbon (Option 1 only)
 *  - Bold title + short subtitle + 1-line description
 *  - Compact icon-bullet feature list (3 items), optional aside (e.g. store badges)
 *  - Single primary CTA, optional sub-element below CTA
 */
const SignupOptionCard = ({
    optionLabel,
    title,
    subtitle,
    description,
    features = [],
    featuresAside,
    primaryCta,
    secondary,
    recommended = false,
    accent = 'light',
    aosDelay = 0,
    headingId,
    children,
}) => {
    const cardClasses = [
        'signup-option-card',
        `signup-option-card--${accent}`,
        recommended ? 'signup-option-card--recommended' : '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <article
            className={cardClasses}
            data-aos="fade-up"
            data-aos-delay={aosDelay}
            aria-labelledby={headingId}
        >
            {recommended && (
                <span className="signup-option-card__ribbon" aria-label="Recommended option">
                    Recommended
                </span>
            )}

            <header className="signup-option-card__header">
                {optionLabel && (
                    <span className="signup-option-card__option-label">{optionLabel}</span>
                )}
                <h2 id={headingId} className="signup-option-card__title">
                    {title}
                </h2>
                {subtitle && (
                    <p className="signup-option-card__subtitle">{subtitle}</p>
                )}
                {description && (
                    <p className="signup-option-card__description">{description}</p>
                )}
            </header>

            {features.length > 0 && (
                featuresAside ? (
                    <div className="signup-option-card__features-row">
                        <ul className="signup-option-card__features">
                            {features.map(({ icon, label }) => (
                                <li key={label} className="signup-option-card__feature">
                                    <span className="signup-option-card__feature-icon" aria-hidden="true">
                                        {icon}
                                    </span>
                                    <span className="signup-option-card__feature-label">{label}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="signup-option-card__features-aside">{featuresAside}</div>
                    </div>
                ) : (
                    <ul className="signup-option-card__features">
                        {features.map(({ icon, label }) => (
                            <li key={label} className="signup-option-card__feature">
                                <span className="signup-option-card__feature-icon" aria-hidden="true">
                                    {icon}
                                </span>
                                <span className="signup-option-card__feature-label">{label}</span>
                            </li>
                        ))}
                    </ul>
                )
            )}

            {children && <div className="signup-option-card__extra">{children}</div>}

            {primaryCta && (
                <footer className="signup-option-card__footer">
                    {primaryCta}
                    {secondary && (
                        <div className="signup-option-card__secondary">{secondary}</div>
                    )}
                </footer>
            )}
        </article>
    );
};

export default SignupOptionCard;
