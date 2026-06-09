import React from 'react'
import { Link } from 'react-router-dom';

import './offerings.css';
import equity from '../../assets/illustrations/equity.webp';
import mutualFund from '../../assets/illustrations/mf.webp';
import loan from '../../assets/illustrations/loan.webp';
import financeIllustration from '../../assets/illustrations/finance-01.svg';
import stockIllustration from '../../assets/illustrations/stock market-01.svg';
import investmentIllustration from '../../assets/illustrations/investment-01.svg';
import bondsIllustration from '../../assets/illustrations/Man invests-01.svg';

export const Offerings = () => {
    return (
        <div id='offerings' className='offerings-container section__padding'>
            <div className='offerings-title'>
                <h1>Our <span className='section-heading-focus'>Investment Solutions</span></h1>
                <div className='lead'>Expert-curated products to help you achieve your financial goals</div>
                <div className='offerings-description'>From mutual funds and equity baskets to bonds, fixed deposits, unlisted stocks, and P2P lending — we offer comprehensive investment solutions tailored to your risk profile and objectives.</div>

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

            <article className='offerings__article'>
                <div className='offerings__content' data-aos="fade-right"
                    data-aos-easing="ease-in-sine">
                    <h2 className='offering_article-title'>P2P Lending</h2>
                    <p>
                        Earn yield by lending through RBI-regulated peer-to-peer platforms. We help you understand credit risk, diversification, and how P2P fits within a balanced portfolio — consultation-first, not product pushing.
                    </p>
                    <div className='offering-btn'>
                        <Link to="/p2p-lending" className='btn'>Learn more</Link>
                    </div>
                </div>
                <div className='offerings-img offerings-img2' data-aos="fade-left">
                    <img src={financeIllustration} alt="P2P lending" />
                </div>
            </article>

            <article className='offerings__article'>
                <div className='offerings-img' data-aos="fade-right"
                    data-aos-easing="ease-in-sine">
                    <img src={stockIllustration} alt="Unlisted stocks" />
                </div>
                <div className='offerings__content' data-aos="fade-left">
                    <h2 className='offering_article-title'>Unlisted Stocks</h2>
                    <p>
                        Access pre-IPO and private market equity opportunities with a research-led approach. We emphasize liquidity awareness, valuation discipline, and appropriate sizing within your overall wealth plan.
                    </p>
                    <div className='offering-btn'>
                        <Link to="/unlisted-stocks" className='btn'>Explore</Link>
                    </div>
                </div>
            </article>

            <article className='offerings__article'>
                <div className='offerings__content' data-aos="fade-right"
                    data-aos-easing="ease-in-sine">
                    <h2 className='offering_article-title'>Fixed Deposits</h2>
                    <p>
                        Park capital safely with bank and NBFC fixed deposits matched to your tenure and liquidity needs. We compare post-tax yields, issuer safety, and how FDs complement growth assets in your portfolio.
                    </p>
                    <div className='offering-btn'>
                        <Link to="/fixed-deposits" className='btn'>View options</Link>
                    </div>
                </div>
                <div className='offerings-img offerings-img2' data-aos="fade-left">
                    <img src={investmentIllustration} alt="Fixed deposits" />
                </div>
            </article>

            <article className='offerings__article'>
                <div className='offerings-img' data-aos="fade-right"
                    data-aos-easing="ease-in-sine">
                    <img src={bondsIllustration} alt="Bonds and debentures" />
                </div>
                <div className='offerings__content' data-aos="fade-left">
                    <h2 className='offering_article-title'>Bonds & Debentures</h2>
                    <p>
                        Generate steady income through government and corporate bonds. We walk you through yields, credit ratings, and tax treatment so you can diversify beyond equities with confidence.
                    </p>
                    <div className='offering-btn'>
                        <Link to="/bonds" className='btn'>Get started</Link>
                    </div>
                </div>
            </article>

        </div>




    )
}

export default Offerings