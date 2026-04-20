/**
 * Mongoose schema definitions for ShopSphere e-commerce platform
 * Collection names prefixed with `app_d8d4_` as per architectural specification
 */

import mongoose from 'mongoose';

// Helper: Timestamps plugin
const timestampsPlugin = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
};

// ==================== USERS ====================
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password_hash: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  profile_picture_url: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['customer', 'seller', 'admin'],
    default: 'customer'
  },
  email_verified: {
    type: Boolean,
    default: false
  },
  oauth_provider: {
    type: String,
    enum: ['google', 'facebook'],
    default: null
  },
  oauth_id: {
    type: String,
    sparse: true
  }
}, timestampsPlugin);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ oauth_id: 1 }, { sparse: true });

// ==================== ADDRESSES ====================
const addressSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  label: {
    type: String,
    required: true
  },
  street: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  zip: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  is_default: {
    type: Boolean,
    default: false
  }
}, timestampsPlugin);

addressSchema.index({ user_id: 1 });

// ==================== PRODUCTS ====================
const variantSchema = new mongoose.Schema({
  size: { type: String },
  color: { type: String },
  sku: { type: String, required: true },
  stock: { type: Number, default: 0 }
});

const productSchema = new mongoose.Schema({
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
  category: {
    type: String,
    required: true
  },
  subcategory: {
    type: String
  },
  brand: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  original_price: {
    type: Number,
    min: 0
  },
  discount_percent: {
    type: Number,
    min: 0,
    max: 100
  },
  images: [{
    type: String,
    required: true
  }],
  variants: [variantSchema],
  stock_total: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'draft', 'archived'],
    default: 'active'
  },
  avg_rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  review_count: {
    type: Number,
    default: 0
  },
  view_count: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }]
}, timestampsPlugin);

productSchema.index({ seller_id: 1 });
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ avg_rating: -1 });
productSchema.index({ created_at: -1 });
productSchema.index({ category: 1, status: 1, avg_rating: -1, created_at: -1 });

// ==================== CART ====================
const cartItemSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  variant_id: {
    type: String // SKU or composite key
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price_snapshot: {
    type: Number,
    required: true
  }
});

const cartSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema]
}, timestampsPlugin);

cartSchema.index({ user_id: 1 }, { unique: true });

// ==================== WISHLIST ====================
const wishlistSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  product_ids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }]
}, timestampsPlugin);

wishlistSchema.index({ user_id: 1 }, { unique: true });

// ==================== ORDERS ====================
const orderItemSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  variant: {
    size: String,
    color: String,
    sku: String
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  seller_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const addressSchemaEmbedded = new mongoose.Schema({
  label: String,
  street: String,
  city: String,
  state: String,
  zip: String,
  country: String
});

const orderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  order_number: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  items: [orderItemSchema],
  total_amount: {
    type: Number,
    required: true
  },
  discount_amount: {
    type: Number,
    default: 0
  },
  delivery_fee: {
    type: Number,
    default: 0
  },
  tax_amount: {
    type: Number,
    default: 0
  },
  payment_method: {
    type: String,
    required: true
  },
  payment_status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  order_status: {
    type: String,
    enum: ['placed', 'confirmed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'placed'
  },
  address: addressSchemaEmbedded,
  tracking_number: {
    type: String
  },
  delivery_speed: {
    type: String,
    default: 'standard'
  },
  coupon_code: {
    type: String
  },
  delivered_at: {
    type: Date
  },
  cancelled_at: {
    type: Date
  }
}, timestampsPlugin);

orderSchema.index({ user_id: 1, created_at: -1 });
orderSchema.index({ order_number: 1 }, { unique: true });

// ==================== REVIEWS ====================
const reviewSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    trim: true
  },
  comment: {
    type: String,
    trim: true
  },
  images: [{
    type: String
  }],
  helpful_votes: {
    type: Number,
    default: 0
  },
  verified_purchase: {
    type: Boolean,
    default: true
  }
}, timestampsPlugin);

reviewSchema.index({ product_id: 1, created_at: -1 });
reviewSchema.index({ user_id: 1, product_id: 1 }, { unique: true }); // One review per user per product

// ==================== QUESTIONS ====================
const questionSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String
  },
  answered_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  answered_at: {
    type: Date
  }
}, timestampsPlugin);

questionSchema.index({ product_id: 1, created_at: -1 });

// ==================== COUPONS ====================
const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
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
  max_uses: {
    type: Number,
    required: true,
    min: 1
  },
  used_count: {
    type: Number,
    default: 0
  },
  valid_from: {
    type: Date,
    required: true
  },
  valid_until: {
    type: Date,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, timestampsPlugin);

couponSchema.index({ code: 1 }, { unique: true });
couponSchema.index({ active: 1, valid_from: 1, valid_until: 1 });

// ==================== CATEGORIES ====================
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  parent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  image_url: {
    type: String
  },
  order: {
    type: Number,
    default: 0
  }
}, timestampsPlugin);

categorySchema.index({ slug: 1 }, { unique: true });
categorySchema.index({ parent_id: 1 });

// ==================== BANNERS ====================
const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  image_url: {
    type: String,
    required: true
  },
  link_url: {
    type: String,
    required: true
  },
  position: {
    type: String,
    enum: ['hero', 'sidebar', 'footer'],
    required: true
  },
  order: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: true
  },
  start_date: {
    type: Date
  },
  end_date: {
    type: Date
  }
}, timestampsPlugin);

bannerSchema.index({ position: 1, order: 1, active: 1 });

// ==================== SELLER APPLICATIONS ====================
const sellerApplicationSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  business_name: {
    type: String,
    required: true
  },
  tax_id: {
    type: String,
    required: true
  },
  documents: [{
    type: String,
    required: true
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  reviewed_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewed_at: {
    type: Date
  }
}, timestampsPlugin);

sellerApplicationSchema.index({ user_id: 1 }, { unique: true });
sellerApplicationSchema.index({ status: 1 });

// Compile models
const User = mongoose.model('User', userSchema, 'app_d8d4_users');
const Address = mongoose.model('Address', addressSchema, 'app_d8d4_addresses');
const Product = mongoose.model('Product', productSchema, 'app_d8d4_products');
const Cart = mongoose.model('Cart', cartSchema, 'app_d8d4_cart');
const Wishlist = mongoose.model('Wishlist', wishlistSchema, 'app_d8d4_wishlist');
const Order = mongoose.model('Order', orderSchema, 'app_d8d4_orders');
const Review = mongoose.model('Review', reviewSchema, 'app_d8d4_reviews');
const Question = mongoose.model('Question', questionSchema, 'app_d8d4_questions');
const Coupon = mongoose.model('Coupon', couponSchema, 'app_d8d4_coupons');
const Category = mongoose.model('Category', categorySchema, 'app_d8d4_categories');
const Banner = mongoose.model('Banner', bannerSchema, 'app_d8d4_banners');
const SellerApplication = mongoose.model('SellerApplication', sellerApplicationSchema, 'app_d8d4_seller_applications');

export {
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