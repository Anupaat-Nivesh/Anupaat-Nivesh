import React from 'react'
import { ListGroupItem } from 'react-bootstrap';
import tech from "../../assets/tech.png";
import team from "../../assets/team.png";
import transparency from "../../assets/transparency.png";
import './about.css';
const About = () => {
    return (
        <div id='about' className='section__padding'>
            <div className='aboutus-title'>
                <h1 className='primary-heading aboutus-heading'> About Us</h1>
            </div>

            <div className='aboutus-description-section '>
                <p className='section-description aboutus-description'> Started in 2018, Anupaat Nivesh is providing one2one consulting to start with your investment journey. Anupaat Nivesh aim to reach out to the common man and extend the opportunity to create wealth by providing them valuable and ethical financial advice. Equity investing has always been an grey area for most of people. However, historically there has been no better way to grow your money exponentially. We at Anupaat Nivesh help our customers with true and quality advise about investment options which can be huge wealth creator to middle class.</p>

                <div className='aboutus-description-points'>
                    <h3 className='secondary-heading'>How we help our customers:</h3>
                    <ul className='section-description aboutus-points'>
                        <li>By Assessing individual's requirements and goals</li>
                        <li>By Creating awareness about financial freedom</li>
                        <li> By Providing coaching to avoid financial issues related to Investment needs and TAX benefits</li>
                        <li>By Providing platform for Investment in Equity MFs and our curated equity baskets</li>
                        <li>By Managing their investments for higher returns</li>
                    </ul>
                </div>

                <div className='aboutus-description-section2'>
                    <div className='aboutus-description-block'>
                        <img src={tech} alt="tech-icon" className='description-block-img' />
                        <h4 className='block-heading'>Cutting-Edge Tech</h4>
                        <p className='block-description'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum sit in nihil quae temporibus quos! Accusamus animi facilis rem similique quas iste dignissimos, odio voluptates blanditiis quo aliquid veritatis quisquam.</p>
                    </div>
                    <div className='aboutus-description-block'>
                        <img src={team} alt="team-icon" className='description-block-img' />
                        <h4 className='block-heading'>Outstanding Team</h4>
                        <p className='block-description'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum sit in nihil quae temporibus quos! Accusamus animi facilis rem similique quas iste dignissimos, odio voluptates blanditiis quo aliquid veritatis quisquam.</p>
                    </div>
                    <div className='aboutus-description-block'>
                        <img src={transparency} alt="transparency-icon" className='description-block-img' />
                        <h4 className='block-heading'>Real Transparency</h4>
                        <p className='block-description'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum sit in nihil quae temporibus quos! Accusamus animi facilis rem similique quas iste dignissimos, odio voluptates blanditiis quo aliquid veritatis quisquam.</p>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default About