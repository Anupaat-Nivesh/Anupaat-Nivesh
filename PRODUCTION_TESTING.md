# Production Testing Checklist

Complete testing guide before going live with production Razorpay integration.

## 🎯 Pre-Testing Setup

### 1. Environment Configuration
- [ ] Frontend `.env.production` configured
- [ ] Backend `.env` configured with production keys
- [ ] All environment variables verified
- [ ] API base URL points to production backend

### 2. Build Verification
- [ ] Frontend builds without errors: `npm run build`
- [ ] Backend starts without errors: `cd backend && npm start`
- [ ] No console errors in browser
- [ ] All assets load correctly

## 🧪 Backend API Testing

### Health Check
```bash
curl https://api.anupaatnivesh.com/api/health
```
- [ ] Returns `{"status": "ok"}`
- [ ] Response time < 500ms
- [ ] No errors in server logs

### Payment Order Creation
```bash
curl -X POST https://api.anupaatnivesh.com/api/payments/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 99,
    "currency": "INR",
    "userData": {
      "email": "test@example.com",
      "firstName": "Test",
      "lastName": "User"
    },
    "bookingData": {
      "bookingReference": "TEST123"
    }
  }'
```
- [ ] Returns order_id (starts with `order_`)
- [ ] Amount is correct (9900 paise = ₹99)
- [ ] Status is "created"
- [ ] No errors in server logs

### Payment Verification
```bash
# First create an order, then use test payment
# This requires actual payment data from Razorpay
```
- [ ] Signature verification works
- [ ] Invalid signatures are rejected
- [ ] Payment data is logged correctly

## 🌐 Frontend Testing

### Page Load Tests
- [ ] Homepage loads: `https://www.anupaatnivesh.com`
- [ ] Consulting session page loads: `/consulting-session`
- [ ] Booking wizard loads: `/booking-wizard`
- [ ] No 404 errors
- [ ] All images/assets load

### API Integration Tests
- [ ] Open browser console (F12)
- [ ] Navigate to consulting session page
- [ ] Check for API connection errors
- [ ] Verify API base URL is correct
- [ ] Test health check from frontend

### Razorpay Integration Tests

#### Script Loading
- [ ] Open browser console
- [ ] Navigate to payment page
- [ ] Check: `window.Razorpay` is defined
- [ ] No script loading errors
- [ ] Razorpay checkout script loads from CDN

#### Payment Flow (Use Test Mode First!)
1. **Fill Booking Form**
   - [ ] Form validation works
   - [ ] All required fields validated
   - [ ] Date/time selection works
   - [ ] Form submission works

2. **Create Payment Order**
   - [ ] Click "Proceed to Payment"
   - [ ] Order creation API call succeeds
   - [ ] Order ID received from backend
   - [ ] No errors in console

3. **Razorpay Checkout**
   - [ ] Razorpay modal opens
   - [ ] Payment amount is correct (₹99)
   - [ ] User details pre-filled
   - [ ] Payment methods available (UPI, Card, Net Banking)

4. **Test Payment (Use Test Cards)**
   - [ ] **Test Card 1 (Success):**
     - Card: `4111 1111 1111 1111`
     - CVV: Any 3 digits
     - Expiry: Any future date
     - [ ] Payment succeeds
     - [ ] Success callback fires
     - [ ] Redirects to success page
   
   - [ ] **Test Card 2 (Failure):**
     - Card: `4000 0000 0000 0002`
     - [ ] Payment fails gracefully
     - [ ] Error message shown
     - [ ] User can retry

5. **Payment Verification**
   - [ ] Payment signature verified on backend
   - [ ] Booking created successfully
   - [ ] Confirmation email sent (if configured)
   - [ ] Success page shows correct details

## 🔄 End-to-End Flow Testing

### Complete Booking Flow
1. **Start Booking**
   - [ ] Visit `/consulting-session`
   - [ ] Fill personal information
   - [ ] Select date and time
   - [ ] Submit form

