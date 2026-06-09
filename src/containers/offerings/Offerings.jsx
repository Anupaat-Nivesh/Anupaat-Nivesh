import React from 'react'
import { Link } from 'react-router-dom';

import './offerings.css';
import mutualFund from '../../assets/illustrations/mf.webp';
import loan from '../../assets/illustrations/loan.webp';
import financeIllustration from '../../assets/illustrations/finance-01.svg';

export const Offerings = () => {
    return (
        <div id='offerings' className='offerings-container section__padding'>
            <div className='offerings-title'>
                <h1>Our <span className='section-heading-focus'>Investment Solutions</span></h1>
                <div className='lead'>Expert-curated products to help you achieve your financial goals</div>
                <div className='offerings-description'>From curated mutual fund baskets to fixed deposits, bonds, unlisted stocks, and P2P lending — we offer investment solutions tailored to your risk profile and objectives.</div>

            </div>

            <article className='offerings__article'>
                <div className='offerings-img' data-aos="fade-right"

                    data-aos-easing="ease-in-sine">
                    <img src={mutualFund} alt="Mutual Fund Basket" />
                </div>
                <div className='offerings__content' data-aos="fade-left">
                    <h2 className='offering_article-title'>Mutual Fund Baskets</h2>
                    <p>
                        Invest in expertly curated mutual fund baskets — FIRE, WATER, and EARTH — designed for growth, balance, and capital preservation. Pay once to unlock fund details; our team supports direct-plan onboarding.
                    </p>
                    <div className='offering-btn'>
                        <Link to="/invest/baskets" className='btn '>
                            View baskets
                        </Link>
                    </div>
                </div>

            </article>

            <article className='offerings__article'>
                <div className='offerings__content' data-aos="fade-right" data-aos-easing="ease-in-sine">
                    <h2 className='offering_article-title'>Fixed Income &amp; Alternatives</h2>
                    <p>
                        Explore fixed deposits and bonds for stable income, plus unlisted stocks and P2P lending for
                        experienced investors seeking diversification. Each product is introduced with clear risk
                        disclosure and a consultation-first path.
                    </p>
                    <div className='offering-btn'>
                        <Link to="/fixed-income-alternatives" className='btn'>View all products</Link>
                    </div>
                </div>
                <div className='offerings-img offerings-img2' data-aos="fade-left">
                    <img src={financeIllustration} alt="Fixed income and alternatives" />
                </div>
            </article>

            <article className='offerings__article'>
                <div className='offerings-img' data-aos="fade-right"

                    data-aos-easing="ease-in-sine">
                    <img src={loan} alt="Loan against securities" />
                </div>
                <div className='offerings__content' data-aos="fade-left">

                    <h2 className='offering_article-title'>Loan Against Securities</h2>
                    <p>
                        Unlock liquidity without selling your investments. Get quick capital against your securities while continuing to earn returns. Perfect for urgent financial needs without disrupting your investment strategy.
                    </p>
                    <div className='offering-btn'>
                        <Link to="/loan-against-securities" className='btn '>Get Started</Link>
                    </div>
                </div>



            </article>





        </div>




    )
}

export default Offerings