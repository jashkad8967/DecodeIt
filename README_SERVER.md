# Backend Server Setup

This directory contains the backend API server for the Decode Puzzle app.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Configure Environment Variables**
   
   Create a `.env` file in the `server` directory:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   PORT=3001
   ```

   **Important:** For Gmail, you need to:
   - Enable 2-Factor Authentication on your Google account
   - Generate an "App Password" from your Google Account settings
   - Use the app password (not your regular password) in `EMAIL_PASS`

3. **Start the Server**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

4. **API Endpoints**
   - `POST /api/contact` - Send contact form email
   - `GET /api/health` - Health check endpoint

## Contact Form API

**Endpoint:** `POST /api/contact`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Your message here"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Message sent successfully!"
}
```

## Deployment

For production deployment, you can:
- Deploy to Heroku, Railway, Render, or similar platforms
- Set environment variables in your hosting platform
- Update `REACT_APP_API_URL` in your React app's environment variables

## Security Notes

- Never commit `.env` file to version control
- Use environment variables for sensitive data
- Consider adding rate limiting for production
- Add CORS restrictions if needed

