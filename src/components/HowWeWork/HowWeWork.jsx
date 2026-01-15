import React from 'react';
import './HowWeWork.css';

/**
 * How We Work - 4 Step Process Component
 * Educational, conversion-focused section showing the advisory process
 */
const HowWeWork = () => {
  const steps = [
    {
      number: '01',
      title: 'Discover',
      description: 'We understand your financial goals, risk appetite, and current situation through a detailed consultation.',
      icon: '🔍'
    },
    {
      number: '02',
      title: 'Allocate',
      description: 'We create a personalized investment plan with the right mix of equity, debt, and hybrid funds aligned to your goals.',
      icon: '📊'
    },
    {
      number: '03',
      title: 'Review',
      description: 'Regular portfolio reviews and rebalancing ensure your investments stay on track with changing market conditions.',
      icon: '🔄'
    },
    {
      number: '04',
      title: 'Grow',
      description: 'With disciplined SIPs, goal-based investing, and expert guidance, watch your wealth grow steadily over time.',
      icon: '📈'
    }
  ];

  return (
    <section className="how-we-work section__padding section__margin">
      <div className="container">
        <div className="section-header" data-aos="fade-up">
          <h2 className="section-title">
            How We <span className="section-heading-focus">Work</span>
          </h2>
          <p className="section-description">
            A simple, transparent process designed to help you achieve your financial goals with confidence.
          </p>
        </div>

        <div className="steps-grid">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="step-card"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="step-number">{step.number}</div>
              <div className="step-icon">{step.icon}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="cta-section" data-aos="fade-up">
          <p className="cta-text">Ready to start your financial journey?</p>
          <a href="#contact" className="btn btn-primary">Get Started Today</a>
        </div>
      </div>
    </section>
  );
};

export default HowWeWork;

