# Database Setup for ShopSphere

This directory contains MongoDB schema definitions and seed data for the ShopSphere e-commerce platform.

## 📁 Contents

- `schema.js`: Mongoose schema definitions for all collections (prefixed `app_d8d4_`)
- `seed.js`: Seed script with realistic sample data
- `README.md`: This file

## 🛠️ Setup

1. Ensure MongoDB is running
2. Run seed script:

```bash
npm run seed
```

## 🧩 Collections

All collections are prefixed with `app_d8d4_`:

- `app_d8d4_users` - User accounts
- `app_d8d4_addresses` - User shipping addresses
- `app_d8d4_products` - Product catalog
- `app_d8d4_cart` - Shopping cart
- `app_d8d4_wishlist` - Saved products
- `app_d8d4_orders` - Order history
- `app_d8d4_reviews` - Product reviews
- `app_d8d4_questions` - Product Q&A
- `app_d8d4_coupons` - Promo codes
- `app_d8d4_categories` - Product categories
- `app_d8d4_banners` - Marketing banners
- `app_d8d4_seller_applications` - Seller onboarding

## 🌱 Seed Data

Includes:
- 1 admin, 1 seller, 1 customer
- 5 sample products across categories
- Sample cart, wishlist, orders, reviews, questions
- 2 coupons and 2 banners
- 5 categories

All passwords are set to predictable values for development (`admin123`, `seller123`, `customer123`).