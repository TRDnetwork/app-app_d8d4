const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId()
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  product_ids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'app_d8d4_wishlists'
});

wishlistSchema.index({ user_id: 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);