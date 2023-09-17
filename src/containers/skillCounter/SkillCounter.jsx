import React from 'react'
import './skillCounter.css'
import CountUp from 'react-countup';
import icon1 from '../../assets/SkillCounter icons/icon1.jpg';
import icon2 from '../../assets/SkillCounter icons/icon2.jpg';
import icon3 from '../../assets/SkillCounter icons/icon3.jpg';
import icon4 from '../../assets/SkillCounter icons/icon4.jpg';
import icon5 from '../../assets/SkillCounter icons/icon5.jpg';


export const SkillCounter = () => {

    return (
        <section className='skills-data home-section'>
            <div className='skill-container'>
                {/* <div className='skill-items'>
                    <img src={icon2} className="skill-counter-icon" alt='icon' />
                    <h2 className='counter-numbers'><CountUp start={0} end={26} duration={2} delay={0} suffix="+" /></h2>

                    <p>INVESTED PLANS</p>
                </div> */}
                <div className='skill-items'>
                    <img src={icon3} className="skill-counter-icon" alt='icon' />
                    <h2 className='counter-numbers'><CountUp start={0} end={12} duration={2} delay={0} suffix="+" /> </h2>
                    <h3>TEAM</h3>
                </div>
                <div className='skill-items'>
                    <img src={icon5} className="skill-counter-icon" alt='icon' />
                    <h2 className='counter-numbers'><CountUp start={0} end={250} duration={2} delay={0} suffix="+" /> </h2>
                    <h3>HAPPY CLIENTS</h3>
                </div>
                <div className='skill-items'>
                    <img src={icon4} className="skill-counter-icon" alt='icon'/>
                    <h2 className='counter-numbers'><CountUp start={0} end={1800000} duration={2} delay={0} suffix="+" /></h2>
                    <h3>Monthly SIP</h3>
                </div>
                <div className='skill-items'>
                    <img src={icon1} className="skill-counter-icon" alt='icon' />
                    <h2 className='counter-numbers'><CountUp start={0} end={8} duration={2} delay={0} suffix=" Cr+" />  </h2>
                    <h3>AUM</h3>
                    <p>100 Cr. by 2025</p>
                </div>
            </div>

        </section>
    )
}

export default SkillCounter