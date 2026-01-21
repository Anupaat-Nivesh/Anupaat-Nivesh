# Flow Testing Guide

## Complete Flow: Consulting Session → Booking → Payment

### Step 1: Fill Consulting Session Form
**URL**: `/consulting-session`

1. User fills the form with:
   - First Name
   - Last Name
   - Email
   - Phone
   - Age
   - Income Range
   - Primary Concern

2. On submit:
   - Data is stored in `sessionStorage`
   - User is redirected to `/booking`

### Step 2: Select Time Slot (Calendly)
**URL**: `/booking`

**Expected Behavior:**
- Calendly widget should load
- User data should be pre-filled
- User selects a time slot
- On booking completion, redirects to `/payment`

**If Calendly doesn't load:**
- Check `.env` has `REACT_APP_CALENDLY_CONSULTING_URL`
- Restart dev server: `npm start`
- Check browser console for errors

### Step 3: Complete Payment
**URL**: `/payment`

**Expected Behavior:**
- Shows booking summary
- User clicks "Pay ₹99"
- Razorpay checkout opens
- User completes payment
- Redirects to `/payment-success`

**If Payment doesn't work:**
- Check `.env` has `REACT_APP_RAZORPAY_KEY_ID`
- Check backend API is running (if using backend)
- Check browser console for errors

---

## Troubleshooting

### Calendly Widget Not Showing

**Symptoms:**
- Shows message: "Calendly/Google Booking integration can be added..."
- No calendar widget visible

**Solutions:**
1. **Check .env file:**
   ```bash
   grep CALENDLY .env
   ```
   Should show:
   ```
   REACT_APP_CALENDLY_CONSULTING_URL=https://calendly.com/anupaatnivesh/financial-planning-session
   ```

2. **Restart dev server:**
   ```bash
   # Stop server (Ctrl+C)
   npm start
   ```
   ⚠️ **Important**: Environment variables are loaded at server start. Changes to `.env` require restart.

3. **Check browser console:**
   - Open DevTools (F12)
   - Look for errors or warnings
   - Check if Calendly script is loading

4. **Verify Calendly URL:**
   - URL should be accessible
   - Format: `https://calendly.com/username/event-type`

### Payment Not Working

**Symptoms:**
- Payment button doesn't open Razorpay
- Error messages in console

**Solutions:**
1. **Check Razorpay Key:**
   ```bash
   grep RAZORPAY .env
   ```
   Should show:
   ```
   REACT_APP_RAZORPAY_KEY_ID=rzp_test_S47IhMgCxOsrbn
   ```

2. **Check Backend (if using):**
   ```bash
   grep API_BASE .env
   ```
   Should show:
   ```
   REACT_APP_API_BASE_URL=http://localhost:8000
   ```

3. **Test Mode:**
   - Use test Razorpay key (`rzp_test_...`)
   - Use test card: `4111 1111 1111 1111`

---

## Quick Test Checklist

- [ ] `.env` file exists and has all required variables
- [ ] Dev server restarted after `.env` changes
- [ ] Calendly URL is accessible
- [ ] Razorpay test key is set
- [ ] Backend API running (if using backend mode)
- [ ] Browser console has no errors
- [ ] Form submission works
- [ ] Booking page loads Calendly widget
- [ ] Payment page loads
- [ ] Razorpay checkout opens

---

## Common Issues

### Issue: "Calendly URL not configured"

**Cause:** Environment variable not loaded

**Fix:**
1. Check `.env` file has `REACT_APP_CALENDLY_CONSULTING_URL`
2. Restart dev server
3. Clear browser cache

### Issue: Calendly widget shows but doesn't load

**Cause:** Calendly script not loading or URL invalid

**Fix:**
1. Check internet connection
2. Verify Calendly URL is correct
3. Check browser console for script errors
4. Try opening Calendly URL directly in browser

### Issue: Payment button does nothing

**Cause:** Razorpay script not loading or key invalid

**Fix:**
1. Check Razorpay key in `.env`
2. Check browser console for errors
3. Verify Razorpay script is loading
4. Test with Razorpay test mode

---

## Testing the Complete Flow

1. **Start dev server:**
   ```bash
   npm start
   ```

2. **Navigate to:** `http://localhost:3000/consulting-session`

3. **Fill form and submit**

4. **Verify redirect to:** `/booking`

5. **Check Calendly widget loads**

6. **Select a time slot** (or simulate booking completion)

7. **Verify redirect to:** `/payment`

8. **Test payment flow** (use test card)

9. **Verify redirect to:** `/payment-success`

---

## Debug Mode

To enable debug logging, check browser console for:
- Calendly URL detection
- User data storage
- Booking data
- Payment initialization

All debug messages are prefixed with component names.

