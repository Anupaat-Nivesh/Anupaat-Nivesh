# Vercel Deployment Guide

## ⚠️ Important Note About Backend

**Vercel is optimized for:**
- ✅ Frontend/React apps (perfect!)
- ✅ Serverless functions (API routes)
- ❌ **NOT ideal for persistent Express.js servers**

**For your Express backend, consider:**
- **Railway** (Recommended - Easy, $5/month)
- **Render** (Free tier available)
- **Hostinger** (If you have hosting)
- **DigitalOcean App Platform**

However, if you want to use Vercel, we can convert your backend to serverless functions.

## 🚀 Option 1: Deploy Frontend to Vercel + Backend to Railway (Recommended)

### Frontend on Vercel (Easy & Free)

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Login to Vercel
```bash
vercel login
```

#### Step 3: Deploy Frontend
```bash
# In project root
vercel
```

Follow prompts:
- Set up and deploy? **Yes**
- Which scope? (Your account)
- Link to existing project? **No**
- Project name: `anupaat-nivesh` (or your choice)
- Directory: `.` (current directory)
- Override settings? **No**

#### Step 4: Configure Environment Variables

After first deployment, add environment variables:

```bash
vercel env add REACT_APP_API_BASE_URL
# Enter: https://your-backend-url.railway.app (or your backend URL)

vercel env add REACT_APP_RAZORPAY_KEY_ID
# Enter: rzp_live_S46rOVxN6EPLPl

vercel env add REACT_APP_BASE_URL
# Enter: https://your-vercel-app.vercel.app

# Add all other REACT_APP_* variables from your .env
```

Or via Vercel Dashboard:
1. Go to your project
2. Settings → Environment Variables
3. Add all variables from `.env`

#### Step 5: Redeploy
```bash
vercel --prod
```

### Backend on Railway (Recommended)

#### Step 1: Sign up at Railway
- Go to https://railway.app
- Sign up with GitHub

#### Step 2: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository
4. Set **Root Directory** to `backend`

#### Step 3: Configure Environment Variables
In Railway dashboard, add:
```
PORT=8000
NODE_ENV=production
FRONTEND_URL=https://your-vercel-app.vercel.app
RAZORPAY_KEY_ID=rzp_live_S46rOVxN6EPLPl
RAZORPAY_KEY_SECRET=C6D1F9oxRsgYmQ2ejxGBmwHy
```

#### Step 4: Deploy
Railway auto-deploys on push. Or manually:
- Click "Deploy"

#### Step 5: Get Backend URL
- Railway provides URL like: `https://your-app.up.railway.app`
- Update frontend `REACT_APP_API_BASE_URL` with this URL

## 🚀 Option 2: Deploy Both to Vercel (Serverless)

### Convert Backend to Serverless Functions

#### Step 1: Create API Directory Structure
```bash
mkdir -p api
```

#### Step 2: Create Serverless Functions

Create `api/payments/create-order.js`:
```javascript
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, currency = 'INR', userData, bookingData, notes } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        error: 'Invalid amount. Amount must be greater than 0.'
      });
    }

    const amountInPaise = Math.round(amount * 100);

    const options = {
      amount: amountInPaise,
      currency: currency,
      receipt: `receipt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      notes: {
        service: 'consulting_session',
        bookingReference: bookingData?.bookingReference || 'N/A',
        userEmail: userData?.email || 'N/A',
        ...notes
      }
    };

    const order = await razorpay.orders.create(options);

    res.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      status: order.status,
      created_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({
      error: 'Failed to create payment order',
      message: error.message
    });
  }
};
```

Create `api/payments/verify.js`:
```javascript
const crypto = require('crypto');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { paymentId, orderId, signature } = req.body;

    if (!paymentId || !orderId || !signature) {
      return res.status(400).json({
        error: 'Missing required payment verification fields'
      });
    }

    const text = `${orderId}|${paymentId}`;
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    if (generatedSignature !== signature) {
      return res.status(400).json({
        verified: false,
        error: 'Invalid payment signature'
      });
    }

    res.json({
      verified: true,
      paymentId,
      orderId,
      message: 'Payment verified successfully'
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      verified: false,
      error: 'Failed to verify payment',
      message: error.message
    });
  }
};
```

Create `api/health.js`:
```javascript
module.exports = async (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Anupaat Nivesh API'
  });
};
```

#### Step 3: Create vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "env": {
    "RAZORPAY_KEY_ID": "@razorpay_key_id",
    "RAZORPAY_KEY_SECRET": "@razorpay_key_secret"
  }
}
```

#### Step 4: Update Frontend API URL
In `.env.production` or Vercel environment variables:
```env
REACT_APP_API_BASE_URL=https://your-app.vercel.app
```

#### Step 5: Deploy
```bash
vercel --prod
```

## 📋 Deployment Checklist

### Frontend (Vercel)
- [ ] Install Vercel CLI
- [ ] Login to Vercel
- [ ] Deploy frontend
- [ ] Add environment variables
- [ ] Update `REACT_APP_API_BASE_URL` with backend URL
- [ ] Redeploy

### Backend (Railway/Alternative)
- [ ] Sign up on Railway
- [ ] Create project from GitHub
- [ ] Set root directory to `backend`
- [ ] Add environment variables
- [ ] Deploy
- [ ] Get backend URL
- [ ] Update frontend with backend URL

## 🔧 Environment Variables Setup

### Frontend (Vercel)
```
REACT_APP_API_BASE_URL=https://your-backend-url.railway.app
REACT_APP_RAZORPAY_KEY_ID=rzp_live_S46rOVxN6EPLPl
REACT_APP_BASE_URL=https://your-app.vercel.app
REACT_APP_CONSULTING_SESSION_PRICE=99
REACT_APP_CONSULTING_SESSION_ACTUAL_PRICE=9999
REACT_APP_CALENDLY_CONSULTING_URL=https://calendly.com/anupaatnivesh/financial-planning-session
REACT_APP_WHATSAPP_NUMBER=919501195200
# ... all other REACT_APP_* variables
```

### Backend (Railway)
```
PORT=8000
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
RAZORPAY_KEY_ID=rzp_live_S46rOVxN6EPLPl
RAZORPAY_KEY_SECRET=C6D1F9oxRsgYmQ2ejxGBmwHy
```

## ✅ Post-Deployment Testing

1. **Test Backend Health:**
   ```bash
   curl https://your-backend-url.railway.app/api/health
   ```

2. **Test Frontend:**
   - Visit your Vercel URL
   - Check console for errors
   - Test booking flow

3. **Test Payment:**
   - Complete booking form
   - Proceed to payment
   - Verify Razorpay checkout opens
   - Complete test payment

## 🎯 Recommended Approach

**Best Option:** Frontend on Vercel + Backend on Railway
- ✅ Easy deployment
- ✅ Free tier available (Railway)
- ✅ Better for Express.js backend
- ✅ Auto-deploy from GitHub

**Alternative:** Both on Vercel (Serverless)
- ⚠️ Requires converting backend to serverless functions
- ✅ Everything in one place
- ⚠️ More complex setup

## 📞 Next Steps

1. Choose deployment option
2. Deploy backend first (get URL)
3. Deploy frontend (use backend URL)
4. Test complete flow
5. Go live! 🚀

