// Idempotent MongoDB schema setup with JSON Schema validation
// Migration: Create collections with validation rules
// Down: Drop collections if they exist

// UP
db.getCollectionNames().forEach(function(collectionName) {
  if (collectionName.startsWith("app_d8d4_") && collectionName !== "migration_logs") {
    db[collectionName].drop();
  }
});

// Users Collection with JSON Schema Validation
db.createCollection("app_d8d4_users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "role", "created_at"],
      properties: {
        email: {
          bsonType: "string",
          pattern: "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$",
          description: "Email must be valid and unique."
        },
        password_hash: {
          bsonType: "string",
          minLength: 60,
          description: "Password hash must be present for non-OAuth users."
        },
        name: {
          bsonType: "string",
          minLength: 1,
          maxLength: 100
        },
        phone: {
          bsonType: "string",
          pattern: "^\\+?[1-9]\\d{1,14}$"
        },
        profile_picture_url: {
          bsonType: "string",
          pattern: "^https?://"
        },
        email_verified: {
          bsonType: "bool",
          default: false
        },
        email_verification_token: {
          bsonType: "string"
        },
        password_reset_token: {
          bsonType: "string"
        },
        password_reset_expires: {
          bsonType: "date"
        },
        role: {
          enum: ["customer", "seller", "admin"],
          description: "User role must be one of: customer, seller, admin"
        },
        oauth_provider: {
          enum: ["google", "facebook"]
        },
        oauth_id: {
          bsonType: "string"
        },
        loyalty_points: {
          bsonType: "int",
          minimum: 0,
          default: 0
        },
        created_at: {
          bsonType: "date"
        },
        updated_at: {
          bsonType: "date"
        }
      }
    }
  }
});

// Addresses Collection
db.createCollection("app_d8d4_addresses", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "line1", "city", "state", "postal_code", "country"],
      properties: {
        user_id: {
          bsonType: "objectId"
        },
        type: {
          enum: ["home", "work", "other"]
        },
        line1: {
          bsonType: "string"
        },
        line2: {
          bsonType: "string"
        },
        city: {
          bsonType: "string"
        },
        state: {
          bsonType: "string"
        },
        postal_code: {
          bsonType: "string"
        },
        country: {
          bsonType: "string"
        },
        is_default: {
          bsonType: "bool",
          default: false
        },
        created_at: {
          bsonType: "date"
        }
      }
    }
  }
});

// Categories Collection
db.createCollection("app_d8d4_categories", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "slug", "created_at"],
      properties: {
        name: {
          bsonType: "string"
        },
        slug: {
          bsonType: "string",
          pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$"
        },
        parent_id: {
          bsonType: "objectId"
        },
        image_url: {
          bsonType: "string",
          pattern: "^https?://"
        },
        order: {
          bsonType: "int"
        },
        created_at: {
          bsonType: "date"
        }
      }
    }
  }
});

// Products Collection
db.createCollection("app_d8d4_products", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["seller_id", "title", "slug", "price", "category_id", "status", "created_at"],
      properties: {
        seller_id: {
          bsonType: "objectId"
        },
        title: {
          bsonType: "string"
        },
        slug: {
          bsonType: "string",
          pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$"
        },
        description: {
          bsonType: "string"
        },
        category_id: {
          bsonType: "objectId"
        },
        brand: {
          bsonType: "string"
        },
        price: {
          bsonType: "number",
          minimum: 0
        },
        original_price: {
          bsonType: "number",
          minimum: 0
        },
        discount_percent: {
          bsonType: "number",
          minimum: 0,
          maximum: 100
        },
        sku: {
          bsonType: "string"
        },
        stock_quantity: {
          bsonType: "int",
          minimum: 0
        },
        images: {
          bsonType: "array",
          items: {
            bsonType: "string",
            pattern: "^https?://"
          }
        },
        variants: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["name", "values"],
            properties: {
              name: { bsonType: "string" },
              values: {
                bsonType: "array",
                items: { bsonType: "string" }
              },
              price_modifier: {
                bsonType: "number"
              }
            }
          }
        },
        tags: {
          bsonType: "array",
          items: { bsonType: "string" }
        },
        is_featured: {
          bsonType: "bool"
        },
        is_sponsored: {
          bsonType: "bool"
        },
        status: {
          enum: ["active", "inactive", "out_of_stock"]
        },
        views: {
          bsonType: "int",
          minimum: 0,
          default: 0
        },
        created_at: {
          bsonType: "date"
        },
        updated_at: {
          bsonType: "date"
        }
      }
    }
  }
});

