import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './contact.css';


import '../../App.css';
import FacebookLogo from "../../assets/facebook-logo.png";
import TwitterLogo from "../../assets/twitter-logo.png";
import WhatsappLogo from "../../assets/whatsapp.png";
import YoutubeLogo from "../../assets/youtube.png";
import LinkedInLogo from "../../assets/linkedin.png";



const Contact = (props) => {
    const notify = () => toast.success("Message sent successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    });

    const form = useRef();

    const sendEmail = (e) => {
        e.preventDefault();

        emailjs.sendForm('service_f3brm8k', 'template_agep8yl', form.current, 'JtCyATfWMRTUTtcft')
            .then((result) => {
                console.log(result.text);
                console.log("message sent");
            }, (error) => {
                console.log(error.text);
            });
        e.target.reset();
    };


    const [phoneNumber, setPhoneNumber] = React.useState('');
    const [mail, setMail] = React.useState('');

    const handlePhoneNumberChange = (e) => {
        const phoneError = document.querySelector('.phone-error');

        const inputPhoneNumber = e.target.value;

        const indianPhoneNumberRegex = /^[6-9]\d{9}$/;

        if (indianPhoneNumberRegex.test(inputPhoneNumber) || inputPhoneNumber === '') {
            setPhoneNumber(inputPhoneNumber);
            console.log(inputPhoneNumber);
            phoneError.textContent = '';
        } else {
            phoneError.textContent = '*Invalid Number';
        }
    };

    const handleMailChange = (e) => {
        const mailError = document.querySelector('.mail-error');

        const inputMail = e.target.value;


        const validEmailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (validEmailRegex.test(inputMail) || inputMail === '') {
            setMail(inputMail);
            console.log(inputMail);
            mailError.textContent = '';
        } else {
            mailError.textContent = '*Invalid E-mail';
        }
    };

    return (
        <div className='contact-section section__padding section__margin' id='contact'>
            <h1>Contact <span className='section-heading-focus'>Us</span></h1>
            <div className='cta'>

                <div className='cta-text-box'>
                    <div className='cta-description'>

                        <p className='section-description cta-text'>Fill up the form and our team will get back to you within <b>24 hours.</b></p>
                    </div>
                    <form className='cta-form' ref={form} onSubmit={sendEmail}>
                        <div>
                            <label htmlFor="first-name">First Name</label>
                            <input id='first-name' type="text" name="first_name" placeholder='Lokesh' required />
                        </div>
                        <div>
                            <label htmlFor="last-name">Last Name</label>
                            <input id='last-name' type="text" name="last_name" placeholder='Singh' required />
                        </div>


                        <div>
                            <label htmlFor="email">Email Address</label>
                            <input type="email" id='email' name="user_email" placeholder='abc@example.com' required onChange={handleMailChange} />
                            <div className='error mail-error'> </div>
                        </div>

                        <div>
                            <label htmlFor="contact-number">Phone</label>
                            <div>
                                <input id='contact-number' name="user_number" placeholder=' 9499424123' type="tel" onChange={handlePhoneNumberChange} />
                                <div className='error phone-error'> </div>
                            </div>
                        </div>


                        <div className='cta-meassage-section'>
                            <label htmlFor="message">Message</label>
                            <textarea type="text" id='messsage' name='message' rows="8" cols="80" placeholder='Write your message...' ></textarea>
                        </div>

                        <button type='submit' value="Send" className='btn btn--form' onClick={notify}>SUBMIT</button>
                        <ToastContainer position="top-right" />
                    </form>
                </div>
                <div className='connect-info'>
                    <div className='cta-social' data-aos="fade-left"

                        data-aos-offset="500"
                    >

                        <a href='https://www.facebook.com/anupaatnivesh' target="_blank" rel='noreferrer'><img src={FacebookLogo} className='cta-social-icon' alt='socialIconImage' /></a>
                        <a href='https://twitter.com/Anupaatnivesh' target="_blank" rel='noreferrer'><img src={TwitterLogo} className='cta-social-icon' alt='socialIconImage' /></a>

                        <a href='https://www.youtube.com/@anupaatnivesh'><img src={YoutubeLogo} className='cta-social-icon' /></a>
                        <a href="#"><img src={WhatsappLogo} className='cta-social-icon' /></a>
                        <a href="#"><img src={LinkedInLogo} className='cta-social-icon' /></a>

                    </div>
                </div>

            </div>
        </div>
    );
}

export default Contact;