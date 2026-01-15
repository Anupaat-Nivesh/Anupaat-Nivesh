import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { ToastContainer, toast } from 'react-toastify';
import PhoneInput, { isPossiblePhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import * as config from '../contact/Config';
import { notifySuccessfull, notifyFailure } from '../contact/ToastConfig';
import './LeadForm.css';

/**
 * Lead Capture Form Component
 * Captures: Name, Mobile/Email, Goal
 * Reuses existing EmailJS configuration and templates
 * Differentiates by subject line based on form type
 */
const LeadForm = ({ 
  title = "Get Started", 
  subtitle = "Fill in your details and we'll get back to you",
  onSuccess = null,
  formType = 'consultation', // 'consultation' or 'portfolio_review'
  source = 'homepage', // 'homepage', 'hero_section', 'contact', etc.
  goalOptions = [
    'Retirement Planning',
    'Child Education',
    'Wealth Creation',
    'Tax Saving',
    'First Crore Goal',
    'Other'
  ]
}) => {
  const formRef = useRef();
  
  // Generate subject based on formType and source
  const getSubject = () => {
    if (formType === 'portfolio_review') {
      if (source === 'hero_section') {
        return 'Portfolio Review Request - Hero Section';
      }
      return 'Portfolio Review Request - Homepage';
    }
    if (source === 'hero_section') {
      return 'Consultation Request - Hero Section';
    }
    return 'Consultation Request - Homepage';
  };

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    goal: '',
    source: source, // Track where lead came from
    subject: getSubject()
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhoneChange = (value) => {
    setFormData(prev => ({ ...prev, phone: value || '' }));
    // Update hidden number field for EmailJS
    const numberInput = formRef.current?.querySelector('input[name="number"]');
    if (numberInput) {
      numberInput.value = value || '';
    }
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
    
    if (!formData.email && !formData.phone) {
      newErrors.contact = 'Please provide either email or phone number';
    }
    
    if (formData.email && !config.validEmailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (formData.phone && !isPossiblePhoneNumber(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }
    
    if (!formData.goal) {
      newErrors.goal = 'Please select a goal';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      notifyFailure('Please fill in all required fields correctly');
      return;
    }

    setIsSubmitting(true);

    try {
      // Use existing EmailJS configuration from Config.js
      // Reuse the same template as contact form but with different subject
      const serviceID = config.emailJSserviceID;
      const templateID = config.emailJStemplateID; // Reuse contact form template
      const publicKey = config.emailJSKey;

      // Ensure phone number and message are set in hidden fields for EmailJS
      const phoneInput = formRef.current.querySelector('input[name="number"]');
      const messageTextarea = formRef.current.querySelector('textarea[name="message"]');
      
      if (phoneInput) {
        phoneInput.value = formData.phone || '';
      }
      
      // Update message with current form data for differentiation
      if (messageTextarea) {
        const sourceDescription = formData.source === 'hero_section' ? 'the hero section' : 
                                  formData.source === 'homepage' ? 'the homepage section' : 
                                  formData.source;
        messageTextarea.value = `${formData.subject}\n\nFinancial Goal: ${formData.goal}\nSource: ${formData.source}\n\nThis is a ${formType === 'portfolio_review' ? 'Portfolio Review' : 'Free Consultation'} request from ${sourceDescription}.`;
      }

      // Send via EmailJS - reusing existing contact form template
      const res = await emailjs.sendForm(serviceID, templateID, formRef.current, publicKey);

      if (res.status !== 200) {
        throw new Error(`Something went wrong, Status: ${res.status}`);
      }

      // Track conversion event
      if (window.gtag) {
        window.gtag('event', 'lead_form_submit', {
          'event_category': 'conversion',
          'event_label': formData.goal,
          'form_type': formType,
          'value': 1
        });
      }

      notifySuccessfull();
      
      // Redirect to thank you page with form type and goal
      const thankYouUrl = `/thank-you?type=${formType}&goal=${encodeURIComponent(formData.goal)}`;
      window.location.href = thankYouUrl;
      
      // Reset form (though redirect will happen)
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        goal: '',
        source: source,
        subject: getSubject()
      });
      
      formRef.current.reset();

      // Call success callback if provided (before redirect)
      if (onSuccess) {
        onSuccess(formData);
      }

    } catch (error) {
      console.error('Lead form submission error:', error);
      // Provide more specific error messages
      if (error.text) {
        let errorMessage = error.text;
        if (error.text.includes('Invalid grant') || error.text.includes('Gmail_API') || error.text.includes('insufficient authentication scopes')) {
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

  return (
    <div className="lead-form-container" style={{ pointerEvents: 'auto' }}>
      <form 
        ref={formRef} 
        onSubmit={handleSubmit} 
        className="lead-form"
        style={{ pointerEvents: 'auto' }}
        onClick={(e) => e.stopPropagation()}
        onFocus={(e) => e.stopPropagation()}
      >
        {/* Hidden fields for EmailJS template compatibility - matching Contact form structure */}
        <input type="hidden" name="source" value={formData.source} />
        <input type="hidden" name="number" value={formData.phone || ''} />
        {/* Message field contains subject and goal info for email differentiation */}
        <textarea 
          name="message" 
          style={{ display: 'none' }}
          readOnly
          value={`${formData.subject}\n\nFinancial Goal: ${formData.goal || 'Not specified'}\nSource: ${formData.source}\n\nThis is a ${formType === 'portfolio_review' ? 'Portfolio Review' : 'Free Consultation'} request from ${formData.source === 'hero_section' ? 'the hero section' : formData.source === 'homepage' ? 'the homepage section' : formData.source}.`}
        />
        
        <div className="form-group">
          <label htmlFor="firstName">First Name *</label>
          <input
            type="text"
            id="firstName"
            name="first_name"
            value={formData.firstName || ''}
            onChange={handleChange}
            onInput={handleChange}
            placeholder="Enter your first name"
            className={errors.firstName ? 'error' : ''}
            required
            autoComplete="given-name"
            style={{ pointerEvents: 'auto', WebkitUserSelect: 'text', userSelect: 'text' }}
            onClick={(e) => e.stopPropagation()}
            onFocus={(e) => e.stopPropagation()}
          />
          {errors.firstName && <span className="error-message">{errors.firstName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name *</label>
          <input
            type="text"
            id="lastName"
            name="last_name"
            value={formData.lastName || ''}
            onChange={handleChange}
            onInput={handleChange}
            placeholder="Enter your last name"
            className={errors.lastName ? 'error' : ''}
            required
            autoComplete="family-name"
            style={{ pointerEvents: 'auto', WebkitUserSelect: 'text', userSelect: 'text' }}
            onClick={(e) => e.stopPropagation()}
            onFocus={(e) => e.stopPropagation()}
          />
          {errors.lastName && <span className="error-message">{errors.lastName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="user_email"
            value={formData.email || ''}
            onChange={handleChange}
            onInput={handleChange}
            placeholder="abc@example.com"
            className={errors.email ? 'error' : ''}
            autoComplete="email"
            style={{ pointerEvents: 'auto', WebkitUserSelect: 'text', userSelect: 'text' }}
            onClick={(e) => e.stopPropagation()}
            onFocus={(e) => e.stopPropagation()}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
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

        {errors.contact && (
          <div className="error-message">{errors.contact}</div>
        )}

        <div className="form-group">
          <label htmlFor="goal">What's your primary financial goal? *</label>
          <select
            id="goal"
            name="goal"
            value={formData.goal}
            onChange={handleChange}
            className={errors.goal ? 'error' : ''}
            required
          >
            <option value="">Select a goal</option>
            {goalOptions.map((goal, index) => (
              <option key={index} value={goal}>{goal}</option>
            ))}
          </select>
          {errors.goal && <span className="error-message">{errors.goal}</span>}
        </div>

        <button 
          type="submit" 
          className="btn btn-primary lead-form-submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : (formType === 'portfolio_review' ? 'Get Free Portfolio Review' : 'Get Free Consultation')}
        </button>

        <p className="form-disclaimer">
          By submitting, you agree to our <a href="/privacy-policy">Privacy Policy</a>. 
          We'll never share your information.
        </p>
      </form>
      <ToastContainer className="toastContainer" position="top-right" />
    </div>
  );
};

export default LeadForm;

