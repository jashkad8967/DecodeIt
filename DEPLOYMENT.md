# Deployment Guide

## Backend Server Deployment

### Step 1: Deploy the Server

Choose a hosting platform (Heroku, Railway, Render, etc.) and deploy your `server` directory.

### Step 2: Set Environment Variables

In your hosting platform's dashboard, set these environment variables:

```
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS="your-app-password-with-#-symbol"
PORT=3001
```

**Important for passwords with `#`:**
- Most platforms handle special characters automatically
- If your password contains `#`, `$`, or spaces, wrap the entire value in double quotes when setting it
- Example: `EMAIL_PASS="abcd efgh ijkl mnop"` (with quotes)

### Step 3: Verify Server is Running

- Check your server logs to see: "Email transporter is ready to send messages"
- Test the health endpoint: `https://your-server.com/api/health`

## Frontend Deployment

### Step 1: Set API URL Environment Variable

Before building your React app, set the `REACT_APP_API_URL` environment variable:

**For local build:**
```bash
REACT_APP_API_URL=https://your-server.com npm run build
```

**For hosting platforms (Vercel, Netlify, etc.):**
- Go to your project settings
- Add environment variable: `REACT_APP_API_URL` = `https://your-server.com`
- Rebuild your app

### Step 2: Build and Deploy

```bash
npm run build
```

Deploy the `build` folder to your hosting platform.

## Platform-Specific Instructions

### Heroku (Backend)
1. Create a new Heroku app
2. Go to Settings → Config Vars
3. Add: `EMAIL_USER`, `EMAIL_PASS`, `PORT`
4. Deploy: `git push heroku main`

### Railway (Backend)
1. Create new project
2. Go to Variables tab
3. Add: `EMAIL_USER`, `EMAIL_PASS`, `PORT`
4. Connect your GitHub repo

### Render (Backend)
1. Create new Web Service
2. Go to Environment section
3. Add: `EMAIL_USER`, `EMAIL_PASS`, `PORT`
4. Deploy from GitHub

### Vercel/Netlify (Frontend)
1. Go to Project Settings → Environment Variables
2. Add: `REACT_APP_API_URL` = `https://your-backend-url.com`
3. Redeploy your app

## Testing After Deployment

1. Check server logs for "Email transporter is ready"
2. Submit the contact form
3. Check your email inbox (and spam folder)
4. Verify inputs clear after successful submission

