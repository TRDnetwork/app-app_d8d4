/**
 * Seed data for ShopSphere e-commerce platform
 * Populate MongoDB collections with realistic sample data
 */

import {
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
} from './schema.js';
import bcrypt from 'bcryptjs';

// Helper: Hash password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Seed function
const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Address.deleteMany({});
    await Product.deleteMany({});
    await Cart.deleteMany({});
    await Wishlist.deleteMany({});
    await Order.deleteMany({});
    await Review.deleteMany({});
    await Question.deleteMany({});
    await Coupon.deleteMany({});
    await Category.deleteMany({});
    await Banner.deleteMany({});
    await SellerApplication.deleteMany({});

    console.log('🗑️  Existing data cleared');

    // ==================== CATEGORIES ====================
    const categories = [
      await Category.create({
        name: 'Electronics',
        slug: 'electronics',
        order: 1
      }),
      await Category.create({
        name: 'Clothing',
        slug: 'clothing',
        order: 2
      }),
      await Category.create({
        name: 'Home & Kitchen',
        slug: 'home-kitchen',
        order: 3
      }),
      await Category.create({
        name: 'Books',
        slug: 'books',
        order: 4
      }),
      await Category.create({
        name: 'Sports & Outdoors',
        slug: 'sports-outdoors',
        order: 5
      })
    ];

    // ==================== USERS ====================
    const [adminUser, sellerUser, customerUser] = await Promise.all([
      User.create({
        email: 'admin@shopsphere.com',
        password_hash: await hashPassword('admin123'),
        name: 'Admin User',
        role: 'admin',
        email_verified: true
      }),
      User.create({
        email: 'seller@shopsphere.com',
        password_hash: await hashPassword('seller123'),
        name: 'Seller User',
        role: 'seller',
        email_verified: true
      }),
      User.create({
        email: 'customer@shopsphere.com',
        password_hash: await hashPassword('customer123'),
        name: 'Customer User',
        phone: '+1234567890',
        profile_picture_url: 'https://via.placeholder.com/150',
        role: 'customer',
        email_verified: true
      })
    ]);

    console.log('👥 Users created');

    // ==================== ADDRESSES ====================
    const address = await Address.create({
      user_id: customerUser._id,
      label: 'Home',
      street: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zip: '94107',
      country: 'USA',
      is_default: true
    });

    console.log('🏠 Addresses created');

    // ==================== PRODUCTS ====================
    const products = [
      await Product.create({
        seller_id: sellerUser._id,
        title: 'Wireless Noise-Canceling Headphones',
        description: 'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound quality.',
        category: 'Electronics',
        brand: 'SoundMax',
        price: 199.99,
        original_price: 299.99,
        discount_percent: 33,
        images: [
          'https://via.placeholder.com/500x500?text=Headphones+Front',
          'https://via.placeholder.com/500x500?text=Headphones+Side',
          'https://via.placeholder.com/500x500?text=Headphones+Box'
        ],
        variants: [
          { size: null, color: 'Black', sku: 'HP-BLK-001', stock: 50 },
          { size: null, color: 'Silver', sku: 'HP-SLV-001', stock: 30 }
        ],
        stock_total: 80,
        status: 'active',
        tags: ['audio', 'wireless', 'premium']
      }),
      await Product.create({
        seller_id: sellerUser._id,
        title: 'Organic Cotton T-Shirt',
        description: 'Soft, breathable 100% organic cotton t-shirt, available in multiple colors. Ethically made and sustainable.',
        category: 'Clothing',
        brand: 'EcoWear',
        price: 29.99,
        original_price: 39.99,
        discount_percent: 25,
        images: [
          'https://via.placeholder.com/500x500?text=T-Shirt+Black',
          'https://via.placeholder.com/500x500?text=T-Shirt+White',
          'https://via.placeholder.com/500x500?text=T-Shirt+Model'
        ],
        variants: [
          { size: 'S', color: 'Black', sku: 'TS-S-BLK', stock: 100 },
          { size: 'M', color: 'Black', sku: 'TS-M-BLK', stock: 150 },
          { size: 'L', color: 'White', sku: 'TS-L-WHT', stock: 80 }
        ],
        stock_total: 330,
        status: 'active',
        tags: ['cotton', 'sustainable', 'basic']
      }),
      await Product.create({
        seller_id: sellerUser._id,
        title: 'Stainless Steel Water Bottle',
        description: 'Double-wall insulated 24oz water bottle keeps drinks cold for 24 hours or hot for 12 hours. Leak-proof lid.',
        category: 'Home & Kitchen',
        brand: 'AquaVita',
        price: 24.99,
        original_price: 29.99,
        discount_percent: 17,
        images: [
          'https://via.placeholder.com/500x500?text=Bottle+Blue',
          'https://via.placeholder.com/500x500?text=Bottle+Red',
          'https://via.placeholder.com/500x500?text=Bottle+Open'
        ],
        variants: [
          { size: '24oz', color: 'Blue', sku: 'WB-24-BLU', stock: 200 },
          { size: '24oz', color: 'Red', sku: 'WB-24-RED', stock: 180 }
        ],
        stock_total: 380,
        status: 'active',
        tags: ['water', 'insulated', 'eco-friendly']
      }),
      await Product.create({
        seller_id: sellerUser._id,
        title: 'The Great Gatsby',
        description: 'F. Scott Fitzgerald\'s classic novel of the Jazz Age, a masterpiece of American literature.',
        category: 'Books',
        brand: null,
        price: 12.99,
        original_price: 14.99,
        discount_percent: 13,
        images: [
          'https://via.placeholder.com/500x500?text=Great+Gatsby+Cover'
        ],
        variants: [
          { size: null, color: null, sku: 'BK-GG-001', stock: 1000 }
        ],
        stock_total: 1000,
        status: 'active',
        tags: ['fiction', 'classic', 'literature']
      }),
      await Product.create({
        seller_id: sellerUser._id,
        title: 'Yoga Mat',
        description: 'Non-slip, extra thick 6mm yoga mat with alignment markers. Perfect for all types of yoga and floor exercises.',
        category: 'Sports & Outdoors',
        brand: 'ZenFit',
        price: 39.99,
        original_price: 49.99,
        discount_percent: 20,
        images: [
          'https://via.placeholder.com/500x500?text=Yoga+Mat+Unrolled',
          'https://via.placeholder.com/500x500?text=Yoga+Mat+Rolled'
        ],
        variants: [
          { size: 'Standard', color: 'Purple', sku: 'YM-PUR-STD', stock: 75 },
          { size: 'Standard', color: 'Black', sku: 'YM-BLK-STD', stock: 60 },
          { size: 'Long', color: 'Blue', sku: 'YM-BLU-LNG', stock: 40 }
        ],
        stock_total: 175,
        status: 'active',
        tags: ['yoga', 'fitness', 'mat']
      })
    ];

    console.log('🛍️  Products created');

    // ==================== CART ====================
    await Cart.create({
      user_id: customerUser._id,
      items: [
        {
          product_id: products[0]._id,
          variant_id: 'HP-BLK-001',
          quantity: 1,
          price_snapshot: 199.99
        },
        {
          product_id: products[1]._id,
          variant_id: 'TS-M-BLK',
          quantity: 2,
          price_snapshot: 29.99
        }
      ]
    });

    console.log('🛒 Cart created');

    // ==================== WISHLIST ====================
    await Wishlist.create({
      user_id: customerUser._id,
      product_ids: [products[2]._id, products[4]._id]
    });

    console.log('❤️  Wishlist created');

    // ==================== COUPONS ====================
    await Coupon.create({
      code: 'WELCOME10',
      discount_type: 'percent',
      discount_value: 10,
      min_order_value: 50,
      max_uses: 1000,
      used_count: 0,
      valid_from: new Date(),
      valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      active: true
    });

    await Coupon.create({
      code: 'FLASH25',
      discount_type: 'percent',
      discount_value: 25,
      min_order_value: 100,
      max_uses: 100,
      used_count: 0,
      valid_from: new Date(),
      valid_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      active: true
    });

    console.log('🎟️  Coupons created');

    // ==================== BANNERS ====================
    await Banner.create({
      title: 'Summer Sale is Live!',
      image_url: 'https://via.placeholder.com/1200x400?text=Summer+Sale',
      link_url: '/search?sale=true',
      position: 'hero',
      order: 1,
      active: true,
      start_date: new Date(),
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    await Banner.create({
      title: 'New Arrivals',
      image_url: 'https://via.placeholder.com/300x200?text=New+Arrivals',
      link_url: '/new-arrivals',
      position: 'sidebar',
      order: 1,
      active: true
    });

    console.log('🖼️  Banners created');

    // ==================== REVIEWS ====================
    await Review.create({
      product_id: products[0]._id,
      user_id: customerUser._id,
      order_id: null, // Will be linked after order creation
      rating: 5,
      title: 'Outstanding Sound Quality',
      comment: 'These headphones are amazing! The noise cancellation works perfectly on my daily commute.',
      images: [],
      helpful_votes: 12,
      verified_purchase: true
    });

    await Review.create({
      product_id: products[1]._id,
      user_id: customerUser._id,
      order_id: null,
      rating: 4,
      title: 'Comfortable and Soft',
      comment: 'Great t-shirt, fits well and feels very comfortable. Color is true to picture.',
      helpful_votes: 5,
      verified_purchase: true
    });

    console.log('⭐ Reviews created');

    // ==================== QUESTIONS ====================
    await Question.create({
      product_id: products[0]._id,
      user_id: customerUser._id,
      question: 'Does this come with a carrying case?',
      answer: 'Yes, a soft zippered case is included in the box.',
      answered_by: sellerUser._id,
      answered_at: new Date()
    });

    await Question.create({
      product_id: products[2]._id,
      user_id: customerUser._id,
      question: 'Is this dishwasher safe?',
      answer: 'The bottle is top-rack dishwasher safe, but we recommend hand washing for longevity.',
      answered_by: sellerUser._id,
      answered_at: new Date()
    });

    console.log('❓ Questions created');

    // ==================== ORDER ====================
    const order = await Order.create({
      user_id: customerUser._id,
      order_number: 'ORD-1001',
      items: [
        {
          product_id: products[0]._id,
          variant: { size: null, color: 'Black', sku: 'HP-BLK-001' },
          quantity: 1,
          price: 199.99,
          seller_id: sellerUser._id
        },
        {
          product_id: products[1]._id,
          variant: { size: 'M', color: 'Black', sku: 'TS-M-BLK' },
          quantity: 1,
          price: 29.99,
          seller_id: sellerUser._id
        }
      ],
      total_amount: 229.98,
      delivery_fee: 5.99,
      tax_amount: 18.40,
      payment_method: 'card',
      payment_status: 'completed',
      order_status: 'delivered',
      address: address.toObject(),
      tracking_number: 'TRK123456789',
      delivered_at: new Date(),
      coupon_code: 'WELCOME10'
    });

    // Link reviews to order
    await Review.updateMany(
      { user_id: customerUser._id, order_id: null },
      { order_id: order._id }
    );

    console.log('📦 Order created and reviews linked');

    console.log('✅ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run seed if called directly
if (process.argv[2] === '--seed') {
  seedData();
}

export default seedData;