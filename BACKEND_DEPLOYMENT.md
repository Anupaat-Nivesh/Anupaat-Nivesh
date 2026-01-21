# Backend Deployment Guide

Complete step-by-step guide to deploy the Anupaat Nivesh backend API server to production.

## 📋 Prerequisites

- Node.js 18+ installed
- Production Razorpay keys (Key ID and Secret)
- Domain name for API (e.g., `api.anupaatnivesh.com`)
- Server access (VPS, cloud instance, or hosting account)

## 🚀 Deployment Options

### Option 1: VPS/Cloud Server (Recommended for Production)

#### Step 1: Server Setup

**1.1 Connect to Your Server**
```bash
ssh user@your-server-ip
```

**1.2 Install Node.js**
```bash
# Update package list
sudo apt update

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should show v18.x or higher
npm --version
```

**1.3 Install PM2 (Process Manager)**
```bash
sudo npm install -g pm2
```

**1.4 Install Nginx (Reverse Proxy)**
```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

#### Step 2: Deploy Application

**2.1 Clone Repository**
```bash
# Navigate to web directory
cd /var/www

# Clone your repository
sudo git clone https://github.com/yourusername/Anupaat-Nivesh.git
sudo chown -R $USER:$USER Anupaat-Nivesh
cd Anupaat-Nivesh/backend
```

**2.2 Install Dependencies**
```bash
npm install --production
```

**2.3 Create Environment File**
```bash
nano .env
```

Add the following (replace with your actual values):
```env
# Server Configuration
PORT=8000
NODE_ENV=production

# Frontend URL (for CORS)
FRONTEND_URL=https://www.anupaatnivesh.com

# Razorpay Production Keys
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_production_secret_key_here
```

**2.4 Test the Server**
```bash
# Start server manually to test
node server.js
```

You should see:
```
🚀 Anupaat Nivesh API Server running on port 8000
📍 Health check: http://localhost:8000/api/health
🔑 Razorpay Key ID: ✅ Configured
🔐 Razorpay Secret: ✅ Configured
```

Press `Ctrl+C` to stop.

#### Step 3: Run with PM2

**3.1 Start with PM2**
```bash
pm2 start server.js --name anupaat-api
```

**3.2 Configure PM2 to Start on Boot**
```bash
pm2 save
pm2 startup
# Follow the instructions shown
```

**3.3 PM2 Useful Commands**
```bash
# View logs
pm2 logs anupaat-api

# View status
pm2 status

# Restart
pm2 restart anupaat-api

# Stop
pm2 stop anupaat-api

# Monitor
pm2 monit
```

#### Step 4: Configure Nginx

**4.1 Create Nginx Configuration**
```bash
sudo nano /etc/nginx/sites-available/anupaat-api
```

Add the following (replace `api.anupaatnivesh.com` with your domain):
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
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Increase timeout for payment processing
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

**4.2 Enable Site**
```bash
sudo ln -s /etc/nginx/sites-available/anupaat-api /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl reload nginx
```

#### Step 5: Setup SSL with Let's Encrypt

**5.1 Install Certbot**
```bash
sudo apt install certbot python3-certbot-nginx -y
```

**5.2 Get SSL Certificate**
```bash
sudo certbot --nginx -d api.anupaatnivesh.com
```

Follow the prompts:
- Enter your email
- Agree to terms
- Choose to redirect HTTP to HTTPS

**5.3 Auto-Renewal Setup**
```bash
# Test renewal
sudo certbot renew --dry-run

# Certbot automatically sets up renewal, but verify:
sudo systemctl status certbot.timer
```

#### Step 6: Configure Firewall

```bash
# Allow SSH, HTTP, and HTTPS
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

### Option 2: Heroku (Easiest for Quick Deployment)

#### Step 1: Install Heroku CLI
```bash
# macOS
brew install heroku/brew/heroku

# Or download from: https://devcenter.heroku.com/articles/heroku-cli
```

#### Step 2: Login and Create App
```bash
heroku login
cd backend
heroku create anupaat-nivesh-api
```

#### Step 3: Set Environment Variables
```bash
heroku config:set NODE_ENV=production
heroku config:set RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
heroku config:set RAZORPAY_KEY_SECRET=your_production_secret_key
heroku config:set FRONTEND_URL=https://www.anupaatnivesh.com
```

#### Step 4: Deploy
```bash
git push heroku main
```

#### Step 5: Verify
```bash
heroku logs --tail
heroku open
```

Your API will be available at: `https://anupaat-nivesh-api.herokuapp.com`

### Option 3: Railway (Modern Alternative)

1. **Sign up at** https://railway.app
2. **Create New Project**
3. **Deploy from GitHub** (connect your repository)
4. **Set Root Directory** to `backend`
5. **Add Environment Variables:**
   - `NODE_ENV=production`
   - `RAZORPAY_KEY_ID=rzp_live_...`
   - `RAZORPAY_KEY_SECRET=...`
   - `FRONTEND_URL=https://www.anupaatnivesh.com`
6. **Deploy** (automatic on push)

### Option 4: DigitalOcean App Platform

1. **Create App** in DigitalOcean dashboard
2. **Connect GitHub** repository
3. **Set Root Directory** to `backend`
4. **Configure Environment Variables**
5. **Deploy**

