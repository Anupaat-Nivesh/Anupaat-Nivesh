# Email Debugging Guide

## Issue: Email shows status 200 but not received

If the console shows `✅ Ops lead notification email sent via EmailJS` with `status: 200`, but you're not receiving the email, follow these steps:

### Step 1: Verify EmailJS Template Recipient

1. Go to [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Navigate to **Email Templates**
3. Find template: `template_abk1zsr` (or the template ID shown in console logs)
4. Click **Edit** on the template
5. Check the **"To Email"** field:
   - It should be set to: `ops.anupaatnivesh@gmail.com`
   - OR if you want it dynamic, set it to: `{{to_email}}`

**Important:** EmailJS sends emails to the recipient configured in the template settings, NOT necessarily the `to_email` variable you pass in the code (unless the template is configured to use that variable).

### Step 2: Check Spam Folder

- Check the spam/junk folder for `ops.anupaatnivesh@gmail.com`
- EmailJS emails sometimes get filtered as spam

### Step 3: Verify Template Fields

Make sure your EmailJS template (`template_abk1zsr`) includes these fields to display lead data:

- `{{first_name}}` - Will show: 📧 email (if provided)
- `{{last_name}}` - Will show: 📱 phone number
- `{{user_email}}` - Lead's email address
- `{{number}}` - Lead's phone number
- `{{message}}` - Full structured lead data
- `{{subject}}` - Email subject line

### Step 4: Test EmailJS Template Directly

1. Go to EmailJS Dashboard → Templates → `template_abk1zsr`
2. Click **"Test"** button
3. Fill in test values:
   - `first_name`: `📧 test@example.com`
   - `last_name`: `📱 1234567890`
   - `user_email`: `test@example.com`
   - `number`: `1234567890`
   - `message`: `Test lead data`
   - `subject`: `New Sales Lead from ArthAI`
4. Click **"Send Test Email"**
5. Check if the test email arrives at `ops.anupaatnivesh@gmail.com`

### Step 5: Check EmailJS Service Settings

1. Go to EmailJS Dashboard → **Email Services**
2. Find service: `service_f3brm8k`
3. Verify it's connected to your email provider (Gmail, etc.)
4. Check if there are any service errors or limits

### Step 6: Verify EmailJS Account Limits

- Free EmailJS accounts have limits (200 emails/month)
- Check if you've exceeded the limit
- Go to Dashboard → **Usage** to see current usage

### Step 7: Check Browser Console for Detailed Logs

When testing, look for these console logs:

```
📧 sendContactEmails called: { hasEmail: true/false, hasPhone: true/false, ... }
📧 Using EmailJS for email sending
✅ EmailJS library imported successfully
📧 Initializing EmailJS with public key: ***
📧 EmailJS initialized. Service ID: service_f3brm8k
📧 Sending ops email with lead data: { templateId: '...', recipient: '...', ... }
✅ Ops lead notification email sent via EmailJS { status: 200, text: 'OK', recipient: '...' }
```

### Common Issues

1. **Template recipient not set**: The template's "To Email" field is empty or set to a different address
2. **Template uses wrong variable**: Template uses `{{user_email}}` for recipient instead of a fixed email or `{{to_email}}`
3. **Email in spam**: Check spam folder
4. **Service disconnected**: EmailJS service needs to be reconnected to email provider
5. **Rate limiting**: Too many emails sent, hitting EmailJS limits

### Quick Fix

If you want to ensure emails always go to `ops.anupaatnivesh@gmail.com`:

1. Go to EmailJS Dashboard → Templates → `template_abk1zsr`
2. Set **"To Email"** field to: `ops.anupaatnivesh@gmail.com` (hardcoded)
3. Save the template
4. Test again

This ensures emails always go to the ops team regardless of what variables are passed.

