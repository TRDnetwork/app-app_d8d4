const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId()
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password_hash: {
    type: String,
    required: function() { return !this.oauth_provider; } // OAuth users don't need password
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['customer', 'seller', 'admin'],
    default: 'customer'
  },
  profile_picture_url: {
    type: String,
    default: null
  },
  phone: {
    type: String,
    default: null
  },
  email_verified: {
    type: Boolean,
    default: false
  },
  oauth_provider: {
    type: String,
    enum: ['google', 'facebook', null],
    default: null
  },
  oauth_id: {
    type: String,
    default: null
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'app_d8d4_users',
  timestamps: { updatedAt: 'updated_at' }
});

userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ oauth_provider: 1, oauth_id: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('User', userSchema);