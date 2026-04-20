import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

// Import models
import User from '../server/src/models/User';
import Category from '../server/src/models/Category';
import Product from '../server/src/models/Product';
import Address from '../server/src/models/Address';
import Review from '../server/src/models/Review';
import Question from '../server/src/models/Question';
import Cart from '../server/src/models/Cart';
import Wishlist from '../server/src/models/Wishlist';
import Order from '../server/src/models/Order';
import Coupon from '../server/src/models/Coupon';
import Banner from '../server/src/models/Banner';

// Sample data
const ADMIN_EMAIL = 'admin@shopsphere.com';
const SELLER_EMAIL = 'seller@shopsphere.com';
const CUSTOMER_EMAIL = 'user@shopsphere.com';

async function seed() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shopsphere');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Address.deleteMany({}),
      Review.deleteMany({}),
      Question.deleteMany({}),
      Cart.deleteMany({}),
      Wishlist.deleteMany({}),
      Order.deleteMany({}),
      Coupon.deleteMany({}),
      Banner.deleteMany({})
    ]);
    console.log('Cleared existing data');

    // Create roles
    const [admin, seller, customer] = await Promise.all([
      User.create({
        email: ADMIN_EMAIL,
        password_hash: await bcrypt.hash('admin123', 10),
        name: 'Admin User',
        role: 'admin',
        email_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      }),
      User.create({
        email: SELLER_EMAIL,
        password_hash: await bcrypt.hash('seller123', 10),
        name: 'Seller User',
        role: 'seller',
        email_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      }),
      User.create({
        email: CUSTOMER_EMAIL,
        password_hash: await bcrypt.hash('user123', 10),
        name: 'Test Customer',
        phone: '+1234567890',
        profile_picture_url: 'https://i.pravatar.cc/150?img=1',
        loyalty_points: 250,
        email_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      })
    ]);

    console.log('Created users');

    // Create categories
    const [electronics, clothing, books] = await Promise.all([
      Category.create({
        name: 'Electronics',
        slug: 'electronics',
        image_url: '/images/categories/electronics.jpg',
        order: 1,
        created_at: new Date()
      }),
      Category.create({
        name: 'Clothing',
        slug: 'clothing',
        image_url: '/images/categories/clothing.jpg',
        order: 2,
        created_at: new Date()
      }),
      Category.create({
        name: 'Books',
        slug: 'books',
        image_url: '/images/categories/books.jpg',
        order: 3,
        created_at: new Date()
      })
    ]);

    console.log('Created categories');

    // Create products
    const productsData = [
      {
        seller_id: seller._id,
        title: 'Wireless Noise-Canceling Headphones',
        slug: 'wireless-headphones',
        description: 'Premium wireless headphones with active noise cancellation and 30-hour battery life.',
        category_id: electronics._id,
        brand: 'SoundMax',
        price: 299.99,
        original_price: 399.99,
        discount_percent: 25,
        sku: 'SM-HD-001',
        stock_quantity: 50,
        images: [
          'https://i.imgur.com/7KbBpJp.jpg',
          'https://i.imgur.com/mNvzZ9G.jpg',
          'https://i.imgur.com/9XaTQ2v.jpg'
        ],
        variants: [
          {
            name: 'Color',
            values: ['Black', 'Silver', 'Blue'],
            price_modifier: 0
          }
        ],
        tags: ['audio', 'wireless', 'noise-canceling'],
        is_featured: true,
        is_sponsored: true,
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        seller_id: seller._id,
        title: 'Organic Cotton T-Shirt',
        slug: 'organic-tshirt',
        description: 'Soft, breathable 100% organic cotton t-shirt available in multiple colors.',
        category_id: clothing._id,
        brand: 'EcoWear',
        price: 29.99,
        original_price: 39.99,
        discount_percent: 25,
        sku: 'EC-TS-001',
        stock_quantity: 200,
        images: [
          'https://i.imgur.com/5XaVbWc.jpg',
          'https://i.imgur.com/8YzQrTd.jpg'
        ],
        variants: [
          {
            name: 'Size',
            values: ['S', 'M', 'L', 'XL'],
            price_modifier: 0
          },
          {
            name: 'Color',
            values: ['White', 'Black', 'Navy', 'Gray'],
            price_modifier: 0
          }
        ],
        tags: ['clothing', 'cotton', 'eco-friendly'],
        is_featured: true,
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        seller_id: seller._id,
        title: 'The Art of Computer Programming',
        slug: 'art-of-computer-programming',
        description: 'Classic computer science book by Donald Knuth covering fundamental algorithms.',
        category_id: books._id,
        brand: 'Addison-Wesley',
        price: 149.99,
        original_price: 149.99,
        discount_percent: 0,
        sku: 'AW-BK-001',
        stock_quantity: 25,
        images: [
          'https://i.imgur.com/3XcYzAb.jpg'
        ],
        variants: [],
        tags: ['programming', 'computer-science', 'algorithms'],
        is_featured: false,
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    const products = await Product.insertMany(productsData);
    console.log('Created products');

    // Create customer address
    const address = await Address.create({
      user_id: customer._id,
      type: 'home',
      line1: '123 Main Street',
      city: 'New York',
      state: 'NY',
      postal_code: '10001',
      country: 'USA',
      is_default: true,
      created_at: new Date()
    });
    console.log('Created address');

    // Create cart
    const cart = await Cart.create({
      user_id: customer._id,
      items: [
        {
          product_id: products[0]._id,
          variant_id: null,
          quantity: 1,
          price_snapshot: 299.99
        }
      ],
      updated_at: new Date()
    });
    console.log('Created cart');

    // Create wishlist
    await Wishlist.create({
      user_id: customer._id,
      product_id: products[1]._id,
      added_at: new Date()
    });
    console.log('Created wishlist');

    // Create reviews
    const reviewsData = [
      {
        product_id: products[0]._id,
        user_id: customer._id,
        rating: 5,
        title: 'Excellent Sound Quality',
        comment: 'These headphones are amazing! The noise cancellation works perfectly.',
        images: ['https://i.imgur.com/mNvzZ9G.jpg'],
        verified_purchase: true,
        created_at: new Date()
      },
      {
        product_id: products[1]._id,
        user_id: customer._id,
        rating: 4,
        title: 'Comfortable and Soft',
        comment: 'Great quality t-shirt, fits well and feels very comfortable.',
        verified_purchase: true,
        created_at: new Date()
      }
    ];

    await Review.insertMany(reviewsData);
    console.log('Created reviews');

    // Create questions
    await Question.create({
      product_id: products[0]._id,
      user_id: customer._id,
      question: 'Does this work with Android phones?',
      answer: 'Yes, these headphones are compatible with all Bluetooth-enabled devices including Android phones.',
      answered_by: seller._id,
      answered_at: new Date(),
      created_at: new Date()
    });
    console.log('Created Q&A');

    // Create coupon
    await Coupon.create({
      code: 'WELCOME10',
      type: 'percentage',
      value: 10,
      min_order_value: 50,
      max_discount: 20,
      usage_limit: 100,
      valid_from: new Date(),
      valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      is_active: true,
      created_at: new Date()
    });
    console.log('Created coupon');

    // Create banner
    await Banner.create({
      title: 'Summer Sale - Up to 50% Off',
      image_url: '/images/banners/summer-sale.jpg',
      link_url: '/deals',
      order: 1,
      is_active: true,
      start_date: new Date(),
      end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      created_at: new Date()
    });
    console.log('Created banner');

    // Create order
    const order = await Order.create({
      user_id: customer._id,
      order_number: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      items: [
        {
          product_id: products[0]._id,
          seller_id: seller._id,
          variant: 'Black',
          quantity: 1,
          price: 299.99,
          status: 'delivered'
        }
      ],
      address: {
        line1: address.line1,
        city: address.city,
        state: address.state,
        postal_code: address.postal_code,
        country: address.country
      },
      delivery_speed: 'standard',
      payment_method: 'stripe',
      payment_status: 'completed',
      subtotal: 299.99,
      discount: 0,
      delivery_charge: 0,
      total: 299.99,
      status: 'delivered',
      tracking_number: 'TRK123456789',
      estimated_delivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      delivered_at: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    });
    console.log('Created order');

    console.log('✅ Seeding completed successfully!');
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run seed if called directly
if (require.main === module) {
  seed().catch(console.error);
}

export default seed;