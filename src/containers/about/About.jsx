import React from 'react'
import tech from "../../assets/tech.svg";
import team from "../../assets/team.svg";
import transparency from "../../assets/transparency.svg";
import aboutUsIllustration from "../../assets/illustrations/customer-support.webp";
import preAboutUsIllustration from "../../assets/illustrations/pre-customer-support.webp";
import './about.css';
import OurTeam from './OurTeam';
import { BsFillCheckCircleFill } from "react-icons/bs";



const About = () => {
    return (
        <div id='about' className='aboutUs-container section__padding'>
            <div className='aboutus-title' data-aos="fade-up" data-aos-anchor-placement="top-bottom">
                <h1><span className='section-heading-focus'>About</span> Us</h1>
            </div>

            <div className='aboutus-description-section'>
                <div className='aboutus-decription-content1'>
                    <p className='aboutus-description1'> Founded in 2018, Anupaat Nivesh is a trusted financial advisory firm dedicated to helping individuals build wealth through strategic investments. We believe that everyone deserves access to quality financial advice, regardless of their background. While equity investing may seem complex, we make it accessible by providing personalized guidance tailored to your unique financial situation.
                    </p><br></br>
                    <p>At Anupaat Nivesh, we empower our clients with transparent, ethical, and data-driven investment recommendations that have the potential to create significant wealth over time.</p>
                </div>

                <div className='aboutus-decription-content2'>
                    <div className='aboutus-description2'>Smart investing requires expertise. With proper guidance and strategic management, equity markets offer unparalleled growth potential.</div>

                </div>

                <div className='aboutus-description-points'>
                    <picture>
                        <source srcSet={aboutUsIllustration} type='image/webp' />
                        <source srcSet={preAboutUsIllustration} type='image/webp' />
                        <img src={aboutUsIllustration} className="aboutus-illustration" alt='illustration' data-aos="fade-right"
                            data-aos-offset="300"
                            data-aos-easing="ease-in-sine" data-aos-duration="500" />
                    </picture>

                    <div data-aos="fade-left" data-aos-duration="500">
                        <h2 className='secondary-heading secondary-about-heading' >How We Help You Succeed:</h2><br></br>
                        <div className=' aboutus-points'>
                            <div className='aboutus-wrapper'>
                                <div className="check-pointer"> <BsFillCheckCircleFill className='check-icon' /></div>
                                <div className="points-text">Personalized assessment of your financial goals and risk profile</div>
                            </div>
                            <div className='aboutus-wrapper'>
                                <div className="check-pointer"> <BsFillCheckCircleFill className='check-icon' /></div>
                                <div className="points-text">Education and guidance on building long-term wealth</div>
                            </div>
                            <div className='aboutus-wrapper'>
                                <div className="check-pointer"><BsFillCheckCircleFill className='check-icon' /></div>
                                <div className="points-text">Strategic tax planning and investment optimization</div>
                            </div>
                            <div className='aboutus-wrapper'>
                                <div className="check-pointer"><BsFillCheckCircleFill className='check-icon' /></div>
                                <div className="points-text">Access to curated mutual funds and equity baskets</div>
                            </div>
                            <div className='aboutus-wrapper'>
                                <div className="check-pointer"><BsFillCheckCircleFill className='check-icon' /></div>
                                <div className="points-text">Ongoing portfolio management for optimal returns</div>
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
                <div className='aboutus-description-block' data-aos="zoom-in" data-aos-duration="500">
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