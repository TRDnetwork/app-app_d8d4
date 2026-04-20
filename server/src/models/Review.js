const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId()
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    default: null
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
    default: Date.now
  }
}, {
  collection: 'app_d8d4_reviews'
});

reviewSchema.index({ product_id: 1 });
reviewSchema.index({ user_id: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ created_at: -1 });

module.exports = mongoose.model('Review', reviewSchema);