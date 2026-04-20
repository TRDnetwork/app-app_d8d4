const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  variant: {
    size: { type: String, default: null },
    color: { type: String, default: null }
  },
  image: {
    type: String,
    required: true
  }
});

const OrderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  items: [OrderItemSchema],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  tax: {
    type: Number,
    required: true,
    min: 0
  },
  shipping_cost: {
    type: Number,
    required: true,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  address_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
    required: true
  },
  payment_method: {
    type: String,
    required: true,
    enum: ['card', 'upi', 'cod']
  },
  payment_status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
    index: true
  },
  order_status: {
    type: String,
    enum: ['placed', 'confirmed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'],
    default: 'placed',
    index: true
  },
  tracking_number: {
    type: String,
    default: null
  },
  stripe_payment_intent_id: {
    type: String,
    default: null,
    index: true
  },
  coupon_code: {
    type: String,
    default: null
  },
  created_at: {
    type: Date,
    default: Date.now,
    index: true
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'app_d8d4_orders'
});

OrderSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

OrderSchema.index({ user_id: 1, created_at: -1 });
OrderSchema.index({ order_status: 1, created_at: -1 });
OrderSchema.index({ stripe_payment_intent_id: 1 });

module.exports = mongoose.model('Order', OrderSchema);