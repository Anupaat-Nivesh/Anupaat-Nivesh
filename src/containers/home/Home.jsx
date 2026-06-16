import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import './home.css';
import { Carousel } from './Carousel';
import { Testimonials } from '../testimonials/Testimonials';
import { SkillCounter } from '../skillCounter/SkillCounter';

import Whyanupaat from '../whyanupaat/Whyanupaat';
import Offerings from '../offerings/Offerings';
import Contact from '../../components/contact/Contact';
import { OurApp, TrustHighlights, MediaPresence } from '../../components';
import HowWeWork from '../../components/HowWeWork/HowWeWork';
import BasketHomePromo from '../../basket/components/basket-analytics/BasketHomePromo';
import HeroBasketSlide from './HeroBasketSlide';
import HomeLeadCapture from '../../components/LeadForm/HomeLeadCapture';
import { updateSEO } from '../../utils/seo';
import { paymentConfig, formatAmountForDisplay, getDiscountPercentage } from '../../utils/paymentConfig';







const Home = () => {
    const [heroScreen, setHeroScreen] = useState(0); // 0 Baskets, 1 Advisor, 2 Consulting, 3 MarketCompass
    const [heroMouseInside, setHeroMouseInside] = useState(false);

    // SEO updates for homepage
    useEffect(() => {
        updateSEO({
            title: 'Financial Planning & Mutual Fund Advisory | Anupaat Nivesh',
            description: 'Get expert financial planning guidance with goal-based mutual fund investments. AMFI registered advisor helping you build long-term wealth through disciplined SIPs and regular portfolio reviews.',
            keywords: 'mutual funds, financial planning, SIP, investment advisor, AMFI registered, financial advisory, goal-based investing, portfolio management',
            canonical: '/',
            ogType: 'website'
        });
    }, []);

    // Auto-rotate hero screens every 6 seconds; pause while pointer is over the hero (read time)
    useEffect(() => {
        if (heroMouseInside) return undefined;
        const interval = setInterval(() => {
            setHeroScreen(prev => (prev + 1) % 4);
        }, 6000);
        return () => clearInterval(interval);
    }, [heroMouseInside]);

    const consultingHasDiscount =
        paymentConfig.consultingSessionActualPrice > paymentConfig.consultingSessionPrice;

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

                <section
                    className="home-hero home-section"
                    onMouseEnter={() => setHeroMouseInside(true)}
                    onMouseLeave={() => setHeroMouseInside(false)}
                >
                    <div className="hero-slider-container">
                        {/* Screen 1: Mutual Fund Baskets (primary CTA) */}
                        <div className={`hero-screen ${heroScreen === 0 ? 'active' : ''}`}>
                            <HeroBasketSlide />
                        </div>

                        {/* Screen 2: Talk to Advisor (Free) */}
                        <div className={`hero-screen ${heroScreen === 1 ? 'active' : ''}`}>
                            <div className="hero-content">
                                <p className="hero-eyebrow">AMFI Registered Mutual Fund Distributor</p>
                                <h1>Build Long-Term Wealth<br />Through Clarity & Discipline</h1>
                                <p className="hero-benefit">Expert guidance for goal-based investing with disciplined SIPs and regular portfolio reviews.</p>
                                <div className="hero-pills">
                                    <span>✓ Free Consultation</span>
                                    <span>✓ Expert Guidance</span>
                                    <span>✓ Personalized Planning</span>
                                </div>
                                <div className="hero-content__spacer" aria-hidden="true" />
                                <div className="hero-content__foot">
                                    <div className="hero-actions">
                                        <Link to="/contact" className="btn btn-primary hero-cta-btn">Talk to an Advisor</Link>
                                    </div>
                                </div>
                            </div>
                            <div className="hero-panel" data-aos="fade-up">
                                <div className="hero-panel__badge">Trusted by growing families & professionals</div>
                                <div className="hero-panel__body">
                                    <div className="hero-panel__stat">
                                        <div className="stat-item">
                                            <p className="stat-label">AUM managed</p>
                                            <p className="stat-value">₹30 Cr+</p>
                                            <p className="stat-hint">Goal ₹100 Cr by 2027</p>
                                        </div>
                                        <div className="stat-item">
                                            <p className="stat-label">Monthly SIPs</p>
                                            <p className="stat-value">₹50 Lac+</p>
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
                                            <p className="stat-value">10 Years+</p>
                                            <p className="stat-hint">Advisory & reviews</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="hero-panel__note">
                                    We pair expert advisors with digital tracking so you always know where your money stands.
                                </div>
                            </div>
                        </div>

                        {/* Screen 3: Consulting Session (Paid) */}
                        <div className={`hero-screen ${heroScreen === 2 ? 'active' : ''}`}>
                            <div className="hero-content">
                                <p className="hero-eyebrow">{consultingHasDiscount ? 'Limited Time Offer' : 'Session fee'}</p>
                                <h1>1-on-1 Financial Consulting<br />Session</h1>
                                <p className="hero-benefit">Get personalized financial planning, investment strategies, and goal achievement roadmap in one session.</p>
                                <div className="hero-pills">
                                    <span>✓ AMFI Registered</span>
                                    <span>✓ BSE STAR MF</span>
                                    <span>✓ 10+ Years Experience</span>
                                </div>
                                <div className="hero-content__spacer" aria-hidden="true" />
                                <div className="hero-content__foot">
                                    <div className="hero-actions hero-actions--pricing">
                                        <div className="hero-pricing">
                                            {consultingHasDiscount ? (
                                                <>
                                                    <span className="price-old">{formatAmountForDisplay(paymentConfig.consultingSessionActualPrice)}</span>
                                                    <span className="price-new">{formatAmountForDisplay(paymentConfig.consultingSessionPrice)}</span>
                                                    <span className="price-discount">Save {getDiscountPercentage()}%</span>
                                                </>
                                            ) : (
                                                <span className="price-new">{formatAmountForDisplay(paymentConfig.consultingSessionPrice)}</span>
                                            )}
                                        </div>
                                        <Link to="/consulting-session" className="btn btn-primary hero-cta-btn">Book Session</Link>
                                    </div>
                                </div>
                            </div>
                            <div className="hero-panel" data-aos="fade-up">
                                <div className="hero-panel__badge">What&apos;s Included</div>
                                <div className="hero-panel__body">
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
                                            <p className="stat-value">{formatAmountForDisplay(paymentConfig.consultingSessionPrice)}</p>
                                            <p className="stat-hint">
                                                {consultingHasDiscount
                                                    ? `Now ${formatAmountForDisplay(paymentConfig.consultingSessionPrice)} (${getDiscountPercentage()}% off)`
                                                    : 'Flat session fee · 30 minutes'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="hero-panel__note">
                                    This session is educational and advisory in nature. No guaranteed returns or stock tips.
                                </div>
                            </div>
                        </div>

                        {/* Screen 4: MarketCompass (coming soon) */}
                        <div className={`hero-screen ${heroScreen === 3 ? 'active' : ''}`}>
                            <div className="hero-content">
                                <p className="hero-eyebrow">Coming soon</p>
                                <h1>MarketCompass<br />Market-ready guidance</h1>
                                <p className="hero-benefit">
                                    Simple hints on when to add money (lump sum vs step-by-step) and where equities fit
                                    the backdrop — built on 20+ years of Indian market data, not rumours or fixed PE
                                    rules.
                                </p>
                                <div className="hero-pills">
                                    <span>✓ 20+ years tested</span>
                                    <span>✓ All market phases</span>
                                    <span>✓ Not stock tips</span>
                                </div>
                                <div className="hero-content__spacer" aria-hidden="true" />
                                <div className="hero-content__foot">
                                    <div className="hero-actions">
                                        <Link to="/valuation" className="btn btn-primary hero-cta-btn">View MarketCompass</Link>
                                        <Link to="/contact" className="btn hero-cta-btn hero-cta-btn--outline-dark">Notify me at launch</Link>
                                    </div>
                                </div>
                            </div>
                            <div className="hero-panel" data-aos="fade-up">
                                <div className="hero-panel__badge">What you will get</div>
                                <div className="hero-panel__body">
                                    <div className="hero-panel__stat">
                                        <div className="stat-item">
                                            <p className="stat-label">Focus</p>
                                            <p className="stat-value">Timing</p>
                                            <p className="stat-hint">Lump sum vs STP style pacing</p>
                                        </div>
                                        <div className="stat-item">
                                            <p className="stat-label">Focus</p>
                                            <p className="stat-value">Allocation</p>
                                            <p className="stat-hint">Equity posture &amp; sleeves</p>
                                        </div>
                                    </div>
                                    <div className="hero-panel__stat">
                                        <div className="stat-item">
                                            <p className="stat-label">Data depth</p>
                                            <p className="stat-value">20+ yrs</p>
                                            <p className="stat-hint">Booms, crashes, events</p>
                                        </div>
                                        <div className="stat-item">
                                            <p className="stat-label">Status</p>
                                            <p className="stat-value">Waitlist</p>
                                            <p className="stat-hint">Early access opening soon</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="hero-panel__note">
                                    Same research discipline as our advisory — packaged as a clear score for deployment
                                    decisions. Not live advice; read disclaimers on the product page.
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hero Navigation Dots */}
                    <div className="hero-navigation">
                        <button 
                            className={`hero-dot ${heroScreen === 0 ? 'active' : ''}`}
                            onClick={() => setHeroScreen(0)}
                            aria-label="Mutual Fund Baskets"
                        />
                        <button 
                            className={`hero-dot ${heroScreen === 1 ? 'active' : ''}`}
                            onClick={() => setHeroScreen(1)}
                            aria-label="Talk to Advisor"
                        />
                        <button 
                            className={`hero-dot ${heroScreen === 2 ? 'active' : ''}`}
                            onClick={() => setHeroScreen(2)}
                            aria-label="Consulting Session"
                        />
                        <button 
                            className={`hero-dot ${heroScreen === 3 ? 'active' : ''}`}
                            onClick={() => setHeroScreen(3)}
                            aria-label="MarketCompass coming soon"
                        />
                    </div>
                </section>

                <div className="home-section hero-carousel">
                    <Carousel />
                </div>

                <section className='home-section offerings-section'>   <Offerings /></section>

                <BasketHomePromo />

                {/* Merged About area: TrustHighlights (compact about) + Whyanupaat
                    (detailed why-us). The standalone /whyanupaat menu has been
                    removed; both render together as one cohesive About story. */}
                <section className='home-section about-section'>
                    <TrustHighlights />
                    <Whyanupaat />
                </section>

                <section className='home-section how-we-work-section'><HowWeWork /></section>
                <SkillCounter />
                <section className='home-section media-presence-section'><MediaPresence /></section>
                <section className='home-section testimonials-section'><Testimonials /></section>

                <HomeLeadCapture />

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