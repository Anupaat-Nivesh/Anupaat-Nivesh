# Portfolio Review Form - Testing & Configuration

## ✅ Form Configuration

### Current Setup
- **Form Type**: `portfolio_review`
- **Source**: `homepage` (can be changed to `hero_section`)
- **Email Template**: Reuses existing `template_agep8yl` from `Config.js`
- **Email Service**: `service_f3brm8k` (existing)
- **Public Key**: `9UdH6e5xO7yZCJSL5` (existing)

### Subject Line Logic

The subject line **automatically changes** based on:
1. **Form Type**: `portfolio_review` vs `consultation`
2. **Source**: `hero_section` vs `homepage`

**Subject Examples:**
- ✅ Hero Section + Portfolio Review: `Portfolio Review Request - Hero Section`
- ✅ Homepage + Portfolio Review: `Portfolio Review Request - Homepage`
- ✅ Hero Section + Consultation: `Consultation Request - Hero Section`
- ✅ Homepage + Consultation: `Consultation Request - Homepage`

### Message Field Structure

The hidden message field contains:
```
[Subject Line]

Financial Goal: [Selected Goal]
Source: [source]

This is a [Portfolio Review/Free Consultation] request from [the hero section/the homepage section].
```

## 📧 EmailJS Template Fields

The form sends these fields to EmailJS (matching Contact form structure):
- `first_name`: User's first name
- `last_name`: User's last name
- `user_email`: User's email (optional)
- `number`: User's phone number
- `message`: Contains subject, goal, source, and request type

## 🧪 Testing Steps

### Test 1: Homepage Portfolio Review Form
1. Navigate to homepage: `http://localhost:3000`
2. Scroll to "#portfolio-review" section
3. Fill out the form:
   - First Name: Test
   - Last Name: User
   - Email: test@example.com (optional)
   - Phone: +91 9876543210
   - Goal: Retirement Planning
4. Click "Get Free Portfolio Review"
5. **Expected**: 
   - Success toast appears
   - Redirects to `/thank-you?type=portfolio_review&goal=Retirement%20Planning`
   - Email sent with subject: "Portfolio Review Request - Homepage"

### Test 2: Verify Email Content
Check your email inbox (configured in EmailJS):
- **Subject**: "Portfolio Review Request - Homepage"
- **Message should contain**:
  ```
  Portfolio Review Request - Homepage

  Financial Goal: Retirement Planning
  Source: homepage

  This is a Portfolio Review request from the homepage section.
  ```

### Test 3: Hero Section Source (Future)
To test from hero section:
1. Update `Home.jsx` line 114: `source="hero_section"`
2. Subject will change to: "Portfolio Review Request - Hero Section"
3. Message will say: "from the hero section"

## 🔧 Configuration

### Current Implementation
```jsx
<LeadForm 
  formType="portfolio_review"
  source="homepage"  // Can be changed to "hero_section"
/>
```

### To Use from Hero Section
When user clicks "Get Free Portfolio Review" button in hero:
```jsx
<LeadForm 
  formType="portfolio_review"
  source="hero_section"  // Different subject line
/>
```

## ✅ Verification Checklist

- [x] Form uses existing EmailJS configuration
- [x] Form reuses existing email template (`template_agep8yl`)
- [x] Subject changes based on source (hero_section vs homepage)
- [x] Message field contains all differentiation info
- [x] Form validation works
- [x] Redirects to thank you page
- [x] Thank you page shows correct form type and goal

## 📝 Notes

- **No new EmailJS template needed** - reuses existing contact form template
- **Subject differentiation** happens in the message field content
- **Source tracking** helps identify where leads come from
- **Form structure** matches Contact form for compatibility

## 🐛 Troubleshooting

### Email not received?
1. Check EmailJS dashboard for logs
2. Verify service ID, template ID, and public key in `Config.js`
3. Check spam folder

### Subject not changing?
1. Verify `source` prop is passed correctly
2. Check `getSubject()` function logic
3. Verify formType prop is set correctly

### Form not submitting?
1. Check browser console for errors
2. Verify all required fields are filled
3. Check EmailJS service status