## 🔧 Post-Deployment Configuration

### 1. Update Frontend API URL

Update your frontend `.env.production`:
```env
REACT_APP_API_BASE_URL=https://api.anupaatnivesh.com
```

### 2. Test Backend Endpoints

```bash
# Health check
curl https://api.anupaatnivesh.com/api/health

# Create order (test)
curl -X POST https://api.anupaatnivesh.com/api/payments/create-order \
  -H "Content-Type: application/json" \
  -d '{"amount": 99, "currency": "INR"}'
```

### 3. Configure DNS

Add an A record pointing to your server IP:
```
Type: A
Name: api
Value: your-server-ip
TTL: 3600
```

Or CNAME if using a platform:
```
Type: CNAME
Name: api
Value: your-platform-domain.com
```

## 📊 Monitoring & Maintenance

### Health Monitoring

**1. Set up Uptime Monitoring**
- Use services like UptimeRobot, Pingdom, or StatusCake
- Monitor: `https://api.anupaatnivesh.com/api/health`
- Set alerts for downtime

**2. Log Monitoring**
```bash
# PM2 logs
pm2 logs anupaat-api --lines 100

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Performance Monitoring

**1. PM2 Monitoring**
```bash
pm2 monit
```

**2. Server Resources**
```bash
# CPU and Memory
htop

# Disk space
df -h
```

### Backup Strategy

**1. Environment Variables**
- Keep `.env` file backed up securely
- Use password manager for secrets

**2. Application Code**
- Code is in Git (already backed up)
- Regular commits and pushes

**3. Database (if added later)**
- Set up automated database backups
- Store backups off-server

## 🔄 Updating the Backend

### Method 1: Git Pull (Recommended)
```bash
cd /var/www/Anupaat-Nivesh/backend
git pull origin main
npm install --production
pm2 restart anupaat-api
```

### Method 2: Manual Update
```bash
# Stop server
pm2 stop anupaat-api

# Update code
# ... make changes ...

# Restart
pm2 start anupaat-api
```

## 🐛 Troubleshooting

### Server Won't Start

**Check logs:**
```bash
pm2 logs anupaat-api
```

**Common issues:**
- Port 8000 already in use: Change `PORT` in `.env`
- Missing environment variables: Check `.env` file
- Razorpay keys invalid: Verify keys in Razorpay dashboard

### Nginx 502 Bad Gateway

**Check:**
```bash
# Is Node.js server running?
pm2 status

# Check Nginx error log
sudo tail -f /var/log/nginx/error.log

# Test backend directly
curl http://localhost:8000/api/health
```

### SSL Certificate Issues

**Renew certificate:**
```bash
sudo certbot renew
sudo systemctl reload nginx
```

### CORS Errors

**Verify:**
- `FRONTEND_URL` in `.env` matches frontend domain
- Nginx configuration allows CORS (if needed)
- Backend CORS middleware configured correctly

## 🔒 Security Best Practices

1. **Keep Dependencies Updated**
   ```bash
   npm audit
   npm audit fix
   ```

2. **Use Strong Passwords**
   - SSH keys instead of passwords
   - Complex passwords for all services

3. **Regular Updates**
   ```bash
   sudo apt update
   sudo apt upgrade
   ```

4. **Firewall Configuration**
   - Only allow necessary ports
   - Block unnecessary access

5. **Monitor Logs**
   - Check for suspicious activity
   - Set up alerts for errors

## 📝 Quick Reference

### Essential Commands

```bash
# Start server
pm2 start server.js --name anupaat-api

# View logs
pm2 logs anupaat-api

# Restart
pm2 restart anupaat-api

# Stop
pm2 stop anupaat-api

# Status
pm2 status

# Reload Nginx
sudo systemctl reload nginx

# Test Nginx config
sudo nginx -t
```

### File Locations

- **Application:** `/var/www/Anupaat-Nivesh/backend/`
- **Environment:** `/var/www/Anupaat-Nivesh/backend/.env`
- **Nginx Config:** `/etc/nginx/sites-available/anupaat-api`
- **SSL Certs:** `/etc/letsencrypt/live/api.anupaatnivesh.com/`

## ✅ Deployment Checklist

- [ ] Node.js installed
- [ ] PM2 installed
- [ ] Application cloned
- [ ] Dependencies installed
- [ ] `.env` file created with production keys
- [ ] Server starts successfully
- [ ] PM2 configured and running
- [ ] Nginx configured
- [ ] SSL certificate installed
- [ ] DNS configured
- [ ] Health check endpoint works
- [ ] Payment order creation works
- [ ] CORS configured correctly
- [ ] Firewall configured
- [ ] Monitoring set up
- [ ] Backups configured

## 🎯 Next Steps

1. ✅ Deploy backend using one of the methods above
2. ✅ Test all API endpoints
3. ✅ Update frontend with backend URL
4. ✅ Run complete payment flow test
5. ✅ Set up monitoring
6. ✅ Go live! 🚀

## 📞 Support

If you encounter issues:
1. Check server logs: `pm2 logs anupaat-api`
2. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Verify environment variables
4. Test backend directly: `curl http://localhost:8000/api/health`
5. Review this guide and `BACKEND_SETUP.md`

