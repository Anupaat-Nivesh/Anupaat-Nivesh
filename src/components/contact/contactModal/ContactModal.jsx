import React, { useState, useRef } from "react";
import "./ContactModal.css";

import { RiCloseLine } from 'react-icons/ri';
import PhoneInput, { isPossiblePhoneNumber } from 'react-phone-number-input'

import { ToastContainer, toast } from "react-toastify";
import { notifyFailure } from "../ToastConfig";
import { submitContactForm, getContactSubmitErrorMessage } from "../../../services/contactSubmitService";

const ContactModal = function (props) {

  const form = useRef();
  const contactFormContainer = useRef();
  const [modalState, setModalState] = useState(true);
  const [number, setNumber] = useState();
  const [mutualFundType, setMutualFundType] = useState('');
  const [formValues, setFormValues] = useState({
    name: '', mail: '', fundName: props.fundName,
  });



  const handleChange = function (e) {
    const { name, value } = e.target;
    setFormValues((prevFormData) => ({ ...prevFormData, [name]: value }));
  }


  const selectMutualChangeHandler = (event) => {

    setMutualFundType(event.target.value);

  };

  const closeModalWindow = function () {
    setModalState(false);
    props.setTheModalState(false);
  }



  const submitModalForm = async function (e) {
    e.preventDefault();
    if (!isPossiblePhoneNumber(number + '')) {
      notifyFailure('Incorrent Phone Number');

      return;
    }

    const pending = toast.loading('Sending Message');

    try {
      const nameParts = (formValues.name || '').trim().split(/\s+/);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      const fund = mutualFundType || form.current?.querySelector('[name="fundname"]')?.value || '';

      await submitContactForm({
        formType: 'mutual_fund',
        firstName,
        lastName,
        email: formValues.mail,
        phone: number,
        message: `Mutual fund inquiry: ${fund}`,
        subject: `Mutual fund inquiry — ${fund}`,
        metadata: { fundName: fund },
        website: form.current?.querySelector('input[name="website"]')?.value || '',
      });

      toast.update(pending, { render: 'Message Sent Successfully!', type: 'success', isLoading: false, autoClose: 3000 });
      setTimeout(closeModalWindow, 3000);
    } catch (err) {
      toast.update(pending, { render: getContactSubmitErrorMessage(err), type: 'error', isLoading: false, autoClose: 5000 });
    }
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
          <div className="fullname-box input-box">
            <input type="text" className="input__fullname input-info" name="name" onChange={handleChange} value={formValues.name} required placeholder="Full Name" pattern='^[A-Za-z]+\s[A-Za-z]+(?:\s[A-Za-z]+)*$' />
            <label htmlFor="name" className="input-label__fullname input-label">Full Name</label>
          </div>
          <div className="email-box input-box">
            <input type="email" className="input__mail input-info" name="mail" onChange={handleChange} value={formValues.mail} required placeholder="Enter e-mail" pattern='^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[cC][oO][mM]))$' />
            <label htmlFor="mail" className="input-label__mail input-label">Mail id</label>
          </div>
          <div className="phonenumber-box input-box">
            <PhoneInput
              name="number"
              id="phone"
              className="input__phonenumber input-info"
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


          <div className="fund-box input-box">
            <label htmlFor="mutual-fund-type" className="select-mutual-fund__label">Select Mutual Fund</label>
            <select className="form-control" id="mutual-fund-type" onChange={selectMutualChangeHandler} name="fundname">
              <option>Core Portfolio (5FF)</option>
              <option>Tax-Saver</option>
              <option>Active-Passive Combo</option>
              <option>Income Generation</option>
            </select>


          </div>

          <input type="text" name="website" tabIndex={-1} autoComplete="off" style={{ display: 'none' }} aria-hidden="true" />

          <div className="btn_container">
            <button type="submit">
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
