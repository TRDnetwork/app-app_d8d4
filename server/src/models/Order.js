const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price_at_purchase: {
    type: Number,
    required: true
  }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId()
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  subtotal: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    required: true
  },
  shipping_cost: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  address_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
    required: true
  },
  payment_method: {
    type: String,
    required: true
  },
  payment_status: {
    type: String,
    enum: ['pending', 'succeeded', 'failed', 'refunded'],
    default: 'pending'
  },
  order_status: {
    type: String,
    enum: ['placed', 'confirmed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'],
    default: 'placed'
  },
  tracking_number: {
    type: String,
    default: null
  },
  stripe_payment_intent_id: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'app_d8d4_orders'
});

orderSchema.index({ user_id: 1 });
orderSchema.index({ order_status: 1 });
orderSchema.index({ stripe_payment_intent_id: 1 }, { unique: true });
orderSchema.index({ created_at: -1 });

module.exports = mongoose.model('Order', orderSchema);