import React from 'react'
import './contact.css';
import { SiFacebook, SiTwitter, SiYoutube,SiWhatsapp } from "react-icons/si";


const Contact = (props) => {
    

    const [phoneNumber,setPhoneNumber] = React.useState('');

    const handlePhoneNumberChange = (e)=>{
        const phoneError = document.querySelector('.phone-error');
    
        const inputPhoneNumber = e.target.value;

        const indianPhoneNumberRegex = /^[6-9]\d{9}$/;

        if(indianPhoneNumberRegex.test(inputPhoneNumber)||inputPhoneNumber===''){
            setPhoneNumber(inputPhoneNumber);
            console.log(inputPhoneNumber);
            phoneError.textContent='';
        }else{
            phoneError.textContent='*Invalid Number';
        }
    };



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
                                <input id='contact-number' placeholder='+91 9499424123' type="tel" onChange={handlePhoneNumberChange}/>
                               <div className='error phone-error'> </div>
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

                    <a href='https://www.facebook.com/anupaatnivesh'><SiFacebook className='cta-social-icon' /></a>
                    <a href='https://twitter.com/Anupaatnivesh'><SiTwitter className='cta-social-icon' /></a>
                    
                    <a href='https://www.youtube.com/@anupaatnivesh'><SiYoutube className='cta-social-icon' /></a>
                    <a href="#"><SiWhatsapp className='cta-social-icon' /></a>
                    
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Contact;