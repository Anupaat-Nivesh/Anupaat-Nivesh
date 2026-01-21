# Railway Backend Deployment Guide (Recommended)

## 🚀 Why Railway?

- ✅ Perfect for Node.js/Express backends
- ✅ Free tier available ($5 credit/month)
- ✅ Auto-deploy from GitHub
- ✅ Easy environment variable management
- ✅ Automatic HTTPS
- ✅ Simple setup

## 📋 Prerequisites

- GitHub account
- Railway account (sign up at https://railway.app)
- Backend code ready in `backend/` folder

## 🚀 Step-by-Step Deployment

### Step 1: Sign Up for Railway

1. Go to https://railway.app
2. Click "Start a New Project"
3. Sign up with GitHub (recommended)

### Step 2: Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Authorize Railway to access your GitHub
4. Select your repository: `Anupaat-Nivesh`
5. Click **"Deploy Now"**

### Step 3: Configure Project Settings

1. **Set Root Directory:**
   - Go to Settings → Source
   - Set **Root Directory** to: `backend`
   - This tells Railway where your backend code is

2. **Set Start Command:**
   - Go to Settings → Deploy
   - Start Command: `node server.js`
   - Or leave default (Railway auto-detects)

### Step 4: Add Environment Variables

Go to **Variables** tab and add:

```env
PORT=8000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.vercel.app
RAZORPAY_KEY_ID=rzp_live_S46rOVxN6EPLPl
RAZORPAY_KEY_SECRET=C6D1F9oxRsgYmQ2ejxGBmwHy
```

**Important:** Replace `your-frontend-url.vercel.app` with your actual Vercel frontend URL after deploying frontend.

### Step 5: Deploy

Railway will automatically:
- Install dependencies (`npm install`)
- Start your server (`node server.js`)
- Provide a public URL

### Step 6: Get Your Backend URL

1. Go to **Settings** → **Networking**
2. Click **"Generate Domain"**
3. Copy the URL (e.g., `https://anupaat-backend.up.railway.app`)

**Or use the default Railway domain:**
- Check the **Deployments** tab
- Your URL will be shown there

### Step 7: Update Frontend

After getting backend URL, update frontend environment variables:

**In Vercel (or your frontend hosting):**
```
REACT_APP_API_BASE_URL=https://your-backend-url.up.railway.app
```

## 🔧 Railway Configuration

### Automatic Deployments

Railway automatically deploys when you:
- Push to main branch
- Merge pull requests

### Manual Deployments

1. Go to **Deployments** tab
2. Click **"Redeploy"**

### View Logs

1. Go to **Deployments** tab
2. Click on a deployment
3. View logs in real-time

## 📊 Monitoring

### Health Checks

Railway automatically monitors your app. Check:
- **Deployments** tab for deployment status
- **Metrics** tab for usage stats

### Custom Domain (Optional)

1. Go to **Settings** → **Networking**
2. Click **"Custom Domain"**
3. Add your domain (e.g., `api.anupaatnivesh.com`)
4. Update DNS records as instructed

## 🐛 Troubleshooting

### Deployment Fails

**Check:**
1. Root directory is set to `backend`
2. Environment variables are set
3. `package.json` has correct start script
4. Check logs in Railway dashboard

### Backend Not Starting

**Check logs:**
1. Go to **Deployments** tab
2. Click on latest deployment
3. Check error messages

**Common issues:**
- Missing environment variables
- Wrong root directory
- Port conflict (Railway sets PORT automatically)

### CORS Errors

**Verify:**
- `FRONTEND_URL` in Railway matches your frontend domain
- Frontend URL uses `https://` (not `http://`)

## 💰 Pricing

- **Free Tier:** $5 credit/month
- **Hobby Plan:** $5/month (if you exceed free tier)
- **Pro Plan:** $20/month (for production)

For a single backend API, free tier is usually sufficient.

## ✅ Post-Deployment Checklist

- [ ] Backend deployed successfully
- [ ] Health check works: `curl https://your-backend-url.up.railway.app/api/health`
- [ ] Environment variables set
- [ ] Frontend URL updated in backend env vars
- [ ] Frontend `REACT_APP_API_BASE_URL` updated
- [ ] Test payment order creation
- [ ] Test payment verification

## 🎯 Next Steps

1. ✅ Deploy backend to Railway
2. ✅ Get backend URL
3. ✅ Deploy frontend to Vercel
4. ✅ Update frontend with backend URL
5. ✅ Test complete flow
6. ✅ Go live! 🚀

## 📞 Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway

