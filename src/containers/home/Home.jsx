import React from 'react'
import { Link } from 'react-router-dom';
import './home.css';
import { Carousel } from './Carousel';
import { Testimonials } from '../testimonials/Testimonials';
import { SkillCounter } from '../skillCounter/SkillCounter';

import Whyanupaat from '../whyanupaat/Whyanupaat';
import About from '../about/About';
import Offerings from '../offerings/Offerings';
import Contact from '../../components/contact/Contact';
import { OurApp } from '../../components';







const Home = () => {



    const img1 = require('../../assets/ImpanelmentsImages/empanelment1.png')
    const img2 = require('../../assets/ImpanelmentsImages/empanelment2.png')
    const img3 = require('../../assets/ImpanelmentsImages/empanelment3.png')
    const img4 = require('../../assets/ImpanelmentsImages/empanelment4.png')
    const img5 = require('../../assets/ImpanelmentsImages/empanelment5.png')
    const img6 = require('../../assets/ImpanelmentsImages/empanelment6.png')
    const img7 = require('../../assets/ImpanelmentsImages/empanelment7.png')
    const img8 = require('../../assets/ImpanelmentsImages/empanelment8.png')
    const img9 = require('../../assets/ImpanelmentsImages/empanelment9.png')
    const img10 = require('../../assets/ImpanelmentsImages/empanelment10.png')
    const img11 = require('../../assets/ImpanelmentsImages/empanelment11.png')
    const img12 = require('../../assets/ImpanelmentsImages/empanelment12.png')

    return (
        <>

            <div className='anupaat_home' id="home">

                <section className="home-hero home-section">
                    <div className="hero-content">
                        <p className="eyebrow">AMFI Registered Mutual Fund Distributor</p>
                        <h1>Plan. Invest. Grow.<br />With a trusted partner.</h1>
                        <p className="hero-subtitle">
                            Human advice backed by data, disciplined SIPs, and proactive reviews to keep every goal on track.
                        </p>
                        <div className="hero-actions">
                            <Link to="/contact" className="btn btn-primary">Book a call</Link>
                            <Link to="/offerings" className="btn btn-ghost">View offerings</Link>
                        </div>
                        <div className="hero-pills">
                            <span>Goal-based plans</span>
                            <span>Tax-efficient strategies</span>
                            <span>100% paperless onboarding</span>
                        </div>
                    </div>
                    <div className="hero-panel" data-aos="fade-up">
                        <div className="hero-panel__badge">Trusted by growing families & professionals</div>
                        <div className="hero-panel__stat">
                            <div>
                                <p className="stat-label">AUM managed</p>
                                <p className="stat-value">₹25 Cr+</p>
                                <p className="stat-hint">Target ₹100 Cr by 2026</p>
                            </div>
                            <div>
                                <p className="stat-label">Monthly SIPs</p>
                                <p className="stat-value">₹40 Lac+</p>
                                <p className="stat-hint">Disciplined, goal-aligned</p>
                            </div>
                        </div>
                        <div className="hero-panel__stat">
                            <div>
                                <p className="stat-label">Happy clients</p>
                                <p className="stat-value">500+</p>
                                <p className="stat-hint">Across India & abroad</p>
                            </div>
                            <div>
                                <p className="stat-label">Experience</p>
                                <p className="stat-value">8 Years+</p>
                                <p className="stat-hint">Advisory & reviews</p>
                            </div>
                        </div>
                        <div className="hero-panel__note">
                            We pair expert advisors with digital tracking so you always know where your money stands.
                        </div>
                    </div>
                </section>

                <div className="home-section hero-carousel">
                    <Carousel />
                </div>

                <section className='home-section offerings-section'>   <Offerings /></section>
                
                {/* Consulting Session Section */}
                <section className='home-section consulting-session-promo'>
                    <div className="consulting-promo-container">
                        <div className="consulting-promo-content">
                            <div className="consulting-promo-badge">Limited Time Offer</div>
                            <h2 className="consulting-promo-title">
                                ₹99 Financial Planning Session
                            </h2>
                            <p className="consulting-promo-description">
                                Get expert financial guidance at an introductory price. This comprehensive session includes financial planning, income-expense clarity, investment planning, and goal clarification.
                            </p>
                            <div className="consulting-promo-price">
                                <span className="price-old">₹9,999</span>
                                <span className="price-new">₹99</span>
                                <span className="price-discount">Save 99%</span>
                            </div>
                            <Link to="/consulting-session" className="btn btn-primary consulting-promo-cta">
                                Book Session for ₹99
                            </Link>
                        </div>
                    </div>
                </section>

                <section className='home-section about-section'> <About /></section>

                <section className='home-section why-section'><Whyanupaat /></section>
                <SkillCounter />
                <section className='home-section testimonials-section'><Testimonials /></section>


                <section className='home-section contact-section'><Contact /></section>
                <section className='home-section our-app-section'><OurApp /></section>

                <section className="empanelment section__padding section__margin home-section">
                    <div >
                        <h1>Our <span className='section-heading-focus'>Empanelments</span></h1>
                        <p className="lead"> </p></div>
                    <div className="empanelment_container">
                        <div data-aos="fade-up">

                            <img src={img1} alt='empanels' />
                            <img src={img2} alt='empanels' />
                            <img src={img3} alt='empanels' />
                            <img src={img4} alt='empanels' />
                            <img src={img5} alt='empanels' />
                            <img src={img6} alt='empanels' />
                            <img src={img7} alt='empanels' />
                            <img src={img8} alt='empanels' />
                            <img src={img9} alt='empanels' />
                            <img src={img10} alt='empanels' />
                            <img src={img11} alt='empanels' />
                            <img src={img12} alt='empanels' />




                        </div>
                    </div>
                </section>




            </div>



        </>
    )
}

export default Home