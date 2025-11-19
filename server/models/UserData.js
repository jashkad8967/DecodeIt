const mongoose = require('mongoose');

const deedSchema = new mongoose.Schema({
  deed: String,
  date: String, // ISO format: YYYY-MM-DD
  solvePoints: Number,
  uploadPoints: Number,
  totalPoints: Number,
  streak: Number,
  image: String, // Base64 encoded image
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const userDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  points: {
    type: Number,
    default: 0
  },
  streak: {
    type: Number,
    default: 0
  },
  lastDeedDate: {
    type: String, // ISO format: YYYY-MM-DD
    default: null
  },
  pastDeeds: [deedSchema],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update updatedAt before saving
userDataSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('UserData', userDataSchema);

