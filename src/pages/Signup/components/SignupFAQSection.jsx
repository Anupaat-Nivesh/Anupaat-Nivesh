import React from 'react';
import Faq from '../../../containers/faqs/Faq';

const SIGNUP_FAQS = [
    {
        id: 1,
        question: 'Which option should I choose?',
        answer:
            'Choose Self Onboarding if you prefer doing it yourself on the app. Choose Assisted Onboarding if you want our team to walk you through the documents.',
    },
    {
        id: 2,
        question: 'Is my data and KYC information safe?',
        answer:
            'Yes. All uploads are encrypted in transit and processed in line with SEBI and AMFI guidelines. We never share your data with third parties for marketing.',
    },
    {
        id: 3,
        question: 'Do I need to pay anything to sign up?',
        answer:
            'No. Sign up is completely free. As an AMFI registered MFD we earn a regulated trail commission from the AMC — there are no hidden onboarding charges.',
    },
    {
        id: 4,
        question: 'Can I switch between options later?',
        answer:
            'Yes. Once your KYC is complete you can install the app any time and your existing portfolio and SIPs will already be linked to your account.',
    },
];

/**
 * Compact FAQ — reuses the existing Faq accordion component but renders it
 * inside a `signup-faqs--compact` wrapper that locally tightens typography
 * and spacing without touching the global FAQ styles.
 */
const SignupFAQSection = () => {
    return (
        <section
            className="signup-faqs signup-faqs--compact home-section"
            aria-labelledby="signup-faqs-title"
        >
            <div className="signup-faqs__header" data-aos="fade-up">
                <h2 id="signup-faqs-title">
                    Common <span className="section-heading-focus">questions</span>
                </h2>
            </div>

            <div className="signup-faqs__container" data-aos="fade-up">
                {SIGNUP_FAQS.map(({ id, question, answer }) => (
                    <Faq key={id} question={question} answer={answer} />
                ))}
            </div>
        </section>
    );
};

export default SignupFAQSection;
