# Production Deployment Guide

This guide explains how to deploy the Anupaat Nivesh application (frontend + backend) to production.

## 🏗️ Architecture Overview

### Development
```
Frontend (React) → http://localhost:3000
Backend (Node.js) → http://localhost:8000
```

### Production
```
Frontend (Static Files) → https://www.anupaatnivesh.com
Backend (API Server) → https://api.anupaatnivesh.com
```

## 📦 Frontend Deployment

### Option 1: Static Hosting (Recommended)

#### Deploy to Netlify / Vercel

1. **Build the frontend:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   - Connect your GitHub repository
   - Build command: `npm run build`
   - Publish directory: `build`
   - Environment variables:
     ```
     REACT_APP_API_BASE_URL=https://api.anupaatnivesh.com
     REACT_APP_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
     REACT_APP_CALENDLY_CONSULTING_URL=https://calendly.com/anupaatnivesh/financial-planning-session
     REACT_APP_WHATSAPP_NUMBER=919501152200
     REACT_APP_BASE_URL=https://www.anupaatnivesh.com
     ```

3. **Deploy to Vercel:**
   - Similar process, connect GitHub repo
   - Auto-detects React app
   - Add environment variables in dashboard

#### Deploy to cPanel / Shared Hosting

1. **Build the frontend:**
   ```bash
   npm run build
   ```

2. **Upload build folder:**
   - Upload contents of `build/` folder to `public_html/`
   - Ensure `.htaccess` is uploaded (for React Router)

3. **Configure environment variables:**
   - Create `.env.production` file
   - Or set via hosting panel if supported

### Option 2: Server Deployment

1. **Build the frontend:**
   ```bash
   npm run build
   ```

