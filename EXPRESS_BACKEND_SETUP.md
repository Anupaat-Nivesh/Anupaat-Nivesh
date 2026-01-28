# Express Backend Setup & Deployment Guide

## Overview

This project has been refactored to use an Express.js backend server while maintaining 100% compatibility with Vercel serverless deployment. All existing functionality, business logic, and API endpoints remain unchanged.

## Architecture

- **Local Development**: Express server runs on port 8000 (or PORT env var)
- **Vercel Deployment**: Express app is wrapped as serverless function via `vercel.json`
- **API Routes**: All routes preserved at `/api/*` endpoints
- **Business Logic**: 100% preserved from original Vercel serverless functions

## Project Structure

```
/
├── server.mjs                    # Express server entry point (ES module)
├── vercel.json                  # Vercel deployment configuration
├── api/
│   ├── routes/
│   │   ├── health.mjs          # Health check route (ES module)
│   │   └── payments.mjs         # Payment routes (ES module)
│   ├── services/
│   │   └── sheets.mjs          # Google Sheets service (ES module)
│   └── _cors.js                 # CORS utility (legacy, now handled by Express)
└── package.json                 # Updated with Express dependencies (no "type": "module")
```

## Local Development Setup

### 1. Install Dependencies

```bash
npm install
```

This will install:
- `express` - Web framework
- `cors` - CORS middleware
- All existing dependencies (razorpay, googleapis, etc.)

### 2. Environment Variables

Create a `.env` file in the project root (if not already present):

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Google Sheets Configuration
GOOGLE_SHEETS_CREDENTIALS={"type":"service_account",...}
GOOGLE_SHEET_ID=your_google_sheet_id

# Server Configuration (optional)
PORT=8000
NODE_ENV=development
```

### 3. Start the Server

```bash
npm run server
```

Or:

```bash
node server.mjs
```

The server will start on `http://localhost:8000` (or the PORT you specified).

### 4. Test the Server

```bash
# Health check
curl http://localhost:8000/api/health

# Root endpoint (shows available routes)
curl http://localhost:8000/
```

### 5. Run Frontend (Separate Terminal)

```bash
npm start
```

The React frontend will run on `http://localhost:3000` and should connect to the backend at `http://localhost:8000`.

**Important**: Update your frontend `.env` file to point to the local backend:

```env
REACT_APP_API_BASE_URL=http://localhost:8000
```

## Vercel Deployment

### 1. Environment Variables in Vercel

Go to your Vercel project dashboard → Settings → Environment Variables and ensure all required variables are set:

**Required Environment Variables:**

```
RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
RAZORPAY_WEBHOOK_SECRET
GOOGLE_SHEETS_CREDENTIALS
GOOGLE_SHEET_ID
```

**Optional Environment Variables:**

```
NODE_ENV=production
PORT (automatically set by Vercel)
```

### 2. Vercel Configuration

The `vercel.json` file is already configured to:
- Route `/api/*` requests to the Express server
- Serve static React build files for all other routes
- Use `@vercel/node` for the Express serverless function

**No changes needed** - the configuration is production-ready.

### 3. Deploy

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Deploy
vercel --prod
```

Or push to your connected Git repository (Vercel will auto-deploy).

### 4. Verify Deployment

After deployment, test the endpoints:

```bash
# Health check
curl https://your-domain.vercel.app/api/health

# Root endpoint
curl https://your-domain.vercel.app/
```

## API Endpoints

All endpoints remain unchanged:

### Health Check
- **GET** `/api/health`
- Returns: `{ status: "Backend is running" }`

### Payment Endpoints

#### Create Order
- **POST** `/api/payments/create-order`
- Body: `{ amount, currency, userData, bookingData, notes }`
- Returns: Razorpay order object

#### Verify Payment
- **POST** `/api/payments/verify-payment`
- Body: `{ orderId, paymentId, signature, userData, bookingData, amount, currency }`
- Returns: `{ success: true, verified: true }`

#### Webhook
- **POST** `/api/payments/webhook`
- **GET** `/api/payments/webhook` (for testing)
- Handles Razorpay webhook events: `payment.captured`, `payment.failed`

## Webhook Configuration in Razorpay

1. Go to Razorpay Dashboard → Settings → Webhooks
2. Add webhook URL: `https://your-domain.vercel.app/api/payments/webhook`
3. Select events:
   - `payment.captured`
   - `payment.failed`
4. Copy the webhook secret and add it to Vercel environment variables as `RAZORPAY_WEBHOOK_SECRET`

## Migration Notes

### What Changed

1. **Server Structure**: Vercel serverless functions → Express routes
2. **Entry Point**: Multiple handler files → Single `server.js` with route modules
3. **CORS**: Custom `_cors.js` → Express `cors` middleware
4. **Request Handling**: Vercel `handler(req, res)` → Express `router.post/get()`

### What Stayed the Same

1. **All Business Logic**: Payment processing, Google Sheets integration, webhook handling
2. **API Endpoints**: All routes remain at `/api/*`
3. **Environment Variables**: Same variable names and usage
4. **Service Modules**: `api/services/sheets.js` unchanged
5. **Frontend Code**: No changes required

### Legacy Files

The original Vercel serverless function files in `/api/payments/*.js` and `/api/health.js` are still present but **not used** when running the Express server. They remain for reference and can be removed after confirming the Express server works correctly.

## Troubleshooting

### Local Development Issues

**Issue**: `Cannot find module` errors
- **Solution**: Ensure `"type": "module"` is in `package.json` (already added)
- Run `npm install` to ensure all dependencies are installed

**Issue**: Port already in use
- **Solution**: Change `PORT` in `.env` or kill the process using port 8000

**Issue**: CORS errors from frontend
- **Solution**: Ensure `REACT_APP_API_BASE_URL=http://localhost:8000` is set in frontend `.env`

### Vercel Deployment Issues

**Issue**: 404 errors on `/api/*` routes
- **Solution**: Verify `vercel.json` is in the project root and routes are configured correctly

**Issue**: Webhook signature verification fails
- **Solution**: 
  1. Ensure `RAZORPAY_WEBHOOK_SECRET` is set in Vercel environment variables
  2. Verify the webhook URL in Razorpay dashboard matches your Vercel domain
  3. Check Vercel function logs for detailed error messages

**Issue**: Google Sheets logging fails
- **Solution**:
  1. Verify `GOOGLE_SHEETS_CREDENTIALS` is a valid JSON string in Vercel
  2. Ensure `GOOGLE_SHEET_ID` is correct
  3. Check that the service account has access to the Google Sheet

## Testing Checklist

- [ ] Local server starts without errors
- [ ] Health check endpoint returns 200
- [ ] Create order endpoint works
- [ ] Payment verification works
- [ ] Webhook endpoint accepts POST requests
- [ ] Google Sheets logging works
- [ ] Vercel deployment succeeds
- [ ] All endpoints work in production
- [ ] Webhook receives and processes Razorpay events

## Support

For issues or questions:
1. Check Vercel function logs: Vercel Dashboard → Functions → View Logs
2. Check server logs: `console.log` statements appear in Vercel logs
3. Verify environment variables are set correctly
4. Test endpoints using `curl` or Postman

## Next Steps

1. Test locally with `npm run server`
2. Deploy to Vercel
3. Update Razorpay webhook URL to production domain
4. Monitor logs for any issues
5. Remove legacy Vercel serverless function files after confirming everything works

