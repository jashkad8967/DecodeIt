# Production Email Setup Guide - FREE Options

## Overview
To receive emails in production, you need to deploy your server to a hosting platform so it runs 24/7. All options below are **100% FREE**.

## Step 1: Deploy the Server

### Option A: Railway (BEST FREE OPTION - Recommended)

**Free Tier**: $5 credit/month (usually enough for a small server that runs 24/7)

1. **Sign up at Railway**: https://railway.app
   - Use GitHub to sign up (easiest)
   - Free tier includes $5 credit/month

2. **Create a new project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your repository
   - **Important**: In the settings, set "Root Directory" to `server`
   - Railway will auto-detect `package.json` and deploy

3. **Set Environment Variables**:
   - Go to your project → Variables tab
   - Click "New Variable" and add:
     ```
     EMAIL_USER = jkadakiabusiness@gmail.com
     EMAIL_PASS = your-16-character-app-password
     ```
   - **Note**: `PORT` is usually auto-set by Railway, but you can add `PORT=3001` if needed
   - **Important**: No quotes needed around the password (Railway handles it)

4. **Get your server URL**:
   - After deployment, Railway gives you a URL like: `https://your-project-name.up.railway.app`
   - Copy this URL - you'll need it for the frontend

5. **Verify it's working**:
   - Check the "Deployments" tab for logs
   - Should see: "✅ Email transporter is ready to send messages"
   - Test: Visit `https://your-url.up.railway.app/api/health` - should return `{"status":"ok"}`

### Option B: Render (Free but spins down - slower first request)

**Free Tier**: Free forever, but server spins down after 15 minutes of inactivity (takes ~30 seconds to wake up)

1. **Sign up at Render**: https://render.com
2. **Create a new Web Service**:
   - Connect your GitHub repo
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Select "Free"

3. **Set Environment Variables**:
   - Go to Environment section
   - Add:
     ```
     EMAIL_USER = jkadakiabusiness@gmail.com
     EMAIL_PASS = your-16-character-app-password
     PORT = 3001
     ```

4. **Deploy**:
   - Render will build and deploy automatically
   - Your server will be at: `https://your-service-name.onrender.com`
   - **Note**: First request after inactivity may take 30 seconds (server waking up)

### Option C: Fly.io (Free tier available)

**Free Tier**: 3 shared-cpu VMs, 3GB persistent storage

1. **Install Fly CLI**: https://fly.io/docs/getting-started/installing-flyctl/
2. **Sign up**: `fly auth signup`
3. **Create app**:
   ```bash
   cd server
   fly launch
   ```
   - Follow prompts
   - Don't deploy yet (we need to set env vars first)

4. **Set environment variables**:
   ```bash
   fly secrets set EMAIL_USER=jkadakiabusiness@gmail.com
   fly secrets set EMAIL_PASS=your-16-character-app-password
   ```

5. **Deploy**:
   ```bash
   fly deploy
   ```

## 🎯 RECOMMENDATION: Use Railway

**Why Railway is best for free:**
- ✅ Server stays running 24/7 (no spin-down)
- ✅ $5 free credit/month (usually enough)
- ✅ Easy setup via GitHub
- ✅ Fast response times
- ✅ Good free tier limits

**Why Render is second choice:**
- ⚠️ Server spins down after 15 min inactivity
- ⚠️ First request after spin-down takes ~30 seconds
- ✅ But completely free forever

## Step 2: Update Frontend to Use Production Server

### Option A: Vercel (Recommended - Free & Easy)

1. **Deploy to Vercel**: https://vercel.com
   - Connect your GitHub repo
   - Vercel auto-detects React apps

2. **Set environment variable**:
   - Go to Project Settings → Environment Variables
   - Add:
     - Name: `REACT_APP_API_URL`
     - Value: `https://your-railway-url.up.railway.app` (from Step 1)
   - **Important**: Select "Production", "Preview", and "Development"
   - Click "Save"

3. **Redeploy**:
   - Go to Deployments tab
   - Click "..." on latest deployment → "Redeploy"
   - Or push a new commit to trigger redeploy

### Option B: Netlify (Free alternative)

1. **Deploy to Netlify**: https://netlify.com
   - Connect GitHub repo
   - Build command: `npm run build`
   - Publish directory: `build`

2. **Set environment variable**:
   - Site settings → Environment variables
   - Add: `REACT_APP_API_URL` = `https://your-server-url.com`

3. **Redeploy** from Deploys tab

### Option C: Manual Build

1. **Set environment variable before building**:
   ```bash
   REACT_APP_API_URL=https://your-server-url.com npm run build
   ```

2. **Deploy the `build` folder** to any static hosting

## Step 3: Verify It Works

1. **Check server logs** on your hosting platform:
   - Should see: "✅ Email transporter is ready to send messages"
   - Should see: "Server running on port 3001"

2. **Test the contact form**:
   - Submit a test message
   - Check your email inbox (and spam folder)

3. **Check server logs** for any errors

## 💰 Cost Breakdown (100% FREE)

- **Railway**: $5 free credit/month (usually enough for 24/7 server)
- **Render**: Completely free (but spins down after inactivity)
- **Fly.io**: Free tier available
- **Vercel/Netlify**: Free for frontend hosting
- **Total Cost**: $0/month ✅

## Important Notes

- **Railway**: Best option - server stays running 24/7, $5 credit usually enough
- **Render**: Free but spins down after 15 min (first request after spin-down takes ~30 sec)
- **Gmail App Password**: Must be valid and active (get from Google Account settings)
- **Environment variables**: Set in hosting platform dashboard, NOT in `.env` file (which isn't deployed)
- **Frontend rebuild**: Required after setting `REACT_APP_API_URL` environment variable

## Troubleshooting

- **"Failed to fetch"**: Check that `REACT_APP_API_URL` is set correctly in frontend
- **"Email transporter verification failed"**: Check server logs and verify `EMAIL_PASS` is correct
- **No emails received**: Check spam folder, verify server logs show successful send
- **Server not responding**: Check hosting platform logs for errors

