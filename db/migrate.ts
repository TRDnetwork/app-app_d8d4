import { MongoClient } from 'mongodb';
import { createHash } from 'crypto';

// Migration runner for ShopSphere (app_d8d4)
// Tracks applied migrations in migration_logs collection
// Ensures idempotent, ordered execution

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shopsphere';
const DB_NAME = 'shopsphere';

interface Migration {
  id: string;
  name: string;
  up: () => Promise<void>;
  down: () => Promise<void>;
}

// Migration Logs Collection - tracks applied migrations
async function ensureMigrationLogs(client: MongoClient) {
  const db = client.db(DB_NAME);
  const collection = db.collection('migration_logs');

  // Create unique index on migrationId
  await collection.createIndex({ migrationId: 1 }, { unique: true });
  await collection.createIndex({ appliedAt: 1 });
}

// Hash migration content for integrity
function hashMigration(content: string): string {
  return createHash('sha256').update(content).digest('hex');
}

// Run all pending migrations
export async function runMigrations() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  console.log('Connected to MongoDB for migrations');

  try {
    await ensureMigrationLogs(client);
    const db = client.db(DB_NAME);
    const logs = db.collection('migration_logs');

    for (const migration of migrations) {
      const existing = await logs.findOne({ migrationId: migration.id });
      if (!existing) {
        console.log(`Running migration: ${migration.id} - ${migration.name}`);
        await migration.up();
        await logs.insertOne({
          migrationId: migration.id,
          name: migration.name,
          appliedAt: new Date(),
          hash: hashMigration(migration.name),
        });
        console.log(`Completed migration: ${migration.id}`);
      } else {
        console.log(`Migration already applied: ${migration.id} - ${migration.name}`);
      }
    }
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await client.close();
  }
}

// Rollback last migration
export async function rollbackLastMigration() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DB_NAME);
  const logs = db.collection('migration_logs');

  const lastMigration = await logs
    .find({})
    .sort({ appliedAt: -1 })
    .limit(1)
    .toArray();

  if (lastMigration.length === 0) {
    console.log('No migrations to rollback');
    await client.close();
    return;
  }

  const migration = migrations.find(m => m.id === lastMigration[0].migrationId);
  if (migration) {
    console.log(`Rolling back: ${migration.id} - ${migration.name}`);
    await migration.down();
    await logs.deleteOne({ migrationId: migration.id });
    console.log(`Rolled back: ${migration.id}`);
  }

  await client.close();
}

