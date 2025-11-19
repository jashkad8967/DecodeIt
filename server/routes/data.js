const express = require('express');
const User = require('../models/User');
const UserData = require('../models/UserData');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

/**
 * Get user data (points, streak, deeds)
 */
router.get('/userdata', authenticate, async (req, res) => {
  try {
    let userData = await UserData.findOne({ userId: req.user._id });

    if (!userData) {
      // Create initial user data if it doesn't exist
      userData = new UserData({
        userId: req.user._id,
        points: 0,
        streak: 0,
        lastDeedDate: null,
        pastDeeds: []
      });
      await userData.save();
    }

    res.json({
      success: true,
      data: {
        points: userData.points || 0,
        streak: userData.streak || 0,
        lastDeedDate: userData.lastDeedDate,
        pastDeeds: userData.pastDeeds || []
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
 * Save user data
 */
router.put('/userdata', authenticate, async (req, res) => {
  try {
    const { points, streak, lastDeedDate, pastDeeds } = req.body;

    let userData = await UserData.findOne({ userId: req.user._id });

    if (!userData) {
      userData = new UserData({
        userId: req.user._id,
        points: 0,
        streak: 0,
        lastDeedDate: null,
        pastDeeds: []
      });
    }

    if (points !== undefined) userData.points = points;
    if (streak !== undefined) userData.streak = streak;
    if (lastDeedDate !== undefined) userData.lastDeedDate = lastDeedDate;
    if (pastDeeds !== undefined) userData.pastDeeds = pastDeeds;

    await userData.save();

    res.json({
      success: true,
      data: {
        points: userData.points,
        streak: userData.streak,
        lastDeedDate: userData.lastDeedDate,
        pastDeeds: userData.pastDeeds
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
 * Get leaderboard (all users sorted by points)
 */
router.get('/leaderboard', async (req, res) => {
  try {
    const allUsers = await User.find({});
    const allUsersData = [];

    for (const user of allUsers) {
      const userData = await UserData.findOne({ userId: user._id });
      const username = user.username || user.email.split('@')[0];
      
      allUsersData.push({
        email: user.email,
        name: username,
        points: userData?.points || 0,
        streak: userData?.streak || 0
      });
    }

    // Remove duplicates by username (keep highest points)
    const usernameMap = new Map();
    allUsersData.forEach(user => {
      const key = user.name.toLowerCase();
      if (!usernameMap.has(key) || user.points > usernameMap.get(key).points) {
        usernameMap.set(key, user);
      }
    });

    const uniqueUsers = Array.from(usernameMap.values());
    uniqueUsers.sort((a, b) => b.points - a.points);

    res.json({
      success: true,
      leaderboard: uniqueUsers
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * Get all public journal entries (entries with images)
 */
router.get('/community', async (req, res) => {
  try {
    const allUsers = await User.find({});
    const allEntries = [];

    for (const user of allUsers) {
      const userData = await UserData.findOne({ userId: user._id });
      const username = user.username || user.email.split('@')[0];

      if (userData && userData.pastDeeds) {
        userData.pastDeeds.forEach(deed => {
          if (deed.image) {
            allEntries.push({
              entryId: `${user.email}_${deed.date}`,
              email: user.email,
              username: username,
              deed: deed.deed,
              date: deed.date,
              image: deed.image,
              solvePoints: deed.solvePoints || 0,
              uploadPoints: deed.uploadPoints || 0,
              totalPoints: deed.totalPoints || 0,
              streak: deed.streak || 0
            });
          }
        });
      }
    }

    res.json({
      success: true,
      entries: allEntries
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;

