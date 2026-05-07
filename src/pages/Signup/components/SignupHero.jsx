import React from 'react';
import { HiShieldCheck } from 'react-icons/hi';

const SignupHero = () => {
    return (
        <section className="signup-hero home-section" aria-labelledby="signup-hero-title">
            <div className="signup-hero__inner" data-aos="fade-up">
                <span className="signup-hero__eyebrow">
                    <HiShieldCheck aria-hidden="true" />
                    Sign Up  ·  AMFI Registered MFD
                </span>

                <h1 id="signup-hero-title" className="signup-hero__title">
                    Start Your <span className="section-heading-focus">Investment Journey</span>
                </h1>

                <p className="signup-hero__subtitle">
                    Choose your preferred onboarding method and begin investing with confidence.
                </p>
            </div>
        </section>
    );
};

export default SignupHero;
