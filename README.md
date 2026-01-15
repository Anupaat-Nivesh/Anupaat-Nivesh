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
   - `REACT_APP_WHATSAPP_NUMBER`: Your WhatsApp number in international format (e.g., `919876543210`)
   - `REACT_APP_BASE_URL`: Your website base URL (optional, for SEO)

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

## 🔒 Compliance

- All content follows SEBI/AMFI compliance guidelines
- No return guarantees or stock tips
- Clear risk disclosures
- Privacy policy linked in compliance section

## 📄 License

[Add your license information here]
