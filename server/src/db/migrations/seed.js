/**
 * Seed script for ShopSphere
 * Creates admin user, categories, and sample products
 */

const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shopsphere';
const SALT_ROUNDS = 10;

async function seedData() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db();

    console.log('🌱 Starting database seeding...');

    // Admin user
    const adminEmail = 'admin@shopsphere.com';
    const existingAdmin = await db.collection('app_d8d4_users').findOne({ email: adminEmail });
    
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', SALT_ROUNDS);
      await db.collection('app_d8d4_users').insertOne({
        email: adminEmail,
        password_hash: hashedPassword,
        name: 'Admin User',
        role: 'admin',
        email_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      });
      console.log('✅ Admin user created');
    } else {
      console.log('⏭️  Admin user already exists');
    }

    // Categories
    const categories = [
      { name: 'Electronics', slug: 'electronics', image_url: 'https://via.placeholder.com/300x200?text=Electronics' },
      { name: 'Clothing', slug: 'clothing', image_url: 'https://via.placeholder.com/300x200?text=Clothing' },
      { name: 'Home & Kitchen', slug: 'home-kitchen', image_url: 'https://via.placeholder.com/300x200?text=Home+Kitchen' },
      { name: 'Books', slug: 'books', image_url: 'https://via.placeholder.com/300x200?text=Books' },
      { name: 'Sports', slug: 'sports', image_url: 'https://via.placeholder.com/300x200?text=Sports' }
    ];

    for (const cat of categories) {
      const existing = await db.collection('app_d8d4_categories').findOne({ slug: cat.slug });
      if (!existing) {
        await db.collection('app_d8d4_categories').insertOne({
          ...cat,
          created_at: new Date()
        });
      }
    }
    console.log('✅ Categories seeded');

    // Get electronics category ID
    const electronics = await db.collection('app_d8d4_categories').findOne({ slug: 'electronics' });

    // Sample products
    const products = [
      {
        title: 'Wireless Noise-Canceling Headphones',
        description: 'Premium over-ear headphones with active noise cancellation and 30-hour battery life.',
        brand: 'SoundMax',
        category_id: electronics._id,
        price: 299.99,
        discount_percent: 15,
        stock: 50,
        images: [
          'https://via.placeholder.com/800x800?text=Headphones+Front',
          'https://via.placeholder.com/800x800?text=Headphones+Side',
          'https://via.placeholder.com/800x800?text=Headphones+Box'
        ],
        variants: [
          { sku: 'HP001-BLK', color: 'Black', stock: 30 },
          { sku: 'HP001-SLV', color: 'Silver', stock: 20 }
        ],
        tags: ['audio', 'wireless', 'premium'],
        status: 'active',
        created_at: new Date()
      },
      {
        title: 'Smartphone Pro Max',
        description: 'Latest flagship smartphone with triple camera system and OLED display.',
        brand: 'TechPhone',
        category_id: electronics._id,
        price: 999.99,
        discount_percent: 10,
        stock: 25,
        images: [
          'https://via.placeholder.com/800x800?text=Phone+Front',
          'https://via.placeholder.com/800x800?text=Phone+Back',
          'https://via.placeholder.com/800x800?text=Phone+Camera'
        ],
        variants: [
          { sku: 'SP001-128GB-BLK', size: '128GB', color: 'Black', stock: 10 },
          { sku: 'SP001-256GB-BLK', size: '256GB', color: 'Black', stock: 8 },
          { sku: 'SP001-128GB-WHT', size: '128GB', color: 'White', stock: 7 }
        ],
        tags: ['mobile', 'camera', '5g'],
        status: 'active',
        created_at: new Date()
      }
    ];

    for (const product of products) {
      const existing = await db.collection('app_d8d4_products').findOne({ title: product.title });
      if (!existing) {
        await db.collection('app_d8d4_products').insertOne(product);
      }
    }
    console.log('✅ Sample products seeded');

    console.log('🎉 Seeding completed successfully');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    throw err;
  } finally {
    await client.close();
  }
}

// Run if called directly
if (require.main === module) {
  seedData().catch(console.error);
}

module.exports = { seedData };