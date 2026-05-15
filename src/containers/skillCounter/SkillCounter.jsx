import React from 'react';
import CountUp from 'react-countup';
import {
  HiOutlineClock,
  HiOutlineUserGroup,
  HiOutlineCash,
  HiOutlineChartPie,
} from 'react-icons/hi';
import './skillCounter.css';

/**
 * Stats strip — icons match TrustHighlights / HowWeWork: Hi outline + primary chip.
 */
const STATS = [
  {
    icon: <HiOutlineClock size={28} aria-hidden="true" />,
    count: <CountUp start={0} end={10} duration={1} delay={0} suffix=" Years+" />,
    title: 'Track Record',
    subtitle: null,
    label: 'Years of advisory experience',
  },
  {
    icon: <HiOutlineUserGroup size={28} aria-hidden="true" />,
    count: <CountUp start={0} end={500} duration={1} delay={0} suffix="+" />,
    title: 'Happy Clients',
    subtitle: null,
    label: 'Families and professionals served',
  },
  {
    icon: <HiOutlineCash size={28} aria-hidden="true" />,
    count: <CountUp start={0} end={50} duration={1} delay={0} suffix=" Lac+" />,
    title: 'Monthly SIP',
    subtitle: null,
    label: 'Disciplined monthly flows',
  },
  {
    icon: <HiOutlineChartPie size={28} aria-hidden="true" />,
    count: <CountUp start={0} end={30} duration={1} delay={0} suffix=" Cr+" />,
    title: 'AUM',
    subtitle: 'Goal ₹100 Cr by 2027',
    label: 'Assets under guidance',
  },
];

export const SkillCounter = () => {
  return (
    <section className="skills-data home-section" aria-label="Firm statistics">
      <div className="skill-container">
        {STATS.map(({ icon, count, title, subtitle, label }) => (
          <div key={title} className="skill-items">
            <span className="skill-counter__icon" aria-hidden="true">
              {icon}
            </span>
            <h2 className="counter-numbers">{count}</h2>
            <h3>{title}</h3>
            {subtitle ? <p>{subtitle}</p> : null}
            <span className="skill-counter__sr-only">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SkillCounter;
