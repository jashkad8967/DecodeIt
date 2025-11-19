# How to Get Your MongoDB Connection String

## Option 1: MongoDB Atlas (Recommended - Free Cloud Database)

MongoDB Atlas offers a free tier that's perfect for development and small applications.

### Step 1: Create an Account
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up for a free account

### Step 2: Create a Cluster
1. After logging in, click **"Build a Database"**
2. Choose the **FREE (M0)** tier
3. Select a cloud provider and region (choose one closest to you)
4. Click **"Create"** (cluster creation takes 1-3 minutes)

### Step 3: Create Database User
1. Go to **"Database Access"** in the left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter a username and password (save these!)
5. Set user privileges to **"Atlas Admin"** or **"Read and write to any database"**
6. Click **"Add User"**

### Step 4: Whitelist Your IP Address
1. Go to **"Network Access"** in the left sidebar
2. Click **"Add IP Address"**
3. For development, click **"Add Current IP Address"**
4. For production, you can add **"0.0.0.0/0"** to allow all IPs (less secure but easier)
5. Click **"Confirm"**

### Step 5: Get Your Connection String
1. Go to **"Database"** in the left sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Select **"Node.js"** as the driver
5. Copy the connection string - it will look like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<username>` and `<password>` with your database user credentials
7. Add your database name at the end (before the `?`):
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/decode-puzzle?retryWrites=true&w=majority
   ```

### Step 6: Use in Your .env File
Add this to `server/.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/decode-puzzle?retryWrites=true&w=majority
```

**Important**: 
- Replace `username` and `password` with your actual database user credentials
- Replace `cluster0.xxxxx.mongodb.net` with your actual cluster URL
- The `decode-puzzle` part is your database name (you can change it)

---

## Option 2: Local MongoDB (For Development)

If you have MongoDB installed locally:

### Step 1: Install MongoDB
- **Windows**: Download from https://www.mongodb.com/try/download/community
- **Mac**: `brew install mongodb-community`
- **Linux**: Follow instructions at https://docs.mongodb.com/manual/installation/

### Step 2: Start MongoDB
- **Windows**: MongoDB should start as a service automatically
- **Mac/Linux**: `mongod` (or `brew services start mongodb-community` on Mac)

### Step 3: Get Connection String
Your connection string will be:
```
mongodb://localhost:27017/decode-puzzle
```

Add to `server/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/decode-puzzle
```

---

## Option 3: Other Hosting Options

### Railway
1. Create account at https://railway.app
2. Create new project
3. Add MongoDB service
4. Copy connection string from service settings

### Render
1. Create account at https://render.com
2. Create new MongoDB database
3. Copy connection string from database dashboard

### MongoDB Atlas (Alternative Method)
If you already have a cluster:
1. Go to your cluster
2. Click **"Connect"**
3. Choose **"Connect your application"**
4. Copy the connection string
5. Replace `<password>` with your actual password
6. Add database name: `mongodb+srv://user:pass@cluster.mongodb.net/decode-puzzle`

---

## Testing Your Connection

After setting up, test your connection:

1. Start your backend server:
   ```bash
   cd server
   npm start
   ```

2. Check the console output - you should see:
   ```
   ✅ Connected to MongoDB
   ```

3. If you see an error, check:
   - Username and password are correct
   - IP address is whitelisted (for Atlas)
   - Connection string format is correct
   - MongoDB service is running (for local)

---

## Security Notes

1. **Never commit your `.env` file** to Git
2. **Use strong passwords** for database users
3. **Restrict IP access** in production (don't use 0.0.0.0/0)
4. **Use environment variables** in production hosting
5. **Rotate passwords** regularly

---

## Troubleshooting

### "Authentication failed"
- Check username and password are correct
- Make sure you're using the database user password, not your Atlas account password

### "IP not whitelisted"
- Add your current IP to Network Access in Atlas
- For production, add your server's IP address

### "Connection timeout"
- Check your internet connection
- Verify the connection string is correct
- Make sure MongoDB service is running (for local)

### "Invalid connection string"
- Make sure the format is correct
- Check for special characters in password (may need URL encoding)
- Verify database name is included

