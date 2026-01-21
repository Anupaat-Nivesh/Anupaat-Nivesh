# Quick Deployment Guide - Vercel + Railway

## 🎯 Recommended Setup

- **Frontend:** Vercel (Free, perfect for React)
- **Backend:** Railway (Free tier, perfect for Express.js)

## 🚀 Quick Start (15 minutes)

### Part 1: Deploy Backend to Railway (5 min)

1. **Sign up:** https://railway.app (use GitHub)
2. **New Project** → **Deploy from GitHub repo**
3. **Select repository:** `Anupaat-Nivesh`
4. **Settings** → **Root Directory:** `backend`
5. **Variables** → Add:
   ```
   PORT=8000
   NODE_ENV=production
   FRONTEND_URL=https://your-app.vercel.app (update after frontend deploy)
   RAZORPAY_KEY_ID=rzp_live_S46rOVxN6EPLPl
   RAZORPAY_KEY_SECRET=C6D1F9oxRsgYmQ2ejxGBmwHy
   ```
6. **Get URL:** Settings → Networking → Generate Domain
7. **Copy URL:** `https://your-backend.up.railway.app`

### Part 2: Deploy Frontend to Vercel (5 min)

1. **Install CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```
   - Follow prompts
   - Project name: `anupaat-nivesh`
   - Directory: `.`

4. **Add Environment Variables:**
   ```bash
   vercel env add REACT_APP_API_BASE_URL
   # Enter: https://your-backend.up.railway.app (from step 1)
   
   vercel env add REACT_APP_RAZORPAY_KEY_ID
   # Enter: rzp_live_S46rOVxN6EPLPl
   
   # Add all other REACT_APP_* variables
   ```

   Or via Dashboard:
   - Go to project → Settings → Environment Variables
   - Add all variables from `.env`

5. **Redeploy:**
   ```bash
   vercel --prod
   ```

6. **Get Frontend URL:** `https://your-app.vercel.app`

### Part 3: Update Backend with Frontend URL (2 min)

1. Go to Railway dashboard
2. **Variables** → Update `FRONTEND_URL`:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```
3. Railway auto-redeploys

### Part 4: Test (3 min)

1. **Test Backend:**
   ```bash
   curl https://your-backend.up.railway.app/api/health
   ```

2. **Test Frontend:**
   - Visit your Vercel URL
   - Try booking flow
   - Test payment

## ✅ Environment Variables Summary

### Railway (Backend)
```
PORT=8000
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
RAZORPAY_KEY_ID=rzp_live_S46rOVxN6EPLPl
RAZORPAY_KEY_SECRET=C6D1F9oxRsgYmQ2ejxGBmwHy
```

### Vercel (Frontend)
```
REACT_APP_API_BASE_URL=https://your-backend.up.railway.app
REACT_APP_RAZORPAY_KEY_ID=rzp_live_S46rOVxN6EPLPl
REACT_APP_BASE_URL=https://your-app.vercel.app
REACT_APP_CONSULTING_SESSION_PRICE=99
REACT_APP_CONSULTING_SESSION_ACTUAL_PRICE=9999
REACT_APP_CALENDLY_CONSULTING_URL=https://calendly.com/anupaatnivesh/financial-planning-session
REACT_APP_WHATSAPP_NUMBER=919501195200
# ... all other REACT_APP_* variables
```

## 🎯 Deployment Order

1. ✅ Deploy backend first (Railway)
2. ✅ Get backend URL
3. ✅ Deploy frontend (Vercel)
4. ✅ Get frontend URL
5. ✅ Update backend `FRONTEND_URL`
6. ✅ Update frontend `REACT_APP_API_BASE_URL`
7. ✅ Redeploy both
8. ✅ Test!

## 📋 Checklist

- [ ] Backend deployed to Railway
- [ ] Backend URL obtained
- [ ] Frontend deployed to Vercel
- [ ] Frontend URL obtained
- [ ] Backend `FRONTEND_URL` updated
- [ ] Frontend `REACT_APP_API_BASE_URL` updated
- [ ] All environment variables set
- [ ] Both services redeployed
- [ ] Health check works
- [ ] Payment flow tested

## 🚀 Ready to Deploy!

Follow the steps above. Total time: ~15 minutes.

Need help? Check:
- `RAILWAY_BACKEND_DEPLOYMENT.md` for detailed Railway guide
- `VERCEL_DEPLOYMENT.md` for detailed Vercel guide

