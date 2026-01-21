# Fix: Local Payment Testing Setup

## ✅ Current Status

- ✅ Backend is running on `http://localhost:8000`
- ✅ `.env` file has `REACT_APP_API_BASE_URL=http://localhost:8000`
- ⚠️ Frontend needs to be restarted to pick up environment variables

## 🔧 Solution

### Step 1: Stop Frontend (if running)

Press `Ctrl+C` in the terminal where `npm start` is running.

### Step 2: Verify .env File

Make sure your `.env` file in the root directory has:
```env
REACT_APP_API_BASE_URL=http://localhost:8000
```

### Step 3: Restart Frontend

```bash
npm start
```

**Important:** React apps only read `.env` files when they start. If you changed `.env` after starting, you must restart.

### Step 4: Verify Backend Connection

1. Open browser console (F12)
2. Go to Network tab
3. Try to make a payment
4. Check if requests go to `http://localhost:8000/api/payments/create-order`

## 🔍 Troubleshooting

### Issue: Still getting "Backend server required" error

**Solution 1: Check .env file location**
- `.env` must be in the **root directory** (same level as `package.json`)
- Not in `src/` folder
- Not in `backend/` folder

**Solution 2: Verify environment variable is loaded**
Add this temporarily to see what's being read:
```javascript
// In browser console (F12)
console.log('API Base URL:', process.env.REACT_APP_API_BASE_URL);
```

**Solution 3: Hard refresh browser**
- Press `Ctrl+Shift+R` (Windows/Linux)
- Press `Cmd+Shift+R` (Mac)
- Or clear browser cache

**Solution 4: Check backend is accessible**
```bash
curl http://localhost:8000/api/health
```

Should return:
```json
{"status":"ok","timestamp":"...","service":"Anupaat Nivesh API"}
```

### Issue: CORS errors

**Solution:**
Backend CORS should allow `localhost:3000`. Check `backend/.env`:
```env
FRONTEND_URL=http://localhost:3000
```

Or backend has fallback to `http://localhost:3000` in code.

### Issue: Backend not running

**Start backend:**
```bash
cd backend
node server.js
```

Should see:
```
🚀 Anupaat Nivesh API Server running on port 8000
```

## ✅ Quick Verification Checklist

- [ ] Backend running: `curl http://localhost:8000/api/health`
- [ ] `.env` file exists in root directory
- [ ] `.env` has `REACT_APP_API_BASE_URL=http://localhost:8000`
- [ ] Frontend restarted after .env changes
- [ ] Browser console shows no CORS errors
- [ ] Network tab shows API calls to `localhost:8000`

## 🚀 Complete Setup Commands

**Terminal 1 - Backend:**
```bash
cd backend
node server.js
```

**Terminal 2 - Frontend:**
```bash
npm start
```

**Terminal 3 - Test Backend:**
```bash
curl http://localhost:8000/api/health
```

## 📝 Expected Flow

1. User fills booking form
2. Clicks "Proceed to Payment"
3. Frontend calls: `http://localhost:8000/api/payments/create-order`
4. Backend creates Razorpay order
5. Returns order_id to frontend
6. Razorpay checkout opens
7. User completes payment
8. Frontend calls: `http://localhost:8000/api/payments/verify`
9. Backend verifies payment
10. Success page shown

## 🎯 Next Steps

Once local testing works:
1. ✅ Test complete payment flow
2. ✅ Verify booking creation
3. ✅ Update .env for production
4. ✅ Deploy backend
5. ✅ Deploy frontend
6. ✅ Test on production

