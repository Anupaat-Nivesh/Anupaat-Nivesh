import React from 'react'
import { ListGroupItem } from 'react-bootstrap';
import tech from "../../assets/tech.svg";
import team from "../../assets/team.svg";
import transparency from "../../assets/transparency.svg";
import './about.css';
import OurTeam from './OurTeam';
const About = () => {
    return (
        <div id='about' className='section__padding section__margin'>
            <div className='aboutus-title'>
                <h1 className='primary-heading aboutus-heading'> About Us</h1>
            </div>

            <div className='aboutus-description-section '>
                <p className='section-description aboutus-description'> Started in 2018, Anupaat Nivesh is providing one2one consulting to start with your investment journey. Anupaat Nivesh aim to reach out to the common man and extend the opportunity to create wealth by providing them valuable and ethical financial advice. Equity investing has always been an grey area for most of people. However, historically there has been no better way to grow your money exponentially. 
                </p>
                <br></br>
                <p className='section-description aboutus-description'>Investing in the stock market is risky. But if managed and predicted correctly, it will have a high growth rate.</p>
                <p className='section-description aboutus-description'>We at Anupaat Nivesh help our customers with true and quality advise about investment options which can be huge wealth creator to middle class.</p>
                
                <div className='aboutus-description-points'>
                    <h2 className='secondary-heading secondary-about-heading'>How we help our customers:</h2><br></br>
                    <ul className='section-description aboutus-points'>
                        <li>By Assessing individual's requirements and goals</li>
                        <li>By Creating awareness about financial freedom</li>
                        <li>By Providing coaching to avoid financial issues related to Investment needs and TAX benefits</li>
                        <li>By Providing platform for Investment in Equity MFs and our curated equity baskets</li>
                        <li>By Managing their investments for higher returns</li>
                    </ul>
                </div>

                <div className='aboutus-description-section2'>
                    <div className='aboutus-description-block'>
                        <img src={tech} alt="tech-icon" className='description-block-img' />
                        <h3 className='block-heading'>Cutting-Edge Tech</h3>
                        <p className='block-description'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum sit in nihil quae temporibus quos! Accusamus animi facilis rem similique quas iste dignissimos, odio voluptates blanditiis quo aliquid veritatis quisquam.</p>
                    </div>
                    <div className='aboutus-description-block'>
                        <img src={team} alt="team-icon" className='description-block-img' />
                        <h3 className='block-heading'>Outstanding Team</h3>
                        <p className='block-description'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum sit in nihil quae temporibus quos! Accusamus animi facilis rem similique quas iste dignissimos, odio voluptates blanditiis quo aliquid veritatis quisquam.</p>
                    </div>
                    <div className='aboutus-description-block'>
                        <img src={transparency} alt="transparency-icon" className='description-block-img' />
                        <h3 className='block-heading'>Real Transparency</h3>
                        <p className='block-description'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum sit in nihil quae temporibus quos! Accusamus animi facilis rem similique quas iste dignissimos, odio voluptates blanditiis quo aliquid veritatis quisquam.</p>
                    </div>

                </div>

                <div className='aboutus-description-section3'>
                    <OurTeam />
                </div>
            </div>

        </div>
    )
}

export default About