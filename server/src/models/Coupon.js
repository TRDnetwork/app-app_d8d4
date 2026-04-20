const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId()
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  discount_type: {
    type: String,
    enum: ['percent', 'fixed'],
    required: true
  },
  discount_value: {
    type: Number,
    required: true,
    min: 0
  },
  min_order_value: {
    type: Number,
    default: 0
  },
  expiry_date: {
    type: Date,
    required: true
  },
  usage_limit: {
    type: Number,
    default: null // null means unlimited
  },
  used_count: {
    type: Number,
    default: 0
  }
}, {
  collection: 'app_d8d4_coupons'
});

couponSchema.index({ code: 1 }, { unique: true });
couponSchema.index({ expiry_date: 1 });
couponSchema.index({ used_count: 1 });

module.exports = mongoose.model('Coupon', couponSchema);