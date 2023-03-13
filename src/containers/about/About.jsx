import React from 'react'
import { ListGroupItem } from 'react-bootstrap';
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
            </div>

        </div>
    )
}

export default About