import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PhoneInput, { isPossiblePhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import * as config from '../contact/Config';
import { storeUserData } from '../../utils/bookingHandler';
import './ConsultingSessionForm.css';

/**
 * Consulting Session Form Component
 * Collects user information before booking calendar slot
 */
const ConsultingSessionForm = () => {
  const navigate = useNavigate();
  const formRef = useRef();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    incomeRange: '',
    primaryConcern: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const incomeRanges = [
    'Less than ₹50,000',
    '₹50,000 - ₹1,00,000',
    '₹1,00,000 - ₹2,50,000',
    '₹2,50,000 - ₹5,00,000',
    'Above ₹5,00,000'
  ];

  const primaryConcerns = [
    'Retirement Planning',
    'Child Education',
    'Wealth Creation',
    'Tax Saving',
    'Debt Management',
    'First Crore Goal',
    'Portfolio Review',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhoneChange = (value) => {
    setFormData(prev => ({ ...prev, phone: value || '' }));
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: '' }));
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

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!config.validEmailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!isPossiblePhoneNumber(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }

    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else {
      const ageNum = parseInt(formData.age, 10);
      if (isNaN(ageNum) || ageNum < 18 || ageNum > 100) {
        newErrors.age = 'Age must be between 18 and 100';
      }
    }

    if (!formData.incomeRange) {
      newErrors.incomeRange = 'Please select your income range';
    }

    if (!formData.primaryConcern) {
      newErrors.primaryConcern = 'Please select your primary concern';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Store user data in sessionStorage
      storeUserData(formData);

      // Track form submission
      if (window.gtag) {
        window.gtag('event', 'consulting_form_submit', {
          'event_category': 'conversion',
          'event_label': formData.primaryConcern,
          'value': 1
        });
      }

      // Navigate to booking page with user data
      navigate('/booking', {
        state: {
          userData: formData,
          source: 'consulting_session'
        }
      });
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({ submit: 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="consulting-form-container">
      <form ref={formRef} onSubmit={handleSubmit} className="consulting-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name *</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter your first name"
              className={errors.firstName ? 'error' : ''}
              required
              autoComplete="given-name"
            />
            {errors.firstName && <span className="error-message">{errors.firstName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name *</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter your last name"
              className={errors.lastName ? 'error' : ''}
              required
              autoComplete="family-name"
            />
            {errors.lastName && <span className="error-message">{errors.lastName}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="abc@example.com"
              className={errors.email ? 'error' : ''}
              required
              autoComplete="email"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <div className="mobile-number__input-container">
              <PhoneInput
                className="phoneInput"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handlePhoneChange}
                defaultCountry="IN"
                international
                countryCallingCodeEditable={false}
              />
            </div>
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="age">Age *</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Enter your age"
              min="18"
              max="100"
              className={errors.age ? 'error' : ''}
              required
            />
            {errors.age && <span className="error-message">{errors.age}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="incomeRange">Monthly Income Range *</label>
            <select
              id="incomeRange"
              name="incomeRange"
              value={formData.incomeRange}
              onChange={handleChange}
              className={errors.incomeRange ? 'error' : ''}
              required
            >
              <option value="">Select income range</option>
              {incomeRanges.map((range, index) => (
                <option key={index} value={range}>{range}</option>
              ))}
            </select>
            {errors.incomeRange && <span className="error-message">{errors.incomeRange}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="primaryConcern">Primary Financial Concern *</label>
          <select
            id="primaryConcern"
            name="primaryConcern"
            value={formData.primaryConcern}
            onChange={handleChange}
            className={errors.primaryConcern ? 'error' : ''}
            required
          >
            <option value="">Select your primary concern</option>
            {primaryConcerns.map((concern, index) => (
              <option key={index} value={concern}>{concern}</option>
            ))}
          </select>
          {errors.primaryConcern && <span className="error-message">{errors.primaryConcern}</span>}
        </div>

        {errors.submit && (
          <div className="error-message submit-error">{errors.submit}</div>
        )}

        <button
          type="submit"
          className="btn btn-primary consulting-form-submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Continue to Booking'}
        </button>

        <p className="form-disclaimer">
          By submitting, you agree to our <a href="/privacy-policy">Privacy Policy</a>. 
          We'll use this information to schedule your consultation session.
        </p>
      </form>
    </div>
  );
};

export default ConsultingSessionForm;

