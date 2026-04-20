```ts
import { Db } from 'mongodb';

export const up = async (db: Db): Promise<void> => {
  const collectionName = 'app_d8d4_orders';

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
          'user_id',
          'order_number',
          'items',
          'total_amount',
          'order_status',
          'created_at',
        ],
        properties: {
          user_id: { bsonType: 'objectId' },
          order_number: { bsonType: 'string' },
          items: {
            bsonType: 'array',
            items: {
              bsonType: 'object',
              required: ['product_id', 'quantity', 'price'],
              properties: {
                product_id: { bsonType: 'objectId' },
                variant: { bsonType: 'object' },
                quantity: { bsonType: 'number', minimum: 1 },
                price: { bsonType: 'number', minimum: 0 },
                seller_id: { bsonType: 'objectId' },
              },
            },
          },
          total_amount: { bsonType: 'number', minimum: 0 },
          discount_amount: { bsonType: 'number', minimum: 0 },
          delivery_fee: { bsonType: 'number', minimum: 0 },
          tax_amount: { bsonType: 'number', minimum: 0 },
          payment_method: { bsonType: 'string' },
          payment_status: {
            enum: ['pending', 'completed', 'failed', 'refunded'],
          },
          order_status: {
            enum: [
              'placed',
              'confirmed',
              'shipped',
              'out_for_delivery',
              'delivered',
              'cancelled',
            ],
          },
          address: { bsonType: 'object' },
          tracking_number: { bsonType: 'string' },
          delivery_speed: { bsonType: 'string' },
          coupon_code: { bsonType: 'string' },
          created_at: { bsonType: 'date' },
          updated_at: { bsonType: 'date' },
          delivered_at: { bsonType: 'date' },
          cancelled_at: { bsonType: 'date' },
        },
      },
    },
  });

  // Indexes
  await db.collection(collectionName).createIndex({ user_id: 1, created_at: -1 });
  await db.collection(collectionName).createIndex({ order_number: 1 }, { unique: true });
  await db.collection(collectionName).createIndex({ order_status: 1 });
  await db.collection(collectionName).createIndex({ 'items.product_id': 1 });

  console.log(`✅ Created ${collectionName} with validation and indexes`);
};
```