/**
 * Database initialization script for ShopSphere (app_d8d4)
 * Sets up collections, indexes, and validation rules
 */

const { MongoClient } = require('mongodb');

async function initDatabase() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/shopsphere';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();

    // Define collection configurations with validation and indexes
    const collections = [
      {
        name: 'app_d8d4_users',
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['email', 'password_hash', 'name', 'role', 'created_at'],
            properties: {
              email: { bsonType: 'string', pattern: '^[^@]+@[^@]+\\.[^@]+$' },
              password_hash: { bsonType: 'string' },
              name: { bsonType: 'string', minLength: 1 },
              role: { 
                bsonType: 'string', 
                enum: ['customer', 'seller', 'admin'] 
              },
              profile_picture_url: { bsonType: 'string' },
              phone: { bsonType: 'string' },
              email_verified: { bsonType: 'bool', default: false },
              oauth_provider: { 
                bsonType: 'string', 
                enum: ['google', 'facebook'] 
              },
              oauth_id: { bsonType: 'string' },
              created_at: { bsonType: 'date' },
              updated_at: { bsonType: 'date' }
            }
          }
        },
        indexes: [
          { key: { email: 1 }, unique: true },
          { key: { role: 1 } },
          { key: { oauth_provider: 1, oauth_id: 1 }, unique: true, sparse: true }
        ]
      },
      {
        name: 'app_d8d4_addresses',
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['user_id', 'address_line1', 'city', 'state', 'zip', 'country'],
            properties: {
              user_id: { bsonType: 'objectId' },
              address_line1: { bsonType: 'string' },
              address_line2: { bsonType: 'string' },
              city: { bsonType: 'string' },
              state: { bsonType: 'string' },
              zip: { bsonType: 'string' },
              country: { bsonType: 'string' },
              is_default: { bsonType: 'bool', default: false },
              created_at: { bsonType: 'date' },
              updated_at: { bsonType: 'date' }
            }
          }
        },
        indexes: [
          { key: { user_id: 1 } },
          { key: { user_id: 1, is_default: 1 } }
        ]
      },
      {
        name: 'app_d8d4_products',
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['seller_id', 'title', 'price', 'stock', 'created_at'],
            properties: {
              seller_id: { bsonType: 'objectId' },
              title: { bsonType: 'string', minLength: 1 },
              description: { bsonType: 'string' },
              brand: { bsonType: 'string' },
              category_id: { bsonType: 'objectId' },
              subcategory_id: { bsonType: 'objectId' },
              price: { bsonType: 'number', minimum: 0 },
              discount_percent: { 
                bsonType: 'number', 
                minimum: 0, 
                maximum: 100 
              },
              stock: { bsonType: 'number', minimum: 0 },
              images: { 
                bsonType: 'array',
                items: { bsonType: 'string' }
              },
              variants: {
                bsonType: 'array',
                items: {
                  bsonType: 'object',
                  required: ['color', 'sku', 'price', 'stock'],
                  properties: {
                    size: { bsonType: 'string' },
                    color: { bsonType: 'string' },
                    sku: { bsonType: 'string' },
                    price: { bsonType: 'number', minimum: 0 },
                    stock: { bsonType: 'number', minimum: 0 }
                  }
                }
              },
              tags: { 
                bsonType: 'array',
                items: { bsonType: 'string' }
              },
              status: { 
                bsonType: 'string', 
                enum: ['active', 'inactive'], 
                default: 'active' 
              },
              created_at: { bsonType: 'date' },
              updated_at: { bsonType: 'date' }
            }
          }
        },
        indexes: [
          { key: { seller_id: 1 } },
          { key: { category_id: 1 } },
          { key: { title: 'text', description: 'text', brand: 'text' } },
          { key: { price: 1 } },
          { key: { created_at: -1 } },
          { key: { status: 1 } },
          { key: { 'variants.sku': 1 }, unique: true, sparse: true }
        ]
      },
      {
        name: 'app_d8d4_categories',
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['name', 'slug', 'created_at'],
            properties: {
              name: { bsonType: 'string', minLength: 1 },
              slug: { bsonType: 'string', pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$' },
              parent_id: { bsonType: 'objectId' },
              image_url: { bsonType: 'string' },
              created_at: { bsonType: 'date' },
              updated_at: { bsonType: 'date' }
            }
          }
        },
        indexes: [
          { key: { slug: 1 }, unique: true },
          { key: { parent_id: 1 } }
        ]
      },
      {
        name: 'app_d8d4_reviews',
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['product_id', 'user_id', 'rating', 'created_at'],
            properties: {
              product_id: { bsonType: 'objectId' },
              user_id: { bsonType: 'objectId' },
              rating: { bsonType: 'number', minimum: 1, maximum: 5 },
              title: { bsonType: 'string' },
              comment: { bsonType: 'string' },
              images: { 
                bsonType: 'array',
                items: { bsonType: 'string' }
              },
              helpful_votes: { 
                bsonType: 'array',
                items: { bsonType: 'objectId' }
              },
              created_at: { bsonType: 'date' },
              updated_at: { bsonType: 'date' }
            }
          }
        },
        indexes: [
          { key: { product_id: 1 } },
          { key: { user_id: 1 } },
          { key: { product_id: 1, user_id: 1 }, unique: true },
          { key: { rating: 1 } },
          { key: { created_at: -1 } }
        ]
      },
      {
        name: 'app_d8d4_orders',
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['user_id', 'items', 'total', 'created_at'],
            properties: {
              user_id: { bsonType: 'objectId' },
              items: {
                bsonType: 'array',
                minItems: 1,
                items: {
                  bsonType: 'object',
                  required: ['product_id', 'quantity', 'price_at_purchase'],
                  properties: {
                    product_id: { bsonType: 'objectId' },
                    quantity: { bsonType: 'number', minimum: 1 },
                    price_at_purchase: { bsonType: 'number', minimum: 0 },
                    variant: { bsonType: 'object' }
                  }
                }
              },
              subtotal: { bsonType: 'number', minimum: 0 },
              tax: { bsonType: 'number', minimum: 0 },
              shipping_cost: { bsonType: 'number', minimum: 0 },
              total: { bsonType: 'number', minimum: 0 },
              address_id: { bsonType: 'objectId' },
              payment_method: { 
                bsonType: 'string', 
                enum: ['card', 'upi', 'cod'] 
              },
              payment_status: { 
                bsonType: 'string', 
                enum: ['pending', 'completed', 'failed', 'refunded'] 
              },
              order_status: { 
                bsonType: 'string', 
                enum: ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned'] 
              },
              tracking_number: { bsonType: 'string' },
              stripe_payment_intent_id: { bsonType: 'string' },
              created_at: { bsonType: 'date' },
              updated_at: { bsonType: 'date' }
            }
          }
        },
        indexes: [
          { key: { user_id: 1 } },
          { key: { 'items.product_id': 1 } },
          { key: { order_status: 1 } },
          { key: { created_at: -1 } },
          { key: { stripe_payment_intent_id: 1 }, unique: true, sparse: true }
        ]
      },
      {
        name: 'app_d8d4_carts',
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['user_id', 'updated_at'],
            properties: {
              user_id: { bsonType: 'objectId' },
              items: {
                bsonType: 'array',
                items: {
                  bsonType: 'object',
                  required: ['product_id', 'quantity'],
                  properties: {
                    product_id: { bsonType: 'objectId' },
                    quantity: { bsonType: 'number', minimum: 1 },
                    variant: { bsonType: 'object' }
                  }
                }
              },
              updated_at: { bsonType: 'date' }
            }
          }
        },
        indexes: [
          { key: { user_id: 1 }, unique: true }
        ]
      },
      {
        name: 'app_d8d4_wishlists',
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['user_id', 'updated_at'],
            properties: {
              user_id: { bsonType: 'objectId' },
              product_ids: { 
                bsonType: 'array',
                items: { bsonType: 'objectId' }
              },
              updated_at: { bsonType: 'date' }
            }
          }
        },
        indexes: [
          { key: { user_id: 1 }, unique: true }
        ]
      },
      {
        name: 'app_d8d4_coupons',
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['code', 'discount_type', 'discount_value', 'created_at'],
            properties: {
              code: { bsonType: 'string', pattern: '^[A-Z0-9]{4,10}$' },
              discount_type: { 
                bsonType: 'string', 
                enum: ['percent', 'fixed'] 
              },
              discount_value: { bsonType: 'number', minimum: 0 },
              min_order_value: { bsonType: 'number', minimum: 0 },
              expiry_date: { bsonType: 'date' },
              usage_limit: { bsonType: 'number', minimum: 1 },
              used_count: { bsonType: 'number', minimum: 0, default: 0 },
              created_at: { bsonType: 'date' },
              updated_at: { bsonType: 'date' }
            }
          }
        },
        indexes: [
          { key: { code: 1 }, unique: true },
          { key: { expiry_date: 1 } },
          { key: { used_count: 1 } }
        ]
      },
      {
        name: 'app_d8d4_questions',
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['product_id', 'user_id', 'question', 'created_at'],
            properties: {
              product_id: { bsonType: 'objectId' },
              user_id: { bsonType: 'objectId' },
              question: { bsonType: 'string' },
              answer: { bsonType: 'string' },
              answered_at: { bsonType: 'date' },
              created_at: { bsonType: 'date' },
              updated_at: { bsonType: 'date' }
            }
          }
        },
        indexes: [
          { key: { product_id: 1 } },
          { key: { user_id: 1 } },
          { key: { created_at: -1 } },
          { key: { answered_at: 1 }, sparse: true }
        ]
      },
      {
        name: 'app_d8d4_seller_analytics',
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['seller_id', 'date', 'revenue', 'orders_count'],
            properties: {
              seller_id: { bsonType: 'objectId' },
              date: { bsonType: 'date' },
              revenue: { bsonType: 'number', minimum: 0 },
              orders_count: { bsonType: 'number', minimum: 0 },
              refunds_count: { bsonType: 'number', minimum: 0, default: 0 }
            }
          }
        },
        indexes: [
          { key: { seller_id: 1, date: 1 }, unique: true },
          { key: { date: 1 } }
        ]
      }
    ];

    // Create collections with validation rules
    for (const collectionConfig of collections) {
      try {
        // Check if collection exists
        const collections = await db.listCollections({ name: collectionConfig.name }).toArray();
        
        if (collections.length === 0) {
          // Create collection with validator
          await db.createCollection(collectionConfig.name, {
            validator: collectionConfig.validator
          });
          console.log(`Created collection: ${collectionConfig.name}`);
        } else {
          // Update validator on existing collection
          await db.command({
            collMod: collectionConfig.name,
            validator: collectionConfig.validator
          });
          console.log(`Updated validator for collection: ${collectionConfig.name}`);
        }

        // Create indexes
        const collection = db.collection(collectionConfig.name);
        for (const index of collectionConfig.indexes) {
          try {
            await collection.createIndex(index.key, index);
            console.log(`Created index on ${collectionConfig.name}:`, index.key);
          } catch (indexError) {
            console.warn(`Index creation failed for ${collectionConfig.name}:`, indexError.message);
          }
        }

      } catch (collectionError) {
        console.error(`Failed to process collection ${collectionConfig.name}:`, collectionError.message);
      }
    }

    // Create compound indexes for performance
    await db.collection('app_d8d4_orders').createIndex({ user_id: 1, created_at: -1 });
    await db.collection('app_d8d4_products').createIndex({ category_id: 1, price: 1, created_at: -1 });
    await db.collection('app_d8d4_reviews').createIndex({ product_id: 1, created_at: -1 });
    
    console.log('Database initialization completed successfully');

  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  } finally {
    await client.close();
  }
}

// Run initialization if this file is executed directly
if (require.main === module) {
  initDatabase().catch(console.error);
}

module.exports = { initDatabase };