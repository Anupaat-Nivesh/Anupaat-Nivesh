import React from 'react'
import './skillCounter.css'
import CountUp from 'react-countup';


export const SkillCounter = () => {

    return (
        <section className='skills-data'>
            <div className='skill-container'>
                <div className='skill-items'>

                    <h2 className='counter-numbers'><CountUp start={0} end={26} duration={2} delay={0} suffix="+" /></h2>

                    <p>INVESTED PLANS</p>
                </div>
                <div className='skill-items'>

                    <h2 className='counter-numbers'><CountUp start={0} end={12} duration={2} delay={0} suffix="+" /> </h2>
                    <p>TEAM</p>
                </div>
                <div className='skill-items'>
                    <h2 className='counter-numbers'><CountUp start={0} end={150} duration={2} delay={0} suffix="+" /> </h2>
                    <p>HAPPY CLIENTS</p>
                </div>
                <div className='skill-items'>
                    <h2 className='counter-numbers'><CountUp start={0} end={1145000} duration={2} delay={0} suffix="+" /></h2>
                    <p>Monthly SIP</p>
                </div>
                <div className='skill-items'>
                    <h2 className='counter-numbers'><CountUp start={0} end={285} duration={2} delay={0} suffix=" Lac+" />  </h2>
                    <p>AUM</p>
                </div>
            </div>

        </section>
    )
}

export default SkillCounter