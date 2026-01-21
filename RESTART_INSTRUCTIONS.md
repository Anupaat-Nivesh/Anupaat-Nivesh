# ⚠️ IMPORTANT: Restart Dev Server After .env Changes

## The Problem
React environment variables (those starting with `REACT_APP_`) are **only loaded when the development server starts**. 

If you change `.env` file while the server is running, the changes **will NOT be picked up** until you restart.

## The Solution

### Step 1: Stop the Dev Server
- Press `Ctrl + C` in the terminal where `npm start` is running
- Wait for it to fully stop

### Step 2: Verify .env File
Check that your `.env` file has:
```bash
cat .env | grep CALENDLY
```

Should show:
```
REACT_APP_CALENDLY_CONSULTING_URL=https://calendly.com/anupaatnivesh/financial-planning-session
REACT_APP_CALENDLY_URL=https://calendly.com/anupaatnivesh/financial-planning-session
```

### Step 3: Restart the Dev Server
```bash
npm start
```

### Step 4: Verify in Browser
1. Open browser console (F12)
2. Look for "🔍 Environment Variables Check" log
3. Should show ✅ for `REACT_APP_CALENDLY_CONSULTING_URL`

## Quick Commands

```bash
# Check .env file
cat .env | grep CALENDLY

# Restart server (stop with Ctrl+C first, then):
npm start

# Clear cache and restart (if still not working)
rm -rf node_modules/.cache
npm start
```

## Still Not Working?

1. **Check .env file location**: Must be in project root (same level as `package.json`)
2. **Check file name**: Must be exactly `.env` (not `.env.local` or `.env.development`)
3. **Check variable names**: Must start with `REACT_APP_`
4. **Check for typos**: No spaces around `=`
5. **Clear cache**: `rm -rf node_modules/.cache && npm start`
