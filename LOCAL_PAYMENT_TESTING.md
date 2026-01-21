# Local Payment Testing Guide

## 🧪 Testing Payment Flow on Local Machine

### Prerequisites
- ✅ Backend server running on port 8000
- ✅ Frontend running on port 3000
- ✅ Razorpay keys configured (test or live)
- ✅ Browser with console open (F12)

## 🚀 Step-by-Step Testing

### Step 1: Start Backend Server

```bash
cd backend
node server.js
```

**Expected output:**
```
🚀 Anupaat Nivesh API Server running on port 8000
📍 Health check: http://localhost:8000/api/health
🔑 Razorpay Key ID: ✅ Configured
🔐 Razorpay Secret: ✅ Configured
```

**Test health check:**
```bash
curl http://localhost:8000/api/health
```

### Step 2: Start Frontend

```bash
# In a new terminal
npm start
```

**Expected:**
- Opens browser at `http://localhost:3000`
- No console errors

### Step 3: Navigate to Booking Page

1. Go to: `http://localhost:3000/consulting-session`
2. Or navigate through the website to the booking page

### Step 4: Fill Booking Form

1. **Personal Information:**
   - First Name: Test
   - Last Name: User
   - Email: test@example.com
   - Phone: 9876543210

2. **Select Date & Time:**
   - Choose a date
   - Select a time slot

3. **Submit Form:**
   - Click "Book Session" or "Proceed to Payment"

### Step 5: Payment Flow

1. **Review Booking Details:**
   - Verify amount (₹99)
   - Check booking details

2. **Click "Proceed to Payment"**
   - Should create Razorpay order
   - Check browser console for any errors

3. **Razorpay Checkout Opens:**
   - Modal should appear
   - Amount should be ₹99
   - User details pre-filled

### Step 6: Test Payment

#### Option A: Test Mode (Recommended for Testing)

**If using test keys (`rzp_test_...`):**

**Test Card for Success:**
- Card Number: `4111 1111 1111 1111`
- CVV: Any 3 digits (e.g., `123`)
- Expiry: Any future date (e.g., `12/25`)
- Name: Any name

**Test Card for Failure:**
- Card Number: `4000 0000 0000 0002`
- CVV: Any 3 digits
- Expiry: Any future date

#### Option B: Live Mode (Use Real Card - Small Amount)

**If using live keys (`rzp_live_...`):**
- Use a real card
- Amount is ₹99 (real money!)
- Test with small amount first

### Step 7: Verify Payment Success

After successful payment:
1. ✅ Payment verified on backend
2. ✅ Booking created
3. ✅ Redirect to success page
4. ✅ Booking reference shown
5. ✅ Confirmation message displayed

### Step 8: Check Backend Logs

Check backend terminal for:
```
✅ Razorpay order created: order_xxxxx
✅ Payment verified successfully: pay_xxxxx
✅ Booking created: booking_xxxxx
```

## 🔍 Testing Checklist

### Backend Tests
- [ ] Backend starts without errors
- [ ] Health check endpoint works
- [ ] Order creation endpoint works
- [ ] Payment verification works
- [ ] CORS allows frontend requests

### Frontend Tests
- [ ] Page loads correctly
- [ ] Form validation works
- [ ] Date/time selection works
- [ ] API calls succeed (check console)
- [ ] Razorpay script loads
- [ ] Razorpay checkout opens
- [ ] Payment amount is correct
- [ ] User details pre-filled

### Payment Flow Tests
- [ ] Order creation succeeds
- [ ] Razorpay modal opens
- [ ] Payment can be completed
- [ ] Payment verification succeeds
- [ ] Booking is created
- [ ] Success page displays
- [ ] Error handling works (cancel payment)

## 🐛 Common Issues & Fixes

### Issue: Backend not starting
**Fix:**
- Check if port 8000 is in use
- Verify `.env` file exists in backend/
- Check Razorpay keys are set

### Issue: CORS errors
**Fix:**
- Verify `FRONTEND_URL` in backend `.env` is `http://localhost:3000`
- Check backend CORS configuration

### Issue: Razorpay not opening
**Fix:**
- Check browser console for errors
- Verify Razorpay key is correct
- Check if Razorpay script loaded
- Verify order was created

### Issue: Payment verification fails
**Fix:**
- Check backend logs
- Verify Razorpay secret key
- Check payment signature

### Issue: API calls failing
**Fix:**
- Verify `REACT_APP_API_BASE_URL=http://localhost:8000` in frontend `.env`
- Check backend is running
- Check browser console for errors

## 📊 Test Scenarios

### Scenario 1: Successful Payment
1. Fill form correctly
2. Complete payment with success test card
3. Verify booking created
4. Check success page

### Scenario 2: Payment Cancellation
1. Fill form
2. Open Razorpay checkout
3. Close modal without paying
4. Verify error handling
5. Can retry payment

### Scenario 3: Payment Failure
1. Fill form
2. Use failure test card (`4000 0000 0000 0002`)
3. Verify error message
4. Can retry with different card

### Scenario 4: Network Error
1. Fill form
2. Stop backend server
3. Try to proceed to payment
4. Verify error message
5. Restart backend and retry

## ✅ Success Criteria

Payment flow is working if:
- ✅ Backend creates Razorpay order
- ✅ Razorpay checkout opens
- ✅ Payment can be completed
- ✅ Payment is verified on backend
- ✅ Booking is created
- ✅ Success page shows correct details
- ✅ No errors in console or logs

## 🎯 Next Steps After Testing

Once local testing passes:
1. ✅ Update `.env` files with production URLs
2. ✅ Deploy backend to Hostinger
3. ✅ Deploy frontend
4. ✅ Test on production
5. ✅ Go live! 🚀

