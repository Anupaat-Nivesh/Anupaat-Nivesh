# Hostinger Backend Deployment Guide

## ✅ Can You Deploy Backend on Hostinger?

**Yes, but it depends on your Hostinger plan:**

### Supported Plans:
- ✅ **Business Hosting** - Supports Node.js Web Apps
- ✅ **Cloud Hosting** - Supports Node.js Web Apps
- ✅ **VPS Hosting** - Full control, can install Node.js manually
- ❌ **Shared/Basic Hosting** - Usually doesn't support Node.js backends

### Check Your Plan:
1. Login to Hostinger hPanel
2. Go to **Websites** → Check your plan type
3. Look for **"Node.js Web App"** option in the menu

## 🚀 Deployment Options on Hostinger

### Option 1: Hostinger Node.js Web App (Recommended if Available)

If your plan supports it, this is the easiest method.

#### Step 1: Prepare Your Backend

1. **Ensure `package.json` has start script:**
   ```json
   {
     "scripts": {
       "start": "node server.js"
     }
   }
   ```

2. **Create/Update `backend/.env` with production values:**
   ```env
   PORT=8000
   NODE_ENV=production
   FRONTEND_URL=https://www.anupaatnivesh.com
   RAZORPAY_KEY_ID=rzp_live_S46rOVxN6EPLPl
   RAZORPAY_KEY_SECRET=C6D1F9oxRsgYmQ2ejxGBmwHy
   ```

#### Step 2: Deploy via Hostinger hPanel

1. **Login to Hostinger hPanel**
2. **Navigate to:** Websites → Add Website → Node.js Web App
3. **Choose deployment method:**
   - **Option A: GitHub Integration** (Recommended)
     - Connect your GitHub account
     - Select repository
     - Set root directory to `backend`
   
   - **Option B: ZIP Upload**
     - Zip the `backend/` folder
     - Upload via hPanel
     - Extract in the Node.js app directory

4. **Configure Environment Variables:**
   - In hPanel, go to your Node.js app settings
   - Find "Environment Variables" section
   - Add all variables from `backend/.env`:
     ```
     PORT=8000
     NODE_ENV=production
     FRONTEND_URL=https://www.anupaatnivesh.com
     RAZORPAY_KEY_ID=rzp_live_S46rOVxN6EPLPl
     RAZORPAY_KEY_SECRET=C6D1F9oxRsgYmQ2ejxGBmwHy
     ```

5. **Set Node.js Version:**
   - Select Node.js 18.x or 20.x (match your local version)

6. **Configure Start Command:**
   - Start command: `node server.js`
   - Or: `npm start` (if package.json has start script)

7. **Deploy:**
   - Click "Deploy" or "Save"
   - Wait for deployment to complete

#### Step 3: Get Your Backend URL

After deployment, Hostinger will provide:
- **App URL:** `https://your-app-name.hostingerapp.com`
- **Or custom domain:** `https://api.anupaatnivesh.com` (if configured)

#### Step 4: Update Frontend `.env`

Update your frontend `.env`:
```env
REACT_APP_API_BASE_URL=https://your-backend-url.com
```

### Option 2: Hostinger VPS (Full Control)

If you have VPS hosting, you have full control.

#### Step 1: Connect to VPS

```bash
ssh root@your-vps-ip
```

#### Step 2: Install Node.js

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Verify
node --version
npm --version
```

#### Step 3: Install PM2

```bash
npm install -g pm2
```

#### Step 4: Deploy Application

```bash
# Clone repository
cd /var/www
git clone https://github.com/yourusername/Anupaat-Nivesh.git
cd Anupaat-Nivesh/backend

# Install dependencies
npm install --production

# Create .env file
nano .env
# Add all environment variables

# Start with PM2
pm2 start server.js --name anupaat-api
pm2 save
pm2 startup
```

#### Step 5: Configure Nginx (if needed)

```bash
# Install Nginx
apt install nginx -y

# Create config
nano /etc/nginx/sites-available/anupaat-api
```

Add:
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
    }
}
```

Enable and restart:
```bash
ln -s /etc/nginx/sites-available/anupaat-api /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

#### Step 6: Setup SSL

```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y

# Get certificate
certbot --nginx -d api.anupaatnivesh.com
```

### Option 3: Use Subdomain on Same Hostinger Account

If your frontend is on Hostinger, you can deploy backend as subdomain:

1. **In hPanel:**
   - Go to **Domains** → **Subdomains**
   - Create subdomain: `api.anupaatnivesh.com`
   - Point to Node.js app directory

2. **Deploy backend** using Option 1 or 2 above

3. **Update frontend `.env`:**
   ```env
   REACT_APP_API_BASE_URL=https://api.anupaatnivesh.com
   ```

## 🔧 Post-Deployment Configuration

### 1. Test Backend

```bash
# Health check
curl https://your-backend-url.com/api/health

# Should return:
# {"status":"ok","timestamp":"...","service":"Anupaat Nivesh API"}
```

### 2. Update Frontend

Update frontend `.env`:
```env
REACT_APP_API_BASE_URL=https://your-backend-url.com
```

### 3. Test Complete Flow

1. Visit your frontend
2. Try booking a session
3. Complete test payment
4. Verify everything works

## 📋 Hostinger Deployment Checklist

- [ ] Verified Hostinger plan supports Node.js
- [ ] Backend code prepared (package.json has start script)
- [ ] `.env` file updated with production values
- [ ] Deployed via hPanel or VPS
- [ ] Environment variables set in hPanel
- [ ] Backend URL obtained
- [ ] Frontend `.env` updated with backend URL
- [ ] Health check endpoint tested
- [ ] Payment order creation tested
- [ ] Complete flow tested

## 🐛 Troubleshooting

### Backend Not Starting

**Check logs in hPanel:**
- Go to Node.js app → Logs
- Check for errors

**Common issues:**
- Missing environment variables
- Wrong Node.js version
- Port conflict
- Missing dependencies

### CORS Errors

**Verify:**
- `FRONTEND_URL` in backend `.env` matches frontend domain
- Frontend domain is allowed in CORS config

### Can't Access Backend

**Check:**
- Backend is running (check logs)
- Port is correct
- Firewall allows connections
- Domain DNS is configured

## 💡 Alternative: If Hostinger Doesn't Support Node.js

If your current plan doesn't support Node.js, consider:

1. **Upgrade to Business/Cloud Plan** (if available)
2. **Use Hostinger VPS** (more control)
3. **Use Alternative Hosting:**
   - **Railway** (Free tier available)
   - **Render** (Free tier available)
   - **Heroku** (Paid, but easy)
   - **DigitalOcean App Platform**
   - **AWS/Google Cloud**

## 📞 Next Steps

1. ✅ Check your Hostinger plan
2. ✅ Choose deployment method (Node.js Web App or VPS)
3. ✅ Deploy backend
4. ✅ Get backend URL
5. ✅ Update frontend `.env`
6. ✅ Test everything
7. ✅ Go live! 🚀

