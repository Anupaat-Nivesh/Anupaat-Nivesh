import React from 'react'
import tech from "../../assets/tech.svg";
import team from "../../assets/team.svg";
import transparency from "../../assets/transparency.svg";
import aboutUsIllustration from "../../assets/illustrations/customer-support.png";
import './about.css';
import OurTeam from './OurTeam';
import { BsFillCheckCircleFill } from "react-icons/bs";



const About = () => {
    return (
        <div id='about' className='aboutUs-container section__padding'>
            <div className='aboutus-title' data-aos="fade-up" data-aos-anchor-placement="top-bottom">
                <h1><span className='section-heading-focus'>About</span> Us</h1>
            </div>

            <div className='aboutus-description-section '>
                <div className='aboutus-decription-content1'>
                <p className='aboutus-description1'> Started in 2018, Anupaat Nivesh is providing one2one consulting to start with your investment journey. Anupaat Nivesh aim to reach out to the common man and extend the opportunity to create wealth by providing them valuable and ethical financial advice. Equity investing has always been an grey area for most of people. However, historically there has been no better way to grow your money exponentially.
                </p>
                </div>
                
                <div className='aboutus-decription-content2'>
                <div className='aboutus-description2'>Investing in the stock market is risky. But if managed and predicted correctly, it will have a high growth rate.</div>
                <p className='aboutus-description3'>We at Anupaat Nivesh help our customers with true and quality advise about investment options which can be huge wealth creator to middle class.</p>
                </div>

                <div className='aboutus-description-points'>

                    <img src={aboutUsIllustration} className="aboutus-illustration" alt='illustration' data-aos="fade-right"
                        data-aos-offset="300"
                        data-aos-easing="ease-in-sine" data-aos-duration="500" />

                    <div data-aos="fade-left" data-aos-duration="500">
                        <h2 className='secondary-heading secondary-about-heading' >How we help our customers:</h2><br></br>
                        <div className=' aboutus-points'>
                            <div className='aboutus-wrapper'>
                                <div className="check-pointer"> <BsFillCheckCircleFill className='check-icon' /></div>
                                <div className="points-text">By Assessing individual's requirements and goals</div>
                            </div>
                            <div className='aboutus-wrapper'>
                                <div className="check-pointer"> <BsFillCheckCircleFill className='check-icon' /></div>
                                <div className="points-text">  By Creating awareness about financial freedom</div>
                            </div>
                            <div className='aboutus-wrapper'>
                                <div className="check-pointer"><BsFillCheckCircleFill className='check-icon' /></div>
                                <div className="points-text"> By Providing coaching to avoid financial issues related to Investment needs and TAX benefits</div>
                            </div>
                            <div className='aboutus-wrapper'>
                                <div className="check-pointer"><BsFillCheckCircleFill className='check-icon' /></div>
                                <div className="points-text"> By Providing platform for Investment in Equity MFs and our curated equity baskets</div>
                            </div>
                            <div className='aboutus-wrapper'>
                                <div className="check-pointer"><BsFillCheckCircleFill className='check-icon' /></div>
                                <div className="points-text">  By Managing their investments for higher returns</div>
                            </div>


                        </div>
                    </div>
                </div>
                </div>

                <div className='aboutus-description-section2' >
                    <div className='aboutus-description-block' data-aos="zoom-in">
                        <img src={tech} alt="tech-icon" className='description-block-img' />
                        <h3 className='block-heading'>Cutting-Edge Tech</h3>
                        <p className='block-description'>
                            We use our technical expertise to deliver the core of financial investment
                            with use of digital technology.
                            Technology helps us to deliver the best for our customers and to keep us ahead of time.
                        </p>
                    </div>
                    <div className='aboutus-description-block' data-aos="zoom-in">
                        <img src={team} alt="team-icon" className='description-block-img' />
                        <h3 className='block-heading'>Outstanding Team</h3>
                        <p className='block-description'>
                            We are team of Young, Energetic and skillfull executives
                            doing continous research on market trends to generate alpha returns for our customers by leveraging our
                            techno-functional expertise.

                        </p>
                    </div>
                    <div className='aboutus-description-block' data-aos="zoom-in" data-aos-duration="3000">
                        <img src={transparency} alt="transparency-icon" className='description-block-img' />
                        <h3 className='block-heading'>Real Transparency</h3>
                        <p className='block-description'>
                            We are independent advisory company and provide unbiased, transparent and best customized recommendation
                            to our customers. Customer's interest is all that matters to us.
                        </p>
                    </div>

                
                </div>
                <div className='aboutus-description-section3'>
                    <OurTeam />
                </div>
            

        </div>
    )
}

export default About