// Reviews Collection
db.createCollection("app_d8d4_reviews", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["product_id", "user_id", "rating", "created_at"],
      properties: {
        product_id: {
          bsonType: "objectId"
        },
        user_id: {
          bsonType: "objectId"
        },
        order_id: {
          bsonType: "objectId"
        },
        rating: {
          bsonType: "number",
          minimum: 1,
          maximum: 5
        },
        title: {
          bsonType: "string"
        },
        comment: {
          bsonType: "string"
        },
        images: {
          bsonType: "array",
          items: {
            bsonType: "string",
            pattern: "^https?://"
          }
        },
        helpful_votes: {
          bsonType: "int",
          minimum: 0,
          default: 0
        },
        verified_purchase: {
          bsonType: "bool",
          default: false
        },
        created_at: {
          bsonType: "date"
        },
        updated_at: {
          bsonType: "date"
        }
      }
    }
  }
});

// Questions Collection
db.createCollection("app_d8d4_questions", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["product_id", "user_id", "question", "created_at"],
      properties: {
        product_id: {
          bsonType: "objectId"
        },
        user_id: {
          bsonType: "objectId"
        },
        question: {
          bsonType: "string"
        },
        answer: {
          bsonType: "string"
        },
        answered_by: {
          bsonType: "objectId"
        },
        created_at: {
          bsonType: "date"
        },
        answered_at: {
          bsonType: "date"
        }
      }
    }
  }
});

// Carts Collection
db.createCollection("app_d8d4_carts", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "items", "updated_at"],
      properties: {
        user_id: {
          bsonType: "objectId"
        },
        items: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["product_id", "quantity", "price_snapshot"],
            properties: {
              product_id: { bsonType: "objectId" },
              variant_id: { bsonType: "string" },
              quantity: {
                bsonType: "int",
                minimum: 1
              },
              price_snapshot: {
                bsonType: "number"
              }
            }
          }
        },
        updated_at: {
          bsonType: "date"
        }
      }
    }
  }
});

// Wishlists Collection
db.createCollection("app_d8d4_wishlists", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "product_id", "added_at"],
      properties: {
        user_id: {
          bsonType: "objectId"
        },
        product_id: {
          bsonType: "objectId"
        },
        added_at: {
          bsonType: "date"
        }
      }
    }
  }
});

// Orders Collection
db.createCollection("app_d8d4_orders", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "order_number", "items", "address", "total", "status", "created_at"],
      properties: {
        user_id: {
          bsonType: "objectId"
        },
        order_number: {
          bsonType: "string",
          pattern: "^[A-Z0-9]{8,}$"
        },
        items: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["product_id", "seller_id", "quantity", "price", "status"],
            properties: {
              product_id: { bsonType: "objectId" },
              seller_id: { bsonType: "objectId" },
              variant: { bsonType: "object" },
              quantity: { bsonType: "int" },
              price: { bsonType: "number" },
              status: {
                enum: ["pending", "confirmed", "shipped", "delivered", "cancelled", "returned"]
              }
            }
          }
        },
        address: {
          bsonType: "object",
          required: ["line1", "city", "state", "postal_code", "country"],
          properties: {
            line1: { bsonType: "string" },
            line2: { bsonType: "string" },
            city: { bsonType: "string" },
            state: { bsonType: "string" },
            postal_code: { bsonType: "string" },
            country: { bsonType: "string" }
          }
        },
        delivery_speed: {
          enum: ["standard", "express", "same_day"]
        },
        payment_method: {
          enum: ["stripe", "upi", "cod"]
        },
        payment_status: {
          enum: ["pending", "completed", "failed", "refunded"]
        },
        stripe_session_id: {
          bsonType: "string"
        },
        stripe_payment_intent_id: {
          bsonType: "string"
        },
        subtotal: {
          bsonType: "number"
        },
        discount: {
          bsonType: "number"
        },
        coupon_code: {
          bsonType: "string"
        },
        delivery_charge: {
          bsonType: "number"
        },
        total: {
          bsonType: "number",
          minimum: 0
        },
        status: {
          enum: ["placed", "confirmed", "shipped", "out_for_delivery", "delivered", "cancelled", "returned"]
        },
        tracking_number: {
          bsonType: "string"
        },
        estimated_delivery: {
          bsonType: "date"
        },
        delivered_at: {
          bsonType: "date"
        },
        created_at: {
          bsonType: "date"
        },
        updated_at: {
          bsonType: "date"
        }
      }
    }
  }
});

