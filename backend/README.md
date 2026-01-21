# Anupaat Nivesh Backend API

Backend API server for handling Razorpay payments and booking management.

## Quick Start

```bash
# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Edit .env and add your Razorpay keys
# Then start the server
npm start
```

## Environment Variables

Required variables in `.env`:

```env
PORT=8000
FRONTEND_URL=http://localhost:3000
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key
```

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment
- `POST /api/bookings` - Create booking
- `GET /api/bookings/:id` - Get booking
- `PUT /api/bookings/:id/status` - Update booking status

See `BACKEND_API.md` for detailed API documentation.

## Development

```bash
npm run dev  # With auto-reload (requires nodemon)
```

## Production

```bash
npm start
```

For production deployment, see `PRODUCTION_DEPLOYMENT.md` in the root directory.

