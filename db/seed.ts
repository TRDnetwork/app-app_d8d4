import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Import models
import UserModel from '../server/src/models/User';
import AddressModel from '../server/src/models/Address';
import CategoryModel from '../server/src/models/Category';
import ProductModel from '../server/src/models/Product';
import ReviewModel from '../server/src/models/Review';
import WishlistModel from '../server/src/models/Wishlist';
import CartModel from '../server/src/models/Cart';
import OrderModel from '../server/src/models/Order';
import CouponModel from '../server/src/models/Coupon';
import BannerModel from '../server/src/models/Banner';
import SellerApplicationModel from '../server/src/models/SellerApplication';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sample data
const roles = ['customer', 'seller', 'admin'];
const deliverySpeeds = ['standard', 'express', 'same_day'];
const paymentMethods = ['stripe', 'upi', 'cod'];
const orderStatuses = ['placed', 'confirmed', 'shipped', 'out_for_delivery', 'delivered'];
const reviewRatings = [5, 4, 5, 3, 5, 4, 2, 5, 4, 5];

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shopsphere');
    console.log('MongoDB connected for seeding');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Seed Users
const seedUsers = async () => {
  console.log('Seeding users...');

  const password = await bcrypt.hash('password123', 10);

  const adminUser = await UserModel.findOneAndUpdate(
    { email: 'admin@shopsphere.com' },
    {
      email: 'admin@shopsphere.com',
      password_hash: password,
      name: 'Admin User',
      phone: '+1234567890',
      role: 'admin',
      email_verified: true,
      loyalty_points: 500,
      created_at: new Date(),
      updated_at: new Date(),
    },
    { upsert: true, new: true }
  );

  const sellerUser = await UserModel.findOneAndUpdate(
    { email: 'seller@shopsphere.com' },
    {
      email: 'seller@shopsphere.com',
      password_hash: password,
      name: 'Seller User',
      phone: '+1987654321',
      role: 'seller',
      email_verified: true,
      loyalty_points: 250,
      created_at: new Date(),
      updated_at: new Date(),
    },
    { upsert: true, new: true }
  );

  const customerUser = await UserModel.findOneAndUpdate(
    { email: 'user@shopsphere.com' },
    {
      email: 'user@shopsphere.com',
      password_hash: password,
      name: 'John Doe',
      phone: '+1555123456',
      role: 'customer',
      email_verified: true,
      loyalty_points: 120,
      created_at: new Date(),
      updated_at: new Date(),
    },
    { upsert: true, new: true }
  );

  return { adminUser, sellerUser, customerUser };
};

// Seed Addresses
const seedAddresses = async (userId: string) => {
  console.log('Seeding addresses...');

  const addresses = [
    {
      user_id: userId,
      type: 'home',
      line1: '123 Main St',
      line2: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      postal_code: '10001',
      country: 'USA',
      is_default: true,
      created_at: new Date(),
    },
    {
      user_id: userId,
      type: 'work',
      line1: '456 Business Ave',
      line2: '',
      city: 'New York',
      state: 'NY',
      postal_code: '10002',
      country: 'USA',
      is_default: false,
      created_at: new Date(),
    },
  ];

  for (const addr of addresses) {
    await AddressModel.findOneAndUpdate({ user_id: addr.user_id, line1: addr.line1 }, addr, {
      upsert: true,
    });
  }
};

