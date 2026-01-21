# Backend API Documentation

This document describes the backend API endpoints required for the Anupaat Nivesh frontend application.

## Architecture Overview

- **Frontend**: React application (this repository)
- **Backend**: Node.js/Express API server (separate repository)
- **Communication**: RESTful API over HTTPS
- **Authentication**: Not required for public endpoints (can be added later)

## Base URL

- **Development**: `http://localhost:8000`
- **Production**: `https://api.anupaatnivesh.com` (or your backend domain)

Configure via `REACT_APP_API_BASE_URL` environment variable.

## API Endpoints

### Health Check

**GET** `/api/health`

Check if backend API is available.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

### Payment Endpoints

#### Create Razorpay Order

**POST** `/api/payments/create-order`

Create a Razorpay order for payment processing.

**Request Body:**
```json
{
  "amount": 99,
  "currency": "INR",
  "userData": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+919876543210",
    "age": "30",
    "incomeRange": "₹1,00,000 - ₹2,50,000",
    "primaryConcern": "Retirement Planning"
  },
  "bookingData": {
    "bookingReference": "AN-CS-2024-0115-1030-001",
    "calendlyEventId": "event_uuid",
    "calendlyEventUri": "https://calendly.com/...",
    "startTime": "2024-01-20T10:00:00Z",
    "endTime": "2024-01-20T11:00:00Z",
    "timezone": "Asia/Kolkata",
    "location": "Online"
  },
  "notes": {
    "service": "consulting_session",
    "bookingReference": "AN-CS-2024-0115-1030-001"
  }
}
```

**Response:**
```json
{
  "order_id": "order_xxxxxxxxxxxxx",
  "amount": 9900,
  "currency": "INR",
  "status": "created",
  "created_at": "2024-01-15T10:30:00Z"
}
```

**Backend Implementation Notes:**
- Use Razorpay SDK to create order
- Store order details in database
- Use Razorpay Secret Key (from environment): `Fvj0EC80HEhLNMO5O2yVw8v9`
- Amount should be in paise (99 INR = 9900 paise)

---

#### Verify Payment

**POST** `/api/payments/verify`

Verify Razorpay payment signature.

**Request Body:**
```json
{
  "payment_id": "pay_xxxxxxxxxxxxx",
  "order_id": "order_xxxxxxxxxxxxx",
  "signature": "signature_string",
  "userData": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com"
  },
  "bookingData": {
    "bookingReference": "AN-CS-2024-0115-1030-001"
  }
}
```

**Response:**
```json
{
  "verified": true,
  "paymentData": {
    "payment_id": "pay_xxxxxxxxxxxxx",
    "order_id": "order_xxxxxxxxxxxxx",
    "amount": 9900,
    "currency": "INR",
    "status": "captured",
    "timestamp": "2024-01-15T10:35:00Z"
  }
}
```

**Backend Implementation Notes:**
- Use Razorpay SDK to verify signature
- Signature verification formula: `HMACSHA256(order_id + "|" + payment_id, secret_key)`
- Store payment details in database
- Return error if verification fails

---

#### Get Order Details

**GET** `/api/payments/order/:orderId`

Get Razorpay order details.

**Response:**
```json
{
  "order_id": "order_xxxxxxxxxxxxx",
  "amount": 9900,
  "currency": "INR",
  "status": "paid",
  "payment_id": "pay_xxxxxxxxxxxxx"
}
```

---

### Booking Endpoints

#### Create Booking

**POST** `/api/bookings`

Create a new booking record.

**Request Body:**
```json
{
  "bookingReference": "AN-CS-2024-0115-1030-001",
  "userData": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+919876543210",
    "age": "30",
    "incomeRange": "₹1,00,000 - ₹2,50,000",
    "primaryConcern": "Retirement Planning"
  },
  "bookingData": {
    "calendlyEventId": "event_uuid",
    "calendlyEventUri": "https://calendly.com/...",
    "calendlyInviteeUri": "https://calendly.com/...",
    "startTime": "2024-01-20T10:00:00Z",
    "endTime": "2024-01-20T11:00:00Z",
    "timezone": "Asia/Kolkata",
    "location": "Online",
    "eventName": "Financial Planning Session"
  },
  "paymentData": {
    "paymentId": "pay_xxxxxxxxxxxxx",
    "orderId": "order_xxxxxxxxxxxxx",
    "signature": "signature_string",
    "amount": 99,
    "currency": "INR",
    "status": "captured",
    "timestamp": "2024-01-15T10:35:00Z"
  },
  "status": "confirmed"
}
```

