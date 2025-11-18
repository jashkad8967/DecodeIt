const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');

// Load .env file from server directory
const envPath = path.join(__dirname, '.env');
const fs = require('fs');

// Check if .env file exists
if (fs.existsSync(envPath)) {
  console.log('✅ .env file found at:', envPath);
} else {
  console.error('❌ .env file NOT FOUND at:', envPath);
  console.error('Please create a .env file in the server directory with:');
  console.error('  EMAIL_USER=your-email@gmail.com');
  console.error('  EMAIL_PASS=your-app-password');
}

require('dotenv').config({ path: envPath });

// Log to verify .env is loaded
console.log('\n=== Environment Variables Check ===');
console.log('Current directory:', __dirname);
console.log('.env file path:', envPath);
console.log('Environment variables loaded:');
console.log('  EMAIL_USER:', process.env.EMAIL_USER ? `"${process.env.EMAIL_USER}"` : '❌ NOT SET');
console.log('  EMAIL_PASS:', process.env.EMAIL_PASS ? `SET (length: ${process.env.EMAIL_PASS.length})` : '❌ NOT SET');
console.log('  PORT:', process.env.PORT || 'NOT SET (using default 3001)');
console.log('=====================================\n');

const app = express();
const PORT = process.env.PORT || 3001;

// Log environment status (without sensitive data)
console.log('Server starting...');
console.log('Port:', PORT);
console.log('Email user configured:', process.env.EMAIL_USER ? 'Yes' : 'No');
console.log('Email pass configured:', process.env.EMAIL_PASS ? 'Yes' : 'No');

// Middleware
app.use(cors());
app.use(express.json());

// Email transporter configuration
// Remove quotes from password if present (dotenv sometimes includes them)
// Also handle the case where dotenv might not strip quotes properly
let emailPass = process.env.EMAIL_PASS || '';

// Check if password might have been truncated by # comment
if (emailPass && !process.env.EMAIL_PASS.includes('"') && process.env.EMAIL_PASS.includes('#')) {
  console.warn('⚠️  WARNING: Password contains # symbol but is not quoted!');
  console.warn('   dotenv treats # as a comment, so your password may be truncated.');
  console.warn('   Please wrap your password in quotes in .env: EMAIL_PASS="your-password"');
}

if (emailPass) {
  // Remove surrounding quotes (single or double)
  emailPass = emailPass.replace(/^["']|["']$/g, '');
  // Also remove any escaped quotes
  emailPass = emailPass.replace(/\\"/g, '"').replace(/\\'/g, "'");
}

console.log('Email password check:');
console.log('  EMAIL_PASS raw:', process.env.EMAIL_PASS ? `"${process.env.EMAIL_PASS}" (length: ${process.env.EMAIL_PASS.length})` : 'NOT SET');
console.log('  EMAIL_PASS processed:', emailPass ? `"${emailPass}" (length: ${emailPass.length})` : 'EMPTY');
console.log('  EMAIL_USER:', process.env.EMAIL_USER || 'NOT SET');

// Validate credentials before creating transporter
if (!process.env.EMAIL_USER || !emailPass || emailPass.trim() === '') {
  console.error('\n❌ ERROR: Email credentials are missing or empty!');
  console.error('Please check your .env file in the server directory.');
  console.error('Required variables:');
  console.error('  EMAIL_USER=your-email@gmail.com');
  console.error('  EMAIL_PASS=your-app-password');
  console.error('\nIf your password contains special characters like #, wrap it in quotes:');
  console.error('  EMAIL_PASS="your-password-with-#-symbol"');
  console.error('\n⚠️  Server will start but email sending will fail until credentials are set.');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: emailPass || '',
  },
  // Add debug option to see what's being sent
  debug: true,
  logger: true,
});

