# Production Configuration Guide

This guide helps you configure the application for production deployment with Razorpay payment integration.

## ✅ Razorpay Configuration Status

### Frontend (Already Configured)
- ✅ Razorpay Checkout Script: `https://checkout.razorpay.com/v1/checkout.js` (Production URL)
- ✅ Script loads dynamically from Razorpay CDN
- ⚠️ **Action Required**: Set `REACT_APP_RAZORPAY_KEY_ID` with production key (`rzp_live_...`)

### Backend (Already Configured)
- ✅ Razorpay SDK uses production API automatically with production keys
- ⚠️ **Action Required**: Set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` with production keys

## 🔧 Environment Variables Setup

### Frontend Environment Variables

Create `.env.production` file in the root directory:

```env
# API Configuration - UPDATE THIS WITH YOUR PRODUCTION BACKEND URL
REACT_APP_API_BASE_URL=https://api.anupaatnivesh.com

# Razorpay Production Keys - UPDATE WITH YOUR LIVE KEYS
REACT_APP_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx

# Pricing Configuration
REACT_APP_CONSULTING_SESSION_PRICE=999
REACT_APP_CONSULTING_SESSION_ACTUAL_PRICE=999

# Calendly Integration
REACT_APP_CALENDLY_CONSULTING_URL=https://calendly.com/anupaatnivesh/financial-planning-session

# WhatsApp Integration
REACT_APP_WHATSAPP_NUMBER=919501152200

# Site Configuration
REACT_APP_BASE_URL=https://www.anupaatnivesh.com

# EmailJS (if using)
REACT_APP_EMAILJS_SERVICE_ID=service_xxxxx
REACT_APP_EMAILJS_TEMPLATE_ID=template_xxxxx
REACT_APP_EMAILJS_PUBLIC_KEY=xxxxx
```

### Backend Environment Variables

Create `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=8000
NODE_ENV=production

# Frontend URL (for CORS)
FRONTEND_URL=https://www.anupaatnivesh.com

# Razorpay Production Keys - UPDATE WITH YOUR LIVE KEYS
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_production_secret_key_here

# Database (if using in future)
# DATABASE_URL=your_database_connection_string
```

## 🔑 Getting Razorpay Production Keys

1. **Login to Razorpay Dashboard:**
   - Go to https://dashboard.razorpay.com
   - Login with your account

2. **Switch to Live Mode:**
   - Click on the mode switcher (top right)
   - Select "Live Mode"

3. **Get API Keys:**
   - Go to Settings → API Keys
   - Click "Generate Key" if you haven't already
   - Copy:
     - **Key ID**: Starts with `rzp_live_...`
     - **Key Secret**: Starts with `secret_...`

4. **Important Notes:**
   - ⚠️ **Never share your Key Secret** publicly
   - ⚠️ **Key Secret is only used in backend** (server-side)
   - ✅ **Key ID is safe for frontend** (public)

## 🌐 API Base URL Configuration

### For Development/Testing:
```env
REACT_APP_API_BASE_URL=http://localhost:8000
```

### For Production:
```env
REACT_APP_API_BASE_URL=https://api.anupaatnivesh.com
```

**Replace `api.anupaatnivesh.com` with your actual backend domain.**

## 📝 Configuration Checklist

### Frontend Configuration
- [ ] `.env.production` file created
- [ ] `REACT_APP_API_BASE_URL` set to production backend URL
- [ ] `REACT_APP_RAZORPAY_KEY_ID` set to production key (`rzp_live_...`)
- [ ] All other environment variables configured
- [ ] Build tested with production environment

### Backend Configuration
- [ ] `backend/.env` file created
- [ ] `RAZORPAY_KEY_ID` set to production key (`rzp_live_...`)
- [ ] `RAZORPAY_KEY_SECRET` set to production secret
- [ ] `FRONTEND_URL` set to production frontend URL
- [ ] `NODE_ENV` set to `production`
- [ ] Server tested and running

## 🧪 Testing Production Configuration

### 1. Test Backend Health Check
```bash
curl https://api.anupaatnivesh.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "Anupaat Nivesh API"
}
```

### 2. Test Payment Order Creation
```bash
curl -X POST https://api.anupaatnivesh.com/api/payments/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 99,
    "currency": "INR",
    "userData": {
      "email": "test@example.com",
      "firstName": "Test",
      "lastName": "User"
    },
    "bookingData": {
      "bookingReference": "TEST123"
    }
  }'
```

Expected response:
```json
{
  "order_id": "order_xxxxxxxxxxxxx",
  "amount": 9900,
  "currency": "INR",
  "status": "created",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

### 3. Test Frontend Build
```bash
# Build with production environment
npm run build

# Test the build locally
npx serve -s build -l 3000
```

Visit `http://localhost:3000` and test:
- [ ] Page loads correctly
- [ ] API calls work (check browser console)
- [ ] Razorpay script loads
- [ ] Payment flow works (use test mode first)

## 🔒 Security Reminders

1. **Never commit `.env` files** to Git
2. **Use production keys only in production**
3. **Keep Key Secret secure** (backend only)
4. **Enable HTTPS** for all production URLs
5. **Set proper CORS** on backend

## 📞 Next Steps

1. ✅ Configure environment variables
2. ✅ Test backend API endpoints
3. ✅ Test frontend build
4. ✅ Deploy backend (see `BACKEND_DEPLOYMENT.md`)
5. ✅ Deploy frontend
6. ✅ Run full payment flow test

## 🐛 Troubleshooting

### Razorpay Script Not Loading
- Check browser console for errors
- Verify network connectivity
- Check if Razorpay CDN is accessible

### Payment Order Creation Fails
- Verify backend is running
- Check `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in backend
- Check backend logs for errors
- Verify API base URL in frontend

### CORS Errors
- Verify `FRONTEND_URL` in backend `.env` matches frontend domain
- Check backend CORS configuration

### Payment Verification Fails
- Verify backend is accessible
- Check payment signature verification logic
- Review backend logs

