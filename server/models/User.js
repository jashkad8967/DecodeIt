const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    trim: true,
    default: function() {
      return this.email ? this.email.split('@')[0] : '';
    }
  },
  birthday: {
    type: String, // ISO format: YYYY-MM-DD
    required: true
  },
  theme: {
    type: String,
    enum: ['dark', 'light'],
    default: 'dark'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update updatedAt before saving
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('User', userSchema);

