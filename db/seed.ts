```ts
import { MongoClient, ObjectId } from 'mongodb';
import * as dotenv from 'dotenv';
import { hashPassword } from '../server/src/utils/password';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || 'shopsphere';

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is required');
  process.exit(1);
}

const runSeed = async () => {
  const client = new MongoClient(MONGODB_URI!);
  try {
    await client.connect();
    const db = client.db(DB_NAME);

    const adminPassword = await hashPassword('admin@123');
    const userPassword = await hashPassword('user@123');

    // Clear existing data
    await db.collection('app_d8d4_users').deleteMany({});
    await db.collection('app_d8d4_products').deleteMany({});
    await db.collection('app_d8d4_orders').deleteMany({});
    await db.collection('app_d8d4_reviews').deleteMany({});

    // Seed Users
    const [admin, user1, user2, seller] = await db.collection('app_d8d4_users').insertMany([
      {
        email: 'admin@shopsphere.com',
        password_hash: adminPassword,
        name: 'Admin User',
        role: 'admin',
        email_verified: true,
        created_at: new Date(),
      },
      {
        email: 'user1@shopsphere.com',
        password_hash: userPassword,
        name: 'John Doe',
        phone: '+1234567890',
        profile_picture_url: 'https://example.com/avatar1.jpg',
        role: 'customer',
        email_verified: true,
        created_at: new Date(),
      },
      {
        email: 'user2@shopsphere.com',
        password_hash: userPassword,
        name: 'Jane Smith',
        role: 'customer',
        email_verified: true,
        created_at: new Date(),
      },
      {
        email: 'seller@shopsphere.com',
        password_hash: userPassword,
        name: 'Tech Gadgets Store',
        role: 'seller',
        email_verified: true,
        created_at: new Date(),
      },
    ]);

    // Seed Products
    const products = [
      {
        seller_id: seller.insertedIds[3],
        title: 'Wireless Noise-Canceling Headphones',
        description: 'Premium over-ear headphones with 30-hour battery life.',
        category: 'Electronics',
        brand: 'SoundMax',
        price: 199.99,
        original_price: 299.99,
        discount_percent: 33,
        images: [
          'https://example.com/headphones1.jpg',
          'https://example.com/headphones2.jpg',
        ],
        variants: [
          { color: 'Black', sku: 'HP-BLK-001', stock: 50 },
          { color: 'Silver', sku: 'HP-SLV-001', stock: 30 },
        ],
        stock_total: 80,
        status: 'active',
        avg_rating: 4.7,
        review_count: 124,
        tags: ['audio', 'wireless', 'premium'],
        created_at: new Date(),
      },
      {
        seller_id: seller.insertedIds[3],
        title: 'Smart Fitness Watch',
        description: 'Track heart rate, sleep, and workouts with GPS.',
        category: 'Wearables',
        brand: 'FitTrack',
        price: 149.99,
        original_price: 199.99,
        discount_percent: 25,
        images: [
          'https://example.com/watch1.jpg',
          'https://example.com/watch2.jpg',
        ],
        variants: [
          { color: 'Black', size: 'M', sku: 'FW-BLK-M', stock: 40 },
          { color: 'Rose Gold', size: 'S', sku: 'FW-RG-S', stock: 25 },
        ],
        stock_total: 65,
        status: 'active',
        avg_rating: 4.5,
        review_count: 89,
        tags: ['fitness', 'smartwatch', 'health'],
        created_at: new Date(),
      },
    ];

    const productResult = await db.collection('app_d8d4_products').insertMany(products);

    // Seed Reviews
    await db.collection('app_d8d4_reviews').insertMany([
      {
        product_id: productResult.insertedIds[0],
        user_id: user1.insertedIds[1],
        rating: 5,
        title: 'Amazing sound quality!',
        comment: 'These headphones are incredible. Noise cancellation works perfectly.',
        verified_purchase: true,
        created_at: new Date(),
      },
      {
        product_id: productResult.insertedIds[0],
        user_id: user2.insertedIds[2],
        rating: 4,
        title: 'Great value',
        comment: 'Comfortable and long battery life. Slightly bulky for small ears.',
        verified_purchase: true,
        created_at: new Date(),
      },
    ]);

    console.log('🌱 Database seeded successfully with sample data');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
};

if (require.main === module) {
  runSeed();
}

export default runSeed;
```