const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
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
  variant: {
    size: { type: String },
    color: { type: String }
  }
}, { _id: false });

const cartSchema = new mongoose.Schema({
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
  items: [cartItemSchema],
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'app_d8d4_carts'
});

cartSchema.index({ user_id: 1 }, { unique: true });

module.exports = mongoose.model('Cart', cartSchema);