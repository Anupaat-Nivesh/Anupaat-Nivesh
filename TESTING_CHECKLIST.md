# Testing Checklist - Website Enhancements

## ✅ Components to Test

### 1. Homepage Hero Section
- [ ] Trust indicators display correctly (AMFI, BSE STAR MF, Experience)
- [ ] Three CTAs are visible and clickable:
  - [ ] "Get Free Portfolio Review" - scrolls to lead form section
  - [ ] "Know Your Risk Profile" - navigates to /calculators
  - [ ] "Talk to an Advisor" - navigates to /contact
- [ ] Value proposition text is clear and outcome-based
- [ ] Hero panel stats display correctly

### 2. Lead Form (Portfolio Review)
- [ ] Form displays on homepage (#portfolio-review section)
- [ ] All fields work: First Name, Last Name, Email, Phone, Goal
- [ ] Validation works (required fields, email format, phone format)
- [ ] Form submission uses existing EmailJS configuration
- [ ] Success toast appears on submission
- [ ] Form resets after successful submission
- [ ] Email subject differentiates: "Free Portfolio Review Request"
- [ ] Message field contains goal and source information

### 3. How We Work Section
- [ ] 4 steps display correctly: Discover → Allocate → Review → Grow
- [ ] Section heading has red background with white text
- [ ] Step cards are responsive
- [ ] CTA button "Get Started Today" works

### 4. WhatsApp CTA
- [ ] Sticky button appears on all pages (bottom-right)
- [ ] Button is visible on mobile and desktop
- [ ] Clicking opens WhatsApp with pre-filled message
- [ ] WhatsApp number is correct (919501195200)
- [ ] Button has pulse animation

### 5. Compliance Disclaimer
- [ ] Displays in footer section
- [ ] All disclaimers are visible:
  - [ ] Risk disclaimer
  - [ ] SEBI registration
  - [ ] AMFI registration
  - [ ] BSE STAR MF mention
  - [ ] No guaranteed returns
  - [ ] Privacy policy link

### 6. SEO & Metadata
- [ ] Page title is optimized
- [ ] Meta description is present
- [ ] Open Graph tags work
- [ ] Twitter Card tags work
- [ ] Canonical URL is set

### 7. Mobile Responsiveness
- [ ] All sections are responsive
- [ ] Lead form works on mobile
- [ ] WhatsApp CTA is properly positioned
- [ ] Touch targets are at least 48px
- [ ] Text is readable on mobile

### 8. Form Integration
- [ ] LeadForm uses existing EmailJS config from Config.js
- [ ] Form fields match EmailJS template structure:
  - [ ] first_name
  - [ ] last_name
  - [ ] user_email
  - [ ] number (phone)
  - [ ] message (contains subject and goal)
- [ ] Different request types are differentiated in message field

## 🔧 Integration Points

### EmailJS Configuration
- Uses existing service ID: `service_f3brm8k`
- Uses existing template ID: `template_agep8yl` (contact form template)
- Uses existing public key: `9UdH6e5xO7yZCJSL5`
- Request type differentiation via message field content

### Form Differentiation
- **Portfolio Review**: Message contains "Free Portfolio Review Request"
- **Consultation**: Message contains "Free Consultation Request"
- Both include: Financial Goal, Source, Request type

## 🐛 Known Issues to Fix

1. **Risk Profile Link**: Changed from `/offerings/risk-profile` to `/calculators` (route doesn't exist)
2. **Phone Input**: Needs to match Contact form styling exactly
3. **Form Validation**: Should match Contact form validation patterns

## 📝 Notes

- All forms reuse existing EmailJS infrastructure
- No new dependencies required
- Backward compatible with existing contact form
- Environment variables can override defaults but fallbacks are in place

