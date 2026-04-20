// Idempotent MongoDB index creation
// Migration: Add indexes for performance and uniqueness
// Down: Drop all indexes

// UP
// Users
db.app_d8d4_users.createIndex({ "email": 1 }, { unique: true, name: "idx_users_email_unique" });
db.app_d8d4_users.createIndex({ "role": 1 }, { name: "idx_users_role" });
db.app_d8d4_users.createIndex({ "oauth_provider": 1, "oauth_id": 1 }, { unique: true, name: "idx_users_oauth_unique" });
db.app_d8d4_users.createIndex({ "email_verification_token": 1 }, { unique: true, sparse: true, name: "idx_users_email_token" });
db.app_d8d4_users.createIndex({ "password_reset_token": 1 }, { unique: true, sparse: true, name: "idx_users_reset_token" });

// Addresses
db.app_d8d4_addresses.createIndex({ "user_id": 1 }, { name: "idx_addresses_user" });
db.app_d8d4_addresses.createIndex({ "user_id": 1, "is_default": 1 }, { name: "idx_addresses_user_default" });

// Categories
db.app_d8d4_categories.createIndex({ "slug": 1 }, { unique: true, name: "idx_categories_slug_unique" });
db.app_d8d4_categories.createIndex({ "parent_id": 1 }, { name: "idx_categories_parent" });

// Products
db.app_d8d4_products.createIndex({ "slug": 1 }, { unique: true, name: "idx_products_slug_unique" });
db.app_d8d4_products.createIndex({ "category_id": 1 }, { name: "idx_products_category" });
db.app_d8d4_products.createIndex({ "brand": 1 }, { name: "idx_products_brand" });
db.app_d8d4_products.createIndex({ "status": 1 }, { name: "idx_products_status" });
db.app_d8d4_products.createIndex({ "is_featured": 1 }, { name: "idx_products_featured" });
db.app_d8d4_products.createIndex({ "is_sponsored": 1 }, { name: "idx_products_sponsored" });
db.app_d8d4_products.createIndex({ "created_at": -1 }, { name: "idx_products_created_at" });
db.app_d8d4_products.createIndex({ "views": -1 }, { name: "idx_products_views" });
db.app_d8d4_products.createIndex({ "tags": 1 }, { name: "idx_products_tags" });

// Reviews
db.app_d8d4_reviews.createIndex({ "product_id": 1, "created_at": -1 }, { name: "idx_reviews_product_date" });
db.app_d8d4_reviews.createIndex({ "user_id": 1, "product_id": 1 }, { unique: true, sparse: true, name: "idx_reviews_user_product_unique" });
db.app_d8d4_reviews.createIndex({ "rating": -1 }, { name: "idx_reviews_rating" });

// Questions
db.app_d8d4_questions.createIndex({ "product_id": 1, "created_at": -1 }, { name: "idx_questions_product_date" });
db.app_d8d4_questions.createIndex({ "answered_at": 1 }, { sparse: true, name: "idx_questions_answered" });

// Carts
db.app_d8d4_carts.createIndex({ "user_id": 1 }, { unique: true, name: "idx_carts_user_unique" });

// Wishlists
db.app_d8d4_wishlists.createIndex({ "user_id": 1, "product_id": 1 }, { unique: true, name: "idx_wishlist_user_product_unique" });

// Orders
db.app_d8d4_orders.createIndex({ "user_id": 1, "created_at": -1 }, { name: "idx_orders_user_date" });
db.app_d8d4_orders.createIndex({ "order_number": 1 }, { unique: true, name: "idx_orders_number_unique" });
db.app_d8d4_orders.createIndex({ "stripe_session_id": 1 }, { unique: true, sparse: true, name: "idx_orders_stripe_session" });
db.app_d8d4_orders.createIndex({ "status": 1 }, { name: "idx_orders_status" });
db.app_d8d4_orders.createIndex({ "created_at": -1 }, { name: "idx_orders_created_at" });

// Coupons
db.app_d8d4_coupons.createIndex({ "code": 1 }, { unique: true, name: "idx_coupons_code_unique" });
db.app_d8d4_coupons.createIndex({ "is_active": 1, "valid_from": 1, "valid_until": 1 }, { name: "idx_coupons_active_time" });

