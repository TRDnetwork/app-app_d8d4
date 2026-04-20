-- Insert sample categories
INSERT INTO app_d8d4_categories (name, slug, order_num) VALUES
  ('Electronics', 'electronics', 1),
  ('Clothing', 'clothing', 2),
  ('Home & Kitchen', 'home-kitchen', 3),
  ('Books', 'books', 4),
  ('Sports & Outdoors', 'sports-outdoors', 5);

-- Insert sample users
INSERT INTO app_d8d4_users (id, email, password_hash, name, role, email_verified, created_at) VALUES
  ('11111111-1111-4111-8111-111111111111', 'customer@example.com', '$2b$10$fakehashedpassword', 'John Doe', 'customer', true, NOW()),
  ('22222222-2222-4222-8222-222222222222', 'seller@example.com', '$2b$10$fakehashedpassword', 'Jane Seller', 'seller', true, NOW()),
  ('33333333-3333-4333-8333-333333333333', 'admin@example.com', '$2b$10$fakehashedpassword', 'Admin User', 'admin', true, NOW());

-- Insert sample products
INSERT INTO app_d8d4_products (id, seller_id, title, slug, description, category_id, brand, price, original_price, discount_percent, stock_quantity, images, tags, is_featured, status, created_at) VALUES
  ('10000000-1000-4000-8000-100000000001', '22222222-2222-4222-8222-222222222222', 'Wireless Earbuds', 'wireless-earbuds', 'High-quality wireless earbuds with noise cancellation', (SELECT id FROM app_d8d4_categories WHERE slug = 'electronics'), 'SoundMax', 99.99, 149.99, 33.3, 50, '{"https://picsum.photos/seed/earbuds/400/400"}', '{"audio","wireless","electronics"}', true, 'active', NOW()),
  ('10000000-1000-4000-8000-100000000002', '22222222-2222-4222-8222-222222222222', 'Cotton T-Shirt', 'cotton-tshirt', 'Comfortable 100% cotton t-shirt available in multiple colors', (SELECT id FROM app_d8d4_categories WHERE slug = 'clothing'), 'ComfortWear', 24.99, 29.99, 16.7, 100, '{"https://picsum.photos/seed/tshirt/400/400"}', '{"clothing","tshirt","cotton"}', true, 'active', NOW()),
  ('10000000-1000-4000-8000-100000000003', '22222222-2222-4222-8222-222222222222', 'Coffee Maker', 'coffee-maker', 'Programmable coffee maker with thermal carafe', (SELECT id FROM app_d8d4_categories WHERE slug = 'home-kitchen'), 'BrewMaster', 79.99, 99.99, 20.0, 25, '{"https://picsum.photos/seed/coffeemaker/400/400"}', '{"kitchen","appliance","coffee"}', false, 'active', NOW());

-- Insert sample reviews
INSERT INTO app_d8d4_reviews (product_id, user_id, rating, title, comment, verified_purchase, created_at) VALUES
  ((SELECT id FROM app_d8d4_products WHERE slug = 'wireless-earbuds'), '11111111-1111-4111-8111-111111111111', 5, 'Great sound quality', 'These earbuds sound amazing and the noise cancellation works perfectly.', true, NOW() - INTERVAL '5 days'),
  ((SELECT id FROM app_d8d4_products WHERE slug = 'cotton-tshirt'), '11111111-1111-4111-8111-111111111111', 4, 'Comfortable fit', 'Very comfortable t-shirt, runs true to size. Would buy again.', true, NOW() - INTERVAL '3 days');

-- Insert sample addresses
INSERT INTO app_d8d4_addresses (user_id, type, line1, city, state, postal_code, country, is_default) VALUES
  ('11111111-1111-4111-8111-111111111111', 'home', '123 Main St', 'Anytown', 'CA', '12345', 'USA', true);

-- Insert sample cart
INSERT INTO app_d8d4_carts (user_id, items, updated_at) VALUES
  ('11111111-1111-4111-8111-111111111111', '[{"product_id": "10000000-1000-4000-8000-100000000001", "quantity": 1, "price_snapshot": 99.99}]', NOW());

-- Insert sample wishlist
INSERT INTO app_d8d4_wishlists (user_id, product_id, added_at) VALUES
  ('11111111-1111-4111-8111-111111111111', '10000000-1000-4000-8000-100000000002', NOW());

-- Insert sample coupon
INSERT INTO app_d8d4_coupons (code, type, value, min_order_value, valid_until, is_active) VALUES
  ('WELCOME10', 'percentage', 10, 25.00, NOW() + INTERVAL '30 days', true);

-- Insert sample banner
INSERT INTO app_d8d4_banners (title, image_url, link_url, order_num, is_active, start_date, end_date) VALUES
  ('Summer Sale', 'https://picsum.photos/seed/banner/800/200', '/sales/summer', 1, true, NOW(), NOW() + INTERVAL '7 days');