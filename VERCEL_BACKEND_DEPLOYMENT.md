# Deploy Backend to Vercel

## 🚀 Step-by-Step Guide

### Prerequisites
- Vercel account (sign up at https://vercel.com)
- GitHub repository connected
- Backend code ready

### Step 1: Prepare Backend for Vercel

Vercel expects a specific structure. Let's create the necessary files:

#### 1.1 Create `vercel.json` in backend folder

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

#### 1.2 Update `package.json` (if needed)

Make sure `package.json` has:
```json
{
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  }
}
```

### Step 2: Deploy to Vercel

#### Option A: Via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard:**
   - Visit https://vercel.com/dashboard
   - Click "Add New Project"

2. **Import Repository:**
   - Connect your GitHub account (if not already)
   - Select your repository: `Anupaat-Nivesh`

3. **Configure Project:**
   - **Framework Preset:** Other
   - **Root Directory:** `backend` (IMPORTANT!)
   - **Build Command:** Leave empty (or `npm install`)
   - **Output Directory:** Leave empty
   - **Install Command:** `npm install`

4. **Environment Variables:**
   Add these in Vercel dashboard:
   ```
   NODE_ENV=production
   PORT=8000
   FRONTEND_URL=https://www.anupaatnivesh.com
   RAZORPAY_KEY_ID=rzp_live_S46rOVxN6EPLPl
   RAZORPAY_KEY_SECRET=C6D1F9oxRsgYmQ2ejxGBmwHy
   ```
   
   **How to add:**
   - Click "Environment Variables"
   - Add each variable
   - Select "Production" environment
   - Click "Save"

5. **Deploy:**
   - Click "Deploy"
   - Wait for deployment to complete

6. **Get Your Backend URL:**
   - After deployment, Vercel will provide a URL like:
   - `https://anupaat-nivesh-backend.vercel.app`
   - Or you can set a custom domain

#### Option B: Via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Navigate to backend:**
   ```bash
   cd backend
   ```

4. **Deploy:**
   ```bash
   vercel
   ```

5. **Set Environment Variables:**
   ```bash
   vercel env add RAZORPAY_KEY_ID production
   vercel env add RAZORPAY_KEY_SECRET production
   vercel env add FRONTEND_URL production
   vercel env add NODE_ENV production
   ```

6. **Redeploy:**
   ```bash
   vercel --prod
   ```

### Step 3: Configure Custom Domain (Optional)

1. **In Vercel Dashboard:**
   - Go to your project
   - Click "Settings" → "Domains"
   - Add domain: `api.anupaatnivesh.com`
   - Follow DNS configuration instructions

2. **Update DNS:**
   - Add CNAME record in your domain provider:
   - `api` → `cname.vercel-dns.com`

### Step 4: Test Backend

After deployment, test your backend:

```bash
# Replace with your Vercel URL
curl https://your-backend-url.vercel.app/api/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "...",
  "service": "Anupaat Nivesh API"
}
```

### Step 5: Update Frontend Environment

Once backend is deployed, update frontend `.env`:

```env
REACT_APP_API_BASE_URL=https://your-backend-url.vercel.app
```

Or if using custom domain:
```env
REACT_APP_API_BASE_URL=https://api.anupaatnivesh.com
```

## 📋 Vercel Deployment Checklist

- [ ] Created `vercel.json` in backend folder
- [ ] Verified `package.json` has correct scripts
- [ ] Connected GitHub repository
- [ ] Set root directory to `backend`
- [ ] Added all environment variables
- [ ] Deployed successfully
- [ ] Tested health check endpoint
- [ ] Got backend URL
- [ ] Updated frontend `.env` with backend URL

## 🔧 Troubleshooting

### Issue: Build Fails

**Check:**
- Root directory is set to `backend`
- `package.json` exists in backend folder
- All dependencies are listed in `package.json`

### Issue: Environment Variables Not Working

**Solution:**
- Verify variables are set in Vercel dashboard
- Make sure they're set for "Production" environment
- Redeploy after adding variables

### Issue: CORS Errors

**Solution:**
- Verify `FRONTEND_URL` in Vercel environment variables
- Should be: `https://www.anupaatnivesh.com`
- Redeploy after updating

### Issue: Port Error

**Solution:**
- Vercel automatically assigns port
- Remove `PORT` from environment variables or set to empty
- Vercel handles port assignment

## 📝 Important Notes

1. **Root Directory:** Must be set to `backend` in Vercel settings
2. **Environment Variables:** Must be set in Vercel dashboard
3. **Custom Domain:** Optional but recommended for production
4. **Auto-Deploy:** Vercel auto-deploys on git push (if connected)

## 🎯 Next Steps

After backend is deployed:
1. ✅ Get backend URL from Vercel
2. ✅ Update frontend `.env` with backend URL
3. ✅ Deploy frontend to Hostinger
4. ✅ Test complete payment flow

## 🔗 Useful Links

- Vercel Dashboard: https://vercel.com/dashboard
- Vercel Docs: https://vercel.com/docs
- Node.js on Vercel: https://vercel.com/docs/concepts/functions/serverless-functions

