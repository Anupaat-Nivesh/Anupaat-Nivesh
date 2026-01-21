# Start Backend and Frontend Servers

## 🚀 Quick Start Commands

### Terminal 1 - Backend Server
```bash
cd backend
node server.js
```

**Expected output:**
```
🚀 Anupaat Nivesh API Server running on port 8000
📍 Health check: http://localhost:8000/api/health
🔑 Razorpay Key ID: ✅ Configured
🔐 Razorpay Secret: ✅ Configured
```

### Terminal 2 - Frontend Server
```bash
npm start
```

**Expected output:**
```
Compiled successfully!

You can now view anupaat in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

## ✅ Verification

### Check Backend
```bash
curl http://localhost:8000/api/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "...",
  "service": "Anupaat Nivesh API"
}
```

### Check Frontend
- Open browser: `http://localhost:3000`
- Should load without errors

## 🛑 Stop Servers

### Stop Backend
Press `Ctrl+C` in backend terminal

### Stop Frontend
Press `Ctrl+C` in frontend terminal

Or kill all:
```bash
pkill -f "node server.js"
pkill -f "react-scripts"
```

## 🔄 Restart Servers

1. Stop both servers (Ctrl+C)
2. Start backend: `cd backend && node server.js`
3. Start frontend: `npm start`

## 📋 Environment Check

Before starting, verify:
- ✅ Backend `.env` exists with Razorpay keys
- ✅ Frontend `.env` has `REACT_APP_API_BASE_URL=http://localhost:8000`
- ✅ Both servers can access their `.env` files

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Check what's using port 8000
lsof -i :8000

# Kill process if needed
kill -9 <PID>
```

### Port 3000 in Use
```bash
# Check what's using port 3000
lsof -i :3000

# Kill process if needed
kill -9 <PID>
```

### Backend Not Starting
- Check `backend/.env` exists
- Verify Razorpay keys are set
- Check for syntax errors in `server.js`

### Frontend Not Starting
- Check root `.env` exists
- Verify `REACT_APP_API_BASE_URL` is set
- Clear cache: `rm -rf node_modules/.cache`

