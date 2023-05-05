import React, { useState, useRef } from "react";
import "./ContactModal.css";

import { RiCloseLine } from 'react-icons/ri';
import PhoneInput, { isPossiblePhoneNumber } from 'react-phone-number-input'

import { emailJSserviceID, emailJSKey, emailJSMFtemplteID } from "../Config";
import emailjs from "@emailjs/browser";
import { ToastContainer, toast } from "react-toastify";
import { notifyFailure } from "../ToastConfig";

const ContactModal = function (props) {

  const form = useRef();
  const contactFormContainer = useRef();
  const [modalState, setModalState] = useState(true);
  const [number, setNumber] = useState();
  const [formValues, setFormValues] = useState({
    name: '', mail: '', fundName: props.fundName,
  });



  const handleChange = function (e) {
    const { name, value } = e.target;
    setFormValues((prevFormData) => ({ ...prevFormData, [name]: value }));
  }



  const closeModalWindow = function () {
    setModalState(false);
    props.setTheModalState(false);
  }



  const submitModalForm = function (e) {
    e.preventDefault();
    if (!isPossiblePhoneNumber(number + '')) {
      notifyFailure('Incorrent Phone Number');

      return;
    }

    toast.promise(emailjs.sendForm(emailJSserviceID, emailJSMFtemplteID, form.current, emailJSKey), {
      pending: 'Sending Message',
      success: 'Message Sent!',
      error: 'Please try later!'
    }).then(res => { setTimeout(closeModalWindow, 3000) }).catch(err => { notifyFailure(); });
  };



  return (
    <div className="blur-overlay" style={{ display: `${modalState ? 'flex' : 'none'}` }} onClick={(e) => {
      if (e.target.className === 'blur-overlay') {
        closeModalWindow();

      }
    }}>

      <div className="contactForm-container" ref={contactFormContainer}>
        <div style={{ display: "flex", justifyContent: 'center' }}>
          <RiCloseLine className="close-icon" onClick={closeModalWindow} />
        </div>

        <div className="infotext-container">Send your query and our team will get back to you within 2 business days</div>

        <form className="contact-form" onSubmit={submitModalForm} ref={form}>
          <div className="input-container">
            <label htmlFor="fullname">Full Name : </label>
            <input type="text" id="fullname" className="info-input" name="name" onChange={handleChange} value={formValues.name} required />
          </div>
          <div className="input-container">
            <label htmlFor="mail">Mail id : </label>
            <input type="email" id="mail" className="info-input" name="mail" onChange={handleChange} value={formValues.mail} required />
          </div>
          <div className="input-container">
            <label htmlFor="phone">Phone Number : </label>
            <div>
              <PhoneInput
                name="number"
                id="phone"
                className="ModalForm-PhoneInput"
                value={number}
                onChange={setNumber}
                defaultCountry="IN"
                international
                countryCallingCodeEditable={false}
              />
              <div className="error phone-error">
                {number && isPossiblePhoneNumber(number + '') ? '' : 'Enter a valid Number'}
              </div>
            </div>

          </div>
          <div className="input-container">
            <label htmlFor="fund_name">Fund Type : </label>
            <input className="info-input" id="fund_name" value={props.fundName} name="fundName" readOnly></input>
          </div>
          <div className="btn_container">
            <button>
              <div className="svg-wrapper-1">
                <div className="svg-wrapper">
                  <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z" fill="currentColor"></path>
                  </svg>
                </div>
              </div>
              <span>Send</span>
            </button>
          </div>


        </form>
        <ToastContainer className="toastContainer" position="top-right" />

      </div>



    </div>
  )
};

export default ContactModal;