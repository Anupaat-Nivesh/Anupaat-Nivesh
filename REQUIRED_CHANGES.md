# Required Changes for Production

## 🔍 Current Status

Your `.env` files are mostly correct, but **2 URLs need to be updated** for production.

## ⚠️ Changes Required

### 1. Frontend `.env` (Root Directory)

**Current:**
```env
REACT_APP_API_BASE_URL=http://localhost:8000
```

**Change to:** (Choose based on your backend deployment)

**Option A: If backend on subdomain**
```env
REACT_APP_API_BASE_URL=https://api.anupaatnivesh.com
```

**Option B: If backend on different subdomain**
```env
REACT_APP_API_BASE_URL=https://backend.anupaatnivesh.com
```

**Option C: If backend on same domain, different path**
```env
REACT_APP_API_BASE_URL=https://www.anupaatnivesh.com/api
```

**⚠️ Important:** Replace with your **actual backend URL** after deployment.

---

### 2. Backend `.env` (backend/.env)

**Current:**
```env
FRONTEND_URL=http://localhost:3000
```

**Change to:**
```env
FRONTEND_URL=https://www.anupaatnivesh.com
```

**Also add:**
```env
NODE_ENV=production
```

---

## ✅ What's Already Correct

### Frontend `.env`
- ✅ `REACT_APP_RAZORPAY_KEY_ID=rzp_live_S46rOVxN6EPLPl` (Production key)
- ✅ `REACT_APP_BASE_URL=https://www.anupaatnivesh.com`
- ✅ All other variables are correct

### Backend `.env`
- ✅ `RAZORPAY_KEY_ID=rzp_live_S46rOVxN6EPLPl` (Production key)
- ✅ `RAZORPAY_KEY_SECRET=C6D1F9oxRsgYmQ2ejxGBmwHy` (Production secret)
- ✅ `PORT=8000`

---

## 📝 Quick Update Steps

### Step 1: Update Frontend `.env`

1. Open `.env` in root directory
2. Find: `REACT_APP_API_BASE_URL=http://localhost:8000`
3. Replace with your production backend URL
4. Save file

### Step 2: Update Backend `.env`

1. Open `backend/.env`
2. Find: `FRONTEND_URL=http://localhost:3000`
3. Replace with: `FRONTEND_URL=https://www.anupaatnivesh.com`
4. Add: `NODE_ENV=production`
5. Save file

---

## 🎯 After Deployment

Once you deploy the backend and get its URL:

1. **Update frontend `.env`** with the actual backend URL
2. **Rebuild frontend:** `npm run build`
3. **Redeploy frontend** with updated build

---

## 📋 Complete Updated Files

### Frontend `.env` (Root)
```env
# API Configuration - UPDATE THIS AFTER BACKEND DEPLOYMENT
REACT_APP_API_BASE_URL=https://api.anupaatnivesh.com

# Site Configuration
REACT_APP_BASE_URL=https://www.anupaatnivesh.com

# Razorpay (Production) ✅
REACT_APP_RAZORPAY_KEY_ID=rzp_live_S46rOVxN6EPLPl

# Pricing ✅
REACT_APP_CONSULTING_SESSION_PRICE=99
REACT_APP_CONSULTING_SESSION_ACTUAL_PRICE=9999

# Calendly ✅
REACT_APP_CALENDLY_CONSULTING_URL=https://calendly.com/anupaatnivesh/financial-planning-session
REACT_APP_CALENDLY_URL=https://calendly.com/anupaatnivesh/financial-planning-session

# WhatsApp ✅
REACT_APP_WHATSAPP_NUMBER=919501195200

# EmailJS ✅
REACT_APP_EMAILJS_SERVICE_ID=service_f3brm8k
REACT_APP_EMAILJS_TEMPLATE_ID=template_agep8yl
REACT_APP_EMAILJS_MF_TEMPLATE_ID=template_abk1zsr
REACT_APP_EMAILJS_PUBLIC_KEY=9UdH6e5xO7yZCJSL5
```

### Backend `.env` (backend/.env)
```env
# Server Configuration
PORT=8000
NODE_ENV=production

# Frontend URL (for CORS) - UPDATE THIS
FRONTEND_URL=https://www.anupaatnivesh.com

# Razorpay (Production) ✅
RAZORPAY_KEY_ID=rzp_live_S46rOVxN6EPLPl
RAZORPAY_KEY_SECRET=C6D1F9oxRsgYmQ2ejxGBmwHy
```

---

## ✅ Validation Checklist

After making changes, verify:
- [ ] `REACT_APP_API_BASE_URL` uses `https://` (not `http://`)
- [ ] `REACT_APP_API_BASE_URL` doesn't contain `localhost`
- [ ] `FRONTEND_URL` uses `https://www.anupaatnivesh.com`
- [ ] `FRONTEND_URL` doesn't contain `localhost`
- [ ] `NODE_ENV=production` added to backend `.env`
- [ ] All Razorpay keys are production keys (`rzp_live_...`)

---

## 🚀 Next Steps

1. ✅ Update the 2 URLs mentioned above
2. ✅ Add `NODE_ENV=production` to backend
3. ✅ Deploy backend (see `HOSTINGER_DEPLOYMENT.md`)
4. ✅ Get backend URL from deployment
5. ✅ Update frontend `.env` with actual backend URL
6. ✅ Rebuild and redeploy frontend
7. ✅ Test complete flow

