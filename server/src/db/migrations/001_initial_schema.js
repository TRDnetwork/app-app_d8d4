/**
 * Migration: 001_initial_schema
 * Creates all base collections with validation rules and indexes
 */

module.exports = {
  version: '001',
  description: 'Create initial collections with schema validation and indexes',

  async up(db, client) {
    const session = client.startSession();
    try {
      await session.withTransaction(async () => {
        // app_d8d4_users
        if (!(await db.listCollections({ name: 'app_d8d4_users' }).hasNext())) {
          await db.createCollection('app_d8d4_users', {
            validator: {
              $jsonSchema: {
                bsonType: 'object',
                required: ['email', 'role', 'created_at'],
                properties: {
                  email: { bsonType: 'string', pattern: '^.+@.+$' },
                  password_hash: { bsonType: 'string' },
                  name: { bsonType: 'string' },
                  role: { enum: ['customer', 'seller', 'admin'] },
                  profile_picture_url: { bsonType: 'string' },
                  phone: { bsonType: 'string' },
                  email_verified: { bsonType: 'bool', default: false },
                  oauth_provider: { enum: ['google', 'facebook'] },
                  oauth_id: { bsonType: 'string' },
                  created_at: { bsonType: 'date' },
                  updated_at: { bsonType: 'date' }
                }
              }
            }
          });

          await db.collection('app_d8d4_users').createIndexes([
            { key: { email: 1 }, unique: true },
            { key: { oauth_provider: 1, oauth_id: 1 }, unique: true },
            { key: { role: 1 } },
            { key: { created_at: 1 } }
          ]);
        }

        // app_d8d4_addresses
        if (!(await db.listCollections({ name: 'app_d8d4_addresses' }).hasNext())) {
          await db.createCollection('app_d8d4_addresses', {
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
                  is_default: { bsonType: 'bool', default: false }
                }
              }
            }
          });

          await db.collection('app_d8d4_addresses').createIndexes([
            { key: { user_id: 1 } },
            { key: { user_id: 1, is_default: 1 } }
          ]);
        }

        // app_d8d4_categories
        if (!(await db.listCollections({ name: 'app_d8d4_categories' }).hasNext())) {
          await db.createCollection('app_d8d4_categories', {
            validator: {
              $jsonSchema: {
                bsonType: 'object',
                required: ['name', 'slug'],
                properties: {
                  name: { bsonType: 'string' },
                  slug: { bsonType: 'string' },
                  parent_id: { bsonType: 'objectId' },
                  image_url: { bsonType: 'string' }
                }
              }
            }
          });

          await db.collection('app_d8d4_categories').createIndexes([
            { key: { slug: 1 }, unique: true },
            { key: { parent_id: 1 } }
          ]);
        }

        // app_d8d4_products
        if (!(await db.listCollections({ name: 'app_d8d4_products' }).hasNext())) {
          await db.createCollection('app_d8d4_products', {
            validator: {
              $jsonSchema: {
                bsonType: 'object',
                required: ['seller_id', 'title', 'price', 'stock', 'created_at'],
                properties: {
                  seller_id: { bsonType: 'objectId' },
                  title: { bsonType: 'string' },
                  description: { bsonType: 'string' },
                  brand: { bsonType: 'string' },
                  category_id: { bsonType: 'objectId' },
                  subcategory_id: { bsonType: 'objectId' },
                  price: { bsonType: 'number', minimum: 0 },
                  discount_percent: { bsonType: 'number', minimum: 0, maximum: 100 },
                  stock: { bsonType: 'number', minimum: 0 },
                  images: {
                    bsonType: 'array',
                    items: { bsonType: 'string' }
                  },
                  variants: {
                    bsonType: 'array',
                    items: {
                      bsonType: 'object',
                      required: ['sku'],
                      properties: {
                        sku: { bsonType: 'string' },
                        size: { bsonType: 'string' },
                        color: { bsonType: 'string' },
                        stock: { bsonType: 'number' }
                      }
                    }
                  },
                  tags: {
                    bsonType: 'array',
                    items: { bsonType: 'string' }
                  },
                  status: { enum: ['active', 'inactive'] },
                  created_at: { bsonType: 'date' },
                  updated_at: { bsonType: 'date' }
                }
              }
            }
          });

          await db.collection('app_d8d4_products').createIndexes([
            { key: { seller_id: 1 } },
            { key: { category_id: 1 } },
            { key: { price: 1 } },
            { key: { created_at: 1 } },
            { key: { status: 1 } },
            { key: { title: 'text', description: 'text', brand: 'text' } }
          ]);
        }

        // app_d8d4_reviews
        if (!(await db.listCollections({ name: 'app_d8d4_reviews' }).hasNext())) {
          await db.createCollection('app_d8d4_reviews', {
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
                  created_at: { bsonType: 'date' }
                }
              }
            }
          });

          await db.collection('app_d8d4_reviews').createIndexes([
            { key: { product_id: 1 } },
            { key: { user_id: 1 } },
            { key: { product_id: 1, user_id: 1 }, unique: true }
          ]);
        }

        // app_d8d4_orders
        if (!(await db.listCollections({ name: 'app_d8d4_orders' }).hasNext())) {
          await db.createCollection('app_d8d4_orders', {
            validator: {
              $jsonSchema: {
                bsonType: 'object',
                required: ['user_id', 'items', 'total', 'order_status', 'created_at'],
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
                  payment_method: { enum: ['card', 'upi', 'cod'] },
                  payment_status: { enum: ['pending', 'completed', 'failed', 'refunded'] },
                  order_status: { 
                    enum: ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned'] 
                  },
                  tracking_number: { bsonType: 'string' },
                  stripe_payment_intent_id: { bsonType: 'string' },
                  created_at: { bsonType: 'date' }
                }
              }
            }
          });

          await db.collection('app_d8d4_orders').createIndexes([
            { key: { user_id: 1 } },
            { key: { order_status: 1 } },
            { key: { created_at: 1 } },
            { key: { stripe_payment_intent_id: 1 } }
          ]);
        }

        // app_d8d4_carts
        if (!(await db.listCollections({ name: 'app_d8d4_carts' }).hasNext())) {
          await db.createCollection('app_d8d4_carts', {
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
            }
          });

          await db.collection('app_d8d4_carts').createIndexes([
            { key: { user_id: 1 }, unique: true }
          ]);
        }

        // app_d8d4_wishlists
        if (!(await db.listCollections({ name: 'app_d8d4_wishlists' }).hasNext())) {
          await db.createCollection('app_d8d4_wishlists', {
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
            }
          });

          await db.collection('app_d8d4_wishlists').createIndexes([
            { key: { user_id: 1 }, unique: true }
          ]);
        }

        // app_d8d4_coupons
        if (!(await db.listCollections({ name: 'app_d8d4_coupons' }).hasNext())) {
          await db.createCollection('app_d8d4_coupons', {
            validator: {
              $jsonSchema: {
                bsonType: 'object',
                required: ['code', 'discount_type', 'discount_value', 'created_at'],
                properties: {
                  code: { bsonType: 'string' },
                  discount_type: { enum: ['percent', 'fixed'] },
                  discount_value: { bsonType: 'number', minimum: 0 },
                  min_order_value: { bsonType: 'number', minimum: 0 },
                  expiry_date: { bsonType: 'date' },
                  usage_limit: { bsonType: 'number', minimum: 1 },
                  used_count: { bsonType: 'number', minimum: 0, default: 0 }
                }
              }
            }
          });

          await db.collection('app_d8d4_coupons').createIndexes([
            { key: { code: 1 }, unique: true },
            { key: { expiry_date: 1 } }
          ]);
        }

        // app_d8d4_questions
        if (!(await db.listCollections({ name: 'app_d8d4_questions' }).hasNext())) {
          await db.createCollection('app_d8d4_questions', {
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
                  created_at: { bsonType: 'date' }
                }
              }
            }
          });

          await db.collection('app_d8d4_questions').createIndexes([
            { key: { product_id: 1 } },
            { key: { user_id: 1 } },
            { key: { created_at: 1 } }
          ]);
        }

        // app_d8d4_seller_analytics
        if (!(await db.listCollections({ name: 'app_d8d4_seller_analytics' }).hasNext())) {
          await db.createCollection('app_d8d4_seller_analytics', {
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
            }
          });

          await db.collection('app_d8d4_seller_analytics').createIndexes([
            { key: { seller_id: 1, date: 1 }, unique: true }
          ]);
        }

        // schema_versions - track applied migrations
        if (!(await db.listCollections({ name: 'schema_versions' }).hasNext())) {
          await db.createCollection('schema_versions');
          await db.collection('schema_versions').createIndex({ version: 1 }, { unique: true });
          await db.collection('schema_versions').insertOne({
            version: '001',
            applied_at: new Date(),
            description: 'Initial schema creation'
          });
        }
      });
    } finally {
      await session.endSession();
    }
  },

  async down(db, client) {
    const session = client.startSession();
    try {
      await session.withTransaction(async () => {
        const collections = [
          'app_d8d4_users',
          'app_d8d4_addresses',
          'app_d8d4_categories',
          'app_d8d4_products',
          'app_d8d4_reviews',
          'app_d8d4_orders',
          'app_d8d4_carts',
          'app_d8d4_wishlists',
          'app_d8d4_coupons',
          'app_d8d4_questions',
          'app_d8d4_seller_analytics',
          'schema_versions'
        ];

        for (const coll of collections) {
          if (await db.listCollections({ name: coll }).hasNext()) {
            await db.collection(coll).drop();
          }
        }
      });
    } finally {
      await session.endSession();
    }
  }
};