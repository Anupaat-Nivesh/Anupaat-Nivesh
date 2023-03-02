import React from 'react';
import logo from '../../assets/logo.png';
import { FaRegCopyright, FaPhoneAlt } from 'react-icons/fa';
import { SiFacebook, SiInstagram, SiTwitter, SiLinkedin, SiYoutube, SiGmail } from "react-icons/si";
import './footer.css';

const Footer = () => (

    <div className="anupaat__footer section__padding">
        <div className='anupaat__footer-links_logo'><img src={logo} alt="anupaat_logo" /></div>

        <div className="anupaat__footer-links">
            <div className="anupaat__footer-links_about">
                <h3>About Anupaat Nivesh</h3>
                <p>We started Anupaat Nivesh in aim to help middle class people to achieve Financial freedom by providing them valuable and ethical financial advice, <br /> All Rights Reserved</p>
            </div>
            <div className="anupaat__footer-links_div">
                <h3> Quick Links</h3>
                <p><a href='#faqs'>FAQs</a></p>
                <p><a href='#knowledge-center'>Knowledge Center</a></p>
                <p><a href='#newsroom'>Newsroom</a></p>
                <p><a href='#documents-and-forms'>Documents & Forms</a></p>
                <p><a href='#investor-charter'>Investor Charter</a></p>
                <p><a href='#investor-grievances-data'>Investor Grievances Data</a></p>
                <p><a href='#shareholder-eVoting'>Shareholder eVoting</a></p>

            </div>
            <div className="anupaat__footer-links_div">
                <h3>Company</h3>
                <p><a href='#terms-and-conditions'>Terms & Conditions</a></p>
                <p><a href='#privacy-policy'>Privacy Policy</a></p>
                <p><a href='#contact-us'>Reach Us</a></p>
            </div>
            <div className="anupaat__footer-links_div">
                <h3>Follow Us On</h3>
                <div className='anupaat__footer-socialicons'>
                    <a href='https://www.facebook.com/anupaatnivesh'><SiFacebook /></a>
                    <a href='#'><SiInstagram /></a>
                    <a href='#'><SiLinkedin /></a>
                    <a href='https://twitter.com/Anupaatnivesh'><SiTwitter /></a>
                    <a href='https://www.youtube.com/@anupaatnivesh'><SiYoutube /></a>
                </div>
                <p><FaPhoneAlt /> +91 95011 95200</p>
                <p>< SiGmail /> anupaatnivesh@gmail.com</p>
            </div>
        </div>

        <div className="anupaat__footer-copyright">
            <p><FaRegCopyright />2023 Anupaat Nivesh. All rights reserved.</p>
        </div>
    </div>
);

export default Footer;