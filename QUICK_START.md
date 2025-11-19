# Quick Start: Connect MongoDB

You have `.env` files in both locations. Here's what each is for:

## Two .env Files

1. **Root `.env`** (for frontend):
   - Contains: `REACT_APP_API_URL=http://localhost:3001`
   - Used by: React frontend app

2. **Server `.env`** (for backend):
   - Contains: `MONGODB_URI=...`, `JWT_SECRET=...`, `PORT=3001`
   - Used by: Node.js backend server

## Step-by-Step Connection

### 1. Edit Server .env File

Open `server/.env` and add your MongoDB connection string:

```env
# MongoDB Connection String
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/decode-puzzle?retryWrites=true&w=majority

# JWT Secret (generate one)
JWT_SECRET=your-generated-secret-here

# Server Port
PORT=3001
```

**Replace:**
- `username` with your MongoDB database username
- `password` with your MongoDB database password
- `cluster0.xxxxx.mongodb.net` with your actual cluster URL

### 2. Generate JWT Secret (if not done)

Run this command:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and paste it as `JWT_SECRET` in `server/.env`

### 3. Install Dependencies (if not done)

```bash
cd server
npm install
```

### 4. Start the Server

```bash
cd server
npm start
```

### 5. Check Connection

Look for this in the console:
```
✅ Connected to MongoDB
```

If you see:
```
❌ MongoDB connection error
```

Check:
- Connection string format
- Username/password are correct
- IP address is whitelisted in MongoDB Atlas

## Example server/.env File

```env
MONGODB_URI=mongodb+srv://myuser:mypass123@cluster0.abc123.mongodb.net/decode-puzzle?retryWrites=true&w=majority
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2
PORT=3001
```

## Example Root .env File (for frontend)

```env
REACT_APP_API_URL=http://localhost:3001
```

## Test Connection

After starting the server, test it:
```bash
curl http://localhost:3001/api/health
```

Should return:
```json
{
  "status": "ok",
  "database": "connected"
}
```

