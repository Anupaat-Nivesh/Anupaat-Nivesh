# Anupaat Nivesh

Repository for Anupaat Nivesh Website Development - Financial Advisory & Mutual Fund Services

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd Anupaat-Nivesh
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
   - **WhatsApp**: `REACT_APP_WHATSAPP_NUMBER` - Your WhatsApp number in international format (e.g., `919876543210`)
   - **Razorpay**: `REACT_APP_RAZORPAY_KEY_ID` - Your Razorpay Key ID from dashboard
   - **Calendly**: `REACT_APP_CALENDLY_CONSULTING_URL` - Your Calendly event URL
   - **Pricing**: `REACT_APP_CONSULTING_SESSION_PRICE` and `REACT_APP_CONSULTING_SESSION_ACTUAL_PRICE`
   - **Backend API**: `REACT_APP_API_BASE_URL` - Your backend API URL (optional for development)
   - **SEO**: `REACT_APP_BASE_URL` - Your website base URL (optional, for SEO)
   
   See `.env.example` for all available environment variables.

5. Start the development server
```bash
npm start
```

The app will open at `http://localhost:3000`

## 📦 New Components & Features

### WhatsApp CTA Component
- **Location**: `src/components/WhatsAppCTA/`
- **Features**: Sticky floating button, mobile-first design, accessible
- **Configuration**: Set `REACT_APP_WHATSAPP_NUMBER` in `.env`
- **Usage**: Automatically included in MainLayout

### How We Work Component
- **Location**: `src/components/HowWeWork/`
- **Features**: 4-step visual process (Discover, Allocate, Review, Grow)
- **Usage**: Integrated into Home page

### Compliance Disclaimer Component
- **Location**: `src/components/ComplianceDisclaimer/`
- **Features**: Risk disclosure, AMFI/SEBI references, privacy policy link
- **Usage**: Integrated into Home page footer

### SEO Utilities
- **Location**: `src/utils/seo.js`
- **Features**: Dynamic meta tags, Open Graph, Twitter Cards, canonical URLs
- **Usage**: 
```javascript
import { updateSEO } from '../utils/seo';

useEffect(() => {
  updateSEO({
    title: 'Page Title',
    description: 'Page description',
    canonical: '/page-path'
  });
}, []);
```

## 🎨 Enhanced Features

### Hero Section
- Updated with outcome-based value proposition
- Educational positioning (no aggressive selling)
- Two CTAs: "Get Financial Clarity" and "Talk to an Advisor"

### Mobile UX
- Optimized tap targets (minimum 48px x 48px)
- Improved spacing for touch devices
- Responsive layouts across all new components

### SEO Enhancements
- Unique meta titles & descriptions per page
- Open Graph metadata for social sharing
- Twitter Card metadata
- Canonical URLs
- Proper H1/H2 hierarchy
- Structured data ready (FAQ schema placeholder)

## 📁 Project Structure

```
src/
├── components/
│   ├── WhatsAppCTA/          # WhatsApp floating button
│   ├── HowWeWork/            # 4-step process component
│   ├── ComplianceDisclaimer/ # Compliance & risk disclosure
│   └── ...
├── containers/
│   └── home/
│       └── Home.jsx          # Updated hero section
├── utils/
│   └── seo.js                # SEO utility functions
└── layout/
    └── MainLayout.jsx        # Includes WhatsAppCTA
```

## 🔧 Configuration

### WhatsApp CTA Setup
1. Add `REACT_APP_WHATSAPP_NUMBER` to your `.env` file
2. Format: Country code + number (e.g., `919876543210` for +91 98765 43210)
3. The component will automatically use this number

### SEO Configuration
- Update meta tags per page using `updateSEO()` utility
- Set `REACT_APP_BASE_URL` for canonical URLs and Open Graph images
- Add structured data using `generateFAQSchema()` and `addStructuredData()`

## 🚢 Building for Production

```bash
npm run build
```

The build folder will contain the optimized production build.

## 📝 Notes

- All new components are modular and reusable
- No breaking changes to existing functionality
- Components follow existing code patterns and styling
- Mobile-first responsive design throughout
- Accessible components with ARIA labels
- Performance optimized with lazy loading considerations

