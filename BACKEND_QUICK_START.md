# ✅ Backend Server - Quick Start Guide

## 🎉 Backend Server is Ready!

Your backend server has been created and is now running at:
- **URL:** `http://localhost:8000`
- **Health Check:** `http://localhost:8000/api/health`

## 📁 What Was Created

```
backend/
├── server.js          # Main API server
├── package.json       # Dependencies
├── .env              # Environment variables (your Razorpay keys)
├── .env.example      # Template for environment variables
├── .gitignore        # Git ignore rules
└── README.md         # Backend documentation
```

## 🚀 How to Start the Server

### Option 1: Start Now (Already Running)
The server is currently running in the background. You can test it by:
1. Opening your browser: `http://localhost:8000/api/health`
2. Or testing payment flow in your frontend

### Option 2: Start Manually

```bash
# Navigate to backend directory
cd backend

# Start the server
npm start

# Or for development with auto-reload
npm run dev
```

## ✅ Test the Server

Open your browser and visit:
```
http://localhost:8000/api/health
```

You should see:
```json
{
  "status": "ok",
  "timestamp": "2026-01-15T11:46:04.950Z",
  "service": "Anupaat Nivesh API"
}
```

## 🔄 Test Payment Flow

1. **Start Frontend** (in a new terminal):
   ```bash
   npm start
   ```

2. **Complete the flow:**
   - Go to: `http://localhost:3000/consulting-session`
   - Fill the form
   - Book a time slot
   - Complete payment

3. **The payment should now work!** ✅

## 🌐 Production Deployment

### For Live Web Application:

#### Frontend Deployment:
1. **Build:** `npm run build`
2. **Deploy to:**
   - Netlify / Vercel (easiest)
   - Or your hosting (cPanel, etc.)
3. **Set environment variables:**
   ```
   REACT_APP_API_BASE_URL=https://api.anupaatnivesh.com
   REACT_APP_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
   ```

#### Backend Deployment:
1. **Deploy to:**
   - Heroku (easiest): `heroku create anupaat-api`
   - Railway: Connect GitHub repo
   - DigitalOcean/AWS: Set up Node.js server
2. **Set environment variables:**
   ```
   RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=your_production_secret
   FRONTEND_URL=https://www.anupaatnivesh.com
   ```
3. **Get API URL:** `https://api.anupaatnivesh.com`

#### Update Frontend:
- Change `REACT_APP_API_BASE_URL` to your production backend URL
- Rebuild and redeploy frontend

## 📚 Documentation

- **Backend Setup:** See `BACKEND_SETUP.md`
- **Production Deployment:** See `PRODUCTION_DEPLOYMENT.md`
- **API Documentation:** See `BACKEND_API.md`

## 🔧 Troubleshooting

### Server Not Starting?
```bash
# Check if port 8000 is in use
lsof -i :8000

# Kill the process if needed
kill -9 <PID>

# Or change PORT in backend/.env
```

### Payment Not Working?
1. Check backend is running: `curl http://localhost:8000/api/health`
2. Check Razorpay keys in `backend/.env`
3. Check frontend `.env` has `REACT_APP_API_BASE_URL=http://localhost:8000`

### CORS Errors?
- Update `FRONTEND_URL` in `backend/.env` to match your frontend URL

## 🎯 Next Steps

1. ✅ Backend server is running
2. ✅ Test payment flow
3. ⏭️ Deploy to production when ready
4. ⏭️ Add database for persistent storage (optional)
5. ⏭️ Add authentication (optional)

## 📞 Need Help?

- Check `BACKEND_SETUP.md` for detailed setup
- Check `PRODUCTION_DEPLOYMENT.md` for deployment
- Check `BACKEND_API.md` for API details

