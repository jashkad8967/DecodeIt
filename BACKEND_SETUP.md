# Backend Setup Guide

This guide will help you set up the backend API for cross-device synchronization.

## Prerequisites

1. **MongoDB Database**: You'll need a MongoDB database. Options:
   - **MongoDB Atlas** (Free tier available): https://www.mongodb.com/cloud/atlas
   - **Local MongoDB**: Install MongoDB locally
   - **Other MongoDB hosting**: Railway, Render, etc.

2. **Node.js**: Make sure Node.js is installed

## Setup Steps

### 1. Install Backend Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `server` directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/decode-puzzle
# OR for local MongoDB:
# MONGODB_URI=mongodb://localhost:27017/decode-puzzle

# JWT Secret (change this to a random string in production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Port (optional, defaults to 3001)
PORT=3001

# Email Configuration (optional, for contact form)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

**Important**: 
- Replace `MONGODB_URI` with your actual MongoDB connection string
- Change `JWT_SECRET` to a random secure string in production
- For MongoDB Atlas, create a cluster and get the connection string from the dashboard

### 3. Start the Backend Server

```bash
cd server
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The server should start on port 3001 (or your configured PORT).

### 4. Configure Frontend

Create a `.env` file in the root directory (same level as `package.json`):

```env
REACT_APP_API_URL=http://localhost:3001
```

For production, update this to your deployed backend URL:

```env
REACT_APP_API_URL=https://your-backend-url.com
```

### 5. Deploy Backend (Optional)

#### Option A: Railway
1. Create account at https://railway.app
2. Create new project
3. Connect your GitHub repo
4. Add MongoDB service
5. Set environment variables in Railway dashboard
6. Deploy

#### Option B: Render
1. Create account at https://render.com
2. Create new Web Service
3. Connect your GitHub repo
4. Set build command: `cd server && npm install`
5. Set start command: `cd server && npm start`
6. Add MongoDB database service
7. Set environment variables
8. Deploy

#### Option C: Heroku
1. Create account at https://heroku.com
2. Install Heroku CLI
3. Create app: `heroku create your-app-name`
4. Add MongoDB addon: `heroku addons:create mongolab`
5. Set environment variables: `heroku config:set JWT_SECRET=your-secret`
6. Deploy: `git push heroku main`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Sign in user

### User Profile
- `GET /api/user/profile` - Get current user profile
- `PUT /api/user/profile` - Update profile
- `PUT /api/user/password` - Change password
- `DELETE /api/user/account` - Delete account

### User Data
- `GET /api/data/userdata` - Get user data (points, streak, deeds)
- `PUT /api/data/userdata` - Save user data
- `GET /api/data/leaderboard` - Get leaderboard
- `GET /api/data/community` - Get community posts

### Likes
- `POST /api/likes/toggle` - Toggle like on entry
- `POST /api/likes/status` - Get like status for entries
- `POST /api/likes/counts` - Get like counts for entries

## Testing

1. Start the backend server
2. Test health endpoint: `curl http://localhost:3001/api/health`
3. Test registration:
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test1234","birthday":"2000-01-01"}'
```

## Migration from LocalStorage

The frontend has been updated to use the API with localStorage fallback. To fully migrate:

1. Set up the backend as described above
2. Set `REACT_APP_API_URL` in your frontend `.env`
3. Users will need to re-register (or you can migrate existing data)
4. The app will automatically use the API when available

## Troubleshooting

### MongoDB Connection Issues
- Check your MongoDB connection string
- Ensure your IP is whitelisted (for MongoDB Atlas)
- Check firewall settings

### CORS Errors
- The backend has CORS enabled for all origins
- If issues persist, check the `cors` configuration in `server/index.js`

### Authentication Errors
- Check that JWT_SECRET is set
- Verify token is being sent in Authorization header
- Check token expiration (default: 30 days)

