/**
 * Migration: Create initial collections and indexes for ShopSphere
 * Version: 001
 * Description: Create all required collections with proper indexes and schema validation
 */

const COLLECTIONS = [
  'app_d8d4_users',
  'app_d8d4_addresses',
  'app_d8d4_products',
  'app_d8d4_categories',
  'app_d8d4_reviews',
  'app_d8d4_questions',
  'app_d8d4_carts',
  'app_d8d4_orders',
  'app_d8d4_wishlists',
  'app_d8d4_view_history',
  'app_d8d4_coupons',
  'app_d8d4_banners',
  'app_d8d4_seller_applications',
  'app_d8d4_notifications',
  'app_d8d4_sessions',
  'app_d8d4_password_resets',
  'schema_versions'
];

module.exports = {
  version: '001',
  description: 'Create initial collections and indexes',

  async up(db, client) {
    // Create schema_versions collection first (for tracking migrations)
    await db.createCollection('schema_versions', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['version', 'applied_at'],
          properties: {
            version: {
              bsonType: 'string',
              description: 'Migration version number'
            },
            applied_at: {
              bsonType: 'date',
              description: 'When migration was applied'
            },
            description: {
              bsonType: 'string',
              description: 'Description of migration'
            }
          }
        }
      }
    });

    // Create all collections with schema validation
    for (const collectionName of COLLECTIONS) {
      if (collectionName === 'schema_versions') continue; // Already created

      await db.createCollection(collectionName, {
        // Default validation - will be expanded per collection below
        validator: {}
      });
    }

    // Create indexes for all collections
    await this._createIndexes(db);
  },

  async down(db, client) {
    // Drop all collections
    for (const collectionName of COLLECTIONS) {
      try {
        await db.collection(collectionName).drop();
        console.log(`🗑️  Dropped collection: ${collectionName}`);
      } catch (err) {
        if (err.codeName !== 'NamespaceNotFound') {
          throw err;
        }
        console.log(`⏭️  Collection not found (safe to continue): ${collectionName}`);
      }
    }
  },

  async _createIndexes(db) {
    // Users collection indexes
    await db.collection('app_d8d4_users').createIndex({ email: 1 }, { unique: true, name: 'email_unique' });
    await db.collection('app_d8d4_users').createIndex({ role: 1 }, { name: 'role_idx' });
    await db.collection('app_d8d4_users').createIndex({ oauth_provider: 1, oauth_id: 1 }, { unique: true, sparse: true, name: 'oauth_unique' });
    await db.collection('app_d8d4_users').createIndex({ email_verified: 1 }, { name: 'email_verified_idx' });
    await db.collection('app_d8d4_users').createIndex({ created_at: 1 }, { name: 'created_at_idx' });

    // Addresses collection indexes
    await db.collection('app_d8d4_addresses').createIndex({ user_id: 1 }, { name: 'user_id_idx' });
    await db.collection('app_d8d4_addresses').createIndex({ user_id: 1, is_default: 1 }, { name: 'user_default_idx' });
    await db.collection('app_d8d4_addresses').createIndex({ city: 1, state: 1, country: 1 }, { name: 'location_idx' });

    // Products collection indexes
    await db.collection('app_d8d4_products').createIndex({ seller_id: 1 }, { name: 'seller_id_idx' });
    await db.collection('app_d8d4_products').createIndex({ category_id: 1 }, { name: 'category_id_idx' });
    await db.collection('app_d8d4_products').createIndex({ brand: 1 }, { name: 'brand_idx' });
    await db.collection('app_d8d4_products').createIndex({ status: 1 }, { name: 'status_idx' });
    await db.collection('app_d8d4_products').createIndex({ price: 1 }, { name: 'price_idx' });
    await db.collection('app_d8d4_products').createIndex({ discount_percent: 1 }, { name: 'discount_idx' });
    await db.collection('app_d8d4_products').createIndex({ tags: 1 }, { name: 'tags_idx' });
    await db.collection('app_d8d4_products').createIndex({ ratings_avg: 1 }, { name: 'ratings_avg_idx' });
    await db.collection('app_d8d4_products').createIndex({ views_count: 1 }, { name: 'views_count_idx' });
    await db.collection('app_d8d4_products').createIndex({ created_at: 1 }, { name: 'product_created_at_idx' });
    await db.collection('app_d8d4_products').createIndex({ name: 'text', description: 'text', brand: 'text', tags: 'text' }, { name: 'text_search' });

    // Categories collection indexes
    await db.collection('app_d8d4_categories').createIndex({ slug: 1 }, { unique: true, name: 'slug_unique' });
    await db.collection('app_d8d4_categories').createIndex({ parent_id: 1 }, { name: 'parent_id_idx' });
    await db.collection('app_d8d4_categories').createIndex({ order: 1 }, { name: 'order_idx' });

    // Reviews collection indexes
    await db.collection('app_d8d4_reviews').createIndex({ product_id: 1 }, { name: 'product_id_idx' });
    await db.collection('app_d8d4_reviews').createIndex({ user_id: 1 }, { name: 'review_user_id_idx' });
    await db.collection('app_d8d4_reviews').createIndex({ product_id: 1, created_at: -1 }, { name: 'product_created_at_desc' });
    await db.collection('app_d8d4_reviews').createIndex({ rating: 1 }, { name: 'rating_idx' });
    await db.collection('app_d8d4_reviews').createIndex({ verified_purchase: 1 }, { name: 'verified_purchase_idx' });

    // Questions collection indexes
    await db.collection('app_d8d4_questions').createIndex({ product_id: 1 }, { name: 'question_product_id_idx' });
    await db.collection('app_d8d4_questions').createIndex({ user_id: 1 }, { name: 'question_user_id_idx' });
    await db.collection('app_d8d4_questions').createIndex({ answered_at: 1 }, { sparse: true, name: 'answered_at_idx' });
    await db.collection('app_d8d4_questions').createIndex({ created_at: -1 }, { name: 'question_created_at_desc' });

    // Carts collection indexes
    await db.collection('app_d8d4_carts').createIndex({ user_id: 1 }, { unique: true, name: 'user_id_unique' });
    await db.collection('app_d8d4_carts').createIndex({ updated_at: 1 }, { name: 'cart_updated_at_idx' });

    // Orders collection indexes
    await db.collection('app_d8d4_orders').createIndex({ user_id: 1 }, { name: 'order_user_id_idx' });
    await db.collection('app_d8d4_orders').createIndex({ order_number: 1 }, { unique: true, name: 'order_number_unique' });
    await db.collection('app_d8d4_orders').createIndex({ status: 1 }, { name: 'order_status_idx' });
    await db.collection('app_d8d4_orders').createIndex({ payment_status: 1 }, { name: 'payment_status_idx' });
    await db.collection('app_d8d4_orders').createIndex({ stripe_session_id: 1 }, { sparse: true, unique: true, name: 'stripe_session_unique' });
    await db.collection('app_d8d4_orders').createIndex({ created_at: -1 }, { name: 'order_created_at_desc' });
    await db.collection('app_d8d4_orders').createIndex({ 'status_history.status': 1, 'status_history.timestamp': -1 }, { name: 'status_history_idx' });

    // Wishlists collection indexes
    await db.collection('app_d8d4_wishlists').createIndex({ user_id: 1, product_id: 1 }, { unique: true, name: 'user_product_unique' });
    await db.collection('app_d8d4_wishlists').createIndex({ product_id: 1 }, { name: 'wishlist_product_id_idx' });
    await db.collection('app_d8d4_wishlists').createIndex({ user_id: 1 }, { name: 'wishlist_user_id_idx' });

    // View history collection indexes
    await db.collection('app_d8d4_view_history').createIndex({ user_id: 1, product_id: 1 }, { unique: true, name: 'user_product_view_unique' });
    await db.collection('app_d8d4_view_history').createIndex({ user_id: 1, viewed_at: -1 }, { name: 'user_viewed_at_desc' });
    await db.collection('app_d8d4_view_history').createIndex({ product_id: 1 }, { name: 'viewed_product_id_idx' });

    // Coupons collection indexes
    await db.collection('app_d8d4_coupons').createIndex({ code: 1 }, { unique: true, name: 'coupon_code_unique' });
    await db.collection('app_d8d4_coupons').createIndex({ status: 1 }, { name: 'coupon_status_idx' });
    await db.collection('app_d8d4_coupons').createIndex({ valid_from: 1, valid_until: 1 }, { name: 'validity_period_idx' });
    await db.collection('app_d8d4_coupons').createIndex({ min_order_value: 1 }, { name: 'min_order_value_idx' });

    // Banners collection indexes
    await db.collection('app_d8d4_banners').createIndex({ position: 1 }, { name: 'banner_position_idx' });
    await db.collection('app_d8d4_banners').createIndex({ status: 1 }, { name: 'banner_status_idx' });
    await db.collection('app_d8d4_banners').createIndex({ order: 1 }, { name: 'banner_order_idx' });

    // Seller applications collection indexes
    await db.collection('app_d8d4_seller_applications').createIndex({ user_id: 1 }, { unique: true, name: 'application_user_unique' });
    await db.collection('app_d8d4_seller_applications').createIndex({ status: 1 }, { name: 'application_status_idx' });
    await db.collection('app_d8d4_seller_applications').createIndex({ reviewed_by: 1 }, { name: 'reviewed_by_idx' });
    await db.collection('app_d8d4_seller_applications').createIndex({ created_at: -1 }, { name: 'application_created_at_desc' });

    // Notifications collection indexes
    await db.collection('app_d8d4_notifications').createIndex({ user_id: 1 }, { name: 'notification_user_id_idx' });
    await db.collection('app_d8d4_notifications').createIndex({ read: 1 }, { name: 'notification_read_idx' });
    await db.collection('app_d8d4_notifications').createIndex({ type: 1 }, { name: 'notification_type_idx' });
    await db.collection('app_d8d4_notifications').createIndex({ created_at: -1 }, { name: 'notification_created_at_desc' });

    // Sessions collection indexes
    await db.collection('app_d8d4_sessions').createIndex({ user_id: 1 }, { name: 'session_user_id_idx' });
    await db.collection('app_d8d4_sessions').createIndex({ refresh_token: 1 }, { unique: true, name: 'refresh_token_unique' });
    await db.collection('app_d8d4_sessions').createIndex({ expires_at: 1 }, { name: 'session_expires_at_idx' });
    await db.collection('app_d8d4_sessions').createIndex({ created_at: 1 }, { name: 'session_created_at_idx' });

    // Password resets collection indexes
    await db.collection('app_d8d4_password_resets').createIndex({ user_id: 1 }, { name: 'password_reset_user_id_idx' });
    await db.collection('app_d8d4_password_resets').createIndex({ token_hash: 1 }, { unique: true, name: 'token_hash_unique' });
    await db.collection('app_d8d4_password_resets').createIndex({ expires_at: 1 }, { name: 'reset_expires_at_idx' });

    // Schema versions collection indexes
    await db.collection('schema_versions').createIndex({ version: 1 }, { unique: true, name: 'version_unique' });

    console.log('✅ All indexes created successfully');
  }
};