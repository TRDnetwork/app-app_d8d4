const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  variant: {
    size: { type: String, default: null },
    color: { type: String, default: null }
  }
}, {
  timestamps: true
});

const CartSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  items: [CartItemSchema],
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false,
  collection: 'app_d8d4_carts'
});

CartSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

CartSchema.index({ user_id: 1 });

module.exports = mongoose.model('Cart', CartSchema);