2. **Set up Nginx:**
   ```nginx
   server {
       listen 80;
       server_name www.anupaatnivesh.com;
       
       root /var/www/anupaat-nivesh/build;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
       
       # Serve static files
       location /static {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

3. **Add SSL (Let's Encrypt):**
   ```bash
   sudo certbot --nginx -d www.anupaatnivesh.com
   ```

## 🔧 Backend Deployment

### Option 1: Heroku (Easiest)

1. **Install Heroku CLI:**
   ```bash
   npm install -g heroku-cli
   ```

2. **Login and create app:**
   ```bash
   heroku login
   heroku create anupaat-nivesh-api
   ```

3. **Set environment variables:**
   ```bash
   heroku config:set RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
   heroku config:set RAZORPAY_KEY_SECRET=your_production_secret
   heroku config:set FRONTEND_URL=https://www.anupaatnivesh.com
   heroku config:set NODE_ENV=production
   ```

4. **Deploy:**
   ```bash
   cd backend
   git push heroku main
   ```

5. **Get your API URL:**
   ```
   https://anupaat-nivesh-api.herokuapp.com
   ```

### Option 2: Railway

1. **Connect GitHub repository**
2. **Set root directory:** `backend`
3. **Add environment variables** in dashboard
4. **Deploy automatically** on push

### Option 3: DigitalOcean / AWS / VPS

1. **Set up server:**
   ```bash
   # SSH into your server
   ssh user@your-server-ip
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2
   sudo npm install -g pm2
   ```

2. **Clone and setup:**
   ```bash
   git clone https://github.com/yourusername/Anupaat-Nivesh.git
   cd Anupaat-Nivesh/backend
   npm install
   ```

3. **Create .env file:**
   ```bash
   nano .env
   # Add production environment variables
   ```

4. **Start with PM2:**
   ```bash
   pm2 start server.js --name anupaat-api
   pm2 save
   pm2 startup
   ```

5. **Set up Nginx reverse proxy:**
   ```nginx
   server {
       listen 80;
       server_name api.anupaatnivesh.com;
       
       location / {
           proxy_pass http://localhost:8000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

6. **Add SSL:**
   ```bash
   sudo certbot --nginx -d api.anupaatnivesh.com
   ```

## 🔐 Environment Variables Setup

### Frontend (.env.production)

```env
# API Configuration
REACT_APP_API_BASE_URL=https://api.anupaatnivesh.com

# Razorpay (Production Keys)
REACT_APP_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
REACT_APP_CONSULTING_SESSION_PRICE=99
REACT_APP_CONSULTING_SESSION_ACTUAL_PRICE=9999

# Calendly
REACT_APP_CALENDLY_CONSULTING_URL=https://calendly.com/anupaatnivesh/financial-planning-session

# WhatsApp
REACT_APP_WHATSAPP_NUMBER=919501152200

# Site Configuration
REACT_APP_BASE_URL=https://www.anupaatnivesh.com

# EmailJS (if using)
REACT_APP_EMAILJS_SERVICE_ID=service_xxxxx
REACT_APP_EMAILJS_TEMPLATE_ID=template_xxxxx
REACT_APP_EMAILJS_PUBLIC_KEY=xxxxx
```

### Backend (.env)

```env
# Server Configuration
PORT=8000
NODE_ENV=production
FRONTEND_URL=https://www.anupaatnivesh.com

# Razorpay (Production Keys)
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_production_secret_key

# Database (if using)
DATABASE_URL=your_database_connection_string
```

## 🌐 Domain Configuration

### Frontend Domain
- **Domain:** `www.anupaatnivesh.com`
- **DNS A Record:** Point to hosting IP or CNAME to hosting provider
- **SSL:** Enable HTTPS (required for production)

### Backend Domain
- **Domain:** `api.anupaatnivesh.com`
- **DNS A Record:** Point to backend server IP
- **SSL:** Enable HTTPS (required for API calls)

## ✅ Pre-Deployment Checklist

### Frontend
- [ ] Build succeeds without errors
- [ ] All environment variables set
- [ ] API base URL points to production backend
- [ ] Razorpay keys are production keys
- [ ] Test payment flow in staging
- [ ] SEO meta tags configured
- [ ] Analytics tracking enabled

### Backend
- [ ] Server starts without errors
- [ ] Health check endpoint works
- [ ] Razorpay keys are production keys
- [ ] CORS configured for frontend domain
- [ ] Environment variables set
- [ ] SSL certificate installed
- [ ] Database connected (if using)

## 🧪 Testing Production Setup

### 1. Test Health Check
```bash
curl https://api.anupaatnivesh.com/api/health
```

### 2. Test Payment Flow
1. Visit: `https://www.anupaatnivesh.com/consulting-session`
2. Fill the form
3. Book a time slot
4. Complete payment with test card
5. Verify booking is saved

### 3. Test API Endpoints
```bash
# Create order
curl -X POST https://api.anupaatnivesh.com/api/payments/create-order \
  -H "Content-Type: application/json" \
  -d '{"amount": 99, "currency": "INR"}'
```

## 🔄 Continuous Deployment

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run build
      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        with:
          args: deploy --prod --dir=build
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: |
          cd backend
          npm install
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "anupaat-nivesh-api"
          heroku_email: "your-email@example.com"
```

## 📊 Monitoring & Maintenance

### Backend Monitoring

1. **Health Checks:**
   - Set up uptime monitoring (UptimeRobot, Pingdom)
   - Monitor `/api/health` endpoint

2. **Error Tracking:**
   - Integrate Sentry for error tracking
   - Set up alerts for payment failures

3. **Logs:**
   - Use PM2 logs: `pm2 logs anupaat-api`
   - Or cloud logging (Heroku logs, Railway logs)

### Frontend Monitoring

1. **Analytics:**
   - Google Analytics configured
   - Track conversion events

2. **Error Tracking:**
   - Sentry for frontend errors
   - Monitor payment failures

## 🔒 Security Best Practices

1. **Never commit secrets** to Git
2. **Use environment variables** for all sensitive data
3. **Enable HTTPS** everywhere
4. **Use production Razorpay keys** in production
5. **Set up rate limiting** on backend
6. **Regular security updates** for dependencies
7. **Backup database** regularly (if using)

## 📞 Support

For deployment issues:
- Check `BACKEND_SETUP.md` for backend setup
- Check `BACKEND_API.md` for API documentation
- Check hosting provider documentation

## 🎯 Quick Reference

### Development URLs
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`

### Production URLs (Example)
- Frontend: `https://www.anupaatnivesh.com`
- Backend: `https://api.anupaatnivesh.com`

### Key Files
- Frontend build: `build/`
- Backend server: `backend/server.js`
- Environment: `.env` (backend) and `.env.production` (frontend)

