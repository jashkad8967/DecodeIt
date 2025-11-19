const express = require('express');
const Like = require('../models/Like');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

/**
 * Toggle like for an entry
 */
router.post('/toggle', authenticate, async (req, res) => {
  try {
    const { entryId } = req.body;
    const userEmail = req.user.email.toLowerCase();

    if (!entryId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Entry ID is required' 
      });
    }

    // Check if like exists
    const existingLike = await Like.findOne({ entryId, userEmail });

    if (existingLike) {
      // Unlike
      await Like.deleteOne({ _id: existingLike._id });
      const count = await Like.countDocuments({ entryId });
      res.json({
        success: true,
        liked: false,
        count
      });
    } else {
      // Like
      const like = new Like({ entryId, userEmail });
      await like.save();
      const count = await Like.countDocuments({ entryId });
      res.json({
        success: true,
        liked: true,
        count
      });
    }
  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      // Like already exists, so unlike it
      const like = await Like.findOne({ entryId: req.body.entryId, userEmail: req.user.email.toLowerCase() });
      if (like) {
        await Like.deleteOne({ _id: like._id });
        const count = await Like.countDocuments({ entryId: req.body.entryId });
        return res.json({
          success: true,
          liked: false,
          count
        });
      }
    }
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * Get like status for entries
 */
router.post('/status', authenticate, async (req, res) => {
  try {
    const { entryIds } = req.body;
    const userEmail = req.user.email.toLowerCase();

    if (!Array.isArray(entryIds)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Entry IDs must be an array' 
      });
    }

    const likes = await Like.find({ 
      entryId: { $in: entryIds },
      userEmail 
    });

    const likedEntryIds = likes.map(like => like.entryId);
    const status = {};
    entryIds.forEach(id => {
      status[id] = likedEntryIds.includes(id);
    });

    res.json({
      success: true,
      status
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * Get like counts for entries
 */
router.post('/counts', async (req, res) => {
  try {
    const { entryIds } = req.body;

    if (!Array.isArray(entryIds)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Entry IDs must be an array' 
      });
    }

    const counts = {};
    for (const entryId of entryIds) {
      counts[entryId] = await Like.countDocuments({ entryId });
    }

    res.json({
      success: true,
      counts
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;

