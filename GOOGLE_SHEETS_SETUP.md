# Google Sheets Setup Guide

## Issue: Payments Not Recording in Google Sheet

If payments are successful but not appearing in your Google Sheet, check the following:

## ✅ Step 1: Check Vercel Environment Variables

Go to your Vercel project → Settings → Environment Variables and ensure these are set:

1. **GOOGLE_SHEETS_CREDENTIALS**
   - This should be a JSON string of your Google Service Account credentials
   - Format: `{"type":"service_account","project_id":"...","private_key_id":"...","private_key":"...","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}`

2. **GOOGLE_SHEET_ID**
   - The ID of your Google Sheet (found in the URL)
   - Example: `1f8znptWwqldOXeY5w3_Qo9a1ky0AAAFzt_4oHJEbZq8`

## ✅ Step 2: Create Google Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google Sheets API
4. Create a Service Account
5. Download the JSON key file
6. Copy the entire JSON content and paste it as `GOOGLE_SHEETS_CREDENTIALS` in Vercel

## ✅ Step 3: Share Google Sheet with Service Account

1. Open your Google Sheet
2. Click "Share" button
3. Add the Service Account email (from the JSON, field: `client_email`)
4. Give it "Editor" permissions
5. Save

## ✅ Step 4: Create "Payments" Sheet

1. In your Google Sheet, create a new sheet named **"Payments"** (exact name, case-sensitive)
2. Add headers in row 1:
   - Timestamp
   - Payment ID
   - Order ID
   - Amount
   - Currency
   - Name
   - Email
   - Phone
   - Booking Reference
   - Status
   - Notes

## ✅ Step 5: Check Vercel Logs

After making a payment, check Vercel function logs:
1. Go to Vercel Dashboard → Your Project → Functions
2. Click on `/api/payments/verify-payment`
3. Check the logs for:
   - `✅ Payment logged to Google Sheet successfully` (success)
   - `❌ Error logging to Google Sheet` (error - check details)

## 🔍 Common Issues

### Issue 1: "Google Sheets credentials not found"
**Solution:** Set `GOOGLE_SHEETS_CREDENTIALS` and `GOOGLE_SHEET_ID` in Vercel environment variables

### Issue 2: "Permission denied" or "Sheet not found"
**Solution:** 
- Share the Google Sheet with the Service Account email
- Ensure sheet name is exactly "Payments" (case-sensitive)

### Issue 3: "Invalid credentials"
**Solution:**
- Re-download the Service Account JSON key
- Ensure the entire JSON is copied correctly (no extra spaces, valid JSON)

### Issue 4: Payment succeeds but sheet not updated
**Solution:**
- Check Vercel logs for error messages
- Verify the Service Account has Editor access to the sheet
- Ensure the "Payments" sheet exists with correct name

## 📝 Testing

To test if Google Sheets integration is working:

1. Make a test payment
2. Check Vercel logs immediately after
3. Look for these log messages:
   - `📊 Google Sheets logging attempt:`
   - `📝 Attempting to log payment to Google Sheet:`
   - `✅ Payment logged to Google Sheet successfully`

If you see errors, the logs will show exactly what's wrong.

## 🚀 Quick Fix Checklist

- [ ] `GOOGLE_SHEETS_CREDENTIALS` set in Vercel (full JSON string)
- [ ] `GOOGLE_SHEET_ID` set in Vercel (sheet ID from URL)
- [ ] Google Sheet shared with Service Account email (Editor permission)
- [ ] "Payments" sheet exists in the Google Sheet
- [ ] Headers row exists in "Payments" sheet
- [ ] Redeployed Vercel after setting environment variables

