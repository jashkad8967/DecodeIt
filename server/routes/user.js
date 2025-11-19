const express = require('express');
const User = require('../models/User');
const UserData = require('../models/UserData');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

/**
 * Get current user profile
 */
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      user: {
        email: user.email,
        username: user.username,
        birthday: user.birthday,
        theme: user.theme
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * Update user profile
 */
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { username, theme, birthday } = req.body;
    const user = await User.findById(req.user._id);

    if (username !== undefined) {
      // Check for duplicate username
      if (username && username !== user.username) {
        const existingUser = await User.findOne({ 
          username: username.toLowerCase(),
          _id: { $ne: user._id }
        });
        if (existingUser) {
          return res.status(400).json({ 
            success: false, 
            error: 'This username is already taken.' 
          });
        }
        user.username = username;
      }
    }

    if (theme !== undefined) {
      user.theme = theme;
    }

    if (birthday !== undefined) {
      user.birthday = birthday;
    }

    await user.save();

    res.json({
      success: true,
      user: {
        email: user.email,
        username: user.username,
        birthday: user.birthday,
        theme: user.theme
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * Change password
 */
router.put('/password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        error: 'Current password and new password are required.' 
      });
    }

    if (newPassword.length < 4) {
      return res.status(400).json({ 
        success: false, 
        error: 'New password must be at least 4 characters.' 
      });
    }

    const user = await User.findById(req.user._id);

    // Check current password
    if (user.password !== currentPassword) {
      return res.status(401).json({ 
        success: false, 
        error: 'Current password is incorrect.' 
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * Delete account
 */
router.delete('/account', authenticate, async (req, res) => {
  try {
    const userId = req.user._id;

    // Delete user data
    await UserData.deleteOne({ userId });

    // Delete user
    await User.deleteOne({ _id: userId });

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;

