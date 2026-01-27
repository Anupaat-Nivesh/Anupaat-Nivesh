# Mobile Booking Funnel Setup Guide

## Overview

A new mobile-first consulting booking funnel has been created at `/book-consultation`. This is a standalone page optimized for digital ads (Instagram, YouTube, WhatsApp).

## Route

**URL:** `/book-consultation`

**Component:** `src/pages/BookConsultationMobile/BookConsultationMobile.jsx`

**Standalone:** Yes (no MainLayout, no navbar/footer)

## Features

### ✅ Mobile-First Design
- Max-width: 420px (optimized for mobile)
- Centered layout
- No desktop-heavy UI
- Fast load time

### ✅ Funnel Flow
1. **Hero Section** - Value proposition, price, trust badge
2. **What You Get** - Benefits list with icons
3. **CTA Button** - "Book My Session" (sticky on mobile)
4. **User Form** - Name, Email, Phone (minimal fields)
5. **Calendly Integration** - Time selection
6. **Payment** - Razorpay integration (reuses existing)
7. **Success** - Confirmation screen

### ✅ Integration Points

**Reuses Existing:**
- ✅ Razorpay payment integration (`paymentService.js`)
- ✅ Backend APIs (`/api/payments/create-order`, `/api/payments/verify-payment`)
- ✅ Google Sheets logging (`api/services/sheets.js`)
- ✅ Calendly configuration (`utils/calendlyConfig.js`)
- ✅ Booking reference generation (`utils/bookingHandler.js`)
- ✅ Notification service (`services/notificationService.js`)

**New Features:**
- ✅ Source tracking (`source: "mobile-consulting-funnel"`)
- ✅ Standalone page (no layout wrapper)
- ✅ Mobile-optimized UI/UX

## Google Sheets Schema Update

The Google Sheets now includes a **Source** column (Column L):

**Headers:**
1. Timestamp
2. Payment ID
3. Order ID
4. Amount
5. Currency
6. Name
7. Email
8. Phone
9. Booking Reference
10. Status
11. Notes
12. **Source** (NEW)

**Source Values:**
- `mobile-consulting-funnel` - From this new mobile page
- `N/A` - From existing pages (backward compatible)

## Testing

### Local Testing
1. Start dev server: `npm start`
2. Visit: `http://localhost:3000/book-consultation`
3. Test the full flow:
   - Fill form → Continue
   - Select time (Calendly) → Continue to Payment
   - Complete payment → Success screen

### Production Testing
1. Deploy to Vercel
2. Visit: `https://your-domain.com/book-consultation`
3. Test on mobile device or mobile viewport (420px width)
4. Verify Google Sheets logging includes source field

## Usage for Digital Ads

### Instagram Ads
- Use URL: `https://your-domain.com/book-consultation`
- Optimize for mobile traffic
- Track conversions via source field

### YouTube Ads
- Use URL: `https://your-domain.com/book-consultation`
- Mobile-first landing page
- Fast load time

### WhatsApp Links
- Use URL: `https://your-domain.com/book-consultation`
- Mobile-optimized experience
- Easy form completion on mobile

## Analytics Tracking

The page tracks:
- `page_view` - Page load
- `form_submit` - Form submission
- `purchase` - Payment completion

All events include `source: "mobile-consulting-funnel"` for segmentation.

## Important Notes

1. **No Breaking Changes** - Existing pages and flows remain unchanged
2. **Standalone Page** - No navbar/footer (clean mobile experience)
3. **Source Tracking** - All bookings from this page tagged with source
4. **Backward Compatible** - Existing Google Sheets entries will have `N/A` for source

## Files Created

- `src/pages/BookConsultationMobile/BookConsultationMobile.jsx` - Main component
- `src/pages/BookConsultationMobile/BookConsultationMobile.css` - Mobile-first styles

## Files Modified

- `src/App.js` - Added route (standalone, outside MainLayout)
- `api/services/sheets.js` - Added source column support
- `api/payments/verify-payment.js` - Pass source to sheets
- `src/api/paymentApi.js` - Pass source in verify payment
- `src/api/bookingApi.js` - Pass source in booking data
- `src/services/paymentService.js` - Pass source in verification

## Deployment Checklist

- [ ] Deploy to Vercel
- [ ] Test mobile viewport (420px)
- [ ] Verify form validation works
- [ ] Test Calendly integration
- [ ] Test payment flow
- [ ] Verify Google Sheets logging (check source column)
- [ ] Test on actual mobile device
- [ ] Verify analytics tracking

## Support

If issues arise:
1. Check browser console for errors
2. Check Vercel function logs
3. Verify Google Sheets has "Source" column header
4. Ensure Calendly URL is configured in environment variables

