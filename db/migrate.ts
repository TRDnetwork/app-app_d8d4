```ts
import { MongoClient, Db } from 'mongodb';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || 'shopsphere';

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is required in environment');
  process.exit(1);
}

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');
const APPLIED_COLLECTION = 'schema_migrations';

interface Migration {
  id: string;
  name: string;
  up: (db: Db) => Promise<void>;
  down?: (db: Db) => Promise<void>;
}

async function runMigrations() {
  const client = new MongoClient(MONGODB_URI!);
  try {
    await client.connect();
    const db = client.db(DB_NAME);

    // Ensure migrations collection exists
    if (!(await db.listCollections({ name: APPLIED_COLLECTION }).hasNext())) {
      await db.createCollection(APPLIED_COLLECTION);
      console.log('✅ Created schema_migrations collection');
    }

    const appliedMigrations = await db
      .collection(APPLIED_COLLECTION)
      .find({})
      .sort({ id: 1 })
      .toArray();

    const appliedIds = new Set(appliedMigrations.map((m) => m.id));

    const migrationFiles = fs
      .readdirSync(MIGRATIONS_DIR)
      .filter((f) => f.endsWith('.ts') || f.endsWith('.js'))
      .sort(); // Ensures 001, 002, etc.

    for (const file of migrationFiles) {
      const match = file.match(/^(\d+)_([a-zA-Z0-9_]+)\.(ts|js)$/);
      if (!match) continue;

      const id = match[1];
      const name = match[2];

      if (appliedIds.has(id)) {
        console.log(`⏭️  Skipping ${id}_${name} (already applied)`);
        continue;
      }

      const migrationPath = path.join(MIGRATIONS_DIR, file);
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const migrationModule = require(migrationPath) as Migration;

      console.log(`🔄 Applying migration ${id}: ${name}`);

      await migrationModule.up(db);

      await db.collection(APPLIED_COLLECTION).insertOne({
        id,
        name,
        appliedAt: new Date(),
      });

      console.log(`✅ Applied ${id}_${name}`);
    }

    console.log('🎉 All migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

if (require.main === module) {
  runMigrations();
}

export default runMigrations;
```