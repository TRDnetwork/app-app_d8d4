/**
 * Migration: Add schema validation rules to collections
 * Version: 002
 * Description: Add JSON schema validation to ensure data integrity
 */

module.exports = {
  version: '002',
  description: 'Add schema validation to collections',

  async up(db, client) {
    // Users collection validation
    await db.command({
      collMod: 'app_d8d4_users',
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['email', 'role', 'created_at'],
          properties: {
            email: {
              bsonType: 'string',
              pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
              description: 'Email must be valid and is required'
            },
            password_hash: {
              bsonType: 'string',
              description: 'Password hash is required for non-OAuth users'
            },
            name: {
              bsonType: 'string',
              minLength: 1,
              maxLength: 100,
              description: 'Name must be a string between 1 and 100 characters'
            },
            phone: {
              bsonType: 'string',
              pattern: '^\\+?[1-9]\\d{1,14}$',
              description: 'Phone must be a valid international format'
            },
            profile_picture_url: {
              bsonType: 'string',
              description: 'Profile picture URL must be a valid string'
            },
            email_verified: {
              bsonType: 'bool',
              description: 'Email verification status'
            },
            oauth_provider: {
              bsonType: 'string',
              enum: ['google', 'facebook'],
              description: 'OAuth provider name'
            },
            oauth_id: {
              bsonType: 'string',
              description: 'OAuth provider user ID'
            },
            role: {
              bsonType: 'string',
              enum: ['customer', 'seller', 'admin'],
              description: 'User role must be one of: customer, seller, admin'
            },
            created_at: {
              bsonType: 'date',
              description: 'Creation timestamp is required'
            },
            updated_at: {
              bsonType: 'date',
              description: 'Last update timestamp'
            }
          },
          // Ensure password_hash is present when not using OAuth
          anyOf: [
            { required: ['password_hash'] },
            { required: ['oauth_provider', 'oauth_id'] }
          ]
        }
      },
      validationLevel: 'strict',
      validationAction: 'error'
    });

    // Addresses collection validation
    await db.command({
      collMod: 'app_d8d4_addresses',
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['user_id', 'name', 'phone', 'street', 'city', 'state', 'zip', 'country'],
          properties: {
            user_id: {
              bsonType: 'objectId',
              description: 'Reference to user is required'
            },
            name: {
              bsonType: 'string',
              minLength: 1,
              maxLength: 100,
              description: 'Contact name is required'
            },
            phone: {
              bsonType: 'string',
              pattern: '^\\+?[1-9]\\d{1,14}$',
              description: 'Phone must be valid'
            },
            street: {
              bsonType: 'string',
              minLength: 1,
              maxLength: 200,
              description: 'Street address is required'
            },
            city: {
              bsonType: 'string',
              minLength: 1,
              maxLength: 100,
              description: 'City is required'
            },
            state: {
              bsonType: 'string',
              minLength: 1,
              maxLength: 100,
              description: 'State is required'
            },
            zip: {
              bsonType: 'string',
              pattern: '^[0-9]{5}(?:-[0-9]{4})?$|^[A-Z]{1,2}[0-9][A-Z0-9]?(?: [0-9][A-Z]{2})?$',
              description: 'Valid US or UK postal code'
            },
            country: {
              bsonType: 'string',
              minLength: 2,
              maxLength: 100,
              description: 'Country is required'
            },
            is_default: {
              bsonType: 'bool',
              description: 'Whether this is the default address'
            }
          }
        }
      },
      validationLevel: 'strict',
      validationAction: 'error'
    });

    // Products collection validation
    await db.command({
      collMod: 'app_d8d4_products',
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['seller_id', 'name', 'price', 'category_id', 'status', 'created_at'],
          properties: {
            seller_id: {
              bsonType: 'objectId',
              description: 'Reference to seller is required'
            },
            name: {
              bsonType: 'string',
              minLength: 1,
              maxLength: 200,
              description: 'Product name is required'
            },
            description: {
              bsonType: 'string',
              maxLength: 2000,
              description: 'Product description'
            },
            price: {
              bsonType: 'number',
              minimum: 0,
              description: 'Price must be non-negative'
            },
            original_price: {
              bsonType: 'number',
              minimum: 0,
              description: 'Original price must be non-negative'
            },
            discount_percent: {
              bsonType: 'number',
              minimum: 0,
              maximum: 100,
              description: 'Discount percent must be between 0 and 100'
            },
            category_id: {
              bsonType: 'objectId',
              description: 'Reference to category is required'
            },
            brand: {
              bsonType: 'string',
              maxLength: 100,
              description: 'Brand name'
            },
            images: {
              bsonType: 'array',
              items: {
                bsonType: 'string',
                description: 'Image URL'
              },
              maxItems: 10,
              description: 'Array of image URLs (max 10)'
            },
            variants: {
              bsonType: 'array',
              items: {
                bsonType: 'object',
                required: ['stock'],
                properties: {
                  sku: {
                    bsonType: 'string',
                    maxLength: 50,
                    description: 'Stock keeping unit'
                  },
                  color: {
                    bsonType: 'string',
                    maxLength: 50,
                    description: 'Color option'
                  },
                  size: {
                    bsonType: 'string',
                    maxLength: 50,
                    description: 'Size option'
                  },
                  weight: {
                    bsonType: 'string',
                    maxLength: 50,
                    description: 'Weight option'
                  },
                  stock: {
                    bsonType: 'number',
                    minimum: 0,
                    description: 'Stock quantity must be non-negative'
                  }
                }
              },
              description: 'Product variants'
            },
            stock: {
              bsonType: 'number',
              minimum: 0,
              description: 'Total stock must be non-negative'
            },
            status: {
              bsonType: 'string',
              enum: ['active', 'inactive', 'out_of_stock'],
              description: 'Product status'
            },
            tags: {
              bsonType: 'array',
              items: {
                bsonType: 'string',
                maxLength: 50
              },
              maxItems: 20,
              description: 'Product tags (max 20)'
            },
            ratings_avg: {
              bsonType: 'number',
              minimum: 0,
              maximum: 5,
              description: 'Average rating between 0 and 5'
            },
            ratings_count: {
              bsonType: 'number',
              minimum: 0,
              description: 'Number of ratings must be non-negative'
            },
            views_count: {
              bsonType: 'number',
              minimum: 0,
              description: 'View count must be non-negative'
            },
            created_at: {
              bsonType: 'date',
              description: 'Creation timestamp is required'
            },
            updated_at: {
              bsonType: 'date',
              description: 'Last update timestamp'
            }
          },
          // Ensure original_price >= price when both are present
          // Note: This business rule will be enforced in application code
        }
      },
      validationLevel: 'strict',
      validationAction: 'error'
    });

    // Categories collection validation
    await db.command({
      collMod: 'app_d8d4_categories',
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['name', 'slug', 'created_at'],
          properties: {
            name: {
              bsonType: 'string',
              minLength: 1,
              maxLength: 100,
              description: 'Category name is required'
            },
            slug: {
              bsonType: 'string',
              pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
              description: 'Slug must be lowercase with hyphens'
            },
            parent_id: {
              bsonType: 'objectId',
              description: 'Reference to parent category'
            },
            image_url: {
              bsonType: 'string',
              description: 'Category image URL'
            },
            order: {
              bsonType: 'number',
              minimum: 0,
              description: 'Display order must be non-negative'
            },
            created_at: {
              bsonType: 'date',
              description: 'Creation timestamp is required'
            }
          }
        }
      },
      validationLevel: 'strict',
      validationAction: 'error'
    });

    // Reviews collection validation
    await db.command({
      collMod: 'app_d8d4_reviews',
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['product_id', 'user_id', 'rating', 'created_at'],
          properties: {
            product_id: {
              bsonType: 'objectId',
              description: 'Reference to product is required'
            },
            user_id: {
              bsonType: 'objectId',
              description: 'Reference to user is required'
            },
            order_id: {
              bsonType: 'objectId',
              description: 'Reference to order (for verified purchases)'
            },
            rating: {
              bsonType: 'number',
              minimum: 1,
              maximum: 5,
              description: 'Rating must be between 1 and 5'
            },
            title: {
              bsonType: 'string',
              maxLength: 100,
              description: 'Review title'
            },
            comment: {
              bsonType: 'string',
              maxLength: 1000,
              description: 'Review comment'
            },
            images: {
              bsonType: 'array',
              items: {
                bsonType: 'string'
              },
              maxItems: 5,
              description: 'Review images (max 5)'
            },
            helpful_votes: {
              bsonType: 'number',
              minimum: 0,
              description: 'Helpful votes must be non-negative'
            },
            verified_purchase: {
              bsonType: 'bool',
              description: 'Whether this is a verified purchase'
            },
            created_at: {
              bsonType: 'date',
              description: 'Creation timestamp is required'
            },
            updated_at: {
              bsonType: 'date',
              description: 'Last update timestamp'
            }
          }
        }
      },
      validationLevel: 'strict',
      validationAction: 'error'
    });

    // Questions collection validation
    await db.command({
      collMod: 'app_d8d4_questions',
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['product_id', 'user_id', 'question', 'created_at'],
          properties: {
            product_id: {
              bsonType: 'objectId',
              description: 'Reference to product is required'
            },
            user_id: {
              bsonType: 'objectId',
              description: 'Reference to user is required'
            },
            question: {
              bsonType: 'string',
              minLength: 1,
              maxLength: 500,
              description: 'Question text is required'
            },
            answer: {
              bsonType: 'string',
              maxLength: 1000,
              description: 'Answer text'
            },
            answered_by: {
              bsonType: 'objectId',
              description: 'Reference to user who answered'
            },
            created_at: {
              bsonType: 'date',
              description: 'Creation timestamp is required'
            },
            answered_at: {
              bsonType: 'date',
              description: 'Answer timestamp'
            }
          },
          // If answer is provided, answered_by and answered_at must be present
          anyOf: [
            { required: ['answer'] },
            { not: { required: ['answered_by', 'answered_at'] } }
          ]
        }
      },
      validationLevel: 'strict',
      validationAction: 'error'
    });

    // Carts collection validation
    await db.command({
      collMod: 'app_d8d4_carts',
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['user_id', 'items', 'updated_at'],
          properties: {
            user_id: {
              bsonType: 'objectId',
              description: 'Reference to user is required'
            },
            items: {
              bsonType: 'array',
              items: {
                bsonType: 'object',
                required: ['product_id', 'quantity', 'added_at'],
                properties: {
                  product_id: {
                    bsonType: 'objectId',
                    description: 'Reference to product'
                  },
                  variant_id: {
                    bsonType: 'objectId',
                    description: 'Reference to product variant'
                  },
                  quantity: {
                    bsonType: 'number',
                    minimum: 1,
                    description: 'Quantity must be at least 1'
                  },
                  added_at: {
                    bsonType: 'date',
                    description: 'When item was added to cart'
                  }
                }
              },
              description: 'Cart items'
            },
            saved_for_later: {
              bsonType: 'array',
              items: {
                bsonType: 'object',
                required: ['product_id', 'saved_at'],
                properties: {
                  product_id: {
                    bsonType: 'objectId',
                    description: 'Reference to product'
                  },
                  variant_id: {
                    bsonType: 'objectId',
                    description: 'Reference to product variant'
                  },
                  saved_at: {
                    bsonType: 'date',
                    description: 'When item was saved'
                  }
                }
              },
              description: 'Items saved for later'
            },
            updated_at: {
              bsonType: 'date',
              description: 'Last update timestamp is required'
            }
          }
        }
      },
      validationLevel: 'strict',
      validationAction: 'error'
    });

    // Orders collection validation
    await db.command({
      collMod: 'app_d8d4_orders',
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['user_id', 'order_number', 'items', 'subtotal', 'total', 'shipping_address', 'payment_method', 'status', 'created_at'],
          properties: {
            user_id: {
              bsonType: 'objectId',
              description: 'Reference to user is required'
            },
            order_number: {
              bsonType: 'string',
              pattern: '^[A-Z0-9]{8,}$',
              description: 'Order number must be unique and at least 8 characters'
            },
            items: {
              bsonType: 'array',
              items: {
                bsonType: 'object',
                required: ['product_id', 'name', 'price', 'quantity'],
                properties: {
                  product_id: {
                    bsonType: 'objectId',
                    description: 'Reference to product'
                  },
                  variant_id: {
                    bsonType: 'objectId',
                    description: 'Reference to product variant'
                  },
                  name: {
                    bsonType: 'string',
                    description: 'Product name at time of purchase'
                  },
                  price: {
                    bsonType: 'number',
                    minimum: 0,
                    description: 'Price at time of purchase'
                  },
                  quantity: {
                    bsonType: 'number',
                    minimum: 1,
                    description: 'Quantity must be at least 1'
                  },
                  image: {
                    bsonType: 'string',
                    description: 'Product image at time of purchase'
                  }
                }
              },
              description: 'Order items'
            },
            subtotal: {
              bsonType: 'number',
              minimum: 0,
              description: 'Subtotal must be non-negative'
            },
            shipping_fee: {
              bsonType: 'number',
              minimum: 0,
              description: 'Shipping fee must be non-negative'
            },
            tax: {
              bsonType: 'number',
              minimum: 0,
              description: 'Tax amount must be non-negative'
            },
            discount: {
              bsonType: 'number',
              minimum: 0,
              description: 'Discount amount must be non-negative'
            },
            total: {
              bsonType: 'number',
              minimum: 0,
              description: 'Total amount must be non-negative'
            },
            coupon_code: {
              bsonType: 'string',
              description: 'Applied coupon code'
            },
            shipping_address: {
              bsonType: 'object',
              required: ['name', 'phone', 'street', 'city', 'state', 'zip', 'country'],
              properties: {
                name: {
                  bsonType: 'string',
                  description: 'Contact name'
                },
                phone: {
                  bsonType: 'string',
                  description: 'Contact phone'
                },
                street: {
                  bsonType: 'string',
                  description: 'Street address'
                },
                city: {
                  bsonType: 'string',
                  description: 'City'
                },
                state: {
                  bsonType: 'string',
                  description: 'State'
                },
                zip: {
                  bsonType: 'string',
                  description: 'Postal code'
                },
                country: {
                  bsonType: 'string',
                  description: 'Country'
                }
              },
              description: 'Shipping address at time of purchase'
            },
            delivery_speed: {
              bsonType: 'string',
              enum: ['standard', 'express', 'same_day'],
              description: 'Delivery speed option'
            },
            payment_method: {
              bsonType: 'string',
              description: 'Payment method used'
            },
            payment_status: {
              bsonType: 'string',
              enum: ['pending', 'completed', 'failed', 'refunded'],
              description: 'Payment status'
            },
            stripe_session_id: {
              bsonType: 'string',
              description: 'Stripe checkout session ID'
            },
            status: {
              bsonType: 'string',
              enum: ['placed', 'confirmed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'],
              description: 'Order status'
            },
            tracking_number: {
              bsonType: 'string',
              description: 'Shipping tracking number'
            },
            status_history: {
              bsonType: 'array',
              items: {
                bsonType: 'object',
                required: ['status', 'timestamp'],
                properties: {
                  status: {
                    bsonType: 'string',
                    enum: ['placed', 'confirmed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'],
                    description: 'Order status'
                  },
                  timestamp: {
                    bsonType: 'date',
                    description: 'When status was set'
                  }
                }
              },
              description: 'Order status history'
            },
            created_at: {
              bsonType: 'date',
              description: 'Creation timestamp is required'
            },
            updated_at: {
              bsonType: 'date',
              description: 'Last update timestamp'
            }
          }
        }
      },
      validationLevel: 'strict',
      validationAction: 'error'
    });

    // Wishlists collection validation
    await db.command({
      collMod: 'app_d8d4_wishlists',
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['user_id', 'product_id', 'added_at'],
          properties: {
            user_id: {
              bsonType: 'objectId',
              description: 'Reference to user is required'
            },
            product_id: {
              bsonType: 'objectId',
              description: 'Reference to product is required'
            },
            added_at: {
              bsonType: 'date',
              description: 'When product was added to wishlist is required'
            }
          }
        }
      },
      validationLevel: 'strict',
      validationAction: 'error'
    });

    // View history collection validation
    await db.command({
      collMod: 'app_d8d4_view_history',
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['user_id', 'product_id', 'viewed_at'],
          properties: {
            user_id: {
              bsonType: 'objectId',
              description: 'Reference to user is required'
            },
            product_id: {
              bsonType: 'objectId',
              description: 'Reference to product is required'
            },
            viewed_at: {
              bsonType: 'date',
              description: 'When product was viewed is required'
            }
          }
        }
      },
      validationLevel: 'strict',
      validationAction: 'error'
    });

    // Coupons collection validation
    await db.command({
      collMod: 'app_d8d4_coupons',
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['code', 'discount_type', 'discount_value', 'valid_from', 'valid_until', 'status'],
          properties: {
            code: {
              bsonType: 'string',
              pattern: '^[A-Z0-9]{4,}$',
              description: 'Coupon code must be uppercase alphanumeric'
            },
            discount_type: {
              bsonType: 'string',
              enum: ['percentage', 'fixed'],
              description: 'Discount type must be percentage or fixed'
            },
            discount_value: {
              bsonType: 'number',
              minimum: 0,
              description: 'Discount value must be non-negative'
            },
            min_order_value: {
              bsonType: 'number',
              minimum: 0,
              description: 'Minimum order value must be non-negative'
            },
            max_uses: {
              bsonType: 'number',
              minimum: 1,
              description: 'Maximum uses must be at least 1'
            },
            used_count: {
              bsonType: 'number',
              minimum: 0,
              description: 'Used count must be non-negative'
            },
            valid_from: {
              bsonType: 'date',
              description: 'Validity start date is required'
            },
            valid_until: {
              bsonType: 'date',
              description: 'Validity end date is required'
            },
            status: {
              bsonType: 'string',
              enum: ['active', 'inactive'],
              description: 'Coupon status'
            }
          },
          // Ensure valid_from <= valid_until
          // Note: This business rule will be enforced in application code
        }
      },
      validationLevel: 'strict',
      validationAction: 'error'
    });

    // Banners collection validation
    await db.command({
      collMod: 'app_d8d4_banners',
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['title', 'image_url', 'link_url', 'position', 'order', 'status', 'created_at'],
          properties: {
            title: {
              bsonType: 'string',
              minLength: 1,
              maxLength: 100,
              description: 'Banner title is required'
            },
            image_url: {
              bsonType: 'string',
              description: 'Banner image URL is required'
            },
            link_url: {
              bsonType: 'string',
              description: 'Banner link URL is required'
            },
            position