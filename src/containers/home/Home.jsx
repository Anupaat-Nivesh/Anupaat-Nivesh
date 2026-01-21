import React, { useEffect, useState } from 'react'
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
import HowWeWork from '../../components/HowWeWork/HowWeWork';
import { updateSEO } from '../../utils/seo';







const Home = () => {
    const [heroScreen, setHeroScreen] = useState(0); // 0 = Talk to Advisor, 1 = Consulting Session

    // SEO updates for homepage
    useEffect(() => {
        updateSEO({
            title: 'Financial Planning & Mutual Fund Advisory | Anupaat Nivesh',
            description: 'Get expert financial planning guidance with goal-based mutual fund investments. AMFI registered advisor helping you build long-term wealth through disciplined SIPs and regular portfolio reviews.',
            keywords: 'mutual funds, financial planning, SIP, investment advisor, AMFI registered, financial advisory, goal-based investing, portfolio management',
            canonical: '/',
            ogType: 'website'
        });

        // Auto-rotate hero screens every 6 seconds
        const interval = setInterval(() => {
            setHeroScreen(prev => (prev === 0 ? 1 : 0));
        }, 6000);

        return () => clearInterval(interval);
    }, []);

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
                    <div className="hero-slider-container">
                        {/* Screen 1: Talk to Advisor (Free) */}
                        <div className={`hero-screen ${heroScreen === 0 ? 'active' : ''}`}>
                    <div className="hero-content">
                        <p className="eyebrow">AMFI Registered Mutual Fund Distributor</p>
                                <h1>Build Long-Term Wealth<br />Through Clarity & Discipline</h1>
                                <p className="hero-benefit">Expert guidance for goal-based investing with disciplined SIPs and regular portfolio reviews.</p>
                        <div className="hero-actions">
                                    <Link to="/contact" className="btn btn-primary hero-cta-btn">Talk to an Advisor</Link>
                        </div>
                        <div className="hero-pills">
                                    <span>✓ Free Consultation</span>
                                    <span>✓ Expert Guidance</span>
                                    <span>✓ Personalized Planning</span>
                        </div>
                    </div>
                    <div className="hero-panel" data-aos="fade-up">
                        <div className="hero-panel__badge">Trusted by growing families & professionals</div>
                        <div className="hero-panel__stat">
                                    <div className="stat-item">
                                <p className="stat-label">AUM managed</p>
                                <p className="stat-value">₹25 Cr+</p>
                                <p className="stat-hint">Target ₹100 Cr by 2026</p>
                            </div>
                                    <div className="stat-item">
                                <p className="stat-label">Monthly SIPs</p>
                                <p className="stat-value">₹40 Lac+</p>
                                <p className="stat-hint">Disciplined, goal-aligned</p>
                            </div>
                        </div>
                        <div className="hero-panel__stat">
                                    <div className="stat-item">
                                <p className="stat-label">Happy clients</p>
                                <p className="stat-value">500+</p>
                                <p className="stat-hint">Across India & abroad</p>
                            </div>
                                    <div className="stat-item">
                                <p className="stat-label">Experience</p>
                                <p className="stat-value">8 Years+</p>
                                <p className="stat-hint">Advisory & reviews</p>
                            </div>
                        </div>
                        <div className="hero-panel__note">
                            We pair expert advisors with digital tracking so you always know where your money stands.
                        </div>
                            </div>
                        </div>

                        {/* Screen 2: Consulting Session (Paid) */}
                        <div className={`hero-screen ${heroScreen === 1 ? 'active' : ''}`}>
                            <div className="hero-content">
                                <div className="consulting-badge">Limited Time Offer</div>
                                <h1>1-on-1 Financial Consulting<br />Session</h1>
                                <p className="hero-benefit">Get personalized financial planning, investment strategies, and goal achievement roadmap in one session.</p>
                                <div className="hero-consulting-price">
                                    <div className="price-group">
                                        <span className="price-old">₹9,999</span>
                                        <span className="price-new">₹99</span>
                                        <span className="price-discount">Save 99%</span>
                                    </div>
                                    <Link to="/consulting-session" className="btn btn-primary hero-cta-btn hero-price-btn">Book Session</Link>
                                </div>
                                <div className="hero-pills">
                                    <span>✓ AMFI Registered</span>
                                    <span>✓ BSE STAR MF</span>
                                    <span>✓ 8+ Years Experience</span>
                                </div>
                            </div>
                            <div className="hero-panel" data-aos="fade-up">
                                <div className="hero-panel__badge">What's Included</div>
                                <div className="hero-panel__stat">
                                    <div className="stat-item">
                                        <p className="stat-label">Session Duration</p>
                                        <p className="stat-value">30 Minutes</p>
                                        <p className="stat-hint">One-on-one consultation</p>
                                    </div>
                                    <div className="stat-item">
                                        <p className="stat-label">Format</p>
                                        <p className="stat-value">Online</p>
                                        <p className="stat-hint">Video call / Web conferencing</p>
                                    </div>
                                </div>
                                <div className="hero-panel__stat">
                                    <div className="stat-item">
                                        <p className="stat-label">Includes</p>
                                        <p className="stat-value">Financial Planning</p>
                                        <p className="stat-hint">Investment guidance & goal setting</p>
                                    </div>
                                    <div className="stat-item">
                                        <p className="stat-label">Value</p>
                                        <p className="stat-value">₹9,999</p>
                                        <p className="stat-hint">Now just ₹99 (99% off)</p>
                                    </div>
                                </div>
                                <div className="hero-panel__note">
                                    This session is educational and advisory in nature. No guaranteed returns or stock tips.
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hero Navigation Dots */}
                    <div className="hero-navigation">
                        <button 
                            className={`hero-dot ${heroScreen === 0 ? 'active' : ''}`}
                            onClick={() => setHeroScreen(0)}
                            aria-label="Talk to Advisor"
                        />
                        <button 
                            className={`hero-dot ${heroScreen === 1 ? 'active' : ''}`}
                            onClick={() => setHeroScreen(1)}
                            aria-label="Consulting Session"
                        />
                    </div>
                </section>

                <div className="home-section hero-carousel">
                    <Carousel />
                </div>

                <section className='home-section offerings-section'>   <Offerings /></section>

                <section className='home-section about-section'> <About /></section>

                <section className='home-section why-section'><Whyanupaat /></section>
                <section className='home-section how-we-work-section'><HowWeWork /></section>
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