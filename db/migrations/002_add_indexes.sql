-- UP
-- Placeholder for index definitions.
-- MongoDB indexes are defined in Mongoose schemas (server/models/).

-- Example of how index would be declared if using PostgreSQL:
-- CREATE INDEX IF NOT EXISTS idx_products_category ON app_d8d4_products(category_id);
-- CREATE INDEX IF NOT EXISTS idx_products_seller ON app_d8d4_products(seller_id);
-- CREATE INDEX IF NOT EXISTS idx_orders_user ON app_d8d4_orders(user_id);
-- CREATE INDEX IF NOT EXISTS idx_reviews_product ON app_d8d4_reviews(product_id);
-- CREATE INDEX IF NOT EXISTS idx_cart_user ON app_d8d4_carts(user_id);

-- DOWN
-- DROP INDEX IF EXISTS idx_products_category;
-- DROP INDEX IF EXISTS idx_products_seller;
-- DROP INDEX IF EXISTS idx_orders_user;
-- DROP INDEX IF EXISTS idx_reviews_product;
-- DROP INDEX IF EXISTS idx_cart_user;