// Banners
db.app_d8d4_banners.createIndex({ "order": 1 }, { name: "idx_banners_order" });
db.app_d8d4_banners.createIndex({ "is_active": 1, "start_date": 1, "end_date": 1 }, { name: "idx_banners_active_time" });

// Seller Applications
db.app_d8d4_seller_applications.createIndex({ "user_id": 1 }, { unique: true, name: "idx_seller_app_user_unique" });
db.app_d8d4_seller_applications.createIndex({ "status": 1 }, { name: "idx_seller_app_status" });

// Notifications
db.app_d8d4_notifications.createIndex({ "user_id": 1, "created_at": -1 }, { name: "idx_notifications_user_date" });
db.app_d8d4_notifications.createIndex({ "is_read": 1 }, { name: "idx_notifications_read" });

// Product Views
db.app_d8d4_product_views.createIndex({ "user_id": 1, "viewed_at": -1 }, { name: "idx_product_views_user_recent" });
db.app_d8d4_product_views.createIndex({ "product_id": 1, "viewed_at": -1 }, { name: "idx_product_views_product_recent" });

// DOWN
// Drop all indexes
db.app_d8d4_users.dropIndex("idx_users_email_unique");
db.app_d8d4_users.dropIndex("idx_users_role");
db.app_d8d4_users.dropIndex("idx_users_oauth_unique");
db.app_d8d4_users.dropIndex("idx_users_email_token");
db.app_d8d4_users.dropIndex("idx_users_reset_token");

db.app_d8d4_addresses.dropIndex("idx_addresses_user");
db.app_d8d4_addresses.dropIndex("idx_addresses_user_default");

db.app_d8d4_categories.dropIndex("idx_categories_slug_unique");
db.app_d8d4_categories.dropIndex("idx_categories_parent");

db.app_d8d4_products.dropIndex("idx_products_slug_unique");
db.app_d8d4_products.dropIndex("idx_products_category");
db.app_d8d4_products.dropIndex("idx_products_brand");
db.app_d8d4_products.dropIndex("idx_products_status");
db.app_d8d4_products.dropIndex("idx_products_featured");
db.app_d8d4_products.dropIndex("idx_products_sponsored");
db.app_d8d4_products.dropIndex("idx_products_created_at");
db.app_d8d4_products.dropIndex("idx_products_views");
db.app_d8d4_products.dropIndex("idx_products_tags");

db.app_d8d4_reviews.dropIndex("idx_reviews_product_date");
db.app_d8d4_reviews.dropIndex("idx_reviews_user_product_unique");
db.app_d8d4_reviews.dropIndex("idx_reviews_rating");

db.app_d8d4_questions.dropIndex("idx_questions_product_date");
db.app_d8d4_questions.dropIndex("idx_questions_answered");

db.app_d8d4_carts.dropIndex("idx_carts_user_unique");

db.app_d8d4_wishlists.dropIndex("idx_wishlist_user_product_unique");

db.app_d8d4_orders.dropIndex("idx_orders_user_date");
db.app_d8d4_orders.dropIndex("idx_orders_number_unique");
db.app_d8d4_orders.dropIndex("idx_orders_stripe_session");
db.app_d8d4_orders.dropIndex("idx_orders_status");
db.app_d8d4_orders.dropIndex("idx_orders_created_at");

db.app_d8d4_coupons.dropIndex("idx_coupons_code_unique");
db.app_d8d4_coupons.dropIndex("idx_coupons_active_time");

db.app_d8d4_banners.dropIndex("idx_banners_order");
db.app_d8d4_banners.dropIndex("idx_banners_active_time");

db.app_d8d4_seller_applications.dropIndex("idx_seller_app_user_unique");
db.app_d8d4_seller_applications.dropIndex("idx_seller_app_status");

db.app_d8d4_notifications.dropIndex("idx_notifications_user_date");
db.app_d8d4_notifications.dropIndex("idx_notifications_read");

db.app_d8d4_product_views.dropIndex("idx_product_views_user_recent");
db.app_d8d4_product_views.dropIndex("idx_product_views_product_recent");