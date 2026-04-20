-- UP
-- Placeholder for Row Level Security policies.
-- RLS not applicable to MongoDB backend.

-- Example policy if using Supabase:
-- ALTER TABLE app_d8d4_products ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Anyone can view active products"
--   ON app_d8d4_products FOR SELECT
--   USING (status = 'active');

-- CREATE POLICY "Users can manage their own cart"
--   ON app_d8d4_carts FOR ALL
--   USING (user_id = auth.uid());

-- DOWN
-- DROP POLICY IF EXISTS "Anyone can view active products" ON app_d8d4_products;
-- DROP POLICY IF EXISTS "Users can manage their own cart" ON app_d8d4_carts;
-- ALTER TABLE app_d8d4_products DISABLE ROW LEVEL SECURITY;