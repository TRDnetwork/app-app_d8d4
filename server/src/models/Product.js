const mongoose = require('mongoose');

const VariantSchema = new mongoose.Schema({
  size: { type: String, default: null },
  color: { type: String, default: null },
  sku: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, min: 0 },
  image: { type: String, default: null }
});

const ProductSchema = new mongoose.Schema({
  seller_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
    index: true
  },
  subcategory_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null,
    index: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  discount_percent: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    index: true
  },
  images: [{
    type: String,
    required: true
  }],
  variants: [VariantSchema],
  tags: [{
    type: String,
    index: true
  }],
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
    index: true
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
  collection: 'app_d8d4_products'
});

ProductSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

ProductSchema.index({ title: 'text', description: 'text', brand: 'text', tags: 'text' });

module.exports = mongoose.model('Product', ProductSchema);