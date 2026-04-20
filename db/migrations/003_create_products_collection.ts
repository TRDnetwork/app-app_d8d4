```ts
import { Db } from 'mongodb';

export const up = async (db: Db): Promise<void> => {
  const collectionName = 'app_d8d4_products';

  const collections = await db.listCollections({ name: collectionName }).toArray();
  if (collections.length > 0) {
    console.log(`⏭️  ${collectionName} already exists`);
    return;
  }

  await db.createCollection(collectionName, {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: [
          'seller_id',
          'title',
          'price',
          'status',
          'created_at',
        ],
        properties: {
          seller_id: { bsonType: 'objectId' },
          title: { bsonType: 'string' },
          description: { bsonType: 'string' },
          category: { bsonType: 'string' },
          subcategory: { bsonType: 'string' },
          brand: { bsonType: 'string' },
          price: { bsonType: 'number', minimum: 0 },
          original_price: { bsonType: 'number', minimum: 0 },
          discount_percent: { bsonType: 'number', minimum: 0, maximum: 100 },
          images: {
            bsonType: 'array',
            items: { bsonType: 'string' },
          },
          variants: {
            bsonType: 'array',
            items: {
              bsonType: 'object',
              required: ['sku', 'stock'],
              properties: {
                size: { bsonType: 'string' },
                color: { bsonType: 'string' },
                sku: { bsonType: 'string' },
                stock: { bsonType: 'number', minimum: 0 },
              },
            },
          },
          stock_total: { bsonType: 'number', minimum: 0 },
          status: {
            enum: ['active', 'draft', 'archived'],
          },
          avg_rating: { bsonType: 'number', minimum: 0, maximum: 5 },
          review_count: { bsonType: 'number', minimum: 0 },
          view_count: { bsonType: 'number', minimum: 0 },
          tags: {
            bsonType: 'array',
            items: { bsonType: 'string' },
          },
          created_at: { bsonType: 'date' },
          updated_at: { bsonType: 'date' },
        },
      },
    },
  });

  // Indexes
  await db.collection(collectionName).createIndex({ seller_id: 1 });
  await db.collection(collectionName).createIndex({ category: 1 });
  await db.collection(collectionName).createIndex({ status: 1 });
  await db.collection(collectionName).createIndex({ avg_rating: -1 });
  await db.collection(collectionName).createIndex({ created_at: -1 });
  await db.collection(collectionName).createIndex({ brand: 1 });

  console.log(`✅ Created ${collectionName} with validation and indexes`);
};
```