## 🏗️ Architecture

### Frontend-Backend Separation

This application follows a **clean architecture** with clear separation between frontend and backend:

#### Frontend (This Repository)
- **React Application**: UI components and client-side logic
- **API Client Layer**: `src/api/` - Centralized API communication
- **Service Layer**: `src/services/` - Business logic services
- **No Secrets**: All sensitive operations handled by backend

#### Backend (Separate Repository)
- **API Server**: Node.js/Express backend
- **Payment Processing**: Razorpay order creation and verification
- **Database**: Booking and payment storage
- **Secret Management**: Razorpay secret keys, API tokens

#### Communication
- **RESTful API**: Frontend communicates with backend via HTTP/HTTPS
- **Environment-Based**: Configure `REACT_APP_API_BASE_URL` for backend connection
- **Development Mode**: Works without backend (uses mock data)
- **Production Mode**: Requires backend API

### Project Structure

```
src/
├── api/                    # API client layer
│   ├── config.js          # API configuration
│   ├── client.js          # HTTP client
│   ├── paymentApi.js      # Payment API calls
│   ├── bookingApi.js      # Booking API calls
│   └── index.js           # API exports
├── services/               # Business logic services
│   ├── paymentService.js  # Payment operations
│   ├── bookingService.js  # Booking operations
│   └── notificationService.js
├── utils/                  # Utilities
│   ├── paymentConfig.js   # Payment configuration
│   ├── calendlyConfig.js  # Calendly configuration
│   └── seo.js             # SEO utilities
└── components/             # React components
```

### Development Modes

#### With Backend (Recommended)
1. Set `REACT_APP_API_BASE_URL=http://localhost:8000` in `.env`
2. Start backend API server
3. Frontend makes real API calls to backend
4. All operations use actual backend services

#### Without Backend (Development Only)
1. Don't set `REACT_APP_API_BASE_URL` or leave it empty
2. Frontend uses mock implementations
3. Console warnings indicate mock mode
4. **Not recommended for production**

## 💳 Payment Integration (Razorpay)

### Setup
1. Get your Razorpay Key ID from [Razorpay Dashboard](https://dashboard.razorpay.com) > Settings > API Keys
2. Add `REACT_APP_RAZORPAY_KEY_ID` to your `.env` file
3. Configure pricing: `REACT_APP_CONSULTING_SESSION_PRICE` and `REACT_APP_CONSULTING_SESSION_ACTUAL_PRICE`
4. **Backend Setup**: Configure Razorpay Secret Key in backend (see `BACKEND_API.md`)

### Features
- Secure payment gateway integration
- Support for UPI, Cards, Net Banking
- Payment verification via backend API
- Success/Error handling pages
- Google Analytics tracking

### Payment Flow
1. User fills consulting session form (`/consulting-session`)
2. User selects time slot via Calendly (`/booking`)
3. Frontend calls backend to create Razorpay order
4. User completes payment via Razorpay (`/payment`)
5. Frontend calls backend to verify payment
6. Backend saves booking and payment data
7. Redirect to success page (`/payment-success`)

### Backend Integration
⚠️ **Important**: Payment verification MUST be done on backend for security.

See `BACKEND_API.md` for complete backend API documentation.

**Backend Requirements:**
- Razorpay Secret Key (never in frontend)
- Payment order creation endpoint
- Payment verification endpoint
- Booking storage endpoint

## 📅 Calendly Integration

### Setup
1. Create a Calendly event type for consulting sessions
2. Get the event URL from Calendly > Event Types > Share
3. Add `REACT_APP_CALENDLY_CONSULTING_URL` to your `.env` file

### Features
- Embedded Calendly widget
- User data prefill (name, email, phone)
- Custom field mapping
- Booking completion tracking
- Automatic redirect to payment after booking

### Configuration
- Location: `src/utils/calendlyConfig.js`
- Customize prefill options and field mappings
- Widget styling matches brand colors

## 🔒 Compliance

- All content follows SEBI/AMFI compliance guidelines
- No return guarantees or stock tips
- Clear risk disclosures
- Privacy policy linked in compliance section
- Payment data handled securely via Razorpay

## 📄 License

[Add your license information here]
