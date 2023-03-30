import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
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
                    <p>Equity Investment are subjected to market risk. Read all scheme-related documents carefully before Investing</p>

                </div>
            </div>
            <div className="anupaat__footer-links_div">
                <h3 className='footer-heading'> Quick Links</h3>
                <div className='footer-links'>
                    <p><a href='#faqs'>Home</a></p>
                    <p><a href='#knowledge-center'>About Us</a></p>
                    <p><a href='#newsroom'>Why Anupaat Nivesh</a></p>
                    <p><a href='#documents-and-forms'>Offerings</a></p>
                    <p><a href='#investor-charter'>Contact Us</a></p>
                    <p><a href='#investor-grievances-data'>Download our App</a></p>
                </div>

            </div>
            <div className="anupaat__footer-links_div">
                <h3 className='footer-heading'>Company</h3>
                <div className='footer-links'>
                    <Link to='privacy-policy'>Privacy Policy</Link>
                    <p><a href='#contact-us'>Contact Us</a></p>
                </div>
            </div>
            <div className="anupaat__footer-links_div">
                <h3 className='footer-heading'>Connect with us</h3>
                <div className='contact-info footer-links'>
                    <div className='anupaat__footer-socialicons'>
                        <a href='https://wa.me/919501195200'><img src={WhatsappLogo} alt="logo" /></a>
                        <a href='https://www.facebook.com/anupaatnivesh'><img src={FacebookLogo} alt="logo" /></a>
                        <a href='https://twitter.com/Anupaatnivesh'><img src={TwitterLogo} alt="logo" /></a>
                        <a href='https://www.youtube.com/@anupaatnivesh'><img src={YoutubeLogo} alt="logo" /></a>

                        <a href='https://www.linkedin.com/company/anupaatnivesh/'><img src={LinkedInLogo} alt="logo" /></a>
                    </div>
                    <a className='contact-number' href='tel:95011 95200' ><FaPhoneAlt /> +91 95011 95200</a>
                    <a className='contact-mail' href="mailto:contact@anupaatnivesh.com">< SiGmail /> contact@anupaatnivesh.com</a>
                </div>
            </div>
        </div>
        <div className='copyright-section'>
            <p className='copyright-section-text'><FaRegCopyright /> 2023 Anupaat Nivesh. All rights reserved</p>
        </div>
    </div>
);

export default Footer;