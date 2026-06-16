import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { ToastContainer } from 'react-toastify';
import PhoneInput, { isPossiblePhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import * as config from '../contact/Config';
import { notifySuccessfull, notifyFailure } from '../contact/ToastConfig';
import './LeadForm.css';

const FIELD_MAP = {
  first_name: 'firstName',
  last_name: 'lastName',
  user_email: 'email',
  goal: 'goal',
};

const LeadForm = ({
  title = 'Get Started',
  subtitle = "Tell us your goal — we'll reach out shortly.",
  onSuccess = null,
  formType = 'consultation',
  source = 'homepage',
  submitLabel,
  compact = false,
  goalOptions = [
    'Wealth creation',
    'Retirement planning',
    'Child education',
    'Tax saving',
    'Mutual fund baskets',
    'Other',
  ],
}) => {
  const formRef = useRef();

  const getSubject = () => {
    if (formType === 'portfolio_review') {
      return source === 'hero_section'
        ? 'Portfolio Review Request - Hero Section'
        : 'Portfolio Review Request - Homepage';
    }
    return source === 'hero_section'
      ? 'Consultation Request - Hero Section'
      : 'Consultation Request - Homepage';
  };

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    goal: '',
    source,
    subject: getSubject(),
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const rawName = e.target.name;
    const name = FIELD_MAP[rawName] || rawName;
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhoneChange = (value) => {
    setFormData((prev) => ({ ...prev, phone: value || '' }));
    const numberInput = formRef.current?.querySelector('input[name="number"]');
    if (numberInput) {
      numberInput.value = value || '';
    }
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email && !formData.phone) {
      newErrors.contact = 'Add email or phone so we can reach you';
    }

    if (formData.email && !config.validEmailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (formData.phone && !isPossiblePhoneNumber(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }

    if (!formData.goal) {
      newErrors.goal = 'Select a goal';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildMessage = () => {
    const sourceDescription =
      formData.source === 'hero_section'
        ? 'the hero section'
        : formData.source === 'homepage'
          ? 'the homepage'
          : formData.source;
    const requestType = formType === 'portfolio_review' ? 'Portfolio Review' : 'Consultation';
    return `${formData.subject}\n\nGoal: ${formData.goal}\nSource: ${formData.source}\n\n${requestType} request from ${sourceDescription}.`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      notifyFailure('Please check the highlighted fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const serviceID = config.emailJSserviceID;
      const templateID = config.emailJStemplateID;
      const publicKey = config.emailJSKey;

      const phoneInput = formRef.current.querySelector('input[name="number"]');
      const messageTextarea = formRef.current.querySelector('textarea[name="message"]');

      if (phoneInput) {
        phoneInput.value = formData.phone || '';
      }
      if (messageTextarea) {
        messageTextarea.value = buildMessage();
      }

      const res = await emailjs.sendForm(serviceID, templateID, formRef.current, publicKey);

      if (res.status !== 200) {
        throw new Error(`Something went wrong, Status: ${res.status}`);
      }

      if (window.gtag) {
        window.gtag('event', 'lead_form_submit', {
          event_category: 'conversion',
          event_label: formData.goal,
          form_type: formType,
          value: 1,
        });
      }

      notifySuccessfull();

      const thankYouUrl = `/thank-you?type=${formType}&goal=${encodeURIComponent(formData.goal)}`;
      window.location.href = thankYouUrl;

      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        goal: '',
        source,
        subject: getSubject(),
      });

      formRef.current.reset();

      if (onSuccess) {
        onSuccess(formData);
      }
    } catch (error) {
      console.error('Lead form submission error:', error);
      if (error.text) {
        let errorMessage = error.text;
        if (
          error.text.includes('Invalid grant') ||
          error.text.includes('Gmail_API') ||
          error.text.includes('insufficient authentication scopes')
        ) {
          errorMessage = 'Email service needs to be reconfigured. Please contact the website administrator.';
        } else if (error.text.includes('412')) {
          errorMessage = 'Form validation failed. Please check all fields are filled correctly.';
        }
        notifyFailure(errorMessage);
      } else {
        notifyFailure(error.message || 'Failed to send message. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const buttonLabel =
    submitLabel ||
    (formType === 'portfolio_review' ? 'Get portfolio review' : 'Request a callback');

  return (
    <div className={`lead-form-container ${compact ? 'lead-form-container--compact' : ''}`}>
      {!compact && (
        <div className="lead-form-header">
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="lead-form">
        <input type="hidden" name="source" value={formData.source} />
        <input type="hidden" name="number" value={formData.phone || ''} />
        <textarea name="message" style={{ display: 'none' }} readOnly value={buildMessage()} />

        <div className="lead-form__row">
          <div className="form-group">
            <label htmlFor="firstName">First name</label>
            <input
              type="text"
              id="firstName"
              name="first_name"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First name"
              className={errors.firstName ? 'error' : ''}
              required
              autoComplete="given-name"
            />
            {errors.firstName && <span className="error-message">{errors.firstName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last name</label>
            <input
              type="text"
              id="lastName"
              name="last_name"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last name"
              className={errors.lastName ? 'error' : ''}
              required
              autoComplete="family-name"
            />
            {errors.lastName && <span className="error-message">{errors.lastName}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="user_email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className={errors.email ? 'error' : ''}
            autoComplete="email"
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <div className="mobile-number__input-container">
            <PhoneInput
              className="phoneInput"
              placeholder="Mobile number"
              value={formData.phone}
              onChange={handlePhoneChange}
              defaultCountry="IN"
              international
              countryCallingCodeEditable={false}
            />
          </div>
          {errors.phone && <span className="error-message">{errors.phone}</span>}
        </div>

        {errors.contact && <div className="error-message lead-form__contact-error">{errors.contact}</div>}

        <div className="form-group">
          <label htmlFor="goal">Your goal</label>
          <select
            id="goal"
            name="goal"
            value={formData.goal}
            onChange={handleChange}
            className={errors.goal ? 'error' : ''}
            required
          >
            <option value="">Select one</option>
            {goalOptions.map((goal) => (
              <option key={goal} value={goal}>
                {goal}
              </option>
            ))}
          </select>
          {errors.goal && <span className="error-message">{errors.goal}</span>}
        </div>

        <button type="submit" className="btn btn-primary lead-form-submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sending…' : buttonLabel}
        </button>
      </form>
      <ToastContainer className="toastContainer" position="top-right" />
    </div>
  );
};

export default LeadForm;