**Response:**
```json
{
  "booking_id": "booking_xxxxxxxxxxxxx",
  "booking_reference": "AN-CS-2024-0115-1030-001",
  "status": "confirmed",
  "created_at": "2024-01-15T10:35:00Z"
}
```

**Backend Implementation Notes:**
- Store booking in database
- Link booking with payment record
- Send confirmation emails (optional)
- Generate unique booking_id

---

#### Get Booking

**GET** `/api/bookings/:bookingId`

Get booking details by ID.

**Response:**
```json
{
  "booking_id": "booking_xxxxxxxxxxxxx",
  "booking_reference": "AN-CS-2024-0115-1030-001",
  "userData": { ... },
  "bookingData": { ... },
  "paymentData": { ... },
  "status": "confirmed",
  "created_at": "2024-01-15T10:35:00Z"
}
```

---

#### Get Booking by Reference

**GET** `/api/bookings/reference/:reference`

Get booking details by reference number.

**Response:** Same as Get Booking

---

#### Update Booking Status

**PUT** `/api/bookings/:bookingId/status`

Update booking status.

**Request Body:**
```json
{
  "status": "cancelled"
}
```

**Response:**
```json
{
  "booking_id": "booking_xxxxxxxxxxxxx",
  "status": "cancelled",
  "updated_at": "2024-01-15T11:00:00Z"
}
```

---

## Error Handling

All endpoints should return consistent error responses:

**Error Response:**
```json
{
  "error": "Error message",
  "message": "Detailed error description",
  "status": 400
}
```

**HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error
- `503` - Service Unavailable

---

## Environment Variables (Backend)

The backend should use these environment variables:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_S47IhMgCxOsrbn
RAZORPAY_KEY_SECRET=Fvj0EC80HEhLNMO5O2yVw8v9

# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/anupaat_db

# Server Configuration
PORT=8000
NODE_ENV=production

# Email Configuration (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-password
```

---

## Security Considerations

1. **Never expose Razorpay Secret Key** in frontend code
2. **Always verify payment signatures** on backend
3. **Use HTTPS** in production
4. **Validate all input data** on backend
5. **Rate limiting** for API endpoints
6. **CORS configuration** to allow only frontend domain
7. **Input sanitization** to prevent injection attacks

---

## Development Mode

The frontend supports development mode when backend is not available:
- Mock order creation
- Mock payment verification
- Mock booking storage

**To enable development mode:**
- Don't set `REACT_APP_API_BASE_URL` or set it to empty string
- Frontend will use mock implementations
- Console warnings will indicate mock mode

**For production:**
- Backend API is **required**
- Set `REACT_APP_API_BASE_URL` to your backend URL
- All operations will use real backend API

---

## Testing

### Test Payment Flow

1. Create order via `/api/payments/create-order`
2. Use Razorpay test keys
3. Complete payment in test mode
4. Verify payment via `/api/payments/verify`
5. Save booking via `/api/bookings`

### Test Cards (Razorpay Test Mode)

- **Success**: `4111 1111 1111 1111`
- **Failure**: `4000 0000 0000 0002`
- **CVV**: Any 3 digits
- **Expiry**: Any future date

---

## Implementation Checklist

- [ ] Set up Node.js/Express backend server
- [ ] Configure Razorpay SDK
- [ ] Implement payment order creation
- [ ] Implement payment verification
- [ ] Set up database (PostgreSQL/MongoDB)
- [ ] Implement booking storage
- [ ] Add error handling
- [ ] Configure CORS
- [ ] Add input validation
- [ ] Set up environment variables
- [ ] Deploy backend API
- [ ] Test all endpoints
- [ ] Configure production environment

---

## Support

For questions or issues, contact the development team.

