export const validEmailRegex =
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[cC][oO][mM]))$/;

export const phoneNumberRegex = /^\+[1-9][0-9]{3}[1-9][0-9]*$/;
export const nameRegex = /^[A-Za-z]+$/;

// EmailJS Configuration - Use environment variables in production
// Fallback to hardcoded values for backward compatibility
export const emailJSserviceID = process.env.REACT_APP_EMAILJS_SERVICE_ID || "service_f3brm8k";
export const emailJStemplateID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID || "template_agep8yl";
export const emailJSMFtemplteID = process.env.REACT_APP_EMAILJS_MF_TEMPLATE_ID || "template_abk1zsr";
export const emailJSOpsTemplateID = process.env.REACT_APP_EMAILJS_OPS_TEMPLATE_ID || null;
export const emailJSKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || "9UdH6e5xO7yZCJSL5";
export const otpTimeout = 300;
