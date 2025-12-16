import React from 'react'
import { Link } from 'react-router-dom';

import './offerings.css';
import equity from '../../assets/illustrations/equity.webp';
import mutualFund from '../../assets/illustrations/mf.webp';
import loan from '../../assets/illustrations/loan.webp';

export const Offerings = () => {
    return (
        <div id='offerings' className='offerings-container section__padding'>
            <div className='offerings-title'>
                <h1>Our <span className='section-heading-focus'>Investment Solutions</span></h1>
                <div className='lead'>Expert-curated products to help you achieve your financial goals</div>
                <div className='offerings-description'>From mutual funds to equity baskets, we offer comprehensive investment solutions tailored to your risk profile and objectives.</div>

            </div>

            <article className='offerings__article'>
                <div className='offerings-img' data-aos="fade-right"

                    data-aos-easing="ease-in-sine">
                    <img src={mutualFund} alt="Mutual Fund Basket" />
                </div>
                <div className='offerings__content' data-aos="fade-left">
                    <h2 className='offering_article-title'>Mutual Fund Basket</h2>
                    <p>
                        Invest in expertly curated mutual fund baskets designed to help you achieve specific financial goals. Whether it's your child's education, retirement planning, tax savings, or wealth creation, we have a basket tailored to your needs and risk appetite.
                    </p>
                    <div className='offering-btn'>
                        <Link to="/mutual-funds" className='btn '>
                            Explore Funds
                        </Link>


                    </div>
                </div>

            </article>

            <article className='offerings__article'>
                <div className='offerings__content' data-aos="fade-right"

                    data-aos-easing="ease-in-sine">
                    <h2 className='offering_article-title'>Equity Basket</h2>
                    <p>
                        Access professionally managed equity portfolios created by SEBI-registered Investment Advisors. Our equity baskets are designed to help you build long-term wealth through strategic stock selection and portfolio management.
                    </p>
                    <div className='offering-btn'>
                        <Link to="/equity-basket" className='btn '>View Baskets</Link>
                    </div>
                </div>
                <div className='offerings-img offerings-img2' data-aos="fade-left">
                    <img src={equity} alt="Equity Basket" />
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