// Coupons Collection
db.createCollection("app_d8d4_coupons", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["code", "type", "value", "valid_from", "valid_until", "created_at"],
      properties: {
        code: {
          bsonType: "string",
          pattern: "^[A-Z0-9]{4,}$"
        },
        type: {
          enum: ["percentage", "fixed"]
        },
        value: {
          bsonType: "number",
          minimum: 0
        },
        min_order_value: {
          bsonType: "number",
          minimum: 0
        },
        max_discount: {
          bsonType: "number",
          minimum: 0
        },
        usage_limit: {
          bsonType: "int",
          minimum: 1
        },
        used_count: {
          bsonType: "int",
          minimum: 0,
          default: 0
        },
        valid_from: {
          bsonType: "date"
        },
        valid_until: {
          bsonType: "date"
        },
        is_active: {
          bsonType: "bool",
          default: true
        },
        created_at: {
          bsonType: "date"
        }
      }
    }
  }
});

// Banners Collection
db.createCollection("app_d8d4_banners", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "image_url", "link_url", "order", "created_at"],
      properties: {
        title: {
          bsonType: "string"
        },
        image_url: {
          bsonType: "string",
          pattern: "^https?://"
        },
        link_url: {
          bsonType: "string",
          pattern: "^https?://"
        },
        order: {
          bsonType: "int"
        },
        is_active: {
          bsonType: "bool"
        },
        start_date: {
          bsonType: "date"
        },
        end_date: {
          bsonType: "date"
        },
        created_at: {
          bsonType: "date"
        }
      }
    }
  }
});

// Seller Applications Collection
db.createCollection("app_d8d4_seller_applications", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "business_name", "business_address", "tax_id", "phone", "status", "submitted_at"],
      properties: {
        user_id: {
          bsonType: "objectId"
        },
        business_name: {
          bsonType: "string"
        },
        business_address: {
          bsonType: "string"
        },
        tax_id: {
          bsonType: "string"
        },
        phone: {
          bsonType: "string"
        },
        status: {
          enum: ["pending", "approved", "rejected"]
        },
        rejection_reason: {
          bsonType: "string"
        },
        submitted_at: {
          bsonType: "date"
        },
        reviewed_at: {
          bsonType: "date"
        }
      }
    }
  }
});

// Notifications Collection
db.createCollection("app_d8d4_notifications", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "type", "title", "message", "created_at"],
      properties: {
        user_id: {
          bsonType: "objectId"
        },
        type: {
          enum: ["order_update", "promotion", "system"]
        },
        title: {
          bsonType: "string"
        },
        message: {
          bsonType: "string"
        },
        link: {
          bsonType: "string"
        },
        is_read: {
          bsonType: "bool",
          default: false
        },
        created_at: {
          bsonType: "date"
        }
      }
    }
  }
});

// Product Views Collection
db.createCollection("app_d8d4_product_views", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["product_id", "viewed_at"],
      properties: {
        user_id: {
          bsonType: "objectId"
        },
        product_id: {
          bsonType: "objectId"
        },
        viewed_at: {
          bsonType: "date"
        }
      }
    }
  }
});

// Migration Log Collection
db.createCollection("migration_logs", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["migration_name", "applied_at"],
      properties: {
        migration_name: {
          bsonType: "string"
        },
        applied_at: {
          bsonType: "date"
        }
      }
    }
  }
});

// DOWN
// No down migration — dropping collections handled by idempotent UP script
db.app_d8d4_users.drop();
db.app_d8d4_addresses.drop();
db.app_d8d4_categories.drop();
db.app_d8d4_products.drop();
db.app_d8d4_reviews.drop();
db.app_d8d4_questions.drop();
db.app_d8d4_carts.drop();
db.app_d8d4_wishlists.drop();
db.app_d8d4_orders.drop();
db.app_d8d4_coupons.drop();
db.app_d8d4_banners.drop();
db.app_d8d4_seller_applications.drop();
db.app_d8d4_notifications.drop();
db.app_d8d4_product_views.drop();
db.migration_logs.drop();