import React from 'react'
import './contact.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFacebook,faWhatsapp,faTwitter,faYoutube } from "@fortawesome/free-brands-svg-icons"


const Contact = (props) => {

    return (
        <div className='contact-section'>
            <div className='cta'>
                <div className='cta-text-box'>
                    <div className='cta-description'>
                    <h2 className='heading-secondary'>Contact Information</h2>
                    <p className='cta-text'>Fill up the form and our team will get back to you within <b>24 hours.</b></p> 
                    </div>
                    <form action="" className='cta-form'>
                        <div>
                            <label htmlFor="first-name">First Name</label>
                            <input id='first-name' type="text" placeholder='Lokesh' required/>
                        </div>
                        <div>
                            <label htmlFor="last-name">Last Name</label>
                            <input id='last-name' type="text" placeholder='Singh' required/>
                        </div>

                        
                            <div>
                                <label htmlFor="email">Email Address</label>
                                <input type="email" id='email' placeholder='abc@example.com' required />
                            </div>

                            <div>
                                <label htmlFor="contact-number">Phone</label>
                                <div>
                                <input id='contact-number' placeholder='+91 9499424123' type="tel"/>
                               
                                </div>
                            </div>
                    
                        
                        <div className='cta-meassage-section'>
                            <label htmlFor="message">Message</label>
                            <textarea type="text" id='messsage' name='message' rows="8" cols="80"  placeholder='Write your message...' ></textarea>
                        </div>

                        <button className='btn btn--form'>Send Message</button>
                    </form>
                </div>
                <div className='connect-info'>
                    <div className='cta-social'>

                    <a href='https://www.facebook.com/anupaatnivesh'><FontAwesomeIcon className='cta-social-icon' icon={faFacebook} /></a>
                    <a href='https://twitter.com/Anupaatnivesh'><FontAwesomeIcon className='cta-social-icon' icon={faTwitter}/></a>
                    
                    <a href='https://www.youtube.com/@anupaatnivesh'><FontAwesomeIcon className='cta-social-icon' icon={faYoutube}/></a>
                    <a href="#"><FontAwesomeIcon className='cta-social-icon' icon={faWhatsapp}/></a>
                    
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Contact;