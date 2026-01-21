# Production Setup Summary

Quick reference guide for production deployment with Razorpay integration.

## ✅ Current Configuration Status

### Razorpay URLs
- ✅ **Frontend Script**: `https://checkout.razorpay.com/v1/checkout.js` (Production URL - Already configured)
- ✅ **Backend SDK**: Uses production API automatically with production keys

### Environment Variables Needed

#### Frontend (`.env.production`)
```env
REACT_APP_API_BASE_URL=https://api.anupaatnivesh.com
REACT_APP_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
```

#### Backend (`backend/.env`)
```env
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_production_secret
FRONTEND_URL=https://www.anupaatnivesh.com
```

## 🚀 Quick Deployment Steps

### 1. Update Production API URL

**For Frontend:**
- Create `.env.production` file
- Set `REACT_APP_API_BASE_URL` to your production backend URL
- Example: `REACT_APP_API_BASE_URL=https://api.anupaatnivesh.com`

**For Backend:**
- Update `backend/.env`
- Set `FRONTEND_URL` to your production frontend URL
- Example: `FRONTEND_URL=https://www.anupaatnivesh.com`

### 2. Deploy Backend

Choose one method:

**Option A: VPS/Server (Recommended)**
- Follow: `BACKEND_DEPLOYMENT.md` → Option 1
- Uses PM2 + Nginx + SSL

**Option B: Heroku (Easiest)**
- Follow: `BACKEND_DEPLOYMENT.md` → Option 2
- Quick setup, managed platform

**Option C: Railway**
- Follow: `BACKEND_DEPLOYMENT.md` → Option 3
- Modern, auto-deploy from GitHub

### 3. Test Backend

```bash
# Health check
curl https://api.anupaatnivesh.com/api/health

# Create test order
curl -X POST https://api.anupaatnivesh.com/api/payments/create-order \
  -H "Content-Type: application/json" \
  -d '{"amount": 99, "currency": "INR"}'
```

### 4. Deploy Frontend

**Build:**
```bash
npm run build
```

**Deploy to:**
- Netlify/Vercel (recommended for static hosting)
- Your hosting provider
- See `PRODUCTION_DEPLOYMENT.md` for details

### 5. Test Complete Flow

Follow: `PRODUCTION_TESTING.md`

## 📚 Documentation Files

1. **PRODUCTION_CONFIG.md** - Environment setup and configuration
2. **PRODUCTION_TESTING.md** - Complete testing checklist
3. **BACKEND_DEPLOYMENT.md** - Step-by-step backend deployment
4. **PRODUCTION_DEPLOYMENT.md** - Full deployment guide

## 🔑 Key Points

1. **Razorpay URLs**: Already configured for production ✅
2. **API Base URL**: Must be set in `.env.production` ⚠️
3. **Razorpay Keys**: Use production keys (`rzp_live_...`) ⚠️
4. **Backend Required**: Payment processing needs backend server ⚠️
5. **HTTPS Required**: All production URLs must use HTTPS ⚠️

## 🧪 Testing Checklist

Before going live:
- [ ] Backend health check works
- [ ] Payment order creation works
- [ ] Razorpay checkout opens
- [ ] Test payment succeeds
- [ ] Payment verification works
- [ ] Booking creation works

See `PRODUCTION_TESTING.md` for complete checklist.

## 🎯 Next Steps

1. ✅ Review `PRODUCTION_CONFIG.md` for environment setup
2. ✅ Deploy backend using `BACKEND_DEPLOYMENT.md`
3. ✅ Update frontend `.env.production` with backend URL
4. ✅ Test using `PRODUCTION_TESTING.md`
5. ✅ Deploy frontend
6. ✅ Go live! 🚀

## 📞 Quick Troubleshooting

**Backend not responding:**
- Check if server is running: `pm2 status`
- Check logs: `pm2 logs anupaat-api`
- Verify environment variables

**Payment not working:**
- Verify Razorpay keys are production keys
- Check backend is accessible
- Verify API base URL in frontend

**CORS errors:**
- Check `FRONTEND_URL` in backend `.env`
- Verify frontend domain matches

## 🔒 Security Reminders

- ✅ Never commit `.env` files
- ✅ Use production keys only in production
- ✅ Keep Key Secret secure (backend only)
- ✅ Enable HTTPS everywhere
- ✅ Verify payment on backend (not frontend)

