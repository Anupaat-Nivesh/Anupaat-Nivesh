# Regression Test Plan - Full Payment Flow

## Test Coverage Checklist

### ✅ 1. Consulting Session Page
- [ ] Form appears first (above "Why This Session" and "What's Covered")
- [ ] Value Breakdown section displays correctly
- [ ] Limited-time counter shows sessions left
- [ ] Testimonials section renders
- [ ] Mobile responsive layout
- [ ] All sections load without errors

### ✅ 2. Payment Flow
- [ ] Order creation API works
- [ ] Razorpay checkout initializes
- [ ] Payment verification works
- [ ] Booking reference is passed correctly
- [ ] User data flows through correctly

### ✅ 3. Payment Success Page
- [ ] Success message displays
- [ ] Booking details show correctly
- [ ] Calendly redirect notice appears
- [ ] Countdown timer works (5 seconds)
- [ ] Booking reference in Calendly URL
- [ ] Manual "Book Your Session Now" button works
- [ ] Auto-redirect to Calendly after countdown

### ✅ 4. Payment Error Page
- [ ] Friendly error message displays
- [ ] "Don't worry — no money was deducted" message
- [ ] Retry Payment button works
- [ ] WhatsApp CTA button works
- [ ] Help contacts display correctly

### ✅ 5. Google Sheets Integration
- [ ] Payment data structure is correct
- [ ] All fields are captured (Name, Email, Phone, Booking Ref, Amount, Payment ID, Status)
- [ ] Error handling doesn't break payment flow
- [ ] Sheet name is "Payments"

### ✅ 6. Webhook Endpoint
- [ ] GET endpoint returns status
- [ ] POST endpoint structure is correct
- [ ] Signature verification logic
- [ ] Handles payment.captured event
- [ ] Handles payment.failed event
- [ ] Error handling works

### ✅ 7. Build & Routes
- [ ] Build compiles without errors
- [ ] All routes are accessible
- [ ] No console errors
- [ ] No breaking changes to existing features

