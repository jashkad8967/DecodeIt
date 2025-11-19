# How to Connect MongoDB to Your Backend

Follow these steps to connect your MongoDB database to your backend server.

## Step 1: Get Your MongoDB Connection String

If you haven't already:
1. Go to MongoDB Atlas (https://cloud.mongodb.com)
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Add your database name: `mongodb+srv://username:password@cluster.mongodb.net/decode-puzzle?retryWrites=true&w=majority`

## Step 2: Create .env File in Server Directory

1. Navigate to the `server` folder
2. Create a file named `.env` (no extension)
3. Add your connection string and other variables:

```env
# MongoDB Connection String
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/decode-puzzle?retryWrites=true&w=majority

# JWT Secret (generate one using: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
JWT_SECRET=your-generated-jwt-secret-here

# Server Port (optional, defaults to 3001)
PORT=3001

# Email Configuration (optional)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

**Important**: 
- Replace `username` and `password` with your actual MongoDB database user credentials
- Replace `cluster0.xxxxx.mongodb.net` with your actual cluster URL
- Generate a JWT_SECRET (see JWT_SECRET_GUIDE.md)

## Step 3: Install Backend Dependencies

Open a terminal in the project root and run:

```bash
cd server
npm install
```

This will install:
- mongoose (MongoDB driver)
- jsonwebtoken (JWT authentication)
- bcryptjs (password hashing)
- express, cors, dotenv, nodemailer

## Step 4: Start the Backend Server

```bash
cd server
npm start
```

You should see output like:
```
✅ .env file found at: C:\Users\jashk\decode-puzzle\server\.env
✅ Connected to MongoDB
Server running on port 3001
```

## Step 5: Verify Connection

### Check Console Output

When the server starts, look for:
- ✅ `Connected to MongoDB` - Connection successful!
- ❌ `MongoDB connection error` - Check your connection string

### Test Health Endpoint

Open a new terminal and run:
```bash
curl http://localhost:3001/api/health
```

Or visit in browser: http://localhost:3001/api/health

You should see:
```json
{
  "status": "ok",
  "database": "connected"
}
```

If `database` shows `"disconnected"`, there's a connection issue.

## Troubleshooting

### Error: "MongoDB connection error"

**Check:**
1. ✅ Connection string format is correct
2. ✅ Username and password are correct (database user, not Atlas account)
3. ✅ IP address is whitelisted in MongoDB Atlas Network Access
4. ✅ Database name is included in connection string
5. ✅ Internet connection is working

**Fix IP Whitelist:**
1. Go to MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. Click "Add Current IP Address"
4. Or add `0.0.0.0/0` for all IPs (less secure, easier for testing)

### Error: "Authentication failed"

- Make sure you're using the **database user** password, not your Atlas account password
- Check username and password in connection string
- Verify the database user exists in "Database Access"

### Error: "Connection timeout"

- Check your internet connection
- Verify the connection string is correct
- Make sure MongoDB Atlas cluster is running (not paused)
- Check firewall settings

### Error: "Invalid connection string"

- Make sure the format is: `mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority`
- Check for special characters in password (may need URL encoding)
- Verify database name is included

### .env File Not Found

**Windows:**
1. Make sure file is named `.env` (not `.env.txt`)
2. Create it in the `server` folder (same level as `package.json`)
3. In File Explorer, enable "Show file extensions" to verify

**Create via Command Line:**
```bash
cd server
echo MONGODB_URI=your-connection-string > .env
echo JWT_SECRET=your-secret >> .env
```

## Quick Start Commands

```bash
# 1. Navigate to server directory
cd server

# 2. Install dependencies (if not done)
npm install

# 3. Create .env file (edit with your values)
# Create .env file manually or use:
# Windows PowerShell:
notepad .env
# Mac/Linux:
nano .env

# 4. Start server
npm start
```

## Example .env File

```env
MONGODB_URI=mongodb+srv://myuser:mypassword123@cluster0.abc123.mongodb.net/decode-puzzle?retryWrites=true&w=majority
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2
PORT=3001
```

## Next Steps

Once connected:
1. ✅ Test registration: `POST http://localhost:3001/api/auth/register`
2. ✅ Test login: `POST http://localhost:3001/api/auth/login`
3. ✅ Configure frontend: Add `REACT_APP_API_URL=http://localhost:3001` to root `.env`
4. ✅ Start using the API in your app!

## Production Deployment

When deploying:
- Set `MONGODB_URI` as environment variable in your hosting platform
- Set `JWT_SECRET` as environment variable (different from development)
- Don't commit `.env` file to Git

