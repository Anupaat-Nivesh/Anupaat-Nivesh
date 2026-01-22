# Anupaat Nivesh Backend API

Backend API server for Anupaat Nivesh payment and booking services.

## 🚀 Deployment

This backend is deployed on **Vercel** as serverless functions.

### Structure

```
anupaat-nivesh-backend/
├── api/
│   ├── payments/
│   │   ├── create-order.js
│   │   └── verify-payment.js
│   ├── _cors.js
│   └── health.js
├── package.json
└── vercel.json
```

## 📋 API Endpoints

### Health Check
- `GET /api/health` - Returns backend status

### Payment Endpoints
- `POST /api/payments/create-order` - Create Razorpay payment order
- `POST /api/payments/verify-payment` - Verify Razorpay payment signature

## 🔧 Environment Variables

Required in Vercel:
- `RAZORPAY_KEY_ID` - Razorpay Key ID (starts with `rzp_live_...`)
- `RAZORPAY_KEY_SECRET` - Razorpay Key Secret

## 🌐 CORS Configuration

Backend allows requests from:
- `https://www.anupaatnivesh.com`
- `https://anupaatnivesh.com`
- `http://localhost:3000` (development)

## 📦 Installation

```bash
npm install
```

## 🚀 Local Development

For local testing, you can use Vercel CLI:

```bash
npm install -g vercel
vercel dev
```

## 🔗 Production URL

Backend is deployed at: `https://anupaat-nivesh.vercel.app`

## 📝 Notes

- All endpoints handle OPTIONS preflight requests
- CORS headers are set automatically
- Razorpay keys must be set in Vercel environment variables

