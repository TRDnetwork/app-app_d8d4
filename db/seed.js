// MongoDB seed data with realistic values and relationships
// Run: mongo app_d8d4 db/seed.js

function log(message) {
  print(`[SEED] ${new Date().toISOString()} - ${message}`);
}

function main() {
  log("Starting database seeding");

  // Clear existing data
  log("Clearing existing data...");
  db.app_d8d4_users.deleteMany({ email: { $regex: "@example.com" } });
  db.app_d8d4_products.deleteMany({ brand: { $in: ["Apple", "Samsung", "Nike"] } });
  db.app_d8d4_categories.deleteMany({ name: { $in: ["Electronics", "Clothing", "Books"] } });
  db.app_d8d4_orders.deleteMany({ "address.city": "San Francisco" });
  db.app_d8d4_reviews.deleteMany({ "comment": { $regex: "Great product" } });
  db.app_d8d4_wishlists.deleteMany({});
  db.app_d8d4_carts.deleteMany({});
  db.app_d8d4_coupons.deleteMany({ code: "WELCOME10" });
  db.app_d8d4_banners.deleteMany({ title: "Summer Sale" });

  // Insert Categories
  log("Seeding categories...");
  const categories = [
    { name: "Electronics", slug: "electronics", created_at: new Date() },
    { name: "Clothing", slug: "clothing", created_at: new Date() },
    { name: "Books", slug: "books", created_at: new Date() },
    { name: "Home & Kitchen", slug: "home-kitchen", created_at: new Date() },
    { name: "Sports & Outdoors", slug: "sports-outdoors", created_at: new Date() }
  ];
  const categoryIds = db.app_d8d4_categories.insertMany(categories).insertedIds;

  // Insert Users
  log("Seeding users...");
  const adminId = db.app_d8d4_users.insertOne({
    email: "admin@example.com",
    password_hash: "$2b$10$4WJZjM1l1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1", // "password"
    name: "Admin User",
    role: "admin",
    created_at: new Date(),
    email_verified: true
  }).insertedId;

  const sellerId = db.app_d8d4_users.insertOne({
    email: "seller@example.com",
    password_hash: "$2b$10$4WJZjM1l1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1",
    name: "Seller User",
    role: "seller",
    created_at: new Date(),
    email_verified: true
  }).insertedId;

  const customerId = db.app_d8d4_users.insertOne({
    email: "customer@example.com",
    password_hash: "$2b$10$4WJZjM1l1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1",
    name: "Customer User",
    phone: "+14155552671",
    loyalty_points: 150,
    role: "customer",
    created_at: new Date(),
    email_verified: true
  }).insertedId;

  // Insert Addresses
  log("Seeding addresses...");
  db.app_d8d4_addresses.insertOne({
    user_id: customerId,
    type: "home",
    line1: "123 Market St",
    city: "San Francisco",
    state: "CA",
    postal_code: "94103",
    country: "USA",
    is_default: true,
    created_at: new Date()
  });

  // Insert Products
  log("Seeding products...");
  const productIds = [];
  const electronicsId = categoryIds[Object.keys(categoryIds)[0]];
  const clothingId = categoryIds[Object.keys(categoryIds)[1]];

  const products = [
    {
      seller_id: sellerId,
      title: "iPhone 14 Pro",
      slug: "iphone-14-pro",
      description: "Latest iPhone with A16 chip and 48MP main camera.",
      category_id: electronicsId,
      brand: "Apple",
      price: 999,
      original_price: 1099,
      discount_percent: 9,
      stock_quantity: 50,
      images: [
        "https://example.com/images/iphone14pro-1.jpg",
        "https://example.com/images/iphone14pro-2.jpg"
      ],
      variants: [
        {
          name: "Color",
          values: ["Space Black", "Silver", "Gold", "Deep Purple"],
          price_modifier: 0
        },
        {
          name: "Storage",
          values: ["128GB", "256GB", "512GB", "1TB"],
          price_modifier: 0
        }
      ],
      tags: ["smartphone", "apple", "ios"],
      is_featured: true,
      status: "active",
      created_at: new Date()
    },
    {
      seller_id: sellerId,
      title: "Samsung Galaxy S23",
      slug: "samsung-galaxy-s23",
      description: "Powerful Android flagship with Snapdragon 8 Gen 2.",
      category_id: electronicsId,
      brand: "Samsung",
      price: 799,
      original_price: 899,
      discount_percent: 11,
      stock_quantity: 30,
      images: [
        "https://example.com/images/galaxys23-1.jpg",
        "https://example.com/images/galaxys23-2.jpg"
      ],
      tags: ["smartphone", "samsung", "android"],
      is_sponsored: true,
      status: "active",
      created_at: new Date()
    },
    {
      seller_id: sellerId,
      title: "Nike Air Max 270",
      slug: "nike-air-max-270",
      description: "Comfortable running shoes with visible Air unit.",
      category_id: clothingId,
      brand: "Nike",
      price: 120,
      original_price: 150,
      discount_percent: 20,
      stock_quantity: 100,
      images: [
        "https://example.com/images/nike-air-max-270-1.jpg",
        "https://example.com/images/nike-air-max-270-2.jpg"
      ],
      variants: [
        {
          name: "Size",
          values: ["US 8", "US 9", "US 10", "US 11"],
          price_modifier: 0
        },
        {
          name: "Color",
          values: ["Black", "White", "Blue"],
          price_modifier: 0
        }
      ],
      tags: ["shoes", "nike", "running"],
      status: "active",
      created_at: new Date()
    }
  ];
  products.forEach(p => {
    productIds.push(db.app_d8d4_products.insertOne(p).insertedId);
  });

  // Insert Reviews
  log("Seeding reviews...");
  db.app_d8d4_reviews.insertMany([
    {
      product_id: productIds[0],
      user_id: customerId,
      rating: 5,
      title: "Amazing phone!",
      comment: "Great product with excellent camera quality.",
      verified_purchase: true,
      created_at: new Date()
    },
    {
      product_id: productIds[1],
      user_id: customerId,
      rating: 4,
      title: "Good Android option",
      comment: "Fast performance and clean UI.",
      verified_purchase: true,
      created_at: new Date()
    }
  ]);

  // Insert Wishlist
  log("Seeding wishlist...");
  db.app_d8d4_wishlists.insertOne({
    user_id: customerId,
    product_id: productIds[0],
    added_at: new Date()
  });

  // Insert Cart
  log("Seeding cart...");
  db.app_d8d4_carts.insertOne({
    user_id: customerId,
    items: [
      {
        product_id: productIds[0],
        variant