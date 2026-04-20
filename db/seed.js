const mongoose = require('mongoose');
const User = require('./server/src/models/User');
const Category = require('./server/src/models/Category');
const Product = require('./server/src/models/Product');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shopsphere');

  // Clear existing data
  await User.deleteMany({});
  await Category.deleteMany({});
  await Product.deleteMany({});

  // Create admin
  const admin = new User({
    email: 'admin@example.com',
    password_hash: '$2b$10$epkT0aQ5Y6Y6Y6Y6Y6Y6Y6uZ6Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6', // bcrypt("admin123")
    name: 'Admin User',
    role: 'admin'
  });
  await admin.save();
  console.log('Admin created:', admin.email);

  // Create seller
  const seller = new User({
    email: 'seller@example.com',
    password_hash: '$2b$10$epkT0aQ5Y6Y6Y6Y6Y6Y6Y6uZ6Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6',
    name: 'John Seller',
    role: 'seller'
  });
  await seller.save();
  console.log('Seller created:', seller.email);

  // Create customer
  const customer = new User({
    email: 'customer@example.com',
    password_hash: '$2b$10$epkT0aQ5Y6Y6Y6Y6Y6Y6Y6uZ6Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6',
    name: 'Jane Customer',
    role: 'customer'
  });
  await customer.save();
  console.log('Customer created:', customer.email);

  // Create categories
  const electronics = new Category({ name: 'Electronics', slug: 'electronics' });
  const phones = new Category({ name: 'Smartphones', slug: 'smartphones', parent_id: electronics._id });
  const laptops = new Category({ name: 'Laptops', slug: 'laptops', parent_id: electronics._id });
  await Category.insertMany([electronics, phones, laptops]);
  console.log('Categories created');

  // Create products
  const product1 = new Product({
    seller_id: seller._id,
    title: 'iPhone 15 Pro',
    description: 'Latest Apple smartphone with A17 chip and titanium frame.',
    brand: 'Apple',
    category_id: phones._id,
    price: 999,
    discount_percent: 10,
    stock: 50,
    images: [
      'https://example.com/iphone15pro-1.jpg',
      'https://example.com/iphone15pro-2.jpg'
    ],
    variants: [
      { size: '6.1"', color: 'Titanium Blue', sku: 'IP15P-TB-128', price: 999, stock: 20 },
      { size: '6.1"', color: 'Titanium White', sku: 'IP15P-TW-128', price: 999, stock: 30 }
    ],
    tags: ['smartphone', 'ios', 'camera']
  });

  const product2 = new Product({
    seller_id: seller._id,
    title: 'MacBook Air M2',
    description: 'Ultrafast Apple laptop with M2 chip and 18-hour battery life.',
    brand: 'Apple',
    category_id: laptops._id,
    price: 1199,
    stock: 30,
    images: [
      'https://example.com/macbookair-1.jpg'
    ]
  });

  await Product.insertMany([product1, product2]);
  console.log('Products created');

  await mongoose.connection.close();
}

seed().catch(err => {
  console.error('Seeding failed:', err);
});