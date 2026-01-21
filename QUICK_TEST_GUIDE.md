# Quick Payment Testing Guide

## ✅ Current Status

- ✅ Backend is running on `http://localhost:8000`
- ✅ Order creation tested and working
- ✅ Razorpay keys configured
- ✅ Ready for frontend testing

## 🚀 Start Testing

### Step 1: Start Frontend (New Terminal)

```bash
npm start
```

This will:
- Start React dev server
- Open browser at `http://localhost:3000`
- Hot reload enabled

### Step 2: Navigate to Booking Page

Go to one of these URLs:
- `http://localhost:3000/consulting-session`
- `http://localhost:3000/booking-wizard`
- Or navigate through the website menu

### Step 3: Fill the Form

1. **Personal Details:**
   - First Name: `Test`
   - Last Name: `User`
   - Email: `test@example.com`
   - Phone: `9876543210`

2. **Select Date & Time:**
   - Choose any available date
   - Select a time slot

3. **Click "Book Session" or "Proceed to Payment"**

### Step 4: Test Payment

**When Razorpay checkout opens:**

#### If Using Test Keys (`rzp_test_...`):
- **Card Number:** `4111 1111 1111 1111`
- **CVV:** `123` (any 3 digits)
- **Expiry:** `12/25` (any future date)
- **Name:** `Test User`

#### If Using Live Keys (`rzp_live_...`):
- ⚠️ **This will charge real money (₹99)**
- Use a real card
- Test with small amount first

### Step 5: Verify Success

After payment:
- ✅ Should redirect to success page
- ✅ Booking reference should be shown
- ✅ Check backend terminal for logs
- ✅ Check browser console (F12) for any errors

## 🔍 What to Check

### Browser Console (F12)
- No red errors
- API calls succeed
- Razorpay script loaded
- Order created successfully

### Backend Terminal
Should show:
```
✅ Razorpay order created: order_xxxxx
✅ Payment verified successfully: pay_xxxxx
✅ Booking created: booking_xxxxx
```

### Network Tab (F12 → Network)
- API calls to `localhost:8000` succeed
- Razorpay checkout script loads
- No failed requests

## 🐛 Troubleshooting

### CORS Error?
Backend CORS should allow `localhost:3000` (has fallback). If issues:
- Check backend is running
- Verify `REACT_APP_API_BASE_URL=http://localhost:8000` in frontend `.env`

### Razorpay Not Opening?
- Check browser console for errors
- Verify Razorpay key is correct
- Check if order was created (backend logs)

### Payment Fails?
- Check backend logs
- Verify Razorpay keys are correct
- Check payment amount matches

## ✅ Success Indicators

Payment flow is working if:
- ✅ Form submits successfully
- ✅ Razorpay checkout opens
- ✅ Payment can be completed
- ✅ Success page shows
- ✅ Booking reference displayed
- ✅ No errors in console

## 📝 Test Checklist

- [ ] Frontend starts without errors
- [ ] Can navigate to booking page
- [ ] Form validation works
- [ ] Can select date/time
- [ ] Order creation succeeds
- [ ] Razorpay checkout opens
- [ ] Payment can be completed
- [ ] Payment verification works
- [ ] Success page displays
- [ ] Booking reference shown

## 🎯 Ready to Test!

1. Start frontend: `npm start`
2. Open browser: `http://localhost:3000`
3. Navigate to booking page
4. Fill form and test payment
5. Verify everything works!

