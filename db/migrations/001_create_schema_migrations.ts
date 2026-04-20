```ts
import { Db } from 'mongodb';

export const up = async (db: Db): Promise<void> => {
  const collectionName = 'schema_migrations';

  // Idempotent: only create if not exists
  const collections = await db.listCollections({ name: collectionName }).toArray();
  if (collections.length === 0) {
    await db.createCollection(collectionName);
    console.log(`✅ Created ${collectionName} collection`);
  } else {
    console.log(`⏭️  ${collectionName} already exists`);
  }

  // Create index on id for fast lookup
  await db.collection(collectionName).createIndex({ id: 1 }, { unique: true });
};
```