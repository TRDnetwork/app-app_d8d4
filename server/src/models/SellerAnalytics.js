const mongoose = require('mongoose');

const SellerAnalyticsSchema = new mongoose.Schema({
  seller_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  revenue: {
    type: Number,
    default: 0,
    min: 0
  },
  orders_count: {
    type: Number,
    default: 0,
    min: 0
  },
  refunds_count: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  collection: 'app_d8d4_seller_analytics'
});

SellerAnalyticsSchema.index({ seller_id: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('SellerAnalytics', SellerAnalyticsSchema);