# How to Generate JWT_SECRET

## What is JWT_SECRET?

JWT_SECRET is a secret key used to sign and verify JSON Web Tokens (JWT) for user authentication. It's like a password that ensures tokens haven't been tampered with.

**Important**: This is a secret key that YOU generate - it's not provided by any service.

## How to Generate a Secure JWT_SECRET

### Option 1: Using Node.js (Recommended)

Open a terminal and run:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

This will generate a random 128-character hexadecimal string like:
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2
```

### Option 2: Using OpenSSL (Mac/Linux)

```bash
openssl rand -hex 64
```

### Option 3: Using PowerShell (Windows)

```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | % {[char]$_})
```

Or for a more secure version:
```powershell
[Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Maximum 256 }))
```

### Option 4: Online Generator (Less Secure)

You can use an online random string generator:
- https://www.random.org/strings/
- Set length to 64-128 characters
- Use alphanumeric characters

**Note**: Online generators are less secure than generating locally.

### Option 5: Manual (Simple but Less Secure)

You can create any random string yourself, but make it:
- At least 32 characters long (64+ recommended)
- Mix of letters, numbers, and special characters
- Random and unpredictable

Example (don't use this one - generate your own!):
```
MySuperSecretJWTKey2024!@#$%^&*()_+{}[]|:;<>?,.
```

## How to Use JWT_SECRET

### Step 1: Generate Your Secret

Run one of the commands above to generate a random string.

### Step 2: Add to Your .env File

Create or edit `server/.env`:

```env
# MongoDB Connection
MONGODB_URI=your-mongodb-connection-string

# JWT Secret (change this to your generated secret)
JWT_SECRET=your-generated-secret-key-here

# Server Port
PORT=3001
```

**Important**: 
- Replace `your-generated-secret-key-here` with the secret you generated
- Keep it secret - never commit it to Git
- Use a different secret for production vs development

### Step 3: Verify It's Set

When you start your server, you should see it's configured (the server won't show the actual secret for security).

## Security Best Practices

1. **Use a Long Secret**: At least 64 characters, preferably 128+
2. **Use Different Secrets**: 
   - One for development (`dev-secret`)
   - One for production (`prod-secret`)
3. **Never Commit to Git**: 
   - Add `.env` to `.gitignore`
   - Use environment variables in production hosting
4. **Rotate Regularly**: Change the secret periodically (requires all users to re-login)
5. **Keep It Secret**: Don't share it, don't log it, don't expose it

## Example .env File

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/decode-puzzle?retryWrites=true&w=majority

# JWT Secret (64+ character random string)
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2

# Server Port
PORT=3001

# Email Configuration (optional)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## For Production Deployment

When deploying to production (Railway, Render, Heroku, etc.):

1. **Don't put secrets in code** - use environment variables
2. **Set in hosting dashboard**:
   - Railway: Project → Variables → Add `JWT_SECRET`
   - Render: Environment → Add Environment Variable
   - Heroku: `heroku config:set JWT_SECRET=your-secret`
3. **Use a different secret** than development
4. **Keep it secure** - treat it like a password

## Quick Start Command

**Windows (PowerShell):**
```powershell
cd server
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(64).toString('hex'))" >> .env
```

**Mac/Linux:**
```bash
cd server
echo "JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")" >> .env
```

This will append a generated JWT_SECRET to your `.env` file (you'll still need to add other variables).

## Troubleshooting

### "JWT_SECRET is not set"
- Make sure `.env` file exists in `server/` directory
- Check the variable name is exactly `JWT_SECRET` (case-sensitive)
- Restart the server after adding it

### "Invalid token" errors
- Make sure JWT_SECRET is the same across server restarts
- If you change it, all users will need to re-login
- Check for typos in the secret

### Secret too short
- Use at least 32 characters (64+ recommended)
- Generate a new one if yours is too short

