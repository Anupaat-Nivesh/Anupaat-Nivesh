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

            <div className='anupaat__footer-links_logo'>
                <img src={logo} alt="anupaat_logo" />
                <div className='AboutUs-Content'>

                    <p> Anupaat Nivesh is an independent financial investment advisory firm, providing guidance to customer for investment in
                        Equity Asset class. We are BSE certified mutual fund distributor. </p>



                </div>
            </div>
            <div className="anupaat__footer-links_div">
                <h3 className='footer-heading'> Quick Links</h3>
                <div className='footer-links'>
                    <Link to='/'>Home</Link>
                    <Link to='about'>About Us</Link>
                    <Link to='partner-with-us'>Partner With Us</Link>
                    <Link to='corporate'>Corporate Corner</Link>


                </div>

            </div>
            <div className="anupaat__footer-links_div">
                <h3 className='footer-heading'>Company</h3>
                <div className='footer-links'>
                    <Link to='privacy-policy'>Privacy Policy</Link>
                    <Link to='contact'>Contact Us</Link>
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
            <p><strong>Anupaat Nivesh Pvt. Ltd</strong> CIN - U66190CH2025PTC046615</p>
            <p>AMFI - Registered Mutual Fund Distributor ARN – 347085 | Date of Registration : 02.12.2025 | Valid Till 01.12.2028</p>
            <p>BSE Membership ID - 65566</p>
            <p>Start-Up India Certified | Regn No. - DIPP233072</p>
            <p>Head Office Address: Anupaat Nivesh Pvt. Ltd., Next57 Coworking, Plot 341, 5th Floor, Phase 9 Industrial Area, Mohali, Punjab, India - 160062</p >
            <p>Registered Address: Anupaat Nivesh Pvt. Ltd., #162 / 2, Dadu Majra, Chandigarh, India - 160014</p >
            <p><strong>Disclaimers:</strong></p>
            <p>Mutual Funds and securities investments are subject to market risks and there is no assurance or guarantee that the objective of the Scheme will be achieved. Past performance of the Sponsor/AMC/Fund or that of any scheme of the Fund does not indicate the future performance of the Schemes of the Fund. Please read the Offer Document carefully before investing.</p>
            <p>SEBI has vide its circular dated November 26, 2010, stipulated that with respect to purchase of units of income/ debt oriented schemes (other than liquid schemes) with amount equal to or more than 1 Cr., irrespective of the time of application, the closing NAV of day on which funds are available for utilization shall be applicable. All Investors are advised to keep in mind said circular while investing in income/ debt oriented schemes (other than liquid schemes).</p>
            <p>Investment in Securities markets are subject to market risks, read all the related documents carefully before investing.</p>
            <p>Insurance, NPS are not Exchange-traded products and Anupaat Nivesh Pvt Ltd is just acting as distributor.</p>
            <p>All disputes with respect to the distribution activity, would not have access to the Exchange Investor Redressal Forum or Arbitration mechanism.</p>
        </div >
        <div className='copyright-section'>
            <p className='copyright-section-text'><FaRegCopyright /> 2023 Anupaat Nivesh. All rights reserved</p>
        </div>

    </div >
);

export default Footer;