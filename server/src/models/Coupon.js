const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    index: true
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
    required: true,
    index: true
  },
  usage_limit: {
    type: Number,
    default: null // null means unlimited
  },
  used_count: {
    type: Number,
    default: 0
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
  timestamps: true,
  collection: 'app_d8d4_coupons'
});

CouponSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

CouponSchema.index({ code: 1, expiry_date: 1 });
CouponSchema.index({ expiry_date: 1 });

module.exports = mongoose.model('Coupon', CouponSchema);