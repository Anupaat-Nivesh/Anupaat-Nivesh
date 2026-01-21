# Quick Start: Production Deployment

## ✅ Status Check

### What's Already Done
- ✅ Razorpay script URL is production-ready (`https://checkout.razorpay.com/v1/checkout.js`)
- ✅ Backend server code is ready
- ✅ Frontend payment integration is ready
- ✅ Backend tested and working locally

### What You Need to Do

1. **Set Production API URL** (5 minutes)
2. **Deploy Backend** (15-30 minutes)
3. **Deploy Frontend** (10 minutes)
4. **Test Everything** (15 minutes)

## 🚀 Step-by-Step Guide

### Step 1: Configure Production API URL

**Frontend Configuration:**

Create or update `.env.production` in the root directory:
```env
REACT_APP_API_BASE_URL=https://api.anupaatnivesh.com
REACT_APP_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
```

**Replace `api.anupaatnivesh.com` with your actual backend domain.**

**Backend Configuration:**

Update `backend/.env`:
```env
FRONTEND_URL=https://www.anupaatnivesh.com
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_production_secret
NODE_ENV=production
```

### Step 2: Deploy Backend

**Choose your deployment method:**

#### Option A: Heroku (Easiest - 10 minutes)

```bash
# Install Heroku CLI (if not installed)
# macOS: brew install heroku/brew/heroku

# Login
heroku login

# Create app
cd backend
heroku create anupaat-nivesh-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
heroku config:set RAZORPAY_KEY_SECRET=your_production_secret
heroku config:set FRONTEND_URL=https://www.anupaatnivesh.com

# Deploy
git push heroku main

# Get your API URL
heroku open
# Your API will be at: https://anupaat-nivesh-api.herokuapp.com
```

#### Option B: VPS/Server (Recommended for Production)

Follow the detailed guide in `BACKEND_DEPLOYMENT.md` → Option 1

Quick summary:
1. Install Node.js 18+ and PM2
2. Clone repository to server
3. Install dependencies: `npm install --production`
4. Create `.env` file with production keys
5. Start with PM2: `pm2 start server.js --name anupaat-api`
6. Configure Nginx reverse proxy
7. Setup SSL with Let's Encrypt

#### Option C: Railway (Modern Alternative)

1. Sign up at https://railway.app
2. Create new project
3. Deploy from GitHub
4. Set root directory to `backend`
5. Add environment variables
6. Deploy automatically

### Step 3: Test Backend

After deployment, test your backend:

```bash
# Health check
curl https://your-api-domain.com/api/health

# Should return:
# {"status":"ok","timestamp":"...","service":"Anupaat Nivesh API"}

# Test order creation
curl -X POST https://your-api-domain.com/api/payments/create-order \
  -H "Content-Type: application/json" \
  -d '{"amount": 99, "currency": "INR"}'

# Should return order_id
```

### Step 4: Update Frontend with Backend URL

Update `.env.production`:
```env
REACT_APP_API_BASE_URL=https://your-actual-backend-url.com
```

### Step 5: Build and Deploy Frontend

```bash
# Build for production
npm run build

# Deploy build/ folder to your hosting:
# - Netlify: Connect GitHub, auto-deploy
# - Vercel: Connect GitHub, auto-deploy
# - cPanel: Upload build/ contents to public_html/
# - Or use your preferred hosting method
```

### Step 6: Test Complete Flow

1. Visit your production website
2. Navigate to consulting session page
3. Fill the booking form
4. Complete test payment
5. Verify booking is created

**Use Razorpay Test Cards:**
- Success: `4111 1111 1111 1111`
- Failure: `4000 0000 0000 0002`

## 📋 Testing Checklist

Quick checklist before going live:

- [ ] Backend health check works
- [ ] Backend order creation works
- [ ] Frontend loads correctly
- [ ] Razorpay checkout opens
- [ ] Test payment succeeds
- [ ] Payment verification works
- [ ] Booking is created
- [ ] Success page displays

See `PRODUCTION_TESTING.md` for detailed testing guide.

## 🔑 Important Notes

1. **Razorpay Keys**: Use production keys (`rzp_live_...`) in production
2. **HTTPS Required**: All URLs must use HTTPS in production
3. **CORS**: Backend `FRONTEND_URL` must match your frontend domain
4. **Environment Variables**: Never commit `.env` files to Git

## 📚 Full Documentation

For detailed information, see:

- **PRODUCTION_CONFIG.md** - Complete configuration guide
- **PRODUCTION_TESTING.md** - Comprehensive testing checklist
- **BACKEND_DEPLOYMENT.md** - Detailed backend deployment steps
- **PRODUCTION_DEPLOYMENT.md** - Full deployment guide

## 🐛 Common Issues

**Backend not responding:**
- Check if server is running
- Verify environment variables
- Check server logs

**Payment not working:**
- Verify Razorpay keys are production keys
- Check backend is accessible
- Verify API base URL in frontend

**CORS errors:**
- Check `FRONTEND_URL` in backend `.env`
- Verify frontend domain matches

## ✅ You're Ready!

Once you've:
1. ✅ Set production API URL
2. ✅ Deployed backend
3. ✅ Tested backend endpoints
4. ✅ Deployed frontend
5. ✅ Tested complete flow

**You're ready to go live!** 🚀

## 📞 Need Help?

Refer to:
- `BACKEND_DEPLOYMENT.md` for backend issues
- `PRODUCTION_TESTING.md` for testing issues
- `PRODUCTION_CONFIG.md` for configuration issues

