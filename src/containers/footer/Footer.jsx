import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/footer-logo.png';
import { FaRegCopyright, FaPhoneAlt } from 'react-icons/fa';
import { SiGmail } from "react-icons/si";
import FacebookLogo from "../../assets/facebook-logo.png";
import TwitterLogo from "../../assets/twitter-logo.png";
import WhatsappLogo from "../../assets/whatsapp.png";
import YoutubeLogo from "../../assets/youtube.png";
import LinkedInLogo from "../../assets/linkedin.png";
import './footer.css';

const Footer = () => (

    <div className="anupaat__footer">


        <div className="anupaat__footer-links">
            <div className="anupaat__footer-nav-grid">
                <div className="anupaat__footer-links_div">
                    <h3 className='footer-heading'>Quick Links</h3>
                    <div className='footer-links'>
                        <Link to='/'>Home</Link>
                        <Link to='about'>About Us</Link>
                        <Link to='partner-with-us'>Partner With Us</Link>
                        <Link to='corporate'>Corporate Corner</Link>
                        <Link to='contact'>Contact Us</Link>
                    </div>
                </div>

                <div className="anupaat__footer-links_div">
                    <h3 className='footer-heading'>Invest Products</h3>
                    <div className='footer-links'>
                        <Link to='invest/baskets'>Mutual Fund Baskets</Link>
                        <Link to='fixed-income-alternatives'>Fixed Income &amp; Alternatives</Link>
                        <Link to='fixed-deposits'>Fixed Deposits</Link>
                        <Link to='bonds'>Bonds</Link>
                        <Link to='unlisted-stocks'>Unlisted Stocks</Link>
                        <Link to='p2p-lending'>P2P Lending</Link>
                        <Link to='offerings'>All Offerings</Link>
                    </div>
                </div>

                <div className="anupaat__footer-links_div">
                    <h3 className='footer-heading'>Insights &amp; Tools</h3>
                    <div className='footer-links'>
                        <Link to='screeners'>Screeners Hub</Link>
                        <Link to='screeners/sector-rotation'>Sector Rotation</Link>
                        <Link to='valuation'>MarketCompass</Link>
                        <Link to='calculators'>Calculators</Link>
                        <Link to='tools'>Tools</Link>
                    </div>
                </div>

                <div className="anupaat__footer-links_div">
                    <h3 className='footer-heading'>Company</h3>
                    <div className='footer-links'>
                        <Link to='faqs'>FAQs</Link>
                        <Link to='privacy-policy'>Privacy Policy</Link>
                        <Link to='ourApp'>Our App</Link>
                        <Link to='appdownload'>App Download</Link>
                    </div>
                </div>
            </div>

            <div className="anupaat__footer-links_div">
                <h3 className='footer-heading'>Connect with us</h3>
                <div className='contact-info footer-links'>
                    <div className='anupaat__footer-socialicons'>
                        <a href='https://wa.me/919501195200' target="_blank" rel='noreferrer'><img src={WhatsappLogo} alt="logo" /></a>
                        <a href='https://www.facebook.com/anupaatnivesh' target="_blank" rel='noreferrer'><img src={FacebookLogo} alt="logo" /></a>
                        <a href='https://twitter.com/Anupaatnivesh' target="_blank" rel='noreferrer'><img src={TwitterLogo} alt="logo" /></a>
                        <a href='https://www.youtube.com/@anupaatnivesh' target="_blank" rel='noreferrer'><img src={YoutubeLogo} alt="logo" /></a>

                        <a href='https://www.linkedin.com/company/anupaatnivesh/' target="_blank" rel='noreferrer'><img src={LinkedInLogo} alt="logo" /></a>
                    </div>
                    <a className='contact-number' href='tel:95011 95200' ><FaPhoneAlt /> +91 95011 95200</a>
                    <a className='contact-mail' href="mailto:contact@anupaatnivesh.com">< SiGmail /> contact@anupaatnivesh.com</a>
                </div>
            </div>
        </div>
        <div className='footer-disclaimer'>
            <div className="footer-disclaimer__brand">
                <img src={logo} alt="anupaat_logo" />
                <p>
                    Anupaat Nivesh is an independent financial advisory firm helping investors build disciplined equity and mutual fund portfolios, and is a BSE-certified mutual fund distributor.
                </p>
            </div>
            <p><strong>Anupaat Nivesh Pvt. Ltd.</strong> | CIN: U66190CH2025PTC046615</p>
            <p>AMFI Registered Mutual Fund Distributor | ARN: 347085 | Registered: 02.12.2025 | Valid till: 01.12.2028</p>
            <p>BSE Membership ID: 65566 | Start-Up India Regn No.: DIPP233072</p>
            <p>
                Head Office: Anupaat Nivesh Pvt. Ltd., Next57 Coworking, Plot 341, 5th Floor, Phase 9 Industrial Area,
                Mohali, Punjab, India - 160062
            </p>
            <p>Registered Office: Anupaat Nivesh Pvt. Ltd., #162/2, Dadu Majra, Chandigarh, India - 160014</p>
            <p className="footer-disclaimer__single-line">
                <strong>Disclaimers:</strong> Investments in mutual funds and securities are subject to market risks;
                please read all scheme and offer-related documents carefully before investing. Past performance does not
                guarantee future results; no return, profit, or objective achievement is assured. Anupaat Nivesh is an
                AMFI-registered mutual fund distributor; transactions are executed through <strong>BSE STAR MF</strong> in
                line with applicable regulatory requirements. We do not provide stock tips, trading calls, or
                guaranteed-return products; our services focus on goal-based financial planning and mutual fund
                distribution/advisory support. Elemental mutual fund baskets (FIRE, WATER, EARTH) use a
                synthetic model portfolio NAV computed from underlying scheme history; basket unlock is a
                one-time fee per basket and does not guarantee returns. As per SEBI circular dated 26 Nov 2010, for purchases of Rs. 1 crore or
                above in income/debt-oriented schemes (other than liquid schemes), applicable NAV is based on fund
                realization date. Insurance and NPS are not exchange-traded products; Anupaat Nivesh Pvt. Ltd. acts only
                as distributor; disputes related to distribution activity are not covered under Exchange Investor Redressal
                Forum or Arbitration mechanism.
            </p>
        </div >
        <div className='copyright-section'>
            <p className='copyright-section-text'><FaRegCopyright /> 2023 Anupaat Nivesh. All rights reserved</p>
        </div>

    </div >
);

export default Footer;