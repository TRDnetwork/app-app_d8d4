const mongoose = require('mongoose');

const sellerAnalyticsSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId()
  },
  seller_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  revenue: {
    type: Number,
    default: 0
  },
  orders_count: {
    type: Number,
    default: 0
  },
  refunds_count: {
    type: Number,
    default: 0
  }
}, {
  collection: 'app_d8d4_seller_analytics'
});

sellerAnalyticsSchema.index({ seller_id: 1, date: 1 }, { unique: true });
sellerAnalyticsSchema.index({ date: -1 });

module.exports = mongoose.model('SellerAnalytics', sellerAnalyticsSchema);