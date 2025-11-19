const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const UserData = require('../models/UserData');
const { JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

/**
 * Register a new user
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, birthday, username } = req.body;

    // Validation
    if (!email || !email.includes('@')) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please enter a valid email address.' 
      });
    }

    if (!password || password.length < 4) {
      return res.status(400).json({ 
        success: false, 
        error: 'Password must be at least 4 characters.' 
      });
    }

    if (!birthday) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide your birthday.' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        error: 'An account with this email already exists.' 
      });
    }

    // Check for duplicate username if provided
    if (username) {
      const existingUsername = await User.findOne({ 
        username: username.toLowerCase() 
      });
      if (existingUsername) {
        return res.status(400).json({ 
          success: false, 
          error: 'This username is already taken.' 
        });
      }
    }

    // Create user
    const user = new User({
      email: email.toLowerCase(),
      password: password, // Store plain text for now (matching frontend behavior)
      birthday,
      username: username || email.split('@')[0],
      theme: 'dark'
    });

    await user.save();

    // Create initial user data
    const userData = new UserData({
      userId: user._id,
      points: 0,
      streak: 0,
      lastDeedDate: null,
      pastDeeds: []
    });
    await userData.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '30d' });

    res.json({
      success: true,
      user: {
        email: user.email,
        username: user.username,
        birthday: user.birthday,
        theme: user.theme
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Registration failed' 
    });
  }
});

/**
 * Sign in user
 */
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please enter your email or username.' 
      });
    }

    if (!password || password.length < 4) {
      return res.status(400).json({ 
        success: false, 
        error: 'Password must be at least 4 characters.' 
      });
    }

    // Find user by email or username
    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { username: identifier.toLowerCase() }
      ]
    });

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: 'No account found with this email or username. Please register.' 
      });
    }

    // Check password (plain text comparison for now, matching frontend)
    if (user.password !== password) {
      return res.status(401).json({ 
        success: false, 
        error: 'Incorrect password.' 
      });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '30d' });

    res.json({
      success: true,
      user: {
        email: user.email,
        username: user.username,
        birthday: user.birthday,
        theme: user.theme
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Login failed' 
    });
  }
});

module.exports = router;

