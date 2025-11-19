const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  entryId: {
    type: String,
    required: true,
    index: true
  },
  userEmail: {
    type: String,
    required: true,
    lowercase: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to prevent duplicate likes
likeSchema.index({ entryId: 1, userEmail: 1 }, { unique: true });

module.exports = mongoose.model('Like', likeSchema);

