# Consulting Session Feature - Setup Guide

## Overview

This guide explains how to set up and configure the paid consulting session feature.

## Prerequisites

- Node.js and npm installed
- Razorpay account (test/live)
- Calendly account with separate event type for paid sessions
- EmailJS account (for email notifications)

## Installation

1. **Install Razorpay SDK** (already done)
   ```bash
   npm install razorpay
   ```

2. **Create `.env` file** in project root:
   ```bash
   cp .env.example .env
   # Or create manually
   ```

## Environment Variables

Add these to your `.env` file:

```bash
# Razorpay Payment Integration
REACT_APP_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
# Note: Key Secret should NEVER be in frontend - backend only

# Consulting Session Pricing
REACT_APP_CONSULTING_SESSION_PRICE=99
REACT_APP_CONSULTING_SESSION_ACTUAL_PRICE=9999

# Calendly Integration
REACT_APP_CALENDLY_CONSULTING_URL=https://calendly.com/anupaat-nivesh/consulting-session

# EmailJS Configuration (existing)
REACT_APP_EMAILJS_SERVICE_ID=service_f3brm8k
REACT_APP_EMAILJS_TEMPLATE_ID=template_agep8yl
REACT_APP_EMAILJS_PUBLIC_KEY=9UdH6e5xO7yZCJSL5

# WhatsApp (optional)
REACT_APP_WHATSAPP_NUMBER=919501195200
```

## Razorpay Setup

1. **Create Razorpay Account**
   - Go to https://razorpay.com/
   - Sign up for an account
   - Complete KYC verification

2. **Get API Keys**
   - Go to Dashboard → Settings → API Keys
   - Copy Key ID (starts with `rzp_test_` for test mode)
   - Copy Key Secret (keep this secure, backend only)

3. **Configure Webhooks** (when backend is ready)
   - Go to Dashboard → Settings → Webhooks
   - Add webhook URL: `https://your-backend.com/api/webhooks/razorpay`
   - Select events: `payment.captured`, `payment.failed`, `order.paid`

## Calendly Setup

1. **Create Separate Event Type**
   - Go to Calendly → Event Types
   - Create new event type: "Paid Consulting Session"
   - Set duration (e.g., 60-90 minutes)
   - Configure availability

2. **Get Event URL**
   - Copy the event URL
   - Format: `https://calendly.com/your-username/event-name`
   - Add to `.env` as `REACT_APP_CALENDLY_CONSULTING_URL`

3. **Configure Custom Fields** (optional)
   - Add custom fields in Calendly for:
     - Age
     - Income Range
     - Primary Concern
   - These will be pre-filled from the form

## EmailJS Setup

1. **Create Email Template**
   - Go to EmailJS Dashboard → Email Templates
   - Create new template for "Consulting Session Confirmation"
   - Use variables:
     - `{{user_name}}`
     - `{{booking_reference}}`
     - `{{booking_date}}`
     - `{{payment_amount}}`
     - `{{payment_id}}`

2. **Update Template ID**
   - Copy template ID
   - Add to `.env` (or use existing template)

## Routes

The following routes are now available:

- `/consulting-session` - Landing page
- `/booking` - Calendar booking page
- `/payment` - Payment page
- `/payment-success` - Payment success confirmation
- `/payment-error` - Payment error page

## Testing

### Test Payment Flow

1. **Use Razorpay Test Mode**
   - Use test Key ID: `rzp_test_...`
   - Test cards: https://razorpay.com/docs/payments/test-cards/

2. **Test Cards**
   - Success: `4111 1111 1111 1111`
   - Failure: `4000 0000 0000 0002`
   - CVV: Any 3 digits
   - Expiry: Any future date

3. **Test UPI**
   - Use: `success@razorpay` for success
   - Use: `failure@razorpay` for failure

### Test Booking Flow

1. Fill out the form on `/consulting-session`
2. Select a time slot in Calendly
3. Complete payment
4. Verify email confirmation received

## Backend Integration

When backend is ready:

1. **Update API Endpoints**
   - Edit `src/services/paymentService.js`
   - Replace placeholder functions with actual API calls
   - Set `REACT_APP_API_BASE_URL` in `.env`

2. **Update Booking Service**
   - Edit `src/services/bookingService.js`
   - Replace placeholder functions with actual API calls

3. **Payment Verification**
   - Payment verification MUST be done on backend
   - Never verify payment signature on frontend

## Troubleshooting

### Payment Not Working

- Check Razorpay Key ID is set correctly
- Verify Razorpay script is loading (check browser console)
- Check network tab for API errors
- Verify amount is in paise (99 * 100 = 9900)

### Calendly Not Loading

- Check Calendly URL is correct
- Verify Calendly script is loading
- Check browser console for errors
- Ensure Calendly event is published

### Email Not Sending

- Check EmailJS credentials
- Verify EmailJS template ID
- Check EmailJS service is active
- Review EmailJS logs

## Production Checklist

- [ ] Switch to Razorpay live mode
- [ ] Update Key ID to live key
- [ ] Configure webhook URL
- [ ] Test complete flow end-to-end
- [ ] Set up error monitoring
- [ ] Configure backup and recovery
- [ ] Review security settings
- [ ] Test on mobile devices
- [ ] Verify email templates
- [ ] Check compliance disclaimers

## Support

For issues or questions:
- Check `BACKEND_DESIGN.md` for backend architecture
- Review `PAID_CONSULTING_SESSION_PLAN.md` for implementation details
- Contact: contact@anupaatnivesh.com

