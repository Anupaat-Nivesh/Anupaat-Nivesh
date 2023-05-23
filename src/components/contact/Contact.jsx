import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { ToastContainer } from "react-toastify";
import { notifyFailure, notifySuccessfull } from "./ToastConfig.js";
import { RecaptchaVerifier, signInWithPhoneNumber, signOut } from "firebase/auth";
import * as config from "./Config.js";
import 'animate.css';
import { animateCSS } from "./Animate.js";

import "react-toastify/dist/ReactToastify.css";
import "./contact.css";

import { app, auth } from "./Firebase.js"
import 'react-phone-number-input/style.css'
import PhoneInput, { isPossiblePhoneNumber } from 'react-phone-number-input'


import "../../App.css";
import FacebookLogo from "../../assets/facebook-logo.png";
import TwitterLogo from "../../assets/twitter-logo.png";
import WhatsappLogo from "../../assets/whatsapp.png";
import YoutubeLogo from "../../assets/youtube.png";
import LinkedInLogo from "../../assets/linkedin.png";

const Contact = () => {
    const form = useRef();
    const otpInputElement = useRef();
    const firstNameErrorElement = useRef();
    const lastNameErrorElement = useRef();
    const mailErrorElement = useRef();
    const [_, setMail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [isEmailValid, setIsEmaliValid] = useState(false);
    const [isFirstNameValid, setIsFirstNameValid] = useState(false);
    const [isLastNameValid, setIsLastNameValid] = useState(false);
    const [confirmObj, setConfirmObj] = useState({});
    const [time, setTime] = useState();
    const [countDown, setCountDown] = useState();
    const [value, setValue] = useState();
    const [otpSendStatus, setOtpSendStatus] = useState(false);
    const [numberVerified, setNumberVerified] = useState(false);


    // Verifies and render the Captcha
    const reCaptchaVerfication = (number) => {
        window.reCaptchaVerfier = new RecaptchaVerifier("recaptch-container", {}, auth);
        window.reCaptchaVerfier.render();

        return signInWithPhoneNumber(auth, number, window.reCaptchaVerfier);

    };

    // Verifies the OTP sent
    const verifyOTP = async function (e) {

        try {
            e.preventDefault();
            const otpElement = otpInputElement.current;
            const otpValue = otpElement.value;
            if (otpValue.length !== 6) throw new Error('Invalid OTP');
            await confirmObj.confirm(otpValue);
            setNumberVerified(true);
            setOtpSendStatus(false);
            clearInterval(countDown);
        } catch (err) {
            notifyFailure(err.message);
        }

    };

    // To send the OTP
    const sendOTP = async function (e) {
        e.preventDefault();

        try {
            // Checking if number is valid
            if (!(value && isPossiblePhoneNumber(value))) {
                throw new Error('Not a valid number');
            }
            // awaiting the response for OTP send status
            const response = await reCaptchaVerfication(value, auth);

            // Set the otp send status
            setOtpSendStatus(true);

            // set the key from response of recaptcha verification
            setConfirmObj(response);


            // Clear the recaptcha
            window.reCaptchaVerfier.clear();
            OTPTimeout();

        } catch (err) {
            // console.log(err);
            notifyFailure(err.message);
            window.reCaptchaVerfier.clear();
        }
    };

    // OTP timeout function
    const OTPTimeout = function () {
        // Start the OTP timeout
        setTime(config.otpTimeout);
        const timer = setInterval(() => {

            setTime((prevTime) => {
                if (prevTime === 0) {
                    // window.reCaptchaVerfier.clear();
                    clearInterval(timer);
                    setOtpSendStatus(false);
                    setNumberVerified(false);
                }
                return (prevTime - 1)
            });

        }, 1000);
        setCountDown(timer);
    };

    // Checks if the First name is correct 
    const handleFirstNameChange = (e) => {

        const inputFirstName = e.target.value;


        if (config.nameRegex.test(inputFirstName)) {
            setFirstName(inputFirstName);
            firstNameErrorElement.current.textContent = "";
            setIsFirstNameValid(true);
        } else {
            firstNameErrorElement.current.textContent = "*Invalid Input";
            setIsFirstNameValid(false);
        }
    };

    // Checks if the last name is correct
    const handleLastNameChange = (e) => {
        const inputLastName = e.target.value;

        if (config.nameRegex.test(inputLastName)) {
            setLastName(inputLastName);
            // console.log(inputLastName);
            lastNameErrorElement.textContent = "";
            setIsLastNameValid(true);
        } else {
            lastNameErrorElement.current.textContent = "*Invalid Input";
            setIsLastNameValid(false);
        }
    };


    // Checks if the mail entered is correct?


    const handleMailChange = (e) => {

        const inputMail = e.target.value;

        if (config.validEmailRegex.test(inputMail)) {
            setMail(inputMail);
            // console.log(inputMail);
            mailErrorElement.textContent = "";
            setIsEmaliValid(true);
        } else {
            mailErrorElement.current.textContent = "*Invalid E-mail";
            setIsEmaliValid(false);
        }
    };

    // To submit the form and send the mail to contact support team.

    const submitForm = async function (e) {
        try {
            e.preventDefault();
            if (!numberVerified) {
                animateCSS('.btn--form', 'shakeX');
                notifyFailure('Please verify the OTP');
                return;
            }
            if (!isEmailValid || !isFirstNameValid || !isLastNameValid) throw new Error('Invalid Input, Kindly check and try again!');
            // console.log(form.current);


            const res = await emailjs.sendForm(
                config.emailJSserviceID,
                config.emailJStemplateID,
                form.current,
                config.emailJSKey
            );

            // console.log(res);

            if (res.status !== 200) throw new Error(`Something went wrong, Status: ${res.status}`);

            notifySuccessfull();
            setNumberVerified(false);
            setOtpSendStatus(false);
            e.target.reset();
            setValue('');

            // Signout a user
            await signOut(auth);
            // console.log('User is signed out');

        } catch (err) {
            notifyFailure(err.message);
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
            <div className="cta" >
                <div className="cta-text-box">
                    <div className="cta-description">
                        <p className="section-description cta-text">
                            Fill up the form and our team will get back to you within{" "}
                            <b>24 hours.</b>
                        </p>
                    </div>
                    <form className="cta-form" ref={form} onSubmit={submitForm} >
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
                            <div ref={firstNameErrorElement} className="error first-name-error" required>
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
                            <div ref={lastNameErrorElement} className="error last-name-error" required>
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
                            <div ref={mailErrorElement} className="error mail-error"> </div>
                        </div>

                        <div>
                            <label htmlFor="contact-number">Phone</label>
                            <div className="mobile-number__input-container">
                                <PhoneInput
                                    name="number"
                                    className="phoneInput"
                                    placeholder="Enter phone number"
                                    value={value}
                                    onChange={(input) => {
                                        setValue(input);
                                        setOtpSendStatus(false);
                                        setNumberVerified(false);
                                    }}
                                    defaultCountry="IN"
                                    international
                                    countryCallingCodeEditable={false}
                                    error={value ? (isPossiblePhoneNumber(value) ? undefined : 'Invalid phone number') : 'Phone number required'}
                                />
                                {numberVerified ? <span className="verifiedText animate__animated animate__bounceIn animate__delay-1s" style={{ color: 'green' }}>Verified! ✅</span> : <div className="otp-input__container">
                                    <input ref={otpInputElement} type="text" id="otp-input" placeholder="Enter OTP" style={{ display: `${otpSendStatus ? 'block' : 'none'}` }} />

                                    <button type="click" className="btn otp-btn " onClick={otpSendStatus ? verifyOTP : sendOTP}>{otpSendStatus ? "Verify" : "Send OTP"}</button>


                                </div>}

                            </div>
                            <div className="error phone-error">
                                {value && isPossiblePhoneNumber(value) ? '' : 'Enter a valid Number'}
                            </div>
                            <div className="countdown" style={{ display: `${otpSendStatus ? 'block' : 'none'}` }}>
                                {`${String(Math.floor(time / 60)).padStart(2, '0')}:${String(Math.floor(time % 60)).padStart(2, '0')}`}
                            </div>
                            <div id="recaptch-container"></div>

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

                        <button type="submit" value="Send" className="btn btn--form " id="sign-in-button" style={{ backgroundColor: `${numberVerified ? 'var(--color-primary)' : 'var(--color-subtext-light)'}`, opacity: `${numberVerified ? '100%' : '50%'}` }}>
                            SUBMIT
                        </button>


                    </form>



                    <ToastContainer className="toastContainer" position="top-right" />
                </div>
                <div className="connect-info">
                    <div
                        className="cta-social"
                        data-aos="fade-left"
                        data-aos-offset="500"
                    >
                        { }
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
