# Deploy Frontend to Hostinger

## 🚀 Step-by-Step Guide

### Prerequisites
- Hostinger hosting account
- Frontend built and ready
- Backend URL from Vercel

### Step 1: Build Frontend for Production

```bash
# Make sure you're in the root directory
npm run build
```

This creates a `build/` folder with all static files.

**Verify build:**
```bash
ls -la build/
```

Should see:
- `index.html`
- `static/` folder
- `manifest.json`
- Other assets

### Step 2: Update Environment Variables

Before building, make sure `.env` has production values:

```env
REACT_APP_API_BASE_URL=https://your-backend-url.vercel.app
REACT_APP_BASE_URL=https://www.anupaatnivesh.com
REACT_APP_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
REACT_APP_CONSULTING_SESSION_PRICE=999
REACT_APP_CONSULTING_SESSION_ACTUAL_PRICE=999
REACT_APP_CALENDLY_CONSULTING_URL=https://calendly.com/anupaatnivesh/financial-planning-session
REACT_APP_WHATSAPP_NUMBER=919501195200
```

**Important:** Replace `your-backend-url.vercel.app` with your actual Vercel backend URL.

### Step 3: Rebuild with Production Environment

```bash
# Set NODE_ENV to production
NODE_ENV=production npm run build
```

Or create `.env.production`:
```bash
cp .env .env.production
# Edit .env.production with production values
npm run build
```

### Step 4: Upload to Hostinger

#### Option A: Via File Manager (cPanel/hPanel)

1. **Login to Hostinger:**
   - Go to hPanel
   - Navigate to File Manager

2. **Navigate to public_html:**
   - Go to `public_html/` folder
   - This is your website root

3. **Backup Existing Files (if any):**
   - Create backup folder
   - Move existing files to backup

4. **Upload Build Files:**
   - Select all files from `build/` folder
   - Upload to `public_html/`
   - **Important:** Upload contents of `build/` folder, not the `build/` folder itself

5. **Verify Upload:**
   - `index.html` should be in `public_html/`
   - `static/` folder should be in `public_html/`

#### Option B: Via FTP

1. **Get FTP Credentials:**
   - From Hostinger hPanel
   - FTP Host, Username, Password

2. **Connect via FTP Client:**
   - Use FileZilla, Cyberduck, or similar
   - Connect to your server

3. **Upload Files:**
   - Navigate to `public_html/`
   - Upload all files from `build/` folder
   - Maintain folder structure

### Step 5: Configure .htaccess for React Router

Create or update `.htaccess` in `public_html/`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

This ensures React Router works correctly.

### Step 6: Set File Permissions

```bash
# Via File Manager or FTP
# Set permissions:
- Folders: 755
- Files: 644
- .htaccess: 644
```

### Step 7: Test Your Website

1. **Visit your domain:**
   - `https://www.anupaatnivesh.com`
   - Should load your React app

2. **Test Routes:**
   - Navigate to different pages
   - Check if React Router works
   - Test booking flow

3. **Check Browser Console:**
   - Open DevTools (F12)
   - Check for errors
   - Verify API calls go to backend

### Step 8: Enable HTTPS (SSL)

1. **In Hostinger hPanel:**
   - Go to "SSL" section
   - Enable "Let's Encrypt SSL"
   - Select your domain
   - Activate SSL

2. **Force HTTPS:**
   - Add to `.htaccess`:
   ```apache
   RewriteEngine On
   RewriteCond %{HTTPS} off
   RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
   ```

## 📋 Hostinger Deployment Checklist

- [ ] Frontend built (`npm run build`)
- [ ] `.env` updated with production backend URL
- [ ] Build files uploaded to `public_html/`
- [ ] `.htaccess` configured for React Router
- [ ] File permissions set correctly
- [ ] SSL certificate enabled
- [ ] Website loads correctly
- [ ] React Router works
- [ ] API calls connect to backend
- [ ] Payment flow tested

## 🔧 Troubleshooting

### Issue: Blank Page

**Solutions:**
- Check browser console for errors
- Verify `index.html` is in root
- Check file paths are correct
- Clear browser cache

### Issue: 404 on Routes

**Solution:**
- Verify `.htaccess` is uploaded
- Check mod_rewrite is enabled
- Test `.htaccess` syntax

### Issue: API Calls Failing

**Solutions:**
- Verify `REACT_APP_API_BASE_URL` in build
- Check backend URL is correct
- Verify CORS is configured on backend
- Check browser console for errors

### Issue: Assets Not Loading

**Solutions:**
- Check `public/` folder files are in `build/`
- Verify file paths in `index.html`
- Check file permissions
- Clear browser cache

### Issue: Build Files Too Large

**Solutions:**
- Optimize images
- Enable gzip compression in Hostinger
- Use CDN for static assets

## 🎯 Post-Deployment Testing

### 1. Basic Functionality
- [ ] Homepage loads
- [ ] Navigation works
- [ ] All pages accessible
- [ ] Forms work

### 2. Payment Flow
- [ ] Can access booking page
- [ ] Form submission works
- [ ] API connects to backend
- [ ] Razorpay checkout opens
- [ ] Payment can be completed
- [ ] Success page shows

### 3. Performance
- [ ] Page load time < 3 seconds
- [ ] Images load correctly
- [ ] No console errors
- [ ] Mobile responsive

## 📝 Important Notes

1. **Environment Variables:** React apps bundle environment variables at build time. You must rebuild if you change `.env`.

2. **Build Location:** Upload contents of `build/` folder, not the folder itself.

3. **File Structure:**
   ```
   public_html/
   ├── index.html
   ├── static/
   │   ├── css/
   │   ├── js/
   │   └── media/
   ├── manifest.json
   ├── robots.txt
   └── .htaccess
   ```

4. **Updates:** To update frontend:
   - Make changes
   - Run `npm run build`
   - Upload new `build/` files
   - Clear browser cache

## 🔄 Update Process

When you need to update:

1. **Make changes** to code
2. **Update `.env`** if needed
3. **Rebuild:** `npm run build`
4. **Upload** new build files
5. **Test** on production

## 🎯 Next Steps

After deployment:
1. ✅ Test website loads
2. ✅ Test payment flow
3. ✅ Verify backend connection
4. ✅ Test on mobile
5. ✅ Monitor for errors

## 🔗 Useful Resources

- Hostinger Help: https://www.hostinger.com/tutorials
- React Deployment: https://create-react-app.dev/docs/deployment
- .htaccess Guide: https://www.hostinger.com/tutorials/htaccess

