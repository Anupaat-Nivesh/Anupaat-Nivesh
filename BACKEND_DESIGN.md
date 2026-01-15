# Backend Design Documentation
## Paid Consulting Session Feature

This document outlines the backend architecture and API design for the paid consulting session feature.

## Overview

The backend needs to handle:
1. Razorpay payment order creation
2. Payment verification and signature validation
3. Booking storage and retrieval
4. Webhook handling for Razorpay events
5. Email/WhatsApp notifications (optional)

## Technology Stack Recommendations

### Option 1: Node.js/Express
- **Framework:** Express.js
- **Database:** PostgreSQL with Prisma or Sequelize ORM
- **Payment SDK:** Razorpay Node.js SDK
- **Webhook Verification:** Razorpay webhook signature verification

### Option 2: Python/Django
- **Framework:** Django REST Framework
- **Database:** PostgreSQL with Django ORM
- **Payment SDK:** Razorpay Python SDK
- **Webhook Verification:** Razorpay webhook signature verification

## Database Schema

### Bookings Table

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
  calendly_invitee_uri TEXT,
  booking_date TIMESTAMP,
  booking_time TIME,
  timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
  location VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_bookings_reference ON bookings(booking_reference);
CREATE INDEX idx_bookings_email ON bookings(user_email);
CREATE INDEX idx_bookings_status ON bookings(status);
```

### Payments Table

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
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

CREATE INDEX idx_payments_order_id ON payments(razorpay_order_id);
CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_payments_status ON payments(payment_status);
```

## API Endpoints

### 1. Create Payment Order

**Endpoint:** `POST /api/payments/create-order`

**Request Body:**
```json
{
  "amount": 99,
  "currency": "INR",
  "booking_reference": "AN-CS-2024-0101-1200-001",
  "user_data": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+919876543210"
  }
}
```

**Response:**
```json
{
  "order_id": "order_xxxxxxxxxxxxx",
  "amount": 9900,
  "currency": "INR",
  "key_id": "rzp_test_xxxxxxxxxxxxx"
}
```

**Implementation Notes:**
- Use Razorpay SDK to create order
- Store order_id in database
- Link order to booking reference
- Return order_id to frontend

### 2. Verify Payment

**Endpoint:** `POST /api/payments/verify`

**Request Body:**
```json
{
  "order_id": "order_xxxxxxxxxxxxx",
  "payment_id": "pay_xxxxxxxxxxxxx",
  "signature": "xxxxxxxxxxxxx",
  "booking_reference": "AN-CS-2024-0101-1200-001"
}
```

**Response:**
```json
{
  "verified": true,
  "booking_id": "uuid-here",
  "status": "confirmed"
}
```

**Implementation Notes:**
- Verify Razorpay signature using crypto library
- Update payment status in database
- Link payment to booking
- Update booking status to 'confirmed'
- Trigger email/WhatsApp notifications

### 3. Create Booking

**Endpoint:** `POST /api/bookings`

**Request Body:**
```json
{
  "user_data": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+919876543210",
    "age": 35,
    "incomeRange": "₹1,00,000 - ₹2,50,000",
    "primaryConcern": "Retirement Planning"
  },
  "booking_data": {
    "calendlyEventId": "event-id",
    "calendlyEventUri": "https://calendly.com/...",
    "startTime": "2024-01-15T10:00:00Z",
    "endTime": "2024-01-15T11:00:00Z",
    "timezone": "Asia/Kolkata",
    "location": "Online"
  }
}
```

**Response:**
```json
{
  "booking_id": "uuid-here",
  "booking_reference": "AN-CS-2024-0101-1200-001",
  "status": "pending"
}
```

**Implementation Notes:**
- Generate unique booking reference
- Validate user data
- Store booking in database
- Return booking_id and reference

### 4. Get Booking

**Endpoint:** `GET /api/bookings/:bookingId`

