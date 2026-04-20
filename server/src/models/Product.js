const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  size: { type: String },
  color: { type: String },
  sku: { type: String, required: true },
  price: { type: Number },
  stock: { type: Number, default: 0 }
}, { _id: false });

const productSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId()
  },
  seller_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    trim: true
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  subcategory_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
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
    default: 0
  },
  images: [{
    type: String,
    default: []
  }],
  variants: [variantSchema],
  tags: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  created_at: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'app_d8d4_products'
});

productSchema.index({ seller_id: 1 });
productSchema.index({ category_id: 1 });
productSchema.index({ subcategory_id: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ status: 1 });
productSchema.index({ title: 'text', brand: 'text', description: 'text' }); // For search
productSchema.index({ created_at: -1 });
productSchema.index({ price: 1 });

module.exports = mongoose.model('Product', productSchema);