// Define migrations
const migrations: Migration[] = [
  {
    id: '001_create_users_collection',
    name: 'Create app_d8d4_users collection with indexes',
    async up() {
      const client = new MongoClient(MONGODB_URI);
      const db = client.db(DB_NAME);
      await db.createCollection('app_d8d4_users');
      const collection = db.collection('app_d8d4_users');

      // Create indexes
      await collection.createIndex({ email: 1 }, { unique: true });
      await collection.createIndex({ role: 1 });
      await collection.createIndex({ oauth_provider: 1, oauth_id: 1 }, { unique: true, sparse: true });
      await collection.createIndex({ email_verification_token: 1 }, { unique: true, sparse: true });
      await collection.createIndex({ password_reset_token: 1 }, { unique: true, sparse: true });
      await collection.createIndex({ created_at: 1 });

      await client.close();
    },
    async down() {
      const client = new MongoClient(MONGODB_URI);
      const db = client.db(DB_NAME);
      await db.collection('app_d8d4_users').drop().catch(() => null);
      await client.close();
    }
  },
  {
    id: '002_create_addresses_collection',
    name: 'Create app_d8d4_addresses collection with indexes',
    async up() {
      const client = new MongoClient(MONGODB_URI);
      const db = client.db(DB_NAME);
      await db.createCollection('app_d8d4_addresses');
      const collection = db.collection('app_d8d4_addresses');

      await collection.createIndex({ user_id: 1 });
      await collection.createIndex({ user_id: 1, is_default: 1 });
      await collection.createIndex({ created_at: 1 });

      await client.close();
    },
    async down() {
      const client = new MongoClient(MONGODB_URI);
      const db = client.db(DB_NAME);
      await db.collection('app_d8d4_addresses').drop().catch(() => null);
      await client.close();
    }
  },
  {
    id: '003_create_categories_collection',
    name: 'Create app_d8d4_categories collection with indexes',
    async up() {
      const client = new MongoClient(MONGODB_URI);
      const db = client.db(DB_NAME);
      await db.createCollection('app_d8d4_categories');
      const collection = db.collection('app_d8d4_categories');

      await collection.createIndex({ slug: 1 }, { unique: true });
      await collection.createIndex({ parent_id: 1 });
      await collection.createIndex({ order: 1 });
      await collection.createIndex({ created_at: 1 });

      await client.close();
    },
    async down() {
      const client = new MongoClient(MONGODB_URI);
      const db = client.db(DB_NAME);
      await db.collection('app_d8d4_categories').drop().catch(() => null);
      await client.close();
    }
  },
  {
    id: '004_create_products_collection',
    name: 'Create app_d8d4_products collection with indexes',
    async up() {
      const client = new MongoClient(MONGODB_URI);
      const db = client.db(DB_NAME);
      await db.createCollection('app_d8d4_products');
      const collection = db.collection('app_d8d4_products');

      await collection.createIndex({ slug: 1 }, { unique: true });
      await collection.createIndex({ seller_id: 1 });
      await collection.createIndex({ category_id: 1 });
      await collection.createIndex({ brand: 1 });
      await collection.createIndex({ status: 1 });
      await collection.createIndex({ is_featured: 1 });
      await collection.createIndex({ is_sponsored: 1 });
      await collection.createIndex({ price: 1 });
      await collection.createIndex({ discount_percent: 1 });
      await collection.createIndex({ views: 1 });
      await collection.createIndex({ created_at: 1 });
      await collection.createIndex({ updated_at: 1 });

      await client.close();
    },
    async down() {
      const client = new MongoClient(MONGODB_URI);
      const db = client.db(DB_NAME);
      await db.collection('app_d8d4_products').drop().catch(() => null);
      await client.close();
    }
  },
  {
    id: '005_create_reviews_collection',
    name: 'Create app_d8d4_reviews collection with indexes',
    async up() {
      const client = new MongoClient(MONGODB_URI);
      const db = client.db(DB_NAME);
      await db.createCollection('app_d8d4_reviews');
      const collection = db.collection('app_d8d4_reviews');

      await collection.createIndex({ product_id: 1 });
      await collection.createIndex({ user_id: 1 });
      await collection.createIndex({ order_id: 1 });
      await collection.createIndex({ rating: 1 });
      await collection.createIndex({ verified_purchase: 1 });
      await collection.createIndex({ created_at: 1 });

      await client.close();
    },
    async down() {
      const client = new MongoClient(MONGODB_URI);
      const db = client.db(DB_NAME);
      await db.collection('app_d8d4_reviews').drop().catch(() => null);
      await client.close();
    }
  },
  {
    id: '006_create_questions_collection',
    name: 'Create app_d8d4_questions collection with indexes',
    async up() {
      const client = new MongoClient(MONGODB_URI);
      const db = client.db(DB_NAME);
      await db.createCollection('app_d8d4_questions');
      const collection = db.collection('app_d8d4_questions');

      await collection.createIndex({ product_id: 1 });
      await collection.createIndex({ user_id: 1 });
      await collection.createIndex({ answered_by: 1 });
      await collection.createIndex({ created_at: 1 });
      await collection.createIndex({ answered_at: 1 });

      await client.close();
    },
    async down() {
      const client = new MongoClient(MONGODB_URI);
      const db = client.db(DB_NAME);
      await db.collection('app_d8d4_questions').drop().catch(() => null);
      await client.close();
    }
  },
  {
    id: '007_create_carts_collection',
    name: 'Create app_d8d4_carts collection with indexes',
    async up() {
      const client = new MongoClient(MONGODB_URI);
      const db = client.db(DB_NAME);
      await db.createCollection('app_d8d4_carts');
      const collection = db.collection('app_d8d4_carts');

      await collection.createIndex({ user_id: 1 }, { unique: true });
      await collection.createIndex({ updated_at: 1 });

      await client.close();
    },
    async down() {
      const client = new MongoClient(MONGODB_URI);
      const db = client.db(DB_NAME);
      await db.collection('app_d8d4_carts').drop().catch(() => null);
      await client.close();
    }
  },
  {
    id: '008_create_wishlists_collection',
    name: 'Create app_d8d4_wishlists collection with indexes',
    async up() {
      const client = new MongoClient(MONGODB_URI);
      const db = client.db(DB_NAME);
      await db.createCollection('app_d8d4_wishlists');
      const collection = db.collection('app_d8d4_wishlists');

      await collection.createIndex({ user_id: 1, product_id: 1 }, { unique: true });
      await collection.createIndex({ added_at: 1 });

      await client.close();
    },
    async down() {
      const client = new MongoClient(MONGODB_URI);
      const db = client.db(DB_NAME);
      await db.collection('app_d8d4_wishlists').drop().catch(() => null);
      await client.close();
    }
  },
  {
    id: '009_create_orders_collection',
    name: 'Create app_d8d4_orders collection with indexes',
    async up() {
      const client = new MongoClient(MONGODB_URI);
      const db = client.db(DB_NAME);
      await db.createCollection('app_d8d4_orders');
      const collection = db.collection('app_d8d4_orders');

      await collection.createIndex({ user_id: 1 });
      await collection.createIndex({ order_number: 1 }, { unique: true });
      await collection.createIndex({ status: 1 });
      await collection.createIndex({ payment_status: 1 });
      await collection.createIndex({ stripe_session_id: 1 }, { unique: true, sparse: true });
      await collection.createIndex({ stripe_payment_intent_id: 1 }, { unique: true, sparse: true });
      await collection.createIndex({ created_at: 1 });
      await collection.createIndex({ updated_at: 1 });
      await collection.createIndex({ delivered_at: 1 });

      await client.close();
    },
    async down() {
      const client = new MongoClient(MONGODB_URI);
      const db = client.db(DB_NAME);
      await db.collection('app_d8d4_orders').drop().catch(() => null);
      await client.close();
    }
  },
  {
    id: '010_create_coupons_collection',
    name: 'Create app_d8d4_coupons collection with indexes',
    async up() {
      const client = new MongoClient(MONGODB_URI);
      const db = client.db(DB_NAME);
      await db.createCollection('app_d8d4_coupons');
      const collection = db.collection('app_d8d4_coupons');

      await collection.createIndex({ code: 1 }, { unique: true });
      await collection.createIndex({ is_active: 1 });
      await collection.createIndex({ valid_from: 1 });
      await collection.createIndex({ valid_until: 1 });
      await collection.createIndex({ created_at: 1 });

      await client.close();
    },
    async down() {
      const client = new MongoClient(MONGODB_URI);
      const db = client.db(DB_NAME);
      await db.collection('app_d8d4_coupons').drop().catch(() => null);
      await client.close();
    }
  },
  {
    id: '011_create_banners_collection',
    name: 'Create app_d8d4_banners collection with indexes',
    async up() {
      const client = new MongoClient(MONGODB_URI);
      const db = client.db(DB_NAME);
      await db.createCollection('app_d8d4_banners');
      const collection = db.collection('app_d8d4_banners');

      await collection.createIndex({ is_active: 1 });
      await collection.createIndex({ order: 1 });
      await collection.createIndex({ start_date: 1 });
      await collection.createIndex({ end_date: 1 });
      await collection.createIndex({ created_at: 1 });

      await client.close();
    },
    async down() {
      const client = new MongoClient(MONGODB_URI);
      const db = client.db(DB_NAME);
      await db.collection('app_d8d4_banners').drop().catch(() => null);
      await client.close();
    }
  },
  {
    id: '012_create_seller_applications_collection',
    name: 'Create app_d8d4_seller_applications collection with indexes',
    async up() {
      const client = new MongoClient(MONGODB_URI);
      const db = client.db(DB_NAME);
      await db.createCollection('app_d8d4_seller_applications');
      const collection = db.collection('app_d8d4_seller_applications');

      await collection.createIndex({ user_id: 1 }, { unique: true });
      await collection.createIndex({ status: 1 });
      await collection.createIndex({ submitted_at: 1 });

      await client.close();
    },
    async down() {
      const client = new MongoClient(MONGODB_URI);
      const db = client.db(DB_NAME);
      await db.collection('app_d8d4_seller_applications').drop().catch(() => null);
      await client.close();
    }
  },
  {
    id: '013_create_notifications_collection',
    name: 'Create app_d8d4_notifications collection with indexes',
    async up() {
      const client = new MongoClient(MONGODB_URI);
      const db = client.db(DB_NAME);
      await db.createCollection('app_d8d4_notifications');
      const collection = db.collection('app_d8d4_notifications');

      await collection.createIndex({ user_id: 1 });
      await collection.createIndex({ type: 1 });
      await collection.createIndex({ is_read: 1 });
      await collection.createIndex({ created_at: 1 });

      await client.close();
    },
    async down() {
      const client = new MongoClient(MONGODB_URI);
      const db = client.db(DB_NAME);
      await db.collection('app_d8d4_notifications').drop().catch(() => null);
      await client.close();
    }
  },
  {
    id: '014_create_product_views_collection',
    name: 'Create app_d8d4_product_views collection with indexes',
    async up() {
      const client = new MongoClient(MONGODB_URI);
      const db = client.db(DB_NAME);
      await db.createCollection('app_d8d4_product_views');
      const collection = db.collection('app_d8d4_product_views');

      await collection.createIndex({ user_id: 1, viewed_at: -1 });
      await collection.createIndex({ product_id: 1 });
      await collection.createIndex({ viewed_at: 1 });

      await client.close();
    },
    async down() {
      const client = new MongoClient(MONGODB_URI);
      const db = client.db(DB_NAME);
      await db.collection('app_d8d4_product_views').drop().catch(() => null);
      await client.close();
    }
  }
];

// Export for programmatic use
export default migrations;