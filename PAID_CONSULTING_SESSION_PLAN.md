# Paid Consulting Session Feature - Implementation Plan

## Overview
This plan outlines the implementation of a paid consulting session feature (₹99 introductory offer) with Razorpay payment integration, calendar booking, and complete user flow.

## Branch
Work will be done in: `feature/paymentIntegration`

## Feature Flow

```
Homepage → /consulting-session (Landing) → User Info Form → Calendar Booking → Payment (Razorpay) → Confirmation
```

## Implementation Steps

### Phase 1: Dependencies & Setup

#### 1.1 Install Razorpay SDK
**Command:** `npm install razorpay`
**File:** `package.json` (will be updated)
**Note:** New Razorpay account will be set up in parallel - use test keys initially

#### 1.2 Environment Variables
**File:** `.env.example` (create if doesn't exist)
**Variables to add:**
```
REACT_APP_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
# Note: Key secret should NEVER be in frontend - backend only
REACT_APP_CONSULTING_SESSION_PRICE=99
REACT_APP_CONSULTING_SESSION_ACTUAL_PRICE=9999
REACT_APP_CALENDLY_CONSULTING_URL=https://calendly.com/anupaat-nivesh/consulting-session
# Separate Calendly URL for paid sessions (will be provided)
```

**File:** `src/utils/paymentConfig.js` (new)
- Centralized payment configuration
- Load from environment variables
- Validation helpers

### Phase 2: Landing Page

#### 2.1 Create Landing Page Component
**New File:** `src/pages/ConsultingSession/ConsultingSession.jsx`

**Features:**
- High-conversion copy highlighting value
- Price comparison (₹9,999 → ₹99)
- Clear CTA: "Book Session for ₹99"
- Trust indicators section
- What's included section:
  - Financial Planning
  - REAL Statement (income-expense clarity)
  - Investment Planning
  - Goal Clarification
- FAQ section
- Compliance disclaimer section

**New File:** `src/pages/ConsultingSession/ConsultingSession.css`
- Mobile-first responsive design
- Conversion-optimized layout
- Trust badge styling
- **Design System:**
  - Primary color: `var(--color-primary)` (#FE0101 - red)
  - Background: `var(--color-bg)` (#fff - white)
  - Text: `var(--color-text)` (#1b1b1b)
  - Font: `var(--font-family)` (Poppins)
  - Use existing gradient patterns from hero section
  - Rounded corners: 18px, 24px
  - Shadows: Similar to hero-panel styling

#### 2.2 Add Route
**File:** `src/App.js`
- Add route: `<Route path="consulting-session" element={<ConsultingSession />} />`

### Phase 3: User Information Form

#### 3.1 Create Form Component
**New File:** `src/components/ConsultingSessionForm/ConsultingSessionForm.jsx`

**Form Fields:**
- Name (First + Last)
- Email
- Mobile (with phone input component)
- Age (number input, 18-100)
- Monthly income range (dropdown):
  - Less than ₹50,000
  - ₹50,000 - ₹1,00,000
  - ₹1,00,000 - ₹2,50,000
  - ₹2,50,000 - ₹5,00,000
  - Above ₹5,00,000
- Primary concern (dropdown):
  - Retirement Planning
  - Child Education
  - Wealth Creation
  - Tax Saving
  - Debt Management
  - First Crore Goal
  - Portfolio Review
  - Other

**Validation:**
- All fields required
- Email format validation
- Phone number validation (using existing PhoneInput component)
- Age range validation

**New File:** `src/components/ConsultingSessionForm/ConsultingSessionForm.css`

#### 3.2 Form State Management
- Use React hooks (useState)
- Store form data in component state
- Pass data to next step (calendar booking)

### Phase 4: Calendar Booking Integration

#### 4.1 Enhanced Booking Widget
**File:** `src/components/BookingWidget/BookingWidget.jsx` (modify)

**Enhancements:**
- Accept pre-filled user data
- Support custom Calendly URL for consulting session
- Pass user info to Calendly via prefill parameters
- Handle booking completion callback

**Calendly Prefill Parameters:**
- Name
- Email
- Phone
- Custom fields (Age, Income Range, Primary Concern)

#### 4.2 Booking Completion Handler
**New File:** `src/utils/bookingHandler.js`
- Handle Calendly event booking completion
- Extract booking details (date, time, event type)
- Store booking data with user info
- Redirect to payment page with booking reference

### Phase 5: Razorpay Payment Integration

#### 5.1 Payment Service
**New File:** `src/services/paymentService.js`

**Functions:**
- `createRazorpayOrder(userData, bookingData)` - Create order on backend (placeholder)
- `initializeRazorpayCheckout(orderId, amount, userData)` - Initialize Razorpay checkout
- `handlePaymentSuccess(paymentId, orderId, signature)` - Verify and handle success
- `handlePaymentFailure(error)` - Handle payment failure

**Payment Methods:**
- UPI (QR + Intent)
- Debit Card
- Credit Card
- Net Banking (optional)

#### 5.2 Payment Page Component
**New File:** `src/pages/Payment/Payment.jsx`

**Features:**
- Display order summary:
  - Service: 1-on-1 Financial Consulting Session
  - Amount: ₹99
  - Booking date/time (if selected)
- Razorpay checkout button
- Payment method selection
- Loading states
- Error handling

**New File:** `src/pages/Payment/Payment.css`

#### 5.3 Razorpay Checkout Component
**New File:** `src/components/RazorpayCheckout/RazorpayCheckout.jsx`

**Implementation:**
- Load Razorpay script dynamically
- Initialize checkout with options
- Handle payment callbacks
- Support all required payment methods
- Mobile-optimized UI

**New File:** `src/components/RazorpayCheckout/RazorpayCheckout.css`

#### 5.4 Add Payment Route
**File:** `src/App.js`
- Add route: `<Route path="payment" element={<Payment />} />`
- Pass booking and user data via location state or query params

### Phase 6: Payment Success & Confirmation

#### 6.1 Payment Success Page
**New File:** `src/pages/PaymentSuccess/PaymentSuccess.jsx`

**Features:**
- Success confirmation message
- Booking details display:
  - Booking reference number
  - Session date/time
  - Advisor name (if available)
  - Meeting link/details
- Next steps:
  - Email confirmation sent
  - WhatsApp confirmation (placeholder)
  - Calendar invite (if applicable)
- Download receipt option (placeholder)
- Share booking option

**New File:** `src/pages/PaymentSuccess/PaymentSuccess.css`

#### 6.2 Add Payment Success Route
**File:** `src/App.js`
- Add route: `<Route path="payment-success" element={<PaymentSuccess />} />`

#### 6.3 Notification Services (Placeholders)
**New File:** `src/services/notificationService.js`

**Functions:**
- `sendEmailConfirmation(userData, bookingData, paymentData)` - EmailJS integration
- `sendWhatsAppConfirmation(phone, bookingData)` - Placeholder for WhatsApp API
- `sendAdminNotification(userData, bookingData, paymentData)` - Placeholder for admin alerts

**EmailJS Template:**
- Create new template for consulting session confirmation
- Include: Booking details, payment receipt, next steps

### Phase 7: Backend Integration & Design

#### 7.1 Backend Architecture Design
**New File:** `BACKEND_DESIGN.md` (documentation)

**Recommended Backend Stack:**
- Node.js/Express or Python/Django
- PostgreSQL or MongoDB for data storage
- Razorpay SDK for payment processing
- Email service (EmailJS or SendGrid)
- Webhook handlers for Razorpay events

#### 7.2 Database Schema Design

**Bookings Table:**
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_reference VARCHAR(50) UNIQUE NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  user_phone VARCHAR(20) NOT NULL,
  user_age INTEGER,
  income_range VARCHAR(50),
  primary_concern VARCHAR(100),
  calendly_event_id VARCHAR(255),
  calendly_event_uri TEXT,
  booking_date TIMESTAMP,
  booking_time TIME,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Payments Table:**
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id),
  razorpay_order_id VARCHAR(255) UNIQUE NOT NULL,
  razorpay_payment_id VARCHAR(255),
  razorpay_signature VARCHAR(255),
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  payment_method VARCHAR(50),
  payment_status VARCHAR(20) DEFAULT 'pending',
  payment_timestamp TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Indexes:**
- `bookings.booking_reference` (unique index)
- `bookings.user_email` (for lookups)
- `payments.razorpay_order_id` (unique index)
- `payments.booking_id` (foreign key index)

#### 7.3 Backend API Endpoints

**Payment Endpoints:**
```
POST /api/payments/create-order
  Request: { amount, currency, booking_reference }
  Response: { order_id, amount, currency, key_id }

POST /api/payments/verify
  Request: { order_id, payment_id, signature, booking_reference }
  Response: { verified: boolean, booking_id, status }

POST /api/webhooks/razorpay
  Request: Razorpay webhook payload
  Response: { received: true }
```

**Booking Endpoints:**
```
POST /api/bookings
  Request: { userData, bookingData }
  Response: { booking_id, booking_reference, status }

GET /api/bookings/:bookingId
  Response: { booking details, payment status }

PUT /api/bookings/:bookingId/status
  Request: { status }
  Response: { updated: true }
```

#### 7.4 Booking Storage Service (Frontend)
**New File:** `src/services/bookingService.js`

**Functions:**
- `saveBooking(userData, bookingData, paymentData)` - Call backend API
- `getBooking(bookingId)` - Retrieve booking details
- `updateBookingStatus(bookingId, status)` - Update booking status
- `generateBookingReference()` - Generate unique reference

**Data Structure:**
```javascript
{
  bookingId: string,
  bookingReference: string, // e.g., "AN-CS-2024-001234"
  userData: {
    name, email, phone, age, incomeRange, primaryConcern
  },
  bookingData: {
    date, time, eventType, calendlyEventId, calendlyEventUri
  },
  paymentData: {
    paymentId, orderId, amount, status, timestamp, method
  },
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled',
  createdAt: timestamp
}
```

#### 7.5 Payment Verification (Frontend)
**File:** `src/services/paymentService.js` (enhance)

**Backend Endpoint Integration:**
- POST `/api/payments/create-order` - Create Razorpay order
- POST `/api/payments/verify` - Verify Razorpay payment signature

**Implementation Notes:**
- Payment verification MUST be done on backend
- Frontend only initiates payment and handles UI
- All sensitive operations (signature verification) on backend

**TODO Comments:**
- Add clear TODOs for backend integration
- Document expected API contracts
- Add error handling for API failures

### Phase 8: Homepage Integration

#### 8.1 Add Consulting Session Section
**File:** `src/containers/home/Home.jsx`

**Add Section:**
- Highlighted section: "₹99 Financial Planning Session"
- Value proposition
- CTA button linking to `/consulting-session`
- Trust indicators
- Limited time offer messaging

**Styling:**
- Eye-catching but not overwhelming
- Mobile-responsive
- Consistent with existing design

### Phase 9: Compliance & Disclaimers

#### 9.1 Compliance Section
**File:** `src/pages/ConsultingSession/ConsultingSession.jsx` (add section)

**Content:**
- No guaranteed returns
- Educational & advisory tone
- SEBI/AMFI registration mentions
- Risk disclaimer
- Refund policy (if applicable)
- Terms & conditions link

#### 9.2 Payment Terms
**File:** `src/pages/Payment/Payment.jsx` (add)

**Content:**
- Payment terms
- Refund policy
- Service description
- Contact information

### Phase 10: Error Handling & Edge Cases

#### 10.1 Error Pages
**New File:** `src/pages/PaymentError/PaymentError.jsx`
- Handle payment failures
- Provide retry options
- Support contact information

#### 10.2 Booking Cancellation
- Handle Calendly cancellation
- Update booking status
- Refund handling (if applicable)

#### 10.3 Session Expiry
- Handle expired booking sessions
- Clear old data
- Redirect to landing page

## File Structure Summary

### New Files to Create:
1. `src/pages/ConsultingSession/ConsultingSession.jsx`
2. `src/pages/ConsultingSession/ConsultingSession.css`
3. `src/components/ConsultingSessionForm/ConsultingSessionForm.jsx`
4. `src/components/ConsultingSessionForm/ConsultingSessionForm.css`
5. `src/pages/Payment/Payment.jsx`
6. `src/pages/Payment/Payment.css`
7. `src/components/RazorpayCheckout/RazorpayCheckout.jsx`
8. `src/components/RazorpayCheckout/RazorpayCheckout.css`
9. `src/pages/PaymentSuccess/PaymentSuccess.jsx`
10. `src/pages/PaymentSuccess/PaymentSuccess.css`
11. `src/pages/PaymentError/PaymentError.jsx`
12. `src/pages/PaymentError/PaymentError.css`
13. `src/services/paymentService.js`
14. `src/services/notificationService.js`
15. `src/services/bookingService.js`
16. `src/utils/paymentConfig.js`
17. `src/utils/bookingHandler.js`
18. `.env.example` (update if exists)

### Files to Modify:
1. `src/App.js` - Add routes
2. `src/containers/home/Home.jsx` - Add consulting session section
3. `src/components/BookingWidget/BookingWidget.jsx` - Enhance for consulting session
4. `package.json` - Add Razorpay dependency

## Implementation Order

1. **Setup & Dependencies** (Phase 1)
   - Install Razorpay SDK
   - Set up environment variables
   - Create configuration files

2. **Landing Page** (Phase 2)
   - Create landing page component
   - Add route
   - Add compliance section

3. **User Form** (Phase 3)
   - Create form component
   - Add validation
   - Integrate with existing form patterns

4. **Calendar Booking** (Phase 4)
   - Enhance booking widget
   - Integrate Calendly prefill
   - Handle booking completion

5. **Payment Integration** (Phase 5)
   - Create payment service
   - Build payment page
   - Integrate Razorpay checkout

6. **Success & Notifications** (Phase 6)
   - Create success page
   - Set up notification services
   - Email confirmation

7. **Homepage Integration** (Phase 7)
   - Add consulting session section
   - Add CTA

8. **Error Handling** (Phase 8)
   - Error pages
   - Edge case handling

9. **Testing & Polish** (Phase 9)
   - Test complete flow
   - Mobile responsiveness
   - Error scenarios

## Technical Considerations

### Razorpay Integration
- Use Razorpay Checkout (hosted)
- Support UPI, Cards, Net Banking
- Handle webhooks (backend TODO)
- Payment verification (backend TODO)

### Security
- Never expose Razorpay key secret in frontend
- Use key ID only in frontend
- Payment verification must be done on backend
- Store sensitive data securely

### State Management
- Use React Router location state for passing data between steps
- Consider using sessionStorage for form data persistence
- Clear sensitive data after payment completion

### Mobile Optimization
- Responsive forms
- Mobile-friendly payment UI
- Touch-optimized buttons
- Fast loading times

## Environment Variables Required

```bash
# Razorpay (New account - will be set up in parallel)
REACT_APP_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
# Note: Key secret should NEVER be in frontend - backend only

# Pricing
REACT_APP_CONSULTING_SESSION_PRICE=99
REACT_APP_CONSULTING_SESSION_ACTUAL_PRICE=9999

# Calendar (Separate URL for paid sessions - will be provided)
REACT_APP_CALENDLY_CONSULTING_URL=https://calendly.com/anupaat-nivesh/consulting-session

# EmailJS (existing)
REACT_APP_EMAILJS_SERVICE_ID=service_f3brm8k
REACT_APP_EMAILJS_TEMPLATE_ID=template_xxxxx  # New template for consulting session
REACT_APP_EMAILJS_PUBLIC_KEY=9UdH6e5xO7yZCJSL5

# Backend API (when ready)
REACT_APP_API_BASE_URL=https://api.anupaatnivesh.com
# REACT_APP_API_BASE_URL=http://localhost:3001  # For development
```

## Backend Implementation Guide

### Backend Setup (To be built)

1. **Payment Order Creation**
   - Endpoint: `POST /api/payments/create-order`
   - Create Razorpay order using Razorpay SDK
   - Store order in database
   - Return: `{ order_id, amount, currency, key_id }`

2. **Payment Verification**
   - Endpoint: `POST /api/payments/verify`
   - Verify Razorpay signature using crypto
   - Update payment status in database
   - Link payment to booking
   - Trigger email/WhatsApp notifications
   - Return: `{ verified: boolean, booking_id }`

3. **Booking Storage**
   - Endpoint: `POST /api/bookings`
   - Validate user data
   - Generate unique booking reference
   - Store booking in database
   - Return: `{ booking_id, booking_reference }`

4. **Webhook Handler**
   - Endpoint: `POST /api/webhooks/razorpay`
   - Verify webhook signature
   - Handle events: `payment.captured`, `payment.failed`, `order.paid`
   - Update payment/booking status
   - Send notifications

5. **Booking Retrieval**
   - Endpoint: `GET /api/bookings/:bookingId`
   - Return booking details with payment status
   - Used for confirmation page

### Backend Technology Recommendations

**Option 1: Node.js/Express**
- Razorpay Node SDK
- PostgreSQL with Prisma/Sequelize
- Express webhook middleware

**Option 2: Python/Django**
- Razorpay Python SDK
- PostgreSQL with Django ORM
- Django REST Framework

**Security Considerations:**
- Never expose Razorpay key secret
- Verify all webhook signatures
- Use HTTPS for all endpoints
- Implement rate limiting
- Validate all input data
- Use environment variables for secrets

## Testing Checklist

- [ ] Landing page loads correctly
- [ ] Form validation works
- [ ] Calendar booking integration
- [ ] Razorpay checkout opens
- [ ] Payment success flow
- [ ] Email confirmation sent
- [ ] Mobile responsiveness
- [ ] Error handling
- [ ] Compliance disclaimers visible
- [ ] Homepage integration

## Compliance Checklist

- [ ] No guaranteed returns language
- [ ] Risk disclaimers present
- [ ] SEBI/AMFI registration mentioned
- [ ] Educational tone maintained
- [ ] Refund policy clear
- [ ] Terms & conditions accessible
- [ ] Privacy policy linked

## Success Metrics

- Conversion rate from landing to booking
- Payment completion rate
- User satisfaction
- Mobile vs desktop conversion
- Error rate

## Notes

### Design System
- **Colors:** Use existing CSS variables from `src/index.css`
  - Primary: `var(--color-primary)` (#FE0101 - red)
  - Background: `var(--color-bg)` (#fff)
  - Text: `var(--color-text)` (#1b1b1b)
  - Dark backgrounds: `var(--color-secondary-dark)` (#161a1d)
- **Typography:** Poppins font family
- **Layout:** Follow existing patterns from hero section
  - Rounded corners: 18px, 24px
  - Gradients: Similar to home-hero
  - Shadows: Similar to hero-panel
  - Spacing: Consistent with existing sections

### Backend Development
- Backend needs to be designed and built
- See "Backend Implementation Guide" section above
- Database schema provided
- API contracts documented
- Use placeholders until backend is ready

### Integration Status
- Razorpay: New account - will be set up in parallel (use test keys initially)
- Calendly: Separate URL for paid sessions (will be provided)
- EmailJS: Use existing setup for email confirmations
- WhatsApp: Placeholder for future enhancement
- Admin notifications: Placeholder for future enhancement

### Security
- Payment verification MUST be done on backend
- Never commit `.env` files with real keys
- Never expose Razorpay key secret in frontend
- All sensitive operations on backend only