// Seed Categories
const seedCategories = async () => {
  console.log('Seeding categories...');

  const categories = [
    { name: 'Electronics', slug: 'electronics', order: 1, created_at: new Date() },
    { name: 'Smartphones', slug: 'smartphones', parent_id: null, order: 2, created_at: new Date() },
    { name: 'Laptops', slug: 'laptops', parent_id: null, order: 3, created_at: new Date() },
    { name: 'Tablets', slug: 'tablets', parent_id: null, order: 4, created_at: new Date() },
    { name: 'Accessories', slug: 'accessories', parent_id: null, order: 5, created_at: new Date() },
    { name: 'Home & Kitchen', slug: 'home-kitchen', order: 6, created_at: new Date() },
    { name: 'Clothing', slug: 'clothing', order: 7, created_at: new Date() },
    { name: 'Books', slug: 'books', order: 8, created_at: new Date() },
  ];

  const created: Record<string, any> = {};

  for (const cat of categories) {
    const doc = await CategoryModel.findOneAndUpdate({ slug: cat.slug }, cat, {
      upsert: true,
      new: true,
    });
    created[cat.slug] = doc._id;
  }

  // Update parent-child relationships
  await CategoryModel.updateOne(
    { slug: 'smartphones' },
    { $set: { parent_id: created['electronics'] } }
  );
  await CategoryModel.updateOne(
    { slug: 'laptops' },
    { $set: { parent_id: created['electronics'] } }
  );
  await CategoryModel.updateOne(
    { slug: 'tablets' },
    { $set: { parent_id: created['electronics'] } }
  );
  await CategoryModel.updateOne(
    { slug: 'accessories' },
    { $set: { parent_id: created['electronics'] } }
  );

  return created;
};

