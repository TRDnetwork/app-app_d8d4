const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  comment: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  helpful_votes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  created_at: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  collection: 'app_d8d4_reviews'
});

ReviewSchema.index({ product_id: 1, created_at: -1 });
ReviewSchema.index({ user_id: 1, product_id: 1 }, { unique: true }); // One review per user per product

module.exports = mongoose.model('Review', ReviewSchema);