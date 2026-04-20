```ts
import { Db } from 'mongodb';

export const up = async (db: Db): Promise<void> => {
  const collectionName = 'app_d8d4_users';

  const collections = await db.listCollections({ name: collectionName }).toArray();
  if (collections.length > 0) {
    console.log(`⏭️  ${collectionName} already exists`);
    return;
  }

  await db.createCollection(collectionName, {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['email', 'role', 'created_at'],
        properties: {
          email: {
            bsonType: 'string',
            description: 'must be a string and is required',
            pattern: '^[^@]+@[^@]+\\.[^@]+$',
          },
          password_hash: {
            bsonType: 'string',
            description: 'must be a string if present',
          },
          name: {
            bsonType: 'string',
          },
          phone: {
            bsonType: 'string',
          },
          profile_picture_url: {
            bsonType: 'string',
          },
          role: {
            enum: ['customer', 'seller', 'admin'],
            description: 'must be one of customer, seller, admin',
          },
          email_verified: {
            bsonType: 'bool',
          },
          oauth_provider: {
            bsonType: 'string',
          },
          oauth_id: {
            bsonType: 'string',
          },
          created_at: {
            bsonType: 'date',
          },
          updated_at: {
            bsonType: 'date',
          },
        },
      },
    },
  });

  // Indexes
  await db.collection(collectionName).createIndex({ email: 1 }, { unique: true });
  await db.collection(collectionName).createIndex({ oauth_id: 1 }, { sparse: true });
  await db.collection(collectionName).createIndex({ role: 1 });

  console.log(`✅ Created ${collectionName} with validation and indexes`);
};
```