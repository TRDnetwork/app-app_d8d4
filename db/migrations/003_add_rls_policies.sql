-- UP
-- Enable Row Level Security
ALTER TABLE app_d8d4_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_d8d4_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_d8d4_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_d8d4_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_d8d4_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_d8d4_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_d8d4_carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_d8d4_wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_d8d4_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_d8d4_coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_d8d4_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_d8d4_seller_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_d8d4_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_d8d4_product_views ENABLE ROW LEVEL SECURITY;

-- Users: authenticated users can read own data, admin can read all
CREATE POLICY "Users can view own data" ON app_d8d4_users
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admin can view all users" ON app_d8d4_users
  FOR SELECT USING (EXISTS (SELECT 1 FROM app_d8d4_users u WHERE u.id = auth.uid() AND u.role = 'admin'));
CREATE POLICY "Users can update own data" ON app_d8d4_users
  FOR UPDATE USING (auth.uid() = id);

-- Addresses: users can manage their own
CREATE POLICY "Addresses are user-owned" ON app_d8d4_addresses
  FOR ALL USING (auth.uid() = user_id);

-- Categories: public read
CREATE POLICY "Categories are publicly readable" ON app_d8d4_categories
  FOR SELECT USING (TRUE);

-- Products: public read
CREATE POLICY "Products are publicly readable" ON app_d8d4_products
  FOR SELECT USING (TRUE);

-- Reviews: public read, users can manage own
CREATE POLICY "Reviews are publicly readable" ON app_d8d4_reviews
  FOR SELECT USING (TRUE);
CREATE POLICY "Users can manage own reviews" ON app_d8d4_reviews
  FOR ALL USING (auth.uid() = user_id);

-- Questions: public read, users can manage own, sellers can answer
CREATE POLICY "Questions are publicly readable" ON app_d8d4_questions
  FOR SELECT USING (TRUE);
CREATE POLICY "Users can ask questions" ON app_d8d4_questions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can manage own questions" ON app_d8d4_questions
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Sellers can answer questions" ON app_d8d4_questions
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM app_d8d4_users u WHERE u.id = auth.uid() AND u.role = 'seller')
  );

-- Carts: users can manage own
CREATE POLICY "Carts are user-owned" ON app_d8d4_carts
  FOR ALL USING (auth.uid() = user_id);

-- Wishlists: users can manage own
CREATE POLICY "Wishlists are user-owned" ON app_d8d4_wishlists
  FOR ALL USING (auth.uid() = user_id);

-- Orders: users can view own, sellers can view assigned, admin can view all
CREATE POLICY "Users can view own orders" ON app_d8d4_orders
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Sellers can view their orders" ON app_d8d4_orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM app_d8d4_orders o, jsonb_array_elements(o.items) AS item
      WHERE o.id = app_d8d4_orders.id AND (item->>'seller_id')::uuid = auth.uid()
    )
  );
CREATE POLICY "Admin can view all orders" ON app_d8d4_orders
  FOR SELECT USING (EXISTS (SELECT 1 FROM app_d8d4_users u WHERE u.id = auth.uid() AND u.role = 'admin'));

-- Coupons: public read if active
CREATE POLICY "Coupons are readable if active" ON app_d8d4_coupons
  FOR SELECT USING (is_active = TRUE);

-- Banners: public read if active
CREATE POLICY "Banners are readable if active" ON app_d8d4_banners
  FOR SELECT USING (is_active = TRUE);

-- Seller Applications: users can view own, admin can view all
CREATE POLICY "Users can view own application" ON app_d8d4_seller_applications
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admin can view all applications" ON app_d8d4_seller_applications
  FOR SELECT USING (EXISTS (SELECT 1 FROM app_d8d4_users u WHERE u.id = auth.uid() AND u.role = 'admin'));

-- Notifications: users can manage own
CREATE POLICY "Notifications are user-owned" ON app_d8d4_notifications
  FOR ALL USING (auth.uid() = user_id);

-- Product Views: users can manage own
CREATE POLICY "Product views are user-owned" ON app_d8d4_product_views
  FOR ALL USING (auth.uid() = user_id);

-- Service role bypass
CREATE POLICY "Service role bypass RLS" ON app_d8d4_users
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role bypass RLS" ON app_d8d4_addresses
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role bypass RLS" ON app_d8d4_categories
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role bypass RLS" ON app_d8d4_products
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role bypass RLS" ON app_d8d4_reviews
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role bypass RLS" ON app_d8d4_questions
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role bypass RLS" ON app_d8d4_carts
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role bypass RLS" ON app_d8d4_wishlists
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role bypass RLS" ON app_d8d4_orders
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role bypass RLS" ON app_d8d4_coupons
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role bypass RLS" ON app_d8d4_banners
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role bypass RLS" ON app_d8d4_seller_applications
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role bypass RLS" ON app_d8d4_notifications
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role bypass RLS" ON app_d8d4_product_views
  FOR ALL USING (auth.role() = 'service_role');

-- DOWN
DROP POLICY IF EXISTS "Service role bypass RLS" ON app_d8d4_product_views;
DROP POLICY IF EXISTS "Product views are user-owned" ON app_d8d4_product_views;
DROP POLICY IF EXISTS "Notifications are user-owned" ON app_d8d4_notifications;
DROP POLICY IF EXISTS "Admin can view all applications" ON app_d8d4_seller_applications;
DROP POLICY IF EXISTS "Users can view own application" ON app_d8d4_seller_applications;
DROP POLICY IF EXISTS "Banners are readable if active" ON app_d8d4_banners;
DROP POLICY IF EXISTS "Coupons are readable if active" ON app_d8d4_coupons;
DROP POLICY IF EXISTS "Admin can view all orders" ON app_d8d4_orders;
DROP POLICY IF EXISTS "Sellers can view their orders" ON app_d8d4_orders;
DROP POLICY IF EXISTS "Users can view own orders" ON app_d8d4_orders;
DROP POLICY IF EXISTS "Wishlists are user-owned" ON app_d8d4_wishlists;
DROP POLICY IF EXISTS "Carts are user-owned" ON app_d8d4_carts;
DROP POLICY IF EXISTS "Sellers can answer questions" ON app_d8d4_questions;
DROP POLICY IF EXISTS "Users can manage own questions" ON app_d8d4_questions;
DROP POLICY IF EXISTS "Users can ask questions" ON app_d8d4_questions;
DROP POLICY IF EXISTS "Questions are publicly readable" ON app_d8d4_questions;
DROP POLICY IF EXISTS "Users can manage own reviews" ON app_d8d4_reviews;
DROP POLICY IF EXISTS "Reviews are publicly readable" ON app_d8d4_reviews;
DROP POLICY IF EXISTS "Products are publicly readable" ON app_d8d4_products;
DROP POLICY IF EXISTS "Categories are publicly readable" ON app_d8d4_categories;
DROP POLICY IF EXISTS "Addresses are user-owned" ON app_d8d4_addresses;
DROP POLICY IF EXISTS "Admin can view all users" ON app_d8d4_users;
DROP POLICY IF EXISTS "Users can view own data" ON app_d8d4_users;
DROP POLICY IF EXISTS "Users can update own data" ON app_d8d4_users;