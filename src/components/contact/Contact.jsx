import React, { useRef } from "react";
import emailjs from "@emailjs/browser";
import { ToastContainer, toast } from "react-toastify";
import OtpInput from "react-otp-input";
import "react-toastify/dist/ReactToastify.css";
import "./contact.css";

import "../../App.css";
import FacebookLogo from "../../assets/facebook-logo.png";
import TwitterLogo from "../../assets/twitter-logo.png";
import WhatsappLogo from "../../assets/whatsapp.png";
import YoutubeLogo from "../../assets/youtube.png";
import LinkedInLogo from "../../assets/linkedin.png";

const Contact = (props) => {
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

    const toastOptions = {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    };

    const notifySuccessfull = () =>
        toast.success("Message sent successfully! 😀", toastOptions);

    const notifyFailure = (message) =>
        toast.error(
            `Message failed to send 🥲: ${message}.Try again in some time!`,
            toastOptions
        );

    const sendEmail = (e) => {
        e.preventDefault();

        emailjs
            .sendForm(
                "service_f3brm8k",
                "template_agep8yl",
                form.current,
                "JtCyATfWMRTUTtcft"
            )
            .then((result) => {

                if (!isEmailValid || !isNumberValid || !isFirstNameValid || !isLastNameValid) throw new Error("Invalid Inputs");

                notifySuccessfull();
                console.log("Message sent");
                e.target.reset();

            })
            .catch((err) => {
                notifyFailure(err.message);
                console.log("Message failed");
            });
    };

    const handleFirstNameChange = (e) => {
        const firstNameError = document.querySelector(".first-name-error");

        const inputFirstName = e.target.value;

        const nameRegex = /^[A-Za-z]+$/;

        if (nameRegex.test(inputFirstName)) {
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

        const nameRegex = /^[A-Za-z]+$/;

        if (nameRegex.test(inputLastName)) {
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

        const indianPhoneNumberRegex = /^[6-9]\d{9}$/;

        if (indianPhoneNumberRegex.test(inputPhoneNumber)) {
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

        const validEmailRegex =
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[cC][oO][mM]))$/;

        if (validEmailRegex.test(inputMail)) {
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

                        <button type="submit" value="Send" className="btn btn--form">
                            SUBMIT
                        </button>

                        <div className="otp-verification-container">
                            <OtpInput
                                containerStyle="otp-input"
                                inputStyle={{
                                    color: "red",
                                    padding: "0",
                                    width: "5rem",
                                    height: "5rem",
                                    fontSize: "2rem",
                                }}
                                value={otp}
                                onChange={setOtp}
                                numInputs={6}
                                renderSeparator={<span> - </span>}
                                renderInput={(props) => <input {...props} />}
                            />
                            OTP not received? Send Again!
                        </div>
                        <ToastContainer position="top-right" />
                    </form>
                </div>
                <div className="connect-info">
                    <div
                        className="cta-social"
                        data-aos="fade-left"
                        data-aos-offset="500"
                    >
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
