import { MongoClient } from 'mongodb';
import { hash } from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shopsphere';
const DB_NAME = 'shopsphere';

// Seed data for ShopSphere (app_d8d4)
// Realistic sample data with proper relationships

async function seed() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  console.log('Connected to MongoDB for seeding');

  const db = client.db(DB_NAME);

  try {
    // Clear existing data
    await db.collection('app_d8d4_users').deleteMany({});
    await db.collection('app_d8d4_addresses').deleteMany({});
    await db.collection('app_d8d4_categories').deleteMany({});
    await db.collection('app_d8d4_products').deleteMany({});
    await db.collection('app_d8d4_reviews').deleteMany({});
    await db.collection('app_d8d4_questions').deleteMany({});
    await db.collection('app_d8d4_carts').deleteMany({});
    await db.collection('app_d8d4_wishlists').deleteMany({});
    await db.collection('app_d8d4_orders').deleteMany({});
    await db.collection('app_d8d4_coupons').deleteMany({});
    await db.collection('app_d8d4_banners').deleteMany({});
    await db.collection('app_d8d4_seller_applications').deleteMany({});
    await db.collection('app_d8d4_notifications').deleteMany({});
    await db.collection('app_d8d4_product_views').deleteMany({});

    console.log('Cleared existing data');

    // Seed Users
    const passwordHash = await hash('password123', 10);
    const users = [
      {
        _id: 'user_1',
        email: 'customer@example.com',
        password_hash: passwordHash,
        name: 'John Doe',
        phone: '+1234567890',
        profile_picture_url: 'https://picsum.photos/200/300?random=1',
        email_verified: true,
        role: 'customer',
        loyalty_points: 150,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        _id: 'user_2',
        email: 'seller@example.com',
        password_hash: passwordHash,
        name: 'Jane Seller',
        phone: '+1234567891',
        profile_picture_url: 'https://picsum.photos/200/300?random=2',
        email_verified: true,
        role: 'seller',
        loyalty_points: 0,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        _id: 'user_3',
        email: 'admin@example.com',
        password_hash: passwordHash,
        name: 'Admin User',
        phone: '+1234567892',
        profile_picture_url: 'https://picsum.photos/200/300?random=3',
        email_verified: true,
        role: 'admin',
        loyalty_points: 0,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await db.collection('app_d8d4_users').insertMany(users);
    console.log('Seeded users');

    // Seed Addresses
    const addresses = [
      {
        _id: 'addr_1',
        user_id: 'user_1',
        type: 'home',
        line1: '123 Main St',
        line2: 'Apt 4B',
        city: 'New York',
        state: 'NY',
        postal_code: '10001',
        country: 'USA',
        is_default: true,
        created_at: new Date()
      },
      {
        _id: 'addr_2',
        user_id: 'user_1',
        type: 'work',
        line1: '456 Business Ave',
        city: 'New York',
        state: 'NY',
        postal_code: '10002',
        country: 'USA',
        is_default: false,
        created_at: new Date()
      }
    ];

    await db.collection('app_d8d4_addresses').insertMany(addresses);
    console.log('Seeded addresses');

    // Seed Categories
    const categories = [
      {
        _id: 'cat_1',
        name: 'Electronics',
        slug: 'electronics',
        image_url: 'https://picsum.photos/400/200?random=4',
        order: 1,
        created_at: new Date()
      },
      {
        _id: 'cat_2',
        name: 'Smartphones',
        slug: 'smartphones',
        parent_id: 'cat_1',
        image_url: 'https://picsum.photos/400/200?random=5',
        order: 1,
        created_at: new Date()
      },
      {
        _id: 'cat_3',
        name: 'Laptops',
        slug: 'laptops',
        parent_id: 'cat_1',
        image_url: 'https://picsum.photos/400/200?random=6',
        order: 2,
        created_at: new Date()
      },
      {
        _id: 'cat_4',
        name: 'Home & Kitchen',
        slug: 'home-kitchen',
        image_url: 'https://picsum.photos/400/200?random=7',
        order: 2,
        created_at: new Date()
      }
    ];

    await db.collection('app_d8d4_categories').insertMany(categories);
    console.log('Seeded categories');

    // Seed Products
    const products = [
      {
        _id: 'prod_1',
        seller_id: 'user_2',
        title: 'Wireless Noise-Cancelling Headphones',
        slug: 'wireless-noise-cancelling-headphones',
        description: 'Premium wireless headphones with active noise cancellation and 30-hour battery life.',
        category_id: 'cat_1',
        brand: 'SoundMax',
        price: 299.99,
        original_price: 399.99,
        discount_percent: 25,
        sku: 'SM-HD-001',
        stock_quantity: 50,
        images: [
          'https://picsum.photos/800/800?random=8',
          'https://picsum.photos/800/800?random=9',
          'https://picsum.photos/800/800?random=10'
        ],
        variants: [
          {
            name: 'Color',
            values: ['Black', 'White', 'Blue'],
            price_modifier: 0
          }
        ],
        tags: ['audio', 'wireless', 'noise-cancelling'],
        is_featured: true,
        is_sponsored: true,
        status: 'active',
        views: 150,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        _id: 'prod_2',
        seller_id: 'user_2',
        title: 'Smartphone Pro X',
        slug: 'smartphone-pro-x',
        description: 'Latest flagship smartphone with 6.7" OLED display, 128GB storage, and triple camera system.',
        category_id: 'cat_2',
        brand: 'TechPhone',
        price: 899.99,
        original_price: 999.99,
        discount_percent: 10,
        sku: 'TP-SP-001',
        stock_quantity: 25,
        images: [
          'https://picsum.photos/800/800?random=11',
          'https://picsum.photos/800/800?random=12',
          'https://picsum.photos/800/800?random=13'
        ],
        variants: [
          {
            name: 'Storage',
            values: ['128GB', '256GB'],
            price_modifier: 0
          },
          {
            name: 'Color',
            values: ['Space Gray', 'Silver', 'Gold'],
            price_modifier: 0
          }
        ],
        tags: ['smartphone', 'mobile', 'camera'],
        is_featured: true,
        is_sponsored: false,
        status: 'active',
        views: 200,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        _id: 'prod_3',
        seller_id: 'user_2',
        title: 'UltraBook Pro Laptop',
        slug: 'ultrabook-pro-laptop',
        description: 'Lightweight laptop with 13.3" display, 16GB RAM, 512GB SSD, and 12-hour battery.',
        category_id: 'cat_3',
        brand: 'UltraBook',
        price: 1299.99,
        original_price: 1499.99,
        discount_percent: 13.3,
        sku: 'UB-LP-001',
        stock_quantity: 15,
        images: [
          'https://picsum.photos/800/800?random=14',
          'https://picsum.photos/800/800?random=15',
          'https://picsum.photos/800/800?random=16'
        ],
        variants: [
          {
            name: 'Color',
            values: ['Silver', 'Space Gray'],
            price_modifier: 0
          }
        ],
        tags: ['laptop', 'ultrabook', 'lightweight'],
        is_featured: false,
        is_sponsored: true,
        status: 'active',
        views: 80,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await db.collection('app_d8d4_products').insertMany(products);
    console.log('Seeded products');

    // Seed Reviews
    const reviews = [
      {
        _id: 'rev_1',
        product_id: 'prod_1',
        user_id: 'user_1',
        order_id: 'order_1',
        rating: 5,
        title: 'Amazing sound quality!',
        comment: 'These headphones deliver incredible sound and the noise cancellation is superb.',
        images: ['https://picsum.photos/400/400?random=17'],
        helpful_votes: 12,
        verified_purchase: true,
        created_at: new Date()
      },
      {
        _id: 'rev_2',
        product_id: 'prod_1',
        user_id: 'user_2',
        order_id: 'order_2',
        rating: 4,
        title: 'Great headphones with long battery life',
        comment: 'Comfortable to wear for long periods and battery lasts as advertised.',
        images: [],
        helpful_votes: 8,
        verified_purchase: true,
        created_at: new Date()
      },
      {
        _id: 'rev_3',
        product_id: 'prod_2',
        user_id: 'user_1',
        order_id: 'order_3',
        rating: 5,
        title: 'Best smartphone I\'ve ever owned',
        comment: 'The camera quality is outstanding and performance is lightning fast.',
        images: ['https://picsum.photos/400/400?random=18'],
        helpful_votes: 24,
        verified_purchase: true,
        created_at: new Date()
      }
    ];

    await db.collection('app_d8d4_reviews').insertMany(reviews);
    console.log('Seeded reviews');

    // Seed Questions
    const questions = [
      {
        _id: 'ques_1',
        product_id: 'prod_1',
        user_id: 'user_1',
        question: 'Does this come with a carrying case?',
        answer: 'Yes, it includes a premium carrying case and 3.5mm audio cable.',
        answered_by: 'user_2',
        created_at: new Date(),
        answered_at: new Date()
      },
      {
        _id: 'ques_2',
        product_id: 'prod_2',
        user_id: 'user_3',
        question: 'Is this phone water resistant?',
        answer: 'Yes, it has IP68 water and dust resistance rating.',
        answered_by: 'user_2',
        created_at: new Date(),
        answered_at: new Date()
      }
    ];

    await db.collection('app_d8d4_questions').insertMany(questions);
    console.log('Seeded questions');

    // Seed Carts
    const carts = [
      {
        _id: 'cart_1',
        user_id: 'user_1',
        items: [
          {
            product_id: 'prod_1',
            variant_id: 'Black',
            quantity: 1,
            price_snapshot: 299.99
          },
          {
            product_id: 'prod_2',
            variant_id: '128GB-Silver',
            quantity: 1,
            price_snapshot: 899.99
          }
        ],
        updated_at: new Date()
      }
    ];

    await db.collection('app_d8d4_carts').insertMany(carts);
    console.log('Seeded carts');

    // Seed Wishlists
    const wishlists = [
      {
        _id: 'wish_1',
        user_id: 'user_1',
        product_id: 'prod_3',
        added_at: new Date()
      }
    ];

    await db.collection('app_d8d4_wishlists').insertMany(wishlists);
    console.log('Seeded wishlists');

    // Seed Orders
    const orders = [
      {
        _id: 'order_1',
        user_id: 'user_1',
        order_number: 'ORD-2024-001',
        items: [
          {
            product_id: 'prod_1',
            seller_id: 'user_2',
            variant: 'Color: Black',
            quantity: 1,
            price: 299.99,
            status: 'delivered'
          }
        ],
        address: {
          type: 'home',
          line1: '123 Main St',
          line2: 'Apt 4B',
          city: 'New York',
          state: 'NY',
          postal_code: '10001',
          country: 'USA'
        },
        delivery_speed: 'standard',
        payment_method: 'stripe',
        payment_status: 'completed',
        stripe_session_id: 'cs_test_123',
        stripe_payment_intent_id: 'pi_123',
        subtotal: 299.99,
        discount: 0,
        delivery_charge: 0,
        total: 299.99,
        status: 'delivered',
        tracking_number: '1Z999AA1234567890',
        estimated_delivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        delivered_at: new Date(),
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        updated_at: new Date()
      }
    ];

    await db.collection('app_d8d4_orders').insertMany(orders);
    console.log('Seeded orders');

    // Seed Coupons
    const coupons = [
      {
        _id: 'coupon_1',
        code: 'WELCOME10',
        type: 'percentage',
        value: 10,
        min_order_value: 50,
        max_discount: 20,
        usage_limit: 100,
        used_count: 5,
        valid_from: new Date(Date.now() - 24 * 60 * 60 * 1000),
        valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        is_active: true,
        created_at: new Date()
      },
      {
        _id: 'coupon_2',
        code: 'FLASH25',
        type: 'percentage',
        value: 25,
        min_order_value: 100,
        max_discount: 50,
        usage_limit: 50,
        used_count: 12,
        valid_from: new Date(),
        valid_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        is_active: true,
        created_at: new Date()
      }
    ];

    await db.collection('app_d8d4_coupons').insertMany(coupons);
    console.log('Seeded coupons');

    // Seed Banners
    const banners = [
      {
        _id: 'banner_1',
        title: 'Summer Sale - Up to 50% Off',
        image_url: 'https://picsum.photos/1200/400?random=19',
        link_url: '/search?sale=summer',
        order: 1,
        is_active: true,
        start_date: new Date(Date.now() - 24 * 60 * 60 * 1000),
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        created_at: new Date()
      },
      {
        _id: 'banner_2',
        title: 'Free Shipping on Orders Over $50',
        image_url: 'https://picsum.photos/1200/400?random=20',
        link_url: '/shipping-policy',
        order: 2,
        is_active: true,
        start_date: new Date(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        created_at: new Date()
      }
    ];

    await db.collection('app_d8d4_banners').insertMany(banners);
    console.log('Seeded banners');

    // Seed Seller Applications
    const sellerApplications = [
      {
        _id: 'seller_app_1',
        user_id: 'user_2',
        business_name: 'Tech Gadgets Store',
        business_address: '789 Commerce St, New York, NY 10003',
        tax_id: '12-3456789',
        phone: '+1234567891',
        status: 'approved',
        submitted_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        reviewed_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      }
    ];

    await db.collection('app_d8d4_seller_applications').insertMany(sellerApplications);
    console.log('Seeded seller applications');

    // Seed Notifications
    const notifications = [
      {
        _id: 'notif_1',
        user_id: 'user_1',
        type: 'order_update',
        title: 'Your order has shipped',
        message: 'Your order #ORD-2024-001 has shipped and is on the way.',
        link: '/orders/order_1',
        is_read: false,
        created_at: new Date()
      },
      {
        _id: 'notif_2',
        user_id: 'user_1',
        type: 'promotion',
        title: 'Special offer just for you!',
        message: 'Get 15% off your next purchase with code SUMMER15.',
        link: '/promotions',
        is_read: true,
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      }
    ];

    await db.collection('app_d8d4_notifications').insertMany(notifications);
    console.log('Seeded notifications');

    // Seed Product Views
    const productViews = [
      {
        _id: 'view_1',
        user_id: 'user_1',
        product_id: 'prod_1',
        viewed_at: new Date(Date.now() - 2 * 60 * 1000)
      },
      {
        _id: 'view_2',
        user_id: 'user_1',
        product_id: 'prod_2',
        viewed_at: new Date(Date.now() - 5 * 60 * 1000)
      },
      {
        _id: 'view_3',
        user_id: 'user_1',
        product_id: 'prod_3',
        viewed_at: new Date(Date.now() - 10 * 60 * 1000)
      }
    ];

    await db.collection('app_d8d4