// Verify transporter configuration
transporter.verify(function (error, success) {
  if (error) {
    console.error('\n❌ Email transporter verification failed!');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('\nTroubleshooting steps:');
    console.error('1. Verify the email address is correct:', process.env.EMAIL_USER || 'NOT SET');
    console.error('2. Check that the App Password is exactly 16 characters (no spaces)');
    console.error('3. Make sure you copied the ENTIRE App Password from Google');
    console.error('4. Verify the App Password was generated for "Mail" and is still active');
    console.error('5. Try generating a NEW App Password and updating .env file');
    console.error('\nCurrent password info:');
    console.error('  Length:', emailPass ? emailPass.length : 'EMPTY');
    console.error('  First 3 chars:', emailPass ? `"${emailPass.substring(0, 3)}"` : 'N/A');
    console.error('  Last 3 chars:', emailPass ? `"${emailPass.substring(emailPass.length - 3)}"` : 'N/A');
    console.error('\n⚠️  Server will continue running, but emails will fail until this is fixed.');
  } else {
    console.log('\n✅ Email transporter is ready to send messages!');
    console.log('Email user:', process.env.EMAIL_USER);
    console.log('Email pass configured:', emailPass ? `Yes (length: ${emailPass.length})` : 'No');
  }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    console.log('Contact form request received:', { 
      name: req.body?.name, 
      email: req.body?.email, 
      hasMessage: !!req.body?.message 
    });
    
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'All fields are required' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid email address' 
      });
    }

    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || !emailPass) {
      console.error('Email credentials not configured');
      return res.status(500).json({ 
        success: false, 
        error: 'Email service not configured. Please contact the administrator.' 
      });
    }

    // Prepare email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'jkadakiabusiness@gmail.com',
      subject: `Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><em>Sent from Decode Puzzle App</em></p>
      `,
      replyTo: email,
    };

    // Send email
    console.log('Attempting to send email to:', 'jkadakiabusiness@gmail.com');
    console.log('From:', process.env.EMAIL_USER);
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);

    res.json({ 
      success: true, 
      message: 'Message sent successfully!' 
    });
  } catch (error) {
    console.error('Error sending email:', error);
    console.error('Error details:', {
      code: error.code,
      command: error.command,
      response: error.response,
      message: error.message,
    });
    
    // Provide more helpful error messages
    let errorMessage = 'Failed to send message. Please try again later.';
    if (error.code === 'EAUTH') {
      errorMessage = 'Email authentication failed. Please check your EMAIL_USER and EMAIL_PASS environment variables.';
    } else if (error.code === 'ECONNECTION') {
      errorMessage = 'Could not connect to email server. Please check your internet connection.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    res.status(500).json({ 
      success: false, 
      error: errorMessage
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Debug endpoint to check email configuration (remove in production)
// Note: This must be after emailPass is defined
app.get('/api/debug/email-config', (req, res) => {
  // Get the processed password (same logic as above)
  let processedPass = process.env.EMAIL_PASS || '';
  if (processedPass) {
    processedPass = processedPass.replace(/^["']|["']$/g, '');
    processedPass = processedPass.replace(/\\"/g, '"').replace(/\\'/g, "'");
  }
  
  res.json({
    emailUser: process.env.EMAIL_USER ? 'SET' : 'NOT SET',
    emailUserValue: process.env.EMAIL_USER || 'NOT SET',
    emailPass: process.env.EMAIL_PASS ? `SET (length: ${process.env.EMAIL_PASS.length})` : 'NOT SET',
    emailPassRawPreview: process.env.EMAIL_PASS ? `"${process.env.EMAIL_PASS.substring(0, 3)}..." (first 3 chars)` : 'NOT SET',
    emailPassProcessed: processedPass ? `SET (length: ${processedPass.length})` : 'EMPTY',
    emailPassProcessedPreview: processedPass ? `"${processedPass.substring(0, 3)}..." (first 3 chars)` : 'EMPTY',
    note: 'If emailPassProcessed is EMPTY, the password is not being read correctly from .env file'
  });
});

// Error handling middleware (must be after all routes)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    success: false, 
    error: err.message || 'Internal server error' 
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

