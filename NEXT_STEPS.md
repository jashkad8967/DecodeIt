# Next Steps: Connect Frontend to API

Now that your MongoDB backend is connected, here's what to do next:

## Step 1: Configure Frontend to Use API

### Create/Update Root .env File

Create a `.env` file in the **root directory** (same level as `package.json`):

```env
REACT_APP_API_URL=http://localhost:3001
```

For production, change this to your deployed backend URL:
```env
REACT_APP_API_URL=https://your-backend-url.com
```

## Step 2: Update App.js to Use API (Optional - Gradual Migration)

The frontend currently uses localStorage. To enable API sync, you have two options:

### Option A: Quick Test (Recommended First)

The API utilities are already created with localStorage fallback. You can test the API endpoints directly:

1. **Test Registration:**
   ```bash
   curl -X POST http://localhost:3001/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test1234","birthday":"2000-01-01"}'
   ```

2. **Test Login:**
   ```bash
   curl -X POST http://localhost:3001/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"identifier":"test@example.com","password":"test1234"}'
   ```

### Option B: Full Migration (For Production)

To fully migrate the frontend to use the API:

1. **Update imports in `src/App.js`:**
   - Change `from "./utils/authHelpers"` to `from "./utils/authHelpersAPI"`
   - Change `from "./utils/storage"` to `from "./utils/storageAPI"`

2. **Make functions async:**
   - Add `async/await` to all storage and auth function calls
   - This requires significant refactoring

**Note:** This is a big change. The app will continue working with localStorage until you make this migration.

## Step 3: Test Cross-Device Sync

Once the frontend is connected:

1. **Register a user on your laptop**
2. **Sign in on your phone** with the same credentials
3. **Your data should sync!** Points, streaks, and deeds will appear on both devices

## Current Status

✅ **Backend:** Connected to MongoDB  
✅ **API Endpoints:** Ready and working  
⏳ **Frontend:** Still using localStorage (needs migration to use API)

## What Works Now

- ✅ Backend API is ready
- ✅ MongoDB is connected
- ✅ You can test API endpoints directly
- ✅ Users can register/login via API
- ✅ Data is stored in MongoDB

## What Needs Migration

- ⏳ Frontend still uses localStorage
- ⏳ App.js needs to be updated to use API functions
- ⏳ Functions need to be made async

## Quick Test Commands

### Test Health:
```bash
curl http://localhost:3001/api/health
```

### Test Registration:
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"test1234\",\"birthday\":\"2000-01-01\"}"
```

### Test Login:
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"identifier\":\"test@example.com\",\"password\":\"test1234\"}"
```

## For Now

Your backend is ready! The frontend will continue working with localStorage. When you're ready to enable cross-device sync, you can:

1. Add `REACT_APP_API_URL` to root `.env`
2. Gradually migrate App.js to use API functions
3. Test on multiple devices

The backend is fully functional and ready to sync data once the frontend is connected!

