# Environment Setup Guide

## Overview

This guide explains where and how to configure environment variables for different environments (development, testing, production).

## Environment Files Structure

### Frontend (This Repository)

#### `.env` - Development/Testing
- **Location**: Root of project (`.env`)
- **Purpose**: Local development and testing
- **Git**: Ignored (in `.gitignore`)
- **Contains**: Test credentials, local API URLs

#### `.env.production` - Production Build
- **Location**: Root of project (`.env.production`)
- **Purpose**: Production build configuration
- **Git**: Can be committed (with placeholder values) or managed via CI/CD
- **Contains**: Production credentials, production API URLs

#### `.env.example` - Template
- **Location**: Root of project (`.env.example`)
- **Purpose**: Template for other developers
- **Git**: Committed
- **Contains**: Placeholder values, documentation

---

## Where to Update Secrets

### For Development/Testing

**File**: `.env` (in project root)

```env
# Test/Development Credentials
REACT_APP_RAZORPAY_KEY_ID=rzp_test_S47IhMgCxOsrbn
REACT_APP_API_BASE_URL=http://localhost:8000
REACT_APP_CALENDLY_CONSULTING_URL=https://calendly.com/anupaatnivesh/financial-planning-session
```

**How to Update:**
1. Open `.env` file in root directory
2. Update the values directly
3. Restart development server: `npm start`

---

### For Production

**Option 1: `.env.production` file (Recommended for React)**

**File**: `.env.production` (in project root)

```env
# Production Credentials
REACT_APP_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
REACT_APP_API_BASE_URL=https://api.anupaatnivesh.com
REACT_APP_CALENDLY_CONSULTING_URL=https://calendly.com/anupaatnivesh/financial-planning-session
REACT_APP_BASE_URL=https://www.anupaatnivesh.com
```

**How to Use:**
1. Create `.env.production` file
2. Add production values
3. Build: `npm run build` (automatically uses `.env.production`)

**Option 2: CI/CD Environment Variables (Recommended for Deployment)**

**Platforms**: Vercel, Netlify, GitHub Actions, etc.

**Vercel Example:**
1. Go to Project Settings > Environment Variables
2. Add variables:
   - `REACT_APP_RAZORPAY_KEY_ID` = `rzp_live_xxxxxxxxxxxxx`
   - `REACT_APP_API_BASE_URL` = `https://api.anupaatnivesh.com`
   - etc.
3. Deploy (variables are injected during build)

**Netlify Example:**
1. Go to Site Settings > Environment Variables
2. Add variables
3. Redeploy

---

## Secret Management by Type

### Frontend Secrets (Public - Safe to expose)

These are **public keys** that can be in frontend code:

✅ **Safe in Frontend:**
- `REACT_APP_RAZORPAY_KEY_ID` - Public key (starts with `rzp_test_` or `rzp_live_`)
- `REACT_APP_EMAILJS_PUBLIC_KEY` - Public key
- `REACT_APP_CALENDLY_CONSULTING_URL` - Public URL
- `REACT_APP_WHATSAPP_NUMBER` - Public number

### Backend Secrets (Private - Never in frontend)

These must **ONLY** be in backend:

❌ **Never in Frontend:**
- `RAZORPAY_KEY_SECRET` - Secret key (starts with secret)
- `RAZORPAY_KEY_SECRET` = `Fvj0EC80HEhLNMO5O2yVw8v9` ⚠️
- Database passwords
- API tokens
- Private keys

**Backend `.env` file:**
```env
# Backend .env (separate repository)
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=Fvj0EC80HEhLNMO5O2yVw8v9  # ⚠️ Backend only!
DATABASE_URL=postgresql://...
```

---

## Environment-Specific Configuration

### Development Environment

**File**: `.env`

```env
# Development
REACT_APP_RAZORPAY_KEY_ID=rzp_test_S47IhMgCxOsrbn
REACT_APP_API_BASE_URL=http://localhost:8000
REACT_APP_BASE_URL=http://localhost:3000
```

**Usage:**
```bash
npm start  # Uses .env automatically
```

---

### Testing/Staging Environment

**File**: `.env.staging` (optional)

```env
# Staging
REACT_APP_RAZORPAY_KEY_ID=rzp_test_S47IhMgCxOsrbn
REACT_APP_API_BASE_URL=https://staging-api.anupaatnivesh.com
REACT_APP_BASE_URL=https://staging.anupaatnivesh.com
```

**Usage:**
```bash
# Copy staging env
cp .env.staging .env
npm start
```

