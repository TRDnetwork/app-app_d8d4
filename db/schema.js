// Mongoose schema definitions for ShopSphere (app_d8d4)
// All collections prefixed with app_d8d4_

const mongoose = require('mongoose');

// Helper: Timestamps plugin
const timestamps = {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
};

// app_d8d4_users
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password_hash: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  phone: { type: String, trim: true },
  profile_picture_url: { type: String, default: null },
  role: { type: String, enum: ['customer', 'seller', 'admin'], default: 'customer' },
  email_verified: { type: Boolean, default: false },
  oauth_provider: { type: String, enum: ['google', 'facebook'], default: null },
  oauth_id: { type: String, sparse: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, { timestamps: false });
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ oauth_id: 1 }, { sparse: true });
userSchema.index({ role: 1 });
const User = mongoose.model('app_d8d4_users', userSchema);

// app_d8d4_addresses
const addressSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'app_d8d4_users', required: true },
  label: { type: String, required: true, trim: true },
  street: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  zip: { type: String, required: true, trim: true },
  country: { type: String, required: true, trim: true },
  is_default: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
}, { timestamps: false });
addressSchema.index({ user_id: 1 });
const Address = mongoose.model('app_d8d4_addresses', addressSchema);

// app_d8d4_products
const variantSchema = new mongoose.Schema({
  size: { type: String },
  color: { type: String },
  sku: { type: String, required: true, unique: true },
  stock: { type: Number, required: true, min: 0 }
});

const productSchema = new mongoose.Schema({
  seller_id: { type: mongoose.Schema.Types.ObjectId, ref: 'app_d8d4_users', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String },
  brand: { type: String },
  price: { type: Number, required: true, min: 0 },
  original_price: { type: Number, min: 0 },
  discount_percent: { 
    type: Number, 
    min: 0, 
    max: 100, 
    default: function() {
      return this.original_price > 0 
        ? Math.round(((this.original_price - this.price) / this.original_price) * 100) 
        : 0;
    }
  },
  images: [{ type: String, required: true }], // S3 URLs
  variants: [variantSchema],
  stock_total: { 
    type: Number, 
    required: true, 
    min: 0,
    default: function() {
      return this.variants.reduce((sum, v) => sum + v.stock, 0);
    }
  },
  status: { type: String, enum: ['active', 'draft', 'archived'], default: 'active' },
  avg_rating: { type: Number, default: 0, min: 0, max: 5 },
  review_count: { type: Number, default: 0, min: 0 },
  view_count: { type: Number, default: 0, min: 0 },
  tags: [{ type: String }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, { timestamps: false });
productSchema.index({ seller_id: 1 });
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ avg_rating: -1 });
productSchema.index({ created_at: -1 });
productSchema.index({ title: 'text', description: 'text', brand: 'text', tags: 'text' }); // Full-text search
const Product = mongoose.model('app_d8d4_products', productSchema);

// app_d8d4_cart
const cartItemSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'app_d8d4_products', required: true },
  variant_id: { type: String }, // references sku
  quantity: { type: Number, required: true, min: 1 },
  price_snapshot: { type: Number, required: true } // price at time of add
});

const cartSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'app_d8d4_users', required: true, unique: true },
  items: [cartItemSchema],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, { timestamps: false });
cartSchema.index({ user_id: 1 }, { unique: true });
const Cart = mongoose.model('app_d8d4_cart', cartSchema);

// app_d8d4_wishlist
const wishlistSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'app_d8d4_users', required: true, unique: true },
  product_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'app_d8d4_products' }],
  created_at: { type: Date, default: Date.now }
}, { timestamps: false });
wishlistSchema.index({ user_id: 1 }, { unique: true });
const Wishlist = mongoose.model('app_d8d4_wishlist', wishlistSchema);

// app_d8d4_orders
const orderItemSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'app_d8d4_products', required: true },
  variant: { type: String }, // e.g., "M / Red"
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  seller_id: { type: mongoose.Schema.Types.ObjectId, ref: 'app_d8d4_users', required: true }
});

const orderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'app_d8d4_users', required: true },
  order_number: { type: String, required: true, unique: true },
  items: [orderItemSchema],
  total_amount: { type: Number, required: true, min: 0 },
  discount_amount: { type: Number, default: 0, min: 0 },
  delivery_fee: { type: Number, default: 0, min: 0 },
  tax_amount: { type: Number, default: 0, min: 0 },
  payment_method: { type: String, required: true },
  payment_status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
  order_status: { 
    type: String, 
    enum: ['placed', 'confirmed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'], 
    default: 'placed' 
  },
  address: {
    label: { type: String },
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    country: { type: String }
  },
  tracking_number: { type: String },
  delivery_speed: { type: String, default: 'standard' },
  coupon_code: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  delivered_at: { type: Date },
  cancelled_at: { type: Date }
}, { timestamps: false });
orderSchema.index({ user_id: 1, created_at: -1 });
orderSchema.index({ order_number: 1 }, { unique: true });
orderSchema.index({ order_status: 1 });
const Order = mongoose.model('app_d8d4_orders', orderSchema);

// app_d8d4_reviews
const reviewSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'app_d8d4_products', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'app_d8d4_users', required: true },
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'app_d8d4_orders', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, trim: true },
  comment: { type: String },
  images: [{ type: String }], // S3 URLs
  helpful_votes: { type: Number, default: 0, min: 0 },
  verified_purchase: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, { timestamps: false });
reviewSchema.index({ product_id: 1, created_at: -1 });
reviewSchema.index({ user_id: 1 });
const Review = mongoose.model('app_d8d4_reviews', reviewSchema);

// app_d8d4_questions
const questionSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'app_d8d4_products', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'app_d8d4_users', required: true },
  question: { type: String, required: true },
  answer: { type: String },
  answered_by: { type: mongoose.Schema.Types.ObjectId, ref: 'app_d8d4_users' },
  created_at: { type: Date, default: Date.now },
  answered_at: { type: Date }
}, { timestamps: false });
questionSchema.index({ product_id: 1, created_at: -1 });
const Question = mongoose.model('app_d8d4_questions', questionSchema);

// app_d8d4_coupons
const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  discount_type: { type: String, enum: ['percent', 'fixed'], required: true },
  discount_value: { type: Number, required: true, min: 0 },
  min_order_value: { type: Number, default: 0, min: 0 },
  max_uses: { type: Number, default: null },
  used_count: { type: Number, default: 0, min: 0 },
  valid_from: { type: Date, default: Date.now },
  valid_until: { type: Date, required: true },
  active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now }
}, { timestamps: false });
couponSchema.index({ code: 1 }, { unique: true });
couponSchema.index({ active: 1, valid_from: 1, valid_until: 1 });
const Coupon = mongoose.model('app_d8d4_coupons', couponSchema);

// app_d8d4_categories
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  parent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'app_d8d4_categories', default: null },
  image_url: { type: String },
  order: { type: Number, default: 0 }
}, { timestamps: false });
categorySchema.index({ slug: 1 }, { unique: true });
categorySchema.index({ parent_id: 1 });
const Category = mongoose.model('app_d8d4_categories', categorySchema);

// app_d8d4_banners
const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image_url: { type: String, required: true },
  link_url: { type: String, required: true },
  position: { type: String, enum: ['hero', 'sidebar', 'footer'], required: true },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  start_date: { type: Date, default: Date.now },
  end_date: { type: Date, required: true }
}, { timestamps: false });
bannerSchema.index({ position: 1, order: 1 });
bannerSchema.index({ active: 1, start_date: 1, end_date: 1 });
const Banner = mongoose.model('app_d8d4_banners', bannerSchema);

// app_d8d4_seller_applications
const sellerApplicationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'app_d8d4_users', required: true, unique: true },
  business_name: { type: String, required: true },
  tax_id: { type: String, required: true },
  documents: [{ type: String, required: true }], // S3 URLs
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  reviewed_by: { type: mongoose.Schema.Types.ObjectId, ref: 'app_d8d4_users' },
  reviewed_at: { type: Date },
  created_at: { type: Date, default: Date.now }
}, { timestamps: false });
sellerApplicationSchema.index({ user_id: 1 }, { unique: true });
sellerApplicationSchema.index({ status: 1 });
const SellerApplication = mongoose.model('app_d8d4_seller_applications', sellerApplicationSchema);

module.exports = {
  User,
  Address,
  Product,
  Cart,
  Wishlist,
  Order,
  Review,
  Question,
  Coupon,
  Category,
  Banner,
  SellerApplication
};