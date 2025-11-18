# Server Setup for Contact Form

## Prerequisites
1. Node.js installed
2. A Gmail account with 2-Factor Authentication enabled

## Setup Steps

1. **Install dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Create a `.env` file in the `server` directory:**
   ```
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASS="your-app-password"
   PORT=3001
   ```
   
   **Important:** If your password contains special characters (like `#`, `$`, spaces, etc.), wrap it in double quotes:
   ```
   EMAIL_PASS="your-password-with-#-symbol"
   ```

3. **Get a Gmail App Password:**
   - **IMPORTANT**: Make sure you're signed into the Google account that matches `jkadakiabusiness@gmail.com`
   - Go to https://myaccount.google.com/apppasswords
   - If you don't see this page, enable 2-Step Verification first at https://myaccount.google.com/security
   - Select "Mail" as the app
   - Select "Other (Custom name)" as the device
   - Enter a name like "Decode Puzzle Server"
   - Click "Generate"
   - **Copy the 16-character password** (it will look like: `abcd efgh ijkl mnop`)
   - **Remove all spaces** when pasting into `.env` file
   - Use this password in the `.env` file (NOT your regular Gmail password)

4. **Start the server:**
   ```bash
   npm start
   ```

   You should see:
   - "Email transporter is ready to send messages"
   - "Server running on port 3001"

5. **Test the endpoint:**
   - Open your browser console
   - Submit the contact form
   - Check the server console for logs
   - Check your email inbox (and spam folder)

## Deployment

### For Production Deployment:

1. **Set Environment Variables on Your Hosting Platform:**
   - `EMAIL_USER` - Your Gmail address
   - `EMAIL_PASS` - Your Gmail app password (wrap in quotes if it contains special characters)
   - `PORT` - Port number (usually set automatically by hosting platform)

2. **Popular Hosting Platforms:**
   - **Heroku**: Set env vars in Settings → Config Vars
   - **Railway**: Set env vars in Variables tab
   - **Render**: Set env vars in Environment section
   - **Vercel**: Set env vars in Settings → Environment Variables

3. **Frontend Configuration:**
   - Set `REACT_APP_API_URL` to your deployed server URL (e.g., `https://your-server.herokuapp.com`)
   - This is set at build time, so rebuild your React app after setting it

4. **Important Notes:**
   - The `.env` file is NOT deployed (it's in `.gitignore`)
   - Environment variables must be set in your hosting platform's dashboard
   - For passwords with special characters like `#`, the hosting platform should handle quotes automatically, but if not, wrap the value in quotes when setting it

## Troubleshooting

- **"Email transporter verification failed"**: Check your environment variables are set correctly on your hosting platform
- **"Failed to send message"**: Check server console for detailed error messages
- **No emails received**: Check spam folder, verify email address in `server/index.js` line 60
- **Inputs not clearing**: Check browser console for errors, verify the API response includes `success: true`
- **"Failed to fetch" in production**: Make sure `REACT_APP_API_URL` is set to your deployed server URL