---

### Production Environment

**File**: `.env.production`

```env
# Production
REACT_APP_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
REACT_APP_API_BASE_URL=https://api.anupaatnivesh.com
REACT_APP_BASE_URL=https://www.anupaatnivesh.com
REACT_APP_CALENDLY_CONSULTING_URL=https://calendly.com/anupaatnivesh/financial-planning-session
```

**Usage:**
```bash
npm run build  # Automatically uses .env.production
```

---

## Quick Reference: What to Change Where

### For Testing (Development)

**Update**: `.env` file

```env
# Change these for testing:
REACT_APP_RAZORPAY_KEY_ID=rzp_test_S47IhMgCxOsrbn  # Test key
REACT_APP_API_BASE_URL=http://localhost:8000      # Local backend
```

### For Production

**Update**: `.env.production` OR CI/CD environment variables

```env
# Change these for production:
REACT_APP_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx  # Production key
REACT_APP_API_BASE_URL=https://api.anupaatnivesh.com  # Production API
REACT_APP_BASE_URL=https://www.anupaatnivesh.com      # Production URL
```

---

## Step-by-Step: Switching Environments

### Switch to Production Mode

1. **Create/Update `.env.production`:**
   ```bash
   cp .env .env.production
   # Edit .env.production with production values
   ```

2. **Update values:**
   - Change `rzp_test_` → `rzp_live_`
   - Change `localhost:8000` → `https://api.anupaatnivesh.com`
   - Change `localhost:3000` → `https://www.anupaatnivesh.com`

3. **Build:**
   ```bash
   npm run build
   ```

4. **Deploy:**
   - Deploy `build/` folder to your hosting

### Switch Back to Development

1. **Use `.env` file:**
   ```bash
   # .env already has development values
   npm start
   ```

---

## Best Practices

### ✅ DO:

1. **Use `.env` for development** - Local testing
2. **Use `.env.production` for production builds** - Production values
3. **Use CI/CD variables for deployment** - Most secure
4. **Keep `.env.example` updated** - Template for team
5. **Never commit `.env`** - Already in `.gitignore`
6. **Document all variables** - In `.env.example`

### ❌ DON'T:

1. **Don't commit `.env` with real secrets** - Already ignored
2. **Don't put backend secrets in frontend** - Security risk
3. **Don't hardcode values** - Use environment variables
4. **Don't use production keys in development** - Use test keys

---

## Razorpay Keys: Test vs Production

### Test Keys (Development)
```env
REACT_APP_RAZORPAY_KEY_ID=rzp_test_S47IhMgCxOsrbn
```
- Starts with `rzp_test_`
- Safe for development
- Use Razorpay test dashboard

### Production Keys (Live)
```env
REACT_APP_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
```
- Starts with `rzp_live_`
- Only for production
- Use Razorpay live dashboard

**Where to get keys:**
- **Test**: Razorpay Dashboard > Settings > API Keys > Test Mode
- **Production**: Razorpay Dashboard > Settings > API Keys > Live Mode

---

## Checklist

### Before Testing
- [ ] `.env` has test Razorpay key (`rzp_test_`)
- [ ] `.env` has local API URL (`http://localhost:8000`)
- [ ] All required variables are set
- [ ] Development server restarted

### Before Production
- [ ] `.env.production` has production Razorpay key (`rzp_live_`)
- [ ] `.env.production` has production API URL
- [ ] `.env.production` has production base URL
- [ ] Backend has production Razorpay secret key
- [ ] All variables tested in staging first

---

## Troubleshooting

### Variables Not Updating?

1. **Restart dev server** after changing `.env`
2. **Clear cache**: `rm -rf node_modules/.cache`
3. **Check variable names**: Must start with `REACT_APP_`
4. **Check file location**: `.env` must be in project root

### Production Build Not Using Correct Values?

1. **Check `.env.production` exists**
2. **Verify variable names** match
3. **Rebuild**: `npm run build`
4. **Check build output** for values

---

## Summary

| Environment | File | Razorpay Key | API URL |
|------------|------|--------------|---------|
| **Development** | `.env` | `rzp_test_...` | `http://localhost:8000` |
| **Testing** | `.env` | `rzp_test_...` | `http://localhost:8000` |
| **Production** | `.env.production` | `rzp_live_...` | `https://api.anupaatnivesh.com` |

**Remember:**
- Frontend `.env` = Public keys only
- Backend `.env` = Secret keys (separate repository)
- Update `.env` for testing
- Update `.env.production` for production

