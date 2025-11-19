# Migration Guide: LocalStorage to API

This guide explains how to migrate from localStorage to the API backend for cross-device synchronization.

## Current Status

The backend API is fully set up and ready to use. The frontend has been prepared with API client utilities that include localStorage fallback.

## Quick Start

### 1. Set Up Backend

Follow the instructions in `BACKEND_SETUP.md` to:
- Set up MongoDB database
- Configure environment variables
- Start the backend server

### 2. Enable API Mode in Frontend

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:3001
```

For production:
```env
REACT_APP_API_URL=https://your-backend-url.com
```

### 3. Update App.js (Optional - Gradual Migration)

The current `App.js` uses localStorage. To migrate to the API:

**Option A: Full Migration (Recommended for New Deployments)**
- Replace imports in `App.js`:
  - Change `from "./utils/authHelpers"` to `from "./utils/authHelpersAPI"`
  - Change `from "./utils/storage"` to `from "./utils/storageAPI"`
- Update all function calls to be async (add `await`)
- This requires significant refactoring

**Option B: Hybrid Approach (Easier)**
- Keep existing localStorage code
- Add API sync on key actions (save, load)
- Users can use either localStorage or API
- Gradually migrate features

## What's Been Created

### Backend (`server/`)
- ✅ MongoDB models (User, UserData, Like)
- ✅ Authentication routes (register, login)
- ✅ User profile routes (get, update, delete)
- ✅ Data routes (userdata, leaderboard, community)
- ✅ Likes routes (toggle, status, counts)
- ✅ JWT authentication middleware

### Frontend (`src/utils/`)
- ✅ `api.js` - API client with token management
- ✅ `storageAPI.js` - API-based storage with localStorage fallback
- ✅ `authHelpersAPI.js` - API-based authentication helpers

## Testing

1. Start backend: `cd server && npm start`
2. Test health: `curl http://localhost:3001/api/health`
3. Register user:
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test1234","birthday":"2000-01-01"}'
```

## Important Notes

1. **Existing Users**: Users registered with localStorage will need to re-register with the API
2. **Data Migration**: You may want to create a migration script to move existing localStorage data to MongoDB
3. **Backward Compatibility**: The API utilities include localStorage fallback, so the app will work even if the API is unavailable
4. **Security**: Change `JWT_SECRET` in production to a secure random string

## Next Steps

1. Set up MongoDB database (MongoDB Atlas recommended)
2. Deploy backend server
3. Update frontend `.env` with API URL
4. Test registration and login
5. Gradually migrate App.js to use API functions

For detailed setup instructions, see `BACKEND_SETUP.md`.

