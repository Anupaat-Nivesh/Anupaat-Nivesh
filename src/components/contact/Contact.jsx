import React, { useRef } from "react";
import emailjs from "@emailjs/browser";
import { ToastContainer } from "react-toastify";
import { notifyFailure, notifySuccessfull } from "./ToastConfig.js";
import OtpInput from "react18-input-otp";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import * as config from "./Config.js";
import "react-toastify/dist/ReactToastify.css";
import "./contact.css";
import app from "./Firebase.js"

import "../../App.css";
import FacebookLogo from "../../assets/facebook-logo.png";
import TwitterLogo from "../../assets/twitter-logo.png";
import WhatsappLogo from "../../assets/whatsapp.png";
import YoutubeLogo from "../../assets/youtube.png";
import LinkedInLogo from "../../assets/linkedin.png";

const Contact = () => {
    const form = useRef();
    const [phoneNumber, setPhoneNumber] = React.useState("");
    const [_, setMail] = React.useState("");
    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [isEmailValid, setIsEmaliValid] = React.useState(false);
    const [isNumberValid, setIsNumberValid] = React.useState(false);
    const [isFirstNameValid, setIsFirstNameValid] = React.useState(false);
    const [isLastNameValid, setIsLastNameValid] = React.useState(false);
    const [otp, setOtp] = React.useState("");
    const [confirmObj, setConfirmObj] = React.useState({});
    const [flagRecaptcha, setFlagRecaptcha] = React.useState(true);
    const [flagOtp, setFlagOtp] = React.useState(false);
    const [time, setTime] = React.useState();
    const [countDown, setCountDown] = React.useState();


    const reCaptchaVerfication = (number) => {
        number = "+91" + number;
        const auth = getAuth();
        const reCaptchaVerfier = new RecaptchaVerifier("recaptch-container", {}, auth);
        reCaptchaVerfier.render();
        setFlagRecaptcha(true);
        return signInWithPhoneNumber(auth, number, reCaptchaVerfier);
    };

    const verifyOtp = async function (e) {
        e.preventDefault();

        try {
            if (otp.length !== 6) throw new Error('Invalid OTP');
            await confirmObj.confirm(otp);
            clearInterval(countDown);
            setFlagOtp(false);

            emailjs
                .sendForm(
                    config.emailJSserviceID,
                    config.emailJStemplateID,
                    form.current,
                    config.emailJSKey
                ).then((result) => {
                    if (result.status !== 200) throw new Error(`Something went wrong, Status: ${result.status}`);
                    notifySuccessfull();
                    // console.log("Message sent");
                    e.target.reset();
                })
                .catch((err) => {
                    notifyFailure(err.message);
                    // console.log("Message failed");
                });
        } catch (err) {
            notifyFailure(err.message);
        }

    };

    const sendEmail = async function (e) {
        e.preventDefault();
        if (!isEmailValid || !isNumberValid || !isFirstNameValid || !isLastNameValid) return notifyFailure('Invalid input');

        try {
            const response = await reCaptchaVerfication(phoneNumber);
            // console.log(response);
            setConfirmObj(response);
            setFlagOtp(true); 
            setFlagRecaptcha(false);
            setTime(config.otpTimeout);
            const timer = setInterval(() => {
                
                setTime((prevTime) => { 
                    if (prevTime === 0) {
                        alert('Timeout try again!');
                        clearInterval(timer);
                        setFlagOtp(false);
                        window.location.reload();    
                    }
                    return (prevTime - 1)});

            }, 1000);
            setCountDown(timer);


        } catch (err) {
            alert(`${err.message} Please Try Again!`);
            window.location.reload();
        }
    };





    const handleFirstNameChange = (e) => {
        const firstNameError = document.querySelector(".first-name-error");

        const inputFirstName = e.target.value;


        if (config.nameRegex.test(inputFirstName)) {
            setFirstName(inputFirstName);
            firstNameError.textContent = "";
            setIsFirstNameValid(true);
        } else {
            firstNameError.textContent = "*Invalid Input";
            setIsFirstNameValid(false);
        }
    };

    const handleLastNameChange = (e) => {
        const lastNameError = document.querySelector(".last-name-error");

        const inputLastName = e.target.value;



        if (config.nameRegex.test(inputLastName)) {
            setLastName(inputLastName);
            // console.log(inputLastName);
            lastNameError.textContent = "";
            setIsLastNameValid(true);
        } else {
            lastNameError.textContent = "*Invalid Input";
            setIsLastNameValid(false);
        }
    };

    const handlePhoneNumberChange = (e) => {
        const phoneError = document.querySelector(".phone-error");

        const inputPhoneNumber = e.target.value;


        if (config.indianPhoneNumberRegex.test(inputPhoneNumber)) {
            setPhoneNumber(inputPhoneNumber);
            // console.log(inputPhoneNumber);
            phoneError.textContent = "";
            setIsNumberValid(true);
        } else {
            phoneError.textContent = "*Invalid Number";
            setIsNumberValid(false);
        }
    };

    const handleMailChange = (e) => {
        const mailError = document.querySelector(".mail-error");

        const inputMail = e.target.value;



        if (config.validEmailRegex.test(inputMail)) {
            setMail(inputMail);
            // console.log(inputMail);
            mailError.textContent = "";
            setIsEmaliValid(true);
        } else {
            mailError.textContent = "*Invalid E-mail";
            setIsEmaliValid(false);
        }
    };



    return (
        <div
            className="contact-section section__padding section__margin"
            id="contact"
        >
            <h1>
                Contact <span className="section-heading-focus">Us</span>
            </h1>
            <div className="cta">
                <div className="cta-text-box">
                    <div className="cta-description">
                        <p className="section-description cta-text">
                            Fill up the form and our team will get back to you within{" "}
                            <b>24 hours.</b>
                        </p>
                    </div>
                    <form className="cta-form" ref={form} onSubmit={sendEmail}>
                        <div>
                            <label htmlFor="first-name">First Name</label>
                            <input
                                id="first-name"
                                type="text"
                                name="first_name"
                                placeholder="Anuj"
                                required
                                onChange={handleFirstNameChange}
                            />
                            <div className="error first-name-error" required>
                                {" "}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="last-name">Last Name</label>
                            <input
                                id="last-name"
                                type="text"
                                name="last_name"
                                placeholder="Sharma"
                                required
                                onChange={handleLastNameChange}
                            />
                            <div className="error last-name-error" required>
                                {" "}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="user_email"
                                placeholder="abc@example.com"
                                required
                                onChange={handleMailChange}
                            />
                            <div className="error mail-error"> </div>
                        </div>

                        <div>
                            <label htmlFor="contact-number">Phone</label>
                            <div>
                                <input
                                    id="contact-number"
                                    name="user_number"
                                    placeholder="9243432167"
                                    type="tel"
                                    onChange={handlePhoneNumberChange}
                                />
                                <div className="error phone-error" required>
                                    {" "}
                                </div>
                            </div>
                        </div>

                        <div className="cta-meassage-section">
                            <label htmlFor="message">Message</label>
                            <textarea
                                type="text"
                                id="messsage"
                                name="message"
                                rows="8"
                                cols="80"
                                placeholder="Write your message..."
                                required
                            ></textarea>
                        </div>

                        <button type="submit" value="Send" className="btn btn--form" id="sign-in-button">
                            SUBMIT
                        </button>


                    </form>

                    <div id="recaptch-container" style={{ display: `${flagRecaptcha ? 'flex' : 'none'}` }}></div>

                    <div className="otp-verification-container" style={{ display: `${flagOtp ? 'flex' : 'none'}`, marginTop: '4rem' }}>
                        <span>Enter OTP</span>
                        <span>{time}</span>
                        
                        <form onSubmit={verifyOtp}>
                            <OtpInput
                                value={otp}
                                separator={<span>-</span>}
                                onChange={setOtp}
                                numInputs={6}
                                isSuccessed={true}
                                successStyle="success"

                                containerStyle={{ color: "red" }}

                                inputStyle={{ color: "red", width: '5rem', height: '5rem', borderRadius: '10px', boxShadow: '0 0 0.3rem var(--color-subtext-light)', fontSize: '2rem' }}
                                onSubmit={verifyOtp}
                            />
                            <button type="submit" className="btn--form">verify</button>
                        </form>

                        <form action="" className="control"></form>
                    </div>
                    <ToastContainer className="toastContainer" position="top-right" />
                </div>
                <div className="connect-info">
                    <div
                        className="cta-social"
                        data-aos="fade-left"
                        data-aos-offset="500"
                    >
                        {}
                        <a
                            href="https://www.facebook.com/anupaatnivesh"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <img
                                src={FacebookLogo}
                                className="cta-social-icon"
                                alt="socialIconImage"
                            />
                        </a>
                        <a
                            href="https://twitter.com/Anupaatnivesh"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <img
                                src={TwitterLogo}
                                className="cta-social-icon"
                                alt="socialIconImage"
                            />
                        </a>

                        <a
                            href="https://www.youtube.com/@anupaatnivesh"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <img alt="logo" src={YoutubeLogo} className="cta-social-icon" />
                        </a>
                        <a
                            href="https://wa.me/919501195200"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <img alt="logo" src={WhatsappLogo} className="cta-social-icon" />
                        </a>
                        <a
                            href="https://www.linkedin.com/company/anupaatnivesh/"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <img alt="logo" src={LinkedInLogo} className="cta-social-icon" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
