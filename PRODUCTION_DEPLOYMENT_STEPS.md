# Production Deployment Steps

## 🎯 Overview

- **Backend:** Deploy to Vercel
- **Frontend:** Deploy to Hostinger
- **Testing:** Test complete payment flow

## 📋 Pre-Deployment Checklist

- [ ] Backend code ready
- [ ] Frontend code ready
- [ ] Production Razorpay keys available
- [ ] Domain configured
- [ ] Environment variables prepared

## 🚀 Step 1: Deploy Backend to Vercel

### 1.1 Prepare Backend

```bash
cd backend
# Verify vercel.json exists
ls vercel.json
```

### 1.2 Deploy via Vercel Dashboard

1. **Go to:** https://vercel.com/dashboard
2. **Click:** "Add New Project"
3. **Import:** Your GitHub repository
4. **Configure:**
   - Framework: Other
   - **Root Directory:** `backend` ⚠️ IMPORTANT!
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
5. **Environment Variables:**
   ```
   NODE_ENV=production
   FRONTEND_URL=https://www.anupaatnivesh.com
   RAZORPAY_KEY_ID=rzp_live_S46rOVxN6EPLPl
   RAZORPAY_KEY_SECRET=C6D1F9oxRsgYmQ2ejxGBmwHy
   ```
6. **Deploy:** Click "Deploy"
7. **Get URL:** Note your backend URL (e.g., `https://anupaat-backend.vercel.app`)

### 1.3 Test Backend

```bash
curl https://your-backend-url.vercel.app/api/health
```

Should return: `{"status":"ok",...}`

## 🚀 Step 2: Update Frontend Environment

### 2.1 Update .env

Edit `.env` file:
```env
REACT_APP_API_BASE_URL=https://your-backend-url.vercel.app
REACT_APP_BASE_URL=https://www.anupaatnivesh.com
REACT_APP_RAZORPAY_KEY_ID=rzp_live_S46rOVxN6EPLPl
# ... other variables
```

**Replace `your-backend-url.vercel.app` with actual Vercel URL.**

### 2.2 Verify Environment

```bash
cat .env | grep REACT_APP_API_BASE_URL
```

## 🚀 Step 3: Build Frontend

```bash
# Make sure you're in root directory
npm run build
```

**Verify build:**
```bash
ls -la build/
```

Should see `index.html`, `static/` folder, etc.

## 🚀 Step 4: Deploy Frontend to Hostinger

### 4.1 Login to Hostinger

1. Go to hPanel
2. Navigate to File Manager

### 4.2 Upload Files

1. **Go to:** `public_html/` folder
2. **Backup:** Existing files (if any)
3. **Upload:** All files from `build/` folder
   - Upload **contents** of `build/`, not the folder itself
4. **Verify:** `index.html` is in `public_html/`

### 4.3 Configure .htaccess

Create/update `.htaccess` in `public_html/`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

### 4.4 Enable SSL

1. In hPanel → SSL
2. Enable Let's Encrypt SSL
3. Activate for your domain

## ✅ Step 5: Testing

### 5.1 Basic Tests

1. **Visit:** `https://www.anupaatnivesh.com`
   - [ ] Page loads
   - [ ] No console errors
   - [ ] Navigation works

2. **Test Backend Connection:**
   - [ ] Open browser console (F12)
   - [ ] Navigate to booking page
   - [ ] Check Network tab for API calls
   - [ ] Verify calls go to Vercel backend

### 5.2 Payment Flow Test

1. **Navigate to:** `/consulting-session`
2. **Fill form:**
   - Name, Email, Phone
   - Select date/time
3. **Click:** "Proceed to Payment"
4. **Verify:**
   - [ ] Order creation succeeds
   - [ ] Razorpay checkout opens
   - [ ] Payment amount is correct
   - [ ] Can complete payment
   - [ ] Success page shows

### 5.3 Backend Tests

```bash
# Health check
curl https://your-backend-url.vercel.app/api/health

# Test order creation
curl -X POST https://your-backend-url.vercel.app/api/payments/create-order \
  -H "Content-Type: application/json" \
  -d '{"amount": 99, "currency": "INR"}'
```

## 🔧 Troubleshooting

### Backend Issues

**CORS Errors:**
- Verify `FRONTEND_URL` in Vercel environment variables
- Should be: `https://www.anupaatnivesh.com`

**Environment Variables:**
- Check all variables are set in Vercel dashboard
- Redeploy after adding variables

### Frontend Issues

**Blank Page:**
- Check browser console
- Verify `index.html` is in root
- Check file paths

**API Not Connecting:**
- Verify `REACT_APP_API_BASE_URL` in build
- Rebuild if you changed `.env`
- Check backend URL is correct

**404 on Routes:**
- Verify `.htaccess` is uploaded
- Check mod_rewrite is enabled

## 📝 Quick Reference

### Backend URL
```
https://your-backend-url.vercel.app
```

### Frontend URL
```
https://www.anupaatnivesh.com
```

### Environment Variables

**Backend (Vercel):**
- `NODE_ENV=production`
- `FRONTEND_URL=https://www.anupaatnivesh.com`
- `RAZORPAY_KEY_ID=rzp_live_...`
- `RAZORPAY_KEY_SECRET=...`

**Frontend (Build time):**
- `REACT_APP_API_BASE_URL=https://your-backend-url.vercel.app`
- `REACT_APP_BASE_URL=https://www.anupaatnivesh.com`
- `REACT_APP_RAZORPAY_KEY_ID=rzp_live_...`

## 🎯 Post-Deployment

- [ ] Test complete payment flow
- [ ] Monitor for errors
- [ ] Check analytics
- [ ] Test on mobile devices
- [ ] Verify SSL is working
- [ ] Test all pages

## 📞 Support

If issues persist:
1. Check browser console for errors
2. Check Vercel logs for backend errors
3. Verify all environment variables
4. Test backend endpoints directly
5. Review deployment guides