2. **Payment Process**
   - [ ] Review booking details
   - [ ] Click "Proceed to Payment"
   - [ ] Payment order created
   - [ ] Razorpay checkout opens
   - [ ] Complete test payment

3. **Post-Payment**
   - [ ] Payment verified
   - [ ] Booking confirmed
   - [ ] Success page displayed
   - [ ] Booking reference shown
   - [ ] Email confirmation (if configured)

### Error Handling Tests
- [ ] **Network Error**: Disconnect internet, try payment
  - [ ] Error message shown
  - [ ] User can retry
  
- [ ] **Backend Down**: Stop backend, try payment
  - [ ] Error message shown
  - [ ] User notified
  
- [ ] **Payment Cancelled**: Close Razorpay modal
  - [ ] User returned to booking page
  - [ ] Can retry payment
  
- [ ] **Invalid Payment**: Use failure test card
  - [ ] Error message shown
  - [ ] User can retry with different card

## 📱 Cross-Browser Testing

Test on:
- [ ] Chrome (Desktop)
- [ ] Firefox (Desktop)
- [ ] Safari (Desktop)
- [ ] Edge (Desktop)
- [ ] Chrome (Mobile)
- [ ] Safari (iOS)
- [ ] Samsung Internet (Android)

For each browser:
- [ ] Page loads correctly
- [ ] Forms work
- [ ] Razorpay checkout opens
- [ ] Payment flow works
- [ ] No console errors

## 🔒 Security Testing

- [ ] HTTPS enabled on all pages
- [ ] No sensitive data in console logs
- [ ] API keys not exposed in frontend code
- [ ] CORS properly configured
- [ ] Payment verification on backend (not frontend)
- [ ] No XSS vulnerabilities in user inputs

## 📊 Performance Testing

- [ ] Page load time < 3 seconds
- [ ] API response time < 1 second
- [ ] Razorpay script loads < 2 seconds
- [ ] Payment modal opens < 1 second
- [ ] No memory leaks in browser

## ✅ Production Readiness Checklist

### Configuration
- [ ] Production Razorpay keys configured
- [ ] Production API URL configured
- [ ] All environment variables set
- [ ] SSL certificates installed
- [ ] Domain DNS configured

### Functionality
- [ ] All API endpoints working
- [ ] Payment flow tested end-to-end
- [ ] Error handling tested
- [ ] Booking creation works
- [ ] Email notifications work (if configured)

### Security
- [ ] HTTPS enabled
- [ ] CORS configured correctly
- [ ] No sensitive data exposed
- [ ] Payment verification on backend
- [ ] Environment variables secured

### Monitoring
- [ ] Health check endpoint working
- [ ] Error logging configured
- [ ] Payment logs accessible
- [ ] Uptime monitoring set up

## 🚨 Critical Tests (Must Pass)

Before going live, these MUST work:
1. ✅ Backend health check responds
2. ✅ Payment order creation works
3. ✅ Razorpay checkout opens
4. ✅ Test payment succeeds
5. ✅ Payment verification works
6. ✅ Booking is created
7. ✅ Success page displays

## 📝 Test Results Template

```
Date: ___________
Tester: ___________
Environment: Production

Backend Tests:
- Health Check: [ ] Pass [ ] Fail
- Order Creation: [ ] Pass [ ] Fail
- Payment Verification: [ ] Pass [ ] Fail

Frontend Tests:
- Page Load: [ ] Pass [ ] Fail
- Form Submission: [ ] Pass [ ] Fail
- Payment Flow: [ ] Pass [ ] Fail

End-to-End:
- Complete Booking: [ ] Pass [ ] Fail
- Error Handling: [ ] Pass [ ] Fail

Issues Found:
1. 
2. 
3. 

Ready for Production: [ ] Yes [ ] No
```

## 🎯 Next Steps After Testing

1. ✅ Fix any issues found
2. ✅ Re-test fixed issues
3. ✅ Document any known limitations
4. ✅ Set up monitoring
5. ✅ Prepare rollback plan
6. ✅ Go live! 🚀

