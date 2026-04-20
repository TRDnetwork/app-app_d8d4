// Seed data for ShopSphere (app_d8d4)
// Realistic sample data with proper references

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const {
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
} = require('./schema');

const SALT_ROUNDS = 10;

// Helper: Generate random date between two dates
const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Helper: Generate order number
const generateOrderNumber = () => `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

// Seed function
const seed = async () => {
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

    console.log('🗑️  Cleared existing data');

    // Create categories
    const categories = [
      { name: 'Electronics', slug: 'electronics' },
      { name: 'Clothing', slug: 'clothing' },
      { name: 'Home & Kitchen', slug: 'home-kitchen' },
      { name: 'Books', slug: 'books' },
      { name: 'Sports', slug: 'sports' }
    ];
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Created ${createdCategories.length} categories`);

    // Create users
    const passwordHash = await bcrypt.hash('password123', SALT_ROUNDS);
    const users = [
      {
        email: 'customer@example.com',
        password_hash: passwordHash,
        name: 'John Doe',
        phone: '+1234567890',
        role: 'customer',
        email_verified: true,
        created_at: randomDate(new Date(2023, 0, 1), new Date())
      },
      {
        email: 'seller@example.com',
        password_hash: passwordHash,
        name: 'Jane Smith',
        phone: '+1987654321',
        role: 'seller',
        email_verified: true,
        created_at: randomDate(new Date(2023, 0, 1), new Date())
      },
      {
        email: 'admin@example.com',
        password_hash: passwordHash,
        name: 'Admin User',
        phone: '+1112223333',
        role: 'admin',
        email_verified: true,
        created_at: new Date()
      }
    ];
    const createdUsers = await User.insertMany(users);
    const [customer, seller, admin] = createdUsers;
    console.log(`✅ Created ${createdUsers.length} users`);

    // Create addresses
    const addresses = [
      {
        user_id: customer._id,
        label: 'Home',
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'USA',
        is_default: true,
        created_at: new Date()
      },
      {
        user_id: customer._id,
        label: 'Work',
        street: '456 Office Ave',
        city: 'New York',
        state: 'NY',
        zip: '10002',
        country: 'USA',
        is_default: false,
        created_at: new Date()
      }
    ];
    await Address.insertMany(addresses);
    console.log(`✅ Created ${addresses.length} addresses`);

    // Create products
    const products = [
      {
        seller_id: seller._id,
        title: 'Wireless Noise-Cancelling Headphones',
        description: 'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and crystal-clear audio.',
        category: 'Electronics',
        brand: 'SoundMax',
        price: 199.99,
        original_price: 299.99,
        images: [
          'https://example.s3.amazonaws.com/headphones-1.jpg',
          'https://example.s3.amazonaws.com/headphones-2.jpg',
          'https://example.s3.amazonaws.com/headphones-3.jpg'
        ],
        variants: [
          { size: '', color: 'Black', sku: `SKU-${uuidv4().slice(0,8)}`, stock: 50 },
          { size: '', color: 'Silver', sku: `SKU-${uuidv4().slice(0,8)}`, stock: 30 }
        ],
        status: 'active',
        tags: ['audio', 'wireless', 'premium'],
        created_at: randomDate(new Date(2023, 0, 1), new Date())
      },
      {
        seller_id: seller._id,
        title: 'Organic Cotton T-Shirt',
        description: 'Soft, breathable 100% organic cotton t-shirt, available in multiple colors and sizes.',
        category: 'Clothing',
        brand: 'EcoWear',
        price: 24.99,
        original_price: 34.99,
        images: [
          'https://example.s3.amazonaws.com/tshirt-1.jpg',
          'https://example.s3.amazonaws.com/tshirt-2.jpg'
        ],
        variants: [
          { size: 'S', color: 'White', sku: `SKU-${uuidv4().slice(0,8)}`, stock: 100 },
          { size: 'M', color: 'White', sku: `SKU-${uuidv4().slice(0,8)}`, stock: 150 },
          { size: 'L', color: 'White', sku: `SKU-${uuidv4().slice(0,8)}`, stock: 80 },
          { size: 'M', color: 'Navy', sku: `SKU-${uuidv4().slice(0,8)}`, stock: 60 }
        ],
        status: 'active',
        tags: ['cotton', 'eco-friendly', 'basic'],
        created_at: randomDate(new Date(2023, 0, 1), new Date())
      },
      {
        seller_id: seller._id,
        title: 'Stainless Steel Water Bottle',
        description: 'Double-walled vacuum insulated water bottle keeps drinks cold for 24 hours or hot for 12 hours.',
        category: 'Home & Kitchen',
        brand: 'AquaVita',
        price: 29.99,
        original_price: 39.99,
        images: [
          'https://example.s3.amazonaws.com/bottle-1.jpg'
        ],
        variants: [
          { size: '20oz', color: 'Matte Black', sku: `SKU-${uuidv4().slice(0,8)}`, stock: 200 },
          { size: '32oz', color: 'Matte Black', sku: `SKU-${uuidv4().slice(0,8)}`, stock: 120 },
          { size: '32oz', color: 'Rose Gold', sku: `SKU-${uuidv4().slice(0,8)}`, stock: 75 }
        ],
        status: 'active',
        tags: ['water', 'insulated', 'eco'],
        created_at: randomDate(new Date(2023, 0, 1), new Date())
      }
    ];
    const createdProducts = await Product.insertMany(products);
    console.log(`✅ Created ${createdProducts.length} products`);

    // Create cart
    await Cart.create({
      user_id: customer._id,
      items: [
        {
          product_id: createdProducts[0]._id,
          variant_id: createdProducts[0].variants[0].sku,
          quantity: 1,
          price_snapshot: createdProducts[0].price
        },
        {
          product_id: createdProducts[1]._id,
          variant_id: createdProducts[1].variants[1].sku,
          quantity: 2,
          price_snapshot: createdProducts[1].price
        }
      ],
      created_at: new Date(),
      updated_at: new Date()
    });
    console.log('✅ Created cart');

    // Create wishlist
    await Wishlist.create({
      user_id: customer._id,
      product_ids: [createdProducts[0]._id, createdProducts[2]._id],
      created_at: new Date()
    });
    console.log('✅ Created wishlist');

    // Create coupon
    await Coupon.create({
      code: 'WELCOME10',
      discount_type: 'percent',
      discount_value: 10,
      min_order_value: 50,
      max_uses: 100,
      used_count: 5,
      valid_from: new Date(Date.now() - 86400000), // yesterday
      valid_until: new Date(Date.now() + 2592000000), // 30 days
      active: true,
      created_at: new Date()
    });
    console.log('✅ Created coupon');

    // Create banners
    await Banner.create({
      title: 'Summer Sale - Up to 50% Off',
      image_url: 'https://example.s3.amazonaws.com/banner-summer.jpg',
      link_url: '/deals/summer',
      position: 'hero',
      order: 1,
      active: true,
      start_date: new Date(Date.now() - 86400000),
      end_date: new Date(Date.now() + 2592000000)
    });
    console.log('✅ Created banner');

    // Create reviews
    const reviews = [
      {
        product_id: createdProducts[0]._id,
        user_id: customer._id,
        order_id: new mongoose.Types.ObjectId(), // mock
        rating: 5,
        title: 'Amazing sound quality!',
        comment: 'These headphones are incredible. The noise cancellation is top-notch and the battery lasts forever.',
        images: ['https://example.s3.amazonaws.com/review-headphones.jpg'],
        helpful_votes: 12,
        verified_purchase: true,
        created_at: randomDate(new Date(2023, 0, 1), new Date())
      },
      {
        product_id: createdProducts[1]._id,
        user_id: customer._id,
        order_id: new mongoose.Types.ObjectId(),
        rating: 4,
        title: 'Comfortable and soft',
        comment: 'Great t-shirt, fits well and feels very comfortable. Color is accurate.',
        helpful_votes: 5,
        verified_purchase: true,
        created_at: randomDate(new Date(2023, 0, 1), new Date())
      }
    ];
    await Review.insertMany(reviews);
    console.log(`✅ Created ${reviews.length} reviews`);

    // Update product avg ratings
    for (const product of createdProducts) {
      const reviews = await Review.find({ product_id: product._id });
      if (reviews.length > 0) {
        const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        await Product.findByIdAndUpdate(product._id, {
          avg_rating: Number(avg.toFixed(1)),
          review_count: reviews.length
        });
      }
    }
    console.log('✅ Updated product ratings');

    // Create questions
    await Question.create({
      product_id: createdProducts[0]._id,
      user_id: customer._id,
      question: 'Does this work with Android phones?',
      answer: 'Yes, these headphones work with all Bluetooth-enabled devices including Android, iOS, and Windows.',
      answered_by: seller._id,
      created_at: new Date(Date.now() - 3600000),
      answered_at: new Date()
    });
    console.log('✅ Created question');

    // Create order
    const order = await Order.create({
      user_id: customer._id,
      order_number: generateOrderNumber(),
      items: [
        {
          product_id: createdProducts[0]._id,
          variant: 'Black',
          quantity: 1,
          price: createdProducts[0].price,
          seller_id: seller._id
        },
        {
          product_id: createdProducts[1]._id,
          variant: 'M / White',
          quantity: 1,
          price: createdProducts[1].price,
          seller_id: seller._id
        }
      ],
      total_amount: createdProducts[0].price + createdProducts[1].price,
      delivery_fee: 5.99,
      tax_amount: 15.20,
      payment_method: 'card',
      payment_status: 'completed',
      order_status: 'delivered',
      address: {
        label: 'Home',
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'USA'
      },
      tracking_number: 'TRK123456789',
      delivery_speed: 'standard',
      coupon_code: 'WELCOME10',
      created_at: new Date(Date.now() - 86400000),
      delivered_at: new Date()
    });
    console.log('✅ Created order');

    console.log('🎉 Seeding completed successfully');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run seed if called directly
if (require.main === module) {
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shopsphere', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log('📦 Connected to MongoDB');
    return seed();
  }).then(() => {
    mongoose.connection.close();
  });
}

module.exports = seed;