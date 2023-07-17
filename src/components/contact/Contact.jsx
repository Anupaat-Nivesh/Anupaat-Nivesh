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

import useInput from "../../Hooks/use-input.js";

const Contact = () => {
    const form = useRef();
    const otpInputElement = useRef();
    const [confirmObj, setConfirmObj] = useState({});
    const [time, setTime] = useState();
    const [countDown, setCountDown] = useState();
    const [otpSendStatus, setOtpSendStatus] = useState(false);
    const [numberVerified, setNumberVerified] = useState(false);


    // *********
    const { inputValue: firstNameInputValue, inputFieldHasError: firstNameHasError, inputChangeHandler: firstNameInputChangeHandler, inputBlurHandler: firstNameInputBlurHandler, isInputValueValid: isFirstNameValid, reset: resetFirstNameInput } = useInput(value => config.nameRegex.test(value));


    const { inputValue: lastNameInputValue, inputFieldHasError: lastNameHasError, inputChangeHandler: lastNameInputChangeHandler, inputBlurHandler: lastNameInputBlurHandler, isInputValueValid: isLastNameValid, reset: resetLastNameInput } = useInput(value => config.nameRegex.test(value));


    const { inputValue: mailInputValue, inputFieldHasError: mailHasError, inputChangeHandler: mailInputChangeHandler, inputBlurHandler: mailInputBlurHandler, isInputValueValid: isEmailValid, reset: resetMailInput } = useInput(value => config.validEmailRegex.test(value));


    const { inputValue: numberInputValue, inputFieldHasError: numberHasError, inputChangeHandler: numberInputChangeHandler, inputBlurHandler: numberInputBlurHandler, isInputValueValid: isNumberValid, reset: resetNumberInput } = useInput(value => config.phoneNumberRegex.test(value));

    console.log(numberHasError);
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
            if (!(numberInputValue && isPossiblePhoneNumber(numberInputValue))) {
                throw new Error('Not a valid number');
            }
            // awaiting the response for OTP send status
            const response = await reCaptchaVerfication(numberInputValue, auth);

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

            resetFirstNameInput();
            resetLastNameInput();
            resetMailInput();
            resetNumberInput();

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
                                value={firstNameInputValue}
                                onChange={firstNameInputChangeHandler}
                                onBlur={firstNameInputBlurHandler}
                            />
                            {firstNameHasError && <div className="error first-name-error" required>
                                <p>* Invalid Input</p>
                            </div>}
                        </div>


                        <div>
                            <label htmlFor="last-name">Last Name</label>
                            <input

                                id="last-name"
                                type="text"
                                name="last_name"
                                placeholder="Sharma"
                                required
                                value={lastNameInputValue}
                                onBlur={lastNameInputBlurHandler}
                                onChange={lastNameInputChangeHandler}
                            />
                            {lastNameHasError && <div className="error last-name-error" required>
                                <p>* Invalid Input</p>
                            </div>}
                        </div>

                        <div>
                            <label htmlFor="email">Email Address</label>
                            <input

                                type="email"
                                id="email"
                                name="user_email"
                                placeholder="abc@example.com"
                                required
                                onChange={mailInputChangeHandler}
                                onBlur={mailInputBlurHandler}
                                value={mailInputValue}
                            />
                            {mailHasError && <div className="error mail-error" required>
                                <p>* Invalid E-mail address</p>
                            </div>}
                        </div>

                        <div>
                            <label htmlFor="contact-number">Phone</label>
                            <div className="mobile-number__input-container">
                                <PhoneInput
                                    name="number"
                                    className="phoneInput"
                                    placeholder="Enter phone number"
                                    value={numberInputValue}
                                    onChange={numberInputChangeHandler}
                                    onBlur={numberInputBlurHandler}
                                    defaultCountry="IN"
                                    international
                                    countryCallingCodeEditable={false}
                                />
                                {numberVerified ? <span className="verifiedText animate__animated animate__bounceIn animate__delay-1s" style={{ color: 'green' }}>Verified! ✅</span> : <div className="otp-input__container">
                                    <input ref={otpInputElement} type="text" id="otp-input" placeholder="Enter OTP" style={{ display: `${otpSendStatus ? 'block' : 'none'}` }} />

                                    <button type="click" className="btn otp-btn " onClick={otpSendStatus ? verifyOTP : sendOTP}>{otpSendStatus ? "Verify" : "Send OTP"}</button>


                                </div>}

                            </div>
                            {numberHasError && <div className="error number-error" required>
                                <p>* Invalid Number</p>
                            </div>}
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

                        <button type="submit" value="Send" className="btn btn--form " id="sign-in-button" style={{ backgroundColor: `${numberVerified ? 'var(--color-primary)' : 'var(--color-subtext-light)'}`, opacity: `${numberVerified ? '100%' : '50%'}`, border:'none' }}>
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
