import React from 'react';
import logo from '../../assets/logo.png';
import { FaRegCopyright, FaPhoneAlt } from 'react-icons/fa';
import {SiGmail} from "react-icons/si";
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
            </div>
            <div className="anupaat__footer-links_div">
                <h3 className='footer-heading'> Quick Links</h3>
                <div className='footer-links'>
                    <p><a href='#faqs'>FAQs</a></p>
                    <p><a href='#knowledge-center'>Knowledge Center</a></p>
                    <p><a href='#newsroom'>Newsroom</a></p>
                    <p><a href='#documents-and-forms'>Documents & Forms</a></p>
                    <p><a href='#investor-charter'>Investor Charter</a></p>
                    <p><a href='#investor-grievances-data'>Investor Grievances Data</a></p>
                    <p><a href='#shareholder-eVoting'>Shareholder eVoting</a></p>
                </div>

            </div>
            <div className="anupaat__footer-links_div">
                <h3 className='footer-heading'>Company</h3>
                <div className='footer-links'>
                    <p><a href='#terms-and-conditions'>Terms & Conditions</a></p>
                    <p><a href='#privacy-policy'>Privacy Policy</a></p>
                    <p><a href='#contact-us'>Reach Us</a></p>
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

                        <a href='#'><img src={LinkedInLogo} alt="logo" /></a>
                    </div>
                    <div className='contact-info'>
                   <h3>Contact Us:</h3>
                    <a className='contact-number' href='tel:95011 95200' ><FaPhoneAlt /> +91-95011 95200</a>
                    </div>
                    <div className='contact-info'>
                        <h3>Mail Us:</h3>
                    <a className='contact-mail' href="mailto:anupaatnivesh@gmail.com">< SiGmail /> anupaatnivesh@gmail.com</a>
                    </div>
                </div>
            </div>
        </div>
        <div className='copyright-section'>
            <p className='copyright-section-text'><FaRegCopyright /> 2023 Anupaat Nivesh. All rights reserved</p>
        </div>
    </div>
);

export default Footer;