**Response:**
```json
{
  "booking_id": "uuid-here",
  "booking_reference": "AN-CS-2024-0101-1200-001",
  "user_data": { ... },
  "booking_data": { ... },
  "payment_data": { ... },
  "status": "confirmed"
}
```

### 5. Razorpay Webhook

**Endpoint:** `POST /api/webhooks/razorpay`

**Request Headers:**
```
X-Razorpay-Signature: xxxxxxxxxxxxx
```

**Request Body:** (Razorpay webhook payload)

**Response:**
```json
{
  "received": true
}
```

**Implementation Notes:**
- Verify webhook signature
- Handle events:
  - `payment.captured` - Update payment status
  - `payment.failed` - Update payment status
  - `order.paid` - Update booking status
- Update database accordingly
- Send notifications if needed

## Security Considerations

1. **Never expose Razorpay key secret** - Keep it server-side only
2. **Verify all webhook signatures** - Use Razorpay's signature verification
3. **Validate all input data** - Sanitize and validate all user inputs
4. **Use HTTPS** - All endpoints must use HTTPS
5. **Rate limiting** - Implement rate limiting on payment endpoints
6. **CORS configuration** - Restrict CORS to your frontend domain only
7. **Environment variables** - Store all secrets in environment variables

## Razorpay Integration

### Order Creation (Node.js Example)

```javascript
const Razorpay = require('razorpay');
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

async function createOrder(amount, currency = 'INR') {
  const options = {
    amount: amount * 100, // Convert to paise
    currency: currency,
    receipt: `receipt_${Date.now()}`
  };
  
  const order = await razorpay.orders.create(options);
  return order;
}
```

### Payment Verification (Node.js Example)

```javascript
const crypto = require('crypto');

function verifyPayment(orderId, paymentId, signature, keySecret) {
  const text = `${orderId}|${paymentId}`;
  const generatedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(text)
    .digest('hex');
  
  return generatedSignature === signature;
}
```

### Webhook Verification (Node.js Example)

```javascript
function verifyWebhookSignature(webhookBody, signature, keySecret) {
  const generatedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(JSON.stringify(webhookBody))
    .digest('hex');
  
  return generatedSignature === signature;
}
```

## Notification Integration

### Email Notifications

Use EmailJS or SendGrid to send confirmation emails:
- Booking confirmation
- Payment receipt
- Session reminders
- Cancellation notices

### WhatsApp Notifications (Optional)

Integrate with WhatsApp Business API:
- Booking confirmation
- Payment confirmation
- Session reminders

## Error Handling

1. **Payment failures** - Log errors, notify user, update booking status
2. **Webhook failures** - Retry mechanism, dead letter queue
3. **Database errors** - Transaction rollback, error logging
4. **API timeouts** - Retry logic, fallback mechanisms

## Testing

1. **Unit Tests** - Test payment verification, signature validation
2. **Integration Tests** - Test API endpoints with mock Razorpay
3. **Webhook Tests** - Test webhook handling with test events
4. **End-to-End Tests** - Test complete flow from booking to payment

## Deployment Checklist

- [ ] Set up PostgreSQL database
- [ ] Configure environment variables
- [ ] Set up Razorpay account and get keys
- [ ] Configure webhook URL in Razorpay dashboard
- [ ] Deploy backend API
- [ ] Test payment flow end-to-end
- [ ] Set up monitoring and logging
- [ ] Configure backup and recovery

## TODO

- [ ] Implement actual backend API
- [ ] Set up database migrations
- [ ] Configure webhook endpoint
- [ ] Implement email notifications
- [ ] Add logging and monitoring
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Implement rate limiting
- [ ] Add API documentation (Swagger/OpenAPI)

## References

- [Razorpay Node.js SDK](https://github.com/razorpay/razorpay-node)
- [Razorpay Python SDK](https://github.com/razorpay/razorpay-python)
- [Razorpay Webhooks](https://razorpay.com/docs/webhooks/)
- [Razorpay Payment Verification](https://razorpay.com/docs/payments/server-integration/nodejs/payment-gateway/build-integration/)

