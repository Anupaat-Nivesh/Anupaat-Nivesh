# Portfolio Review Form Testing Guide

## Form Configuration

### Current Setup
- **Form Type**: `portfolio_review`
- **Source**: `homepage` (can be `hero_section` for hero CTA)
- **Email Template**: Reuses existing `template_agep8yl` from Config.js
- **Email Service**: `service_f3brm8k`

### Subject Line Logic

The subject line changes based on:
1. **Form Type**: `portfolio_review` vs `consultation`
2. **Source**: `hero_section` vs `homepage`

**Subject Examples:**
- Hero Section + Portfolio Review: `Portfolio Review Request - Hero Section`
- Homepage + Portfolio Review: `Portfolio Review Request - Homepage`
- Hero Section + Consultation: `Consultation Request - Hero Section`
- Homepage + Consultation: `Consultation Request - Homepage`

### Message Field Structure

The hidden message field contains:
```
[Subject Line]

Financial Goal: [Selected Goal]
Source: [source]

This is a [Portfolio Review/Free Consultation] request from [the hero section/the homepage section].
```

## Testing Steps

### 1. Test Form Submission
1. Navigate to homepage
2. Scroll to "#portfolio-review" section
3. Fill out the form:
   - First Name: Test
   - Last Name: User
   - Email: test@example.com (or leave empty)
   - Phone: +91 9876543210
   - Goal: Retirement Planning
4. Click "Get Free Portfolio Review"
5. Check email inbox for submission

### 2. Verify Email Content
- Subject should be: "Portfolio Review Request - Homepage"
- Message should contain:
  - Financial Goal
  - Source: homepage
  - Request type description

### 3. Test from Hero Section (Future Enhancement)
To test hero section source:
1. Update Home.jsx to pass `source="hero_section"` when form is accessed via hero CTA
2. Subject should change to: "Portfolio Review Request - Hero Section"

## EmailJS Template Fields

The form sends these fields to EmailJS:
- `first_name`: User's first name
- `last_name`: User's last name
- `user_email`: User's email (optional)
- `number`: User's phone number
- `message`: Contains subject, goal, source, and request type

## Expected Behavior

1. ✅ Form validates all required fields
2. ✅ Uses existing EmailJS configuration
3. ✅ Subject differentiates by source
4. ✅ Redirects to thank you page after submission
5. ✅ Thank you page shows correct form type and goal

