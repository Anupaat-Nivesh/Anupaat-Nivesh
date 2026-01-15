import React from 'react';
import './HowWeWork.css';

/**
 * HowWeWork Component
 * 
 * Displays a 4-step visual process for financial advisory services.
 * Educational and conversion-friendly without being salesy.
 * 
 * Steps:
 * 1. Discover - Understanding client goals
 * 2. Allocate - Strategic asset allocation
 * 3. Review - Regular portfolio reviews
 * 4. Grow - Long-term wealth building
 */
const HowWeWork = () => {
  const steps = [
    {
      number: '01',
      title: 'Discover',
      description: 'We understand your financial goals, risk appetite, and timeline through detailed conversations and risk profiling.',
      icon: '🔍'
    },
    {
      number: '02',
      title: 'Allocate',
      description: 'Based on your profile, we create a personalized investment plan with strategic asset allocation across mutual funds.',
      icon: '📊'
    },
    {
      number: '03',
      title: 'Review',
      description: 'Regular portfolio reviews ensure your investments stay aligned with your goals and market conditions.',
      icon: '🔄'
    },
    {
      number: '04',
      title: 'Grow',
      description: 'With disciplined SIPs and periodic rebalancing, we help you build long-term wealth systematically.',
      icon: '📈'
    }
  ];

  return (
    <section className="how-we-work section__padding section__margin">
      <div className="how-we-work__header">
        <h2>How We <span className="section-heading-focus">Work</span></h2>
        <p className="section-description">
          A transparent, step-by-step approach to help you achieve your financial goals
        </p>
      </div>
      
      <div className="how-we-work__steps">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className="how-we-work__step"
            data-aos="fade-up"
            data-aos-delay={index * 100}
          >
            <div className="how-we-work__step-number">{step.number}</div>
            <div className="how-we-work__step-icon">{step.icon}</div>
            <h3 className="how-we-work__step-title">{step.title}</h3>
            <p className="how-we-work__step-description">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowWeWork;

