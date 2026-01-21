# Backend Server Setup Guide

This guide will help you set up and run the backend API server for Anupaat Nivesh.

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Razorpay account with API keys

## 🚀 Quick Start

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and add your Razorpay credentials:

```env
PORT=8000
FRONTEND_URL=http://localhost:3000
RAZORPAY_KEY_ID=rzp_test_S47IhMgCxOsrbn
RAZORPAY_KEY_SECRET=Fvj0EC80HEhLNMO5O2yVw8v9
```

### 4. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

### 5. Verify Server is Running

Open your browser and visit:
```
http://localhost:8000/api/health
```

You should see:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00Z",
  "service": "Anupaat Nivesh API"
}
```

## 🔧 API Endpoints

### Health Check
- **GET** `/api/health`
- Returns server status

### Payment Endpoints

#### Create Order
- **POST** `/api/payments/create-order`
- Creates a Razorpay order for payment

#### Verify Payment
- **POST** `/api/payments/verify`
- Verifies Razorpay payment signature

### Booking Endpoints

#### Create Booking
- **POST** `/api/bookings`
- Creates a new booking record

#### Get Booking
- **GET** `/api/bookings/:id`
- Retrieves booking details

#### Update Booking Status
- **PUT** `/api/bookings/:id/status`
- Updates booking status

## 🧪 Testing

### Test Payment Flow

1. Start the backend server:
   ```bash
   npm start
   ```

2. Start the frontend (in another terminal):
   ```bash
   npm start
   ```

3. Complete the booking flow:
   - Fill the consulting session form
   - Book a time slot via Calendly
   - Complete payment via Razorpay

### Test API Endpoints

You can test endpoints using curl or Postman:

```bash
# Health check
curl http://localhost:8000/api/health

# Create order
curl -X POST http://localhost:8000/api/payments/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 99,
    "currency": "INR",
    "userData": {
      "firstName": "Test",
      "lastName": "User",
      "email": "test@example.com"
    }
  }'
```

## 📦 Production Deployment

### Option 1: Deploy to Heroku

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create anupaat-nivesh-api`
4. Set environment variables:
   ```bash
   heroku config:set RAZORPAY_KEY_ID=rzp_live_xxxxx
   heroku config:set RAZORPAY_KEY_SECRET=xxxxx
   heroku config:set FRONTEND_URL=https://www.anupaatnivesh.com
   ```
5. Deploy: `git push heroku main`

### Option 2: Deploy to Railway

1. Connect your GitHub repository
2. Add environment variables in Railway dashboard
3. Deploy automatically on push

### Option 3: Deploy to DigitalOcean / AWS / Azure

1. Set up a Node.js server
2. Install PM2: `npm install -g pm2`
3. Start with PM2: `pm2 start server.js`
4. Configure reverse proxy (nginx)
5. Set up SSL certificate

### Environment Variables for Production

```env
PORT=8000
FRONTEND_URL=https://www.anupaatnivesh.com
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_production_secret_key
NODE_ENV=production
```

## 🔒 Security Notes

1. **Never commit `.env` file** - It contains sensitive keys
2. **Use production Razorpay keys** in production environment
3. **Enable HTTPS** for all API endpoints
4. **Add rate limiting** to prevent abuse
5. **Add authentication** for admin endpoints (future)

## 🐛 Troubleshooting

### Port Already in Use

If port 8000 is already in use:

```bash
# Change PORT in .env file
PORT=8001
```

Or kill the process:
```bash
# Find process using port 8000
lsof -i :8000

# Kill the process
kill -9 <PID>
```

### Razorpay Errors

- Verify your API keys are correct
- Check if you're using test keys in test mode
- Ensure keys match the environment (test vs live)

### CORS Errors

If you see CORS errors, update `FRONTEND_URL` in `.env` to match your frontend URL.

## 📚 Next Steps

1. **Add Database**: Integrate MongoDB or PostgreSQL for persistent storage
2. **Add Authentication**: Implement JWT or OAuth for secure endpoints
3. **Add Logging**: Implement proper logging (Winston, Morgan)
4. **Add Testing**: Write unit and integration tests
5. **Add Monitoring**: Set up error tracking (Sentry) and monitoring

## 📞 Support

For issues or questions, refer to:
- `BACKEND_API.md` - API documentation
- `ARCHITECTURE.md` - System architecture
- Razorpay Docs: https://razorpay.com/docs/

