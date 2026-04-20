```ts
import { Db } from 'mongodb';

export const up = async (db: Db): Promise<void> => {
  const collectionName = 'app_d8d4_reviews';

  const collections = await db.listCollections({ name: collectionName }).toArray();
  if (collections.length > 0) {
    console.log(`⏭️  ${collectionName} already exists`);
    return;
  }

  await db.createCollection(collectionName, {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['product_id', 'user_id', 'rating', 'created_at'],
        properties: {
          product_id: { bsonType: 'objectId' },
          user_id: { bsonType: 'objectId' },
          order_id: { bsonType: 'objectId' },
          rating: { bsonType: 'number', minimum: 1, maximum: 5 },
          title: { bsonType: 'string' },
          comment: { bsonType: 'string' },
          images: {
            bsonType: 'array',
            items: { bsonType: 'string' },
          },
          helpful_votes: { bsonType: 'number', minimum: 0 },
          verified_purchase: { bsonType: 'bool' },
          created_at: { bsonType: 'date' },
          updated_at: { bsonType: 'date' },
        },
      },
    },
  });

  // Indexes
  await db.collection(collectionName).createIndex({ product_id: 1, created_at: -1 });
  await db.collection(collectionName).createIndex({ user_id: 1 });
  await db.collection(collectionName).createIndex({ verified_purchase: 1 });

  console.log(`✅ Created ${collectionName} with validation and indexes`);
};
```