// Seed Products
const seedProducts = async (sellerId: string, categoryIds: Record<string, any>) => {
  console.log('Seeding products...');

  const products = [
    {
      seller_id: sellerId,
      title: 'iPhone 15 Pro',
      slug: 'iphone-15-pro',
      description:
        'The latest iPhone with A17 chip, titanium design, and advanced camera system.',
      category_id: categoryIds['smartphones'],
      brand: 'Apple',
      price: 999,
      original_price: 1099,
      discount_percent: 9,
      sku: 'IP15P-256GB-NATURAL',
      stock_quantity: 50,
      images: [
        'https://via.placeholder.com/800x800?text=iPhone+15+Pro',
        'https://via.placeholder.com/800x800?text=iPhone+15+Pro+Side',
        'https://via.placeholder.com/800x800?text=iPhone+15+Pro+Camera',
      ],
      variants: [
        {
          name: 'Storage',
          values: [
            { value: '128GB', price_modifier: 0 },
            { value: '256GB', price_modifier: 100 },
            { value: '512GB', price_modifier: 250 },
          ],
        },
        {
          name: 'Color',
          values: [
            { value: 'Natural Titanium', price_modifier: 0 },
            { value: 'Blue Titanium', price_modifier: 0 },
            { value: 'White Titanium', price_modifier: 0 },
            { value: 'Black Titanium', price_modifier: 0 },
          ],
        },
      ],
      tags: ['smartphone', 'apple', 'ios', 'camera'],
      is_featured: true,
      is_sponsored: true,
      status: 'active',
      views: 1250,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      seller_id: sellerId,
      title: 'MacBook Pro 14"',
      slug: 'macbook-pro-14',
      description:
        'Powerful MacBook Pro with M3 chip, stunning display, and all-day battery life.',
      category_id: categoryIds['laptops'],
      brand: 'Apple',
      price: 1999,
      original_price: 2199,
      discount_percent: 9,
      sku: 'MBP14-M3-16GB',
      stock_quantity: 30,
      images: [
        'https://via.placeholder.com/800x800?text=MacBook+Pro',
        'https://via.placeholder.com/800x800?text=MacBook+Pro+Keyboard',
        'https://via.placeholder.com/800x800?text=MacBook+Pro+Ports',
      ],
      variants: [
        {
          name: 'Chip',
          values: [
            { value: 'M3', price_modifier: 0 },
            { value: 'M3 Pro', price_modifier: 300 },
            { value: 'M3 Max', price_modifier: 800 },
          ],
        },
        {
          name: 'Memory',
          values: [
            { value: '16GB', price_modifier: 0 },
            { value: '32GB', price_modifier: 400 },
          ],
        },
      ],
      tags: ['laptop', 'apple', 'macos', 'productivity'],
      is_featured: true,
      is_sponsored: false,
      status: 'active',
      views: 980,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      seller_id: sellerId,
      title: 'Sony WH-1000XM5',
      slug: 'sony-wh1000xm5',
      description:
        'Industry-leading noise cancellation with exceptional sound quality and comfort.',
      category_id: categoryIds['accessories'],
      brand: 'Sony',
      price: 349,
      original_price: 399,
      discount_percent: 12,
      sku: 'WH1000XM5-BLACK',
      stock_quantity: 100,
      images: [
        'https://via.placeholder.com/800x800?text=Sony+Headphones',
        'https://via.placeholder.com/800x800?text=Sony+Headphones+Folded',
        'https://via.placeholder.com/800x800?text=Sony+Headphones+Case',
      ],
      variants: [
        {
          name: 'Color',
          values: [
            { value: 'Black', price_modifier: 0 },
            { value: 'Silver', price_modifier: 0 },
          ],
        },
      ],
      tags: ['headphones', 'sony', 'noise-cancellation', 'wireless'],
      is_featured: false,
      is_sponsored: true,
      status: 'active',
      views: 2100,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      seller_id: sellerId,
      title: 'Samsung Galaxy S24',
      slug: 'samsung-galaxy-s24',
      description:
        'Premium Android smartphone with AI-powered camera and long-lasting battery.',
      category_id: categoryIds['smartphones'],
      brand: 'Samsung',
      price: 799,
      original_price: 899,
      discount_percent: 11,
      sku: 'GALAXYS24-256GB-BLACK',
      stock_quantity: 75,
      images: [
        'https://via.placeholder.com/800x800?text=Galaxy+S24',
        'https://via.placeholder.com/800x800?text=Galaxy+S24+Back',
        'https://via.placeholder.com/800x800?text=Galaxy+S24+Screen',
      ],
      variants: [
        {
          name: 'Storage',
          values: [
            { value: '128GB', price_modifier: 0 },
            { value: '256GB', price_modifier: 100 },
            { value: '512GB', price_modifier: 200 },
          ],
        },
        {
          name: 'Color',
          values: [
            { value: 'Phantom Black', price_modifier: 0 },
            { value: 'Sapphire Blue', price_modifier: 0 },
            { value: 'Silver', price_modifier: 0 },
          ],
        },
      ],
      tags: ['smartphone', 'samsung', 'android', 'camera'],
      is_featured: true,
      is_sponsored: false,
      status: 'active',
      views: 1800,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      seller_id: sellerId,
      title: 'Kindle Paperwhite',
      slug: 'kindle-paperwhite',
      description:
        'Waterproof e-reader with glare-free display and weeks of battery life.',
      category_id: categoryIds['books'],
      brand: 'Amazon',
      price: 139,
      original_price: 159,
      discount_percent: 12,
      sku: 'KINDLE-PW-32GB',
      stock_quantity: 200,
      images: [
        'https://via.placeholder.com/800x800?text=Kindle+Paperwhite',
        'https://via.placeholder.com/800x800?text=Kindle+Reading',
        'https://via.placeholder.com/800x800?text=Kindle+Waterproof',
      ],
      variants: [
        {
          name: 'Storage',
          values: [
            { value: '16GB', price_modifier: 0 },
            { value: '32GB', price_modifier: 20 },
          ],
        },
      ],
      tags: ['e-reader', 'kindle', 'books', 'reading'],
      is_featured: false,
      is_sponsored: true,
      status: 'active',
      views: 1650,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  for (const product of products) {
    await ProductModel.findOneAndUpdate({ slug: product.slug }, product, { upsert: true });
  }
};

// Seed Reviews
const seedReviews = async (products: any[], userId: string) => {
  console.log('Seeding reviews...');

  for (const product of products) {
    const productDoc = await ProductModel.findOne({ slug: product.slug });
    if (!productDoc) continue;

    for (let i = 0; i < 3; i++) {
      const rating = reviewRatings[Math.floor(Math.random() * reviewRatings.length)];
      const titles = [
        'Great product!',
        'Excellent value',
        'Highly recommend',
        'Good but could be better',
        'Not what I expected',
      ];
      const comments = [
        'This product exceeded my expectations. Highly recommend!',
        'Good quality for the price. Fast shipping too.',
        'Exactly as described. Works perfectly.',
        'Decent product but the battery life is shorter than expected.',
        'Not satisfied with the purchase. Customer service was helpful though.',
      ];

      await ReviewModel.findOneAndUpdate(
        {
          product_id: productDoc._id,
          user_id: userId,
          created_at: new Date(Date.now() - i * 86400000),
        },
        {
          product_id: productDoc._id,
          user_id: userId,
          rating,
          title: titles[Math.floor(Math.random() * titles.length)],
          comment: comments[Math.floor(Math.random() * comments.length)],
          verified_purchase: true,
          created_at: new Date(Date.now() - i * 86400000),
        },
        { upsert: true }
      );
    }
  }
};

// Seed Wishlist
const seedWishlist = async (userId: string, productSlugs: string[]) => {
  console.log('Seeding wishlist...');

  for (const slug of productSlugs) {
    const product = await ProductModel.findOne({ slug });
    if (product) {
      await WishlistModel.findOneAndUpdate(
        { user_id: userId, product_id: product._id },
        { user_id: userId, product_id: product._id, added_at: new Date() },
        { upsert: true }
      );
    }
  }
};

// Seed Cart
const seedCart = async (userId: string, productSlugs: string[]) => {
  console.log('Seeding cart...');

  const items = [];

  for (const slug of productSlugs) {
    const product = await ProductModel.findOne({ slug });
    if (product && items.length < 2) {
      items.push({
        product_id: product._id,
        variant: 'Storage: 256GB | Color: Black',
        quantity: 1,
        price_snapshot: product.price,
      });
    }
  }

  if (items.length > 0) {
    await CartModel.findOneAndUpdate(
      { user_id: userId },
      { user_id: userId, items, updated_at: new Date() },
      { upsert: true }
    );
  }
};

// Seed Orders
const seedOrders = async (userId: string, addressId: string) => {
  console.log('Seeding orders...');

  const products = await ProductModel.find({}).limit(3);
  const orderNumber = `ORD-${Date.now()}-${userId.slice(-4)}`;

  const items = products.map((p) => ({
    product_id: p._id,
    seller_id: p.seller_id,
    variant: 'One Size',
    quantity: 1,
    price: p.price,
    status: 'delivered',
  }));

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCharge = 9.99;
  const total = subtotal + deliveryCharge;

  const order = new OrderModel({
    user_id: userId,
    order_number: orderNumber,
    items,
    address: {
      type: 'home',
      line1: '123 Main St',
      line2: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      postal_code: '10001',
      country: 'USA',
    },
    delivery_speed: deliverySpeeds[Math.floor(Math.random() * deliverySpeeds.length)],
    payment_method: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
    payment_status: 'completed',
    subtotal,
    delivery_charge: deliveryCharge,
    total,
    status: orderStatuses[Math.floor(Math.random() * orderStatuses.length)],
    tracking_number: `TRK${uuidv4().toUpperCase().substring(0, 12)}`,
    estimated_delivery: new Date(Date.now() + 3 * 86400000),
    delivered_at: new Date(),
    created_at: new Date(Date.now() - 86400000),
    updated_at: new Date(),
  });

  await order.save();
};

// Seed Coupons
const seedCoupons = async () => {
  console.log('Seeding coupons...');

  const coupons = [
    {
      code: 'WELCOME10',
      type: 'percentage',
      value: 10,
      min_order_value: 50,
      max_discount: 20,
      usage_limit: 1000,
      used_count: 150,
      valid_from: new Date(Date.now() - 86400000),
      valid_until: new Date(Date.now() + 30 * 86400000),
      is_active: true,
      created_at: new Date(),
    },
    {
      code: 'FLASH25',
      type: 'percentage',
      value: 25,
      min_order_value: 100,
      max_discount: 50,
      usage_limit: 500,
      used_count: 89,
      valid_from: new Date(),
      valid_until: new Date(Date.now() + 7 * 86400000),
      is_active: true,
      created_at: new Date(),
    },
    {
      code: 'FREESHIP',
      type: 'fixed',
      value: 10,
      min_order_value: 75,
      max_discount: 10,
      usage_limit: 1000,
      used_count: 320,
      valid_from: new Date(),
      valid_until: new Date(Date.now() + 14 * 86400000),
      is_active: true,
      created_at: new Date(),
    },
  ];

  for (const coupon of coupons) {
    await CouponModel.findOneAndUpdate({ code: coupon.code }, coupon, { upsert: true });
  }
};

// Seed Banners
const seedBanners = async () => {
  console.log('Seeding banners...');

  const banners = [
    {
      title: 'Summer Sale - Up to 50% Off',
      image_url: 'https://via.placeholder.com/1200x400?text=Summer+Sale',
      link_url: '/search?sale=true',
      order: 1,
      is_active: true,
      start_date: new Date(Date.now() - 86400000),
      end_date: new Date(Date.now() + 7 * 86400000),
      created_at: new Date(),
    },
    {
      title: 'New Arrivals - Just Landed',
      image_url: 'https://via.placeholder.com/1200x400?text=New+Arrivals',
      link_url: '/new-arrivals',
      order: 2,
      is_active: true,
      start_date: new Date(),
      end_date: new Date(Date.now() + 14 * 86400000),
      created_at: new Date(),
    },
    {
      title: 'Free Shipping on Orders Over $75',
      image_url: 'https://via.placeholder.com/1200x400?text=Free+Shipping',
      link_url: '/shipping-info',
      order: 3,
      is_active: true,
      start_date: new Date(),
      end_date: new Date(Date.now() + 30 * 86400000),
      created_at: new Date(),
    },
  ];

  for (const banner of banners) {
    await BannerModel.findOneAndUpdate({ title: banner.title }, banner, { upsert: true });
  }
};

// Seed Seller Applications
const seedSellerApplications = async (userId: string) => {
  console.log('Seeding seller applications...');

  await SellerApplicationModel.findOneAndUpdate(
    { user_id: userId },
    {
      user_id: userId,
      business_name: 'Tech Innovations LLC',
      business_address: '789 Innovation Dr, San Francisco, CA 94107',
      tax_id: '12-3456789',
      phone: '+14155550123',
      status: 'approved',
      submitted_at: new Date(Date.now() - 86400000),
      reviewed_at: new Date(),
    },
    { upsert: true }
  );
};

// Main seed function
const runSeed = async () => {
  try {
    await connectDB();

    // Drop all collections before seeding (optional, for clean state)
    // Uncomment if you want to reset data on each seed
    /*
    await Promise.all([
      UserModel.deleteMany({}),
      AddressModel.deleteMany({}),
      CategoryModel.deleteMany({}),
      ProductModel.deleteMany({}),
      ReviewModel.deleteMany({}),
      WishlistModel.deleteMany({}),
      CartModel.deleteMany({}),
      OrderModel.deleteMany({}),
      CouponModel.deleteMany({}),
      BannerModel.deleteMany({}),
      SellerApplicationModel.deleteMany({}),
    ]);
    */

    const { adminUser, sellerUser, customerUser } = await seedUsers();

    await seedAddresses(customerUser._id);
    const address = await AddressModel.findOne({ user_id: customerUser._id });

    const categoryIds = await seedCategories();
    await seedProducts(sellerUser._id, categoryIds);

    const products = [
      { slug: 'iphone-15-pro' },
      { slug: 'macbook-pro-14' },
      { slug: 'sony-wh-1000xm5' },
      { slug: 'samsung-galaxy-s24' },
      { slug: 'kindle-paperwhite' },
    ];

    await seedReviews(products, customerUser._id);
    await seedWishlist(customerUser._id, ['iphone-15-pro', 'sony-wh-1000xm5']);
    await seedCart(customerUser._id, ['macbook-pro-14', 'kindle-paperwhite']);
    await seedOrders(customerUser._id, address._id);
    await seedCoupons();
    await seedBanners();
    await seedSellerApplications(sellerUser._id);

    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run seed
runSeed();