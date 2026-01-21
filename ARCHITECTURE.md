# Architecture Overview

## Frontend-Backend Architecture

This application has been restructured to follow a clean **frontend-backend separation** architecture.

## Key Principles

1. **Frontend handles UI only** - No business logic, no secrets
2. **Backend handles all sensitive operations** - Payment processing, data storage
3. **API-based communication** - RESTful API between frontend and backend
4. **Environment-based configuration** - Easy switching between dev/prod

## Architecture Layers

### 1. Frontend Layer (React)
```
src/
├── components/     # UI components
├── pages/          # Page components
├── api/            # API client layer ⭐ NEW
│   ├── config.js       # API configuration
│   ├── client.js       # HTTP client
│   ├── paymentApi.js   # Payment API calls
│   └── bookingApi.js   # Booking API calls
├── services/       # Business logic services
│   ├── paymentService.js   # Updated to use API client
│   └── bookingService.js   # Updated to use API client
└── utils/          # Utilities and configs
```

### 2. Backend Layer (Separate Repository)
- Node.js/Express API server
- Razorpay integration
- Database operations
- Secret key management

## Configuration

### Environment Variables

#### Frontend (.env)
```env
# Payment (Public Key Only)
REACT_APP_RAZORPAY_KEY_ID=rzp_test_S47IhMgCxOsrbn

# Backend API
REACT_APP_API_BASE_URL=http://localhost:8000  # Development
# REACT_APP_API_BASE_URL=https://api.anupaatnivesh.com  # Production

# Other configs...
```

#### Backend (.env)
```env
# Payment (Secret Key - NEVER in frontend)
RAZORPAY_KEY_ID=rzp_test_S47IhMgCxOsrbn
RAZORPAY_KEY_SECRET=Fvj0EC80HEhLNMO5O2yVw8v9

# Database
DATABASE_URL=postgresql://...

# Server
PORT=8000
```

## Development Modes

### Mode 1: With Backend (Recommended)
```env
REACT_APP_API_BASE_URL=http://localhost:8000
```
- ✅ Real API calls
- ✅ Actual payment processing
- ✅ Database storage
- ✅ Production-ready

### Mode 2: Without Backend (Development Only)
```env
# Leave REACT_APP_API_BASE_URL empty or unset
```
- ⚠️ Mock API responses
- ⚠️ Console warnings
- ⚠️ No real payment processing
- ❌ Not for production

## API Flow

### Payment Flow
```
1. User fills form → Frontend
2. User selects time → Calendly (Frontend)
3. Create order → Frontend → Backend API → Razorpay
4. Payment → Razorpay Gateway
5. Verify payment → Frontend → Backend API → Razorpay
6. Save booking → Frontend → Backend API → Database
7. Success page → Frontend
```

## Testing

### Switch Between Environments

**Development (Local Backend):**
```env
REACT_APP_API_BASE_URL=http://localhost:8000
REACT_APP_RAZORPAY_KEY_ID=rzp_test_S47IhMgCxOsrbn
```

**Production:**
```env
REACT_APP_API_BASE_URL=https://api.anupaatnivesh.com
REACT_APP_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
```

**Development (No Backend):**
```env
# Comment out or remove REACT_APP_API_BASE_URL
# REACT_APP_API_BASE_URL=
```

## Security

✅ **Frontend:**
- Only public Razorpay Key ID
- No secret keys
- API calls to backend only

✅ **Backend:**
- Razorpay Secret Key
- Payment verification
- Database access
- All sensitive operations

## Next Steps

1. **Set up backend API** (see `BACKEND_API.md`)
2. **Configure environment variables**
3. **Test payment flow**
4. **Deploy backend**
5. **Update production .env**

## Files Changed

### New Files
- `src/api/config.js` - API configuration
- `src/api/client.js` - HTTP client
- `src/api/paymentApi.js` - Payment API calls
- `src/api/bookingApi.js` - Booking API calls
- `src/api/index.js` - API exports
- `BACKEND_API.md` - Backend API documentation
- `ARCHITECTURE.md` - This file

### Updated Files
- `src/services/paymentService.js` - Uses API client
- `src/services/bookingService.js` - Uses API client
- `.env` - Added API_BASE_URL
- `.env.example` - Added API_BASE_URL
- `README.md` - Added architecture section

## Support

For backend implementation, refer to `BACKEND_API.md` for complete API specifications.

