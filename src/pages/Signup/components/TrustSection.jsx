import React from 'react';
import {
    HiOutlineBadgeCheck,
    HiOutlineSparkles,
    HiOutlineLockClosed,
    HiOutlineSupport,
} from 'react-icons/hi';

const TRUST_ITEMS = [
    {
        icon: <HiOutlineBadgeCheck size={20} aria-hidden="true" />,
        label: 'AMFI Registered',
    },
    {
        icon: <HiOutlineSparkles size={20} aria-hidden="true" />,
        label: 'BSE Star MF Platform',
    },
    {
        icon: <HiOutlineLockClosed size={20} aria-hidden="true" />,
        label: 'Secure Document Upload',
    },
    {
        icon: <HiOutlineSupport size={20} aria-hidden="true" />,
        label: 'Expert Support',
    },
];

/**
 * Compact trust ribbon — replaces the previous 4-card grid.
 * Just essential indicators rendered as chips so the section feels
 * supportive rather than dominant.
 */
const TrustSection = () => {
    return (
        <section className="signup-trust" aria-label="Trust indicators">
            <ul className="signup-trust__ribbon" data-aos="fade-up">
                {TRUST_ITEMS.map(({ icon, label }) => (
                    <li key={label} className="signup-trust__chip">
                        <span className="signup-trust__chip-icon" aria-hidden="true">
                            {icon}
                        </span>
                        <span className="signup-trust__chip-label">{label}</span>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default TrustSection;
