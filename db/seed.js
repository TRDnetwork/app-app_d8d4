const mongoose = require('mongoose');
const User = require('../server/src/models/User');
const Category = require('../server/src/models/Category');
const Product = require('../server/src/models/Product');

async function seed() {
  // Use environment variable or fallback to local
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/shopsphere';
  
  // Connect to MongoDB
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });

  console.log('Connected to MongoDB for seeding');

  try {
    // Start a session for transaction-like behavior
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Clear existing data
      await User.deleteMany({});
      await Category.deleteMany({});
      await Product.deleteMany({});
      console.log('Cleared existing data');

      // Create admin user
      const admin = new User({
        email: 'admin@example.com',
        password_hash: '$2b$10$epkT0aQ5Y6Y6Y6Y6Y6Y6Y6uZ6Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6', // bcrypt("admin123")
        name: 'Admin User',
        role: 'admin',
        email_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      });
      await admin.save({ session });
      console.log('Admin created:', admin.email);

      // Create seller user
      const seller = new User({
        email: 'seller@example.com',
        password_hash: '$2b$10$epkT0aQ5Y6Y6Y6Y6Y6Y6Y6uZ6Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6',
        name: 'John Seller',
        role: 'seller',
        email_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      });
      await seller.save({ session });
      console.log('Seller created:', seller.email);

      // Create customer user
      const customer = new User({
        email: 'customer@example.com',
        password_hash: '$2b$10$epkT0aQ5Y6Y6Y6Y6Y6Y6Y6uZ6Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6',
        name: 'Jane Customer',
        role: 'customer',
        email_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      });
      await customer.save({ session });
      console.log('Customer created:', customer.email);

      // Create categories
      const electronics = new Category({ 
        name: 'Electronics', 
        slug: 'electronics',
        created_at: new Date(),
        updated_at: new Date()
      });
      
      const phones = new Category({ 
        name: 'Smartphones', 
        slug: 'smartphones', 
        parent_id: electronics._id,
        created_at: new Date(),
        updated_at: new Date()
      });
      
      const laptops = new Category({ 
        name: 'Laptops', 
        slug: 'laptops', 
        parent_id: electronics._id,
        created_at: new Date(),
        updated_at: new Date()
      });
      
      const accessories = new Category({ 
        name: 'Accessories', 
        slug: 'accessories',
        created_at: new Date(),
        updated_at: new Date()
      });

      await Category.insertMany([electronics, phones, laptops, accessories], { session });
      console.log('Categories created');

      // Create products
      const product1 = new Product({
        seller_id: seller._id,
        title: 'iPhone 15 Pro',
        description: 'Latest Apple smartphone with A17 chip and titanium frame. Features advanced camera system, USB-C port, and longer battery life.',
        brand: 'Apple',
        category_id: phones._id,
        price: 999,
        discount_percent: 10,
        stock: 50,
        images: [
          'https://example.com/iphone15pro-1.jpg',
          'https://example.com/iphone15pro-2.jpg',
          'https://example.com/iphone15pro-3.jpg'
        ],
        variants: [
          { size: '6.1"', color: 'Titanium Blue', sku: 'IP15P-TB-128', price: 999, stock: 20 },
          { size: '6.1"', color: 'Titanium White', sku: 'IP15P-TW-128', price: 999, stock: 30 },
          { size: '6.1"', color: 'Natural Titanium', sku: 'IP15P-NT-128', price: 999, stock: 15 }
        ],
        tags: ['smartphone', 'ios', 'camera', 'apple'],
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      });

      const product2 = new Product({
        seller_id: seller._id,
        title: 'MacBook Air M2',
        description: 'Ultrafast Apple laptop with M2 chip and 18-hour battery life. Lightweight design with Retina display.',
        brand: 'Apple',
        category_id: laptops._id,
        price: 1199,
        stock: 30,
        images: [
          'https://example.com/macbookair-1.jpg',
          'https://example.com/macbookair-2.jpg'
        ],
        tags: ['laptop', 'mac', 'apple', 'm2'],
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      });

      const product3 = new Product({
        seller_id: seller._id,
        title: 'Samsung Galaxy S24',
        description: 'Latest Samsung flagship with AI-powered camera and 5G connectivity. Brilliant display and all-day battery.',
        brand: 'Samsung',
        category_id: phones._id,
        price: 899,
        discount_percent: 5,
        stock: 40,
        images: [
          'https://example.com/galaxys24-1.jpg',
          'https://example.com/galaxys24-2.jpg'
        ],
        variants: [
          { size: '6