const mongoose = require('mongoose');

const WishlistSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  product_ids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    index: true
  }],
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false,
  collection: 'app_d8d4_wishlists'
});

WishlistSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

WishlistSchema.index({ user_id: 1 });

module.exports = mongoose.model('Wishlist', WishlistSchema);