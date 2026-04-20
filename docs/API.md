# ShopSphere API Documentation

## Authentication

### POST /api/auth/register
Register a new user

**Request**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201)**
```json
{
  "message": "User registered. Please check your email to verify your account."
}
```

### POST /api/auth/verify-email
Verify user email

**Request**
```json
{
  "token": "verification_token_from_email"
}
```

**Response (200)**
```json
{
  "message": "Email verified successfully"
}
```

### POST /api/auth/login
Authenticate user and get tokens

**Request**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200)**
```json
{
  "token": "jwt_access_token",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "profilePictureUrl": "url_to_profile_picture",
    "phone": "1234567890"
  }
}
```

### POST /api/auth/forgot-password
Request password reset

**Request**
```json
{
  "email": "john@example.com"
}
```

**Response (200)**
```json
{
  "message": "Password reset email sent"
}
```

### POST /api/auth/reset-password
Reset password

**Request**
```json
{
  "token": "reset_token_from_email",
  "password": "new_password123"
}
```

**Response (200)**
```json
{
  "message": "Password reset successful"
}
```

### POST /api/auth/refresh-token
Refresh JWT token using refresh token cookie

**Response (200)**
```json
{
  "token": "new_jwt_access_token",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "profilePictureUrl": "url_to_profile_picture",
    "phone": "1234567890"
  }
}
```

### POST /api/auth/logout
Clear refresh token cookie

**Response (200)**
```json
{
  "message": "Logged out successfully"
}
```

## Products

### GET /api/products
Get list of products with optional filters

**Query Parameters**
- `search` - Search term
- `category` - Category ID
- `brand` - Brand name
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `rating` - Minimum rating
- `sort` - Sort order (priceAsc, priceDesc, newest, bestSelling, rating)
- `page` - Page number
- `limit` - Items per page

**Response (200)**
```json
{
  "success": true,
  "products": [
    {
      "_id": "product_id",
      "title": "iPhone 15 Pro",
      "description": "Latest Apple smartphone",
      "brand": "Apple",
      "category_id": "category_id",
      "price": 999,
      "discount_percent": 10,
      "stock": 50,
      "images": [
        "https://example.com/iphone15pro-1.jpg"
      ],
      "tags": ["smartphone", "ios", "camera"],
      "status": "active",
      "created_at": "2023-12-01T00:00:00.000Z",
      "average_rating": 4.8,
      "review_count": 125
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "pages": 10,
    "limit": 10
  }
}
```

### GET /api/products/:id
Get product details

**Response (200)**
```json
{
  "success": true,
  "product": {
    "_id": "product_id",
    "title": "iPhone 15 Pro",
    "description": "Latest Apple smartphone",
    "brand": "Apple",
    "category_id": "category_id",
    "price": 999,
    "discount_percent": 10,
    "stock": 50,
    "images": [
      "https://example.com/iphone15pro-1.jpg"
    ],
    "variants": [
      {
        "size": "6.1\"",
        "color": "Titanium Blue",
        "sku": "IP15P-TB-128",
        "price": 999,
        "stock": 20,
        "image": "https://example.com/iphone15pro-blue.jpg"
      }
    ],
    "tags": ["smartphone", "ios", "camera"],
    "status": "active",
    "created_at": "2023-12-01T00:00:00.000Z",
    "average_rating": 4.8,
    "review_count": 125,
    "reviews": [
      {
        "_id": "review_id",
        "user_id": "user_id",
        "rating": 5,
        "title": "Amazing phone!",
        "comment": "The camera quality is incredible.",
        "images": [],
        "helpful_votes": [],
        "created_at": "2023-12-05T00:00:00.000Z",
        "user_name": "Jane Smith"
      }
    ],
    "questions": [
      {
        "_id": "question_id",
        "user_id": "user_id",
        "question": "Does it come with a charger?",
        "answer": "No, Apple no longer includes chargers in the box.",
        "answered_at": "2023-12-02T00:00:00.000Z",
        "created_at": "2023-12-01T00:00:00.000Z",
        "user_name": "Mike Johnson"
      }
    ],
    "frequently_bought_together": [
      {
        "_id": "product_id",
        "title": "iPhone 15 Pro Case",
        "price": 49.99,
        "image": "https://example.com/case.jpg"
      }
    ],
    "customers_also_viewed": [
      {
        "_id": "product_id",
        "title": "Samsung Galaxy S24",
        "price": 999,
        "image": "https://example.com/samsung.jpg"
      }
    ]
  }
}
```

### POST /api/products
Create a new product (seller only)

**Headers**
```
Authorization: Bearer <jwt_token>
```

**Request**
```json
{
  "title": "iPhone 15 Pro",
  "description": "Latest Apple smartphone",
  "brand": "Apple",
  "category_id": "category_id",
  "price": 999,
  "discount_percent": 10,
  "stock": 50,
  "images": [
    "https://example.com/iphone15pro-1.jpg"
  ],
  "variants": [
    {
      "size": "6.1\"",
      "color": "Titanium Blue",
      "sku": "IP15P-TB-128",
      "price": 999,
      "stock": 20,
      "image": "https://example.com/iphone15pro-blue.jpg"
    }
  ],
  "tags": ["smartphone", "ios", "camera"],
  "status": "active"
}
```

**Response (201)**
```json
{
  "success": true,
  "product": {
    "_id": "product_id",
    "title": "iPhone 15 Pro",
    "description": "Latest Apple smartphone",
    "brand": "Apple",
    "category_id": "category_id",
    "price": 999,
    "discount_percent": 10,
    "stock": 50,
    "images": [
      "https://example.com/iphone15pro-1.jpg"
    ],
    "variants": [
      {
        "size": "6.1\"",
        "color": "Titanium Blue",
        "sku": "IP15P-TB-128",
        "price": 999,
        "stock": 20,
        "image": "https://example.com/iphone15pro-blue.jpg"
      }
    ],
    "tags": ["smartphone", "ios", "camera"],
    "status": "active",
    "created_at": "2023-12-01T00:00:00.000Z"
  }
}
```

### PUT /api/products/:id
Update a product (seller only)

**Headers**
```
Authorization: Bearer <jwt_token>
```

**Request**
```json
{
  "price": 899,
  "stock": 45,
  "status": "active"
}
```

**Response (200)**
```json
{
  "success": true,
  "product": {
    "_id": "product_id",
    "title": "iPhone 15 Pro",
    "description": "Latest Apple smartphone",
    "brand": "Apple",
    "category_id": "category_id",
    "price": 899,
    "discount_percent": 10,
    "stock": 45,
    "images": [
      "https://example.com/iphone15pro-1.jpg"
    ],
    "variants": [
      {
        "size": "6.1\"",
        "color": "Titanium Blue",
        "sku": "IP15P-TB-128",
        "price": 899,
        "stock": 20,
        "image": "https://example.com/iphone15pro-blue.jpg"
      }
    ],
    "tags": ["smartphone", "ios", "camera"],
    "status": "active",
    "created_at": "2023-12-01T00:00:00.000Z",
    "updated_at": "2023-12-02T00:00:00.000Z"
  }
}
```

### DELETE /api/products/:id
Delete a product (seller only)

**Headers**
```
Authorization: Bearer <jwt_token>
```

**Response (200)**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

## Categories

### GET /api/categories
Get all categories

**Response (200)**
```json
{
  "success": true,
  "categories": [
    {
      "_id": "category_id",
      "name": "Electronics",
      "slug": "electronics",
      "parent_id": null,
      "image_url": "https://example.com/electronics.jpg",
      "created_at": "2023-12-01T00:00:00.000Z"
    },
    {
      "_id": "category_id",
      "name": "Smartphones",
      "slug": "smartphones",
      "parent_id": "electronics_category_id",
      "image_url": "https://example.com/smartphones.jpg",
      "created_at": "2023-12-01T00:00:00.000Z"
    }
  ]
}
```

## Reviews

### POST /api/reviews
Create a review

**Headers**
```
Authorization: Bearer <jwt_token>
```

**Request**
```json
{
  "product_id": "product_id",
  "rating": 5,
  "title": "Amazing phone!",
  "comment": "The camera quality is incredible.",
  "images": []
}
```

**Response (201)**
```json
{
  "success": true,
  "review": {
    "_id": "review_id",
    "product_id": "product_id",
    "user_id": "user_id",
    "rating": 5,
    "title": "Amazing phone!",
    "comment": "The camera quality is incredible.",
    "images": [],
    "helpful_votes": [],
    "created_at": "2023-12-05T00:00:00.000Z"
  }
}
```

### GET /api/reviews/:product_id
Get reviews for a product

**Response (200)**
```json
{
  "success": true,
  "reviews": [
    {
      "_id": "review_id",
      "product_id": "product_id",
      "user_id": "user_id",
      "rating": 5,
      "title": "Amazing phone!",
      "comment": "The camera quality is incredible.",
      "images": [],
      "helpful_votes": [],
      "created_at": "2023-12-05T00:00:00.000Z",
      "user_name": "Jane Smith"
    }
  ],
  "pagination": {
    "total": 125,
    "page": 1,
    "pages": 13,
    "limit": 10
  }
}
```

## Cart

### GET /api/cart
Get user's cart

**Headers**
```
Authorization: Bearer <jwt_token>
```

**Response (200)**
```json
{
  "success": true,
  "cart": {
    "_id": "cart_id",
    "user_id": "user_id",
    "items": [
      {
        "product_id": "product_id",
        "quantity": 1,
        "variant": {
          "size": "6.1\"",
          "color": "Titanium Blue"
        },
        "product": {
          "_id": "product_id",
          "title": "iPhone 15 Pro",
          "price": 899,
          "images": [
            "https://example.com/iphone15pro-1.jpg"
          ]
        }
      }
    ],
    "updated_at": "2023-12-05T00:00:00.000Z"
  }
}
```

### POST /api/cart
Add item to cart

**Headers**
```
Authorization: Bearer <jwt_token>
```

**Request**
```json
{
  "product_id": "product_id",
  "quantity": 1,
  "variant": {
    "size": "6.1\"",
    "color": "Titanium Blue"
  }
}
```

**Response (200)**
```json
{
  "success": true,
  "cart": {
    "_id": "cart_id",
    "user_id": "user_id",
    "items": [
      {
        "product_id": "product_id",
        "quantity": 1,
        "variant": {
          "size": "6.1\"",
          "color": "Titanium Blue"
        },
        "product": {
          "_id": "product_id",
          "title": "iPhone 15 Pro",
          "price": 899,
          "images": [
            "https://example.com/iphone15pro-1.jpg"
          ]
        }
      }
    ],
    "updated_at": "2023-12-05T00:00:00.000Z"
  }
}
```

### PUT /api/cart/:product_id
Update cart item quantity

**Headers**
```
Authorization: Bearer <jwt_token>
```

**Request**
```json
{
  "quantity": 2
}
```

**Response (200)**
```json
{
  "success": true,
  "cart": {
    "_id": "cart_id",
    "user_id": "user_id",
    "items": [
      {
        "product_id": "product_id",
        "quantity": 2,
        "variant": {
          "size": "6.1\"",
          "color": "Titanium Blue"
        },
        "product": {
          "_id": "product_id",
          "title": "iPhone 15 Pro",
          "price": 899,
          "images": [
            "https://example.com/iphone15pro-1.jpg"
          ]
        }
      }
    ],
    "updated_at": "2023-12-05T00:00:00.000Z"
  }
}
```

### DELETE /api/cart/:product_id
Remove item from cart

**Headers**
```
Authorization: Bearer <jwt_token>
```

**Response (200)**
```json
{
  "success": true,
  "cart": {
    "_id": "cart_id",
    "user_id": "user_id",
    "items": [],
    "updated_at": "2023-12-05T00:00:00.000Z"
  }
}
```

## Orders

### POST /api/orders
Create a new order

**Headers**
```
Authorization: Bearer <jwt_token>
```

**Request**
```json
{
  "items": [
    {
      "product_id": "product_id",
      "quantity": 1,
      "price": 899
    }
  ],
  "subtotal": 899,
  "tax": 71.92,
  "shipping_cost": 9.99,
  "total": 980.91,
  "address_id": "address_id",
  "payment_method": "card",
  "coupon_code": "WELCOME10"
}
```

**Response (201)**
```json
{
  "success": true,
  "order": {
    "_id": "order_id",
    "user_id": "user_id",
    "items": [
      {
        "product_id": "product_id",
        "title": "iPhone 15 Pro",
        "price": 899,
        "quantity": 1,
        "variant": {
          "size": "6.1\"",
          "color": "Titanium Blue"
        },
        "image": "https://example.com/iphone15pro-1.jpg"
      }
    ],
    "subtotal": 899,
    "tax": 71.92,
    "shipping_cost": 9.99,
    "total": 980.91,
    "address_id": "address_id",
    "payment_method": "card",
    "payment_status": "pending",
    "order_status": "placed",
    "tracking_number": null,
    "stripe_payment_intent_id": "pi_123456789",
    "coupon_code": "WELCOME10",
    "created_at": "2023-12-05T00:00:00.000Z"
  }
}
```

### GET /api/orders/:id
Get order details

**Headers**
```
Authorization: Bearer <jwt_token>
```

**Response (200)**
```json
{
  "success": true,
  "order": {
    "_id": "order_id",
    "user_id": "user_id",
    "items": [
      {
        "product_id": "product_id",
        "title": "iPhone 15 Pro",
        "price": 899,
        "quantity": 1,
        "variant": {
          "size": "6.1\"",
          "color": "Titanium Blue"
        },
        "image": "https://example.com/iphone15pro-1.jpg"
      }
    ],
    "subtotal": 899,
    "tax": 71.92,
    "shipping_cost": 9.99,
    "total": 980.91,
    "address": {
      "address_line1": "123 Main St",
      "address_line2": "Apt 4B",
      "city": "San Francisco",
      "state": "CA",
      "zip": "94107",
      "country": "United States"
    },
    "payment_method": "card",
    "payment_status": "succeeded",
    "order_status": "shipped",
    "tracking_number": "1Z999AA1234567890",
    "stripe_payment_intent_id": "pi_123456789",
    "coupon_code": "WELCOME10",
    "created_at": "2023-12-05T00:00:00.000Z",
    "updated_at": "2023-12-06T00:00:00.000Z"
  }
}
```

### PUT /api/orders/:id/cancel
Cancel an order

**Headers**
```
Authorization: Bearer <jwt_token>
```

**Response (200)**
```json
{
  "success": true,
  "order": {
    "_id": "order_id",
    "user_id": "user_id",
    "items": [
      {
        "product_id": "product_id",
        "title": "iPhone 15 Pro",
        "price": 899,
        "quantity": 1,
        "variant": {
          "size": "6.1\"",
          "color": "Titanium Blue"
        },
        "image": "https://example.com/iphone15pro-1.jpg"
      }
    ],
    "subtotal": 899,
    "tax": 71.92,
    "shipping_cost": 9.99,
    "total": 980.91,
    "address_id": "address_id",
    "payment_method": "card",
    "payment_status": "succeeded",
    "order_status": "cancelled",
    "tracking_number": "1Z999AA1234567890",
    "stripe_payment_intent_id": "pi_123456789",
    "coupon_code": "WELCOME10",
    "created_at": "2023-12-05T00:00:00.000Z",
    "updated_at": "2023-12-07T00:00:00.000Z"
  }
}
```

### PUT /api/orders/:id/return
Request a return

**Headers**
```
Authorization: Bearer <jwt_token>
```

**Request**
```json
{
  "reason": "Defective product",
  "comments": "The screen has a crack."
}
```

**Response (200)**
```json
{
  "success": true,
  "order": {
    "_id": "order_id",
    "user_id": "user_id",
    "items": [
      {
        "product_id": "product_id",
        "title": "iPhone 15 Pro",
        "price": 899,
        "quantity": 1,
        "variant": {
          "size": "6.1\"",
          "color": "Titanium Blue"
        },
        "image": "https://example.com/iphone15pro-1.jpg"
      }
    ],
    "subtotal": 899,
    "tax": 71.92,
    "shipping_cost": 9.99,
    "total": 980.91,
    "address_id": "address_id",
    "payment_method": "card",
    "payment_status": "refunded",
    "order_status": "returned",
    "tracking_number": "1Z999AA1234567890",
    "stripe_payment_intent_id": "pi_123456789",
    "coupon_code": "WELCOME10",
    "created_at": "2023-12-05T00:00:00.000Z",
    "updated_at": "2023-12-10T00:00:00.000Z"
  }
}
```

## Addresses

### GET /api/addresses
Get user's addresses

**Headers**
```
Authorization: Bearer <jwt_token>
```

**Response (200)**
```json
{
  "success": true,
  "addresses": [
    {
      "_id": "address_id",
      "user_id": "user_id",
      "address_line1": "123 Main St",
      "address_line2": "Apt 4B",
      "city": "San Francisco",
      "state": "CA",
      "zip": "94107",
      "country": "United States",
      "is_default": true,
      "created_at": "2023-12-01T00:00:00.000Z"
    }
  ]
}
```

### POST /api/addresses
Create a new address

**Headers**
```
Authorization: Bearer <jwt_token>
```

**Request**
```json
{
  "address_line1": "456 Oak Ave",
  "address_line2": "Suite 200",
  "city": "San Jose",
  "state": "CA",
  "zip": "95110",
  "country": "United States",
  "is_default": false
}
```

**Response (201)**
```json
{
  "success": true,
  "address": {
    "_id": "address_id",
    "user_id": "user_id",
    "address_line1": "456 Oak Ave",
    "address_line2": "Suite 200",
    "city": "San Jose",
    "state": "CA",
    "zip": "95110",
    "country": "United States",
    "is_default": false,
    "created_at": "2023-12-05T00:00:00.000Z"
  }
}
```

### PUT /api/addresses/:id
Update an address

**Headers**
```
Authorization: Bearer <jwt_token>
```

**Request**
```json
{
  "is_default": true
}
```

**Response (200)**
```json
{
  "success": true,
  "address": {
    "_id": "address_id",
    "user_id": "user_id",
    "address_line1": "123 Main St",
    "address_line2": "Apt 4B",
    "city": "San Francisco",
    "state": "CA",
    "zip": "94107",
    "country": "United States",
    "is_default": true,
    "created_at": "2023-12-01T00:00:00.000Z",
    "updated_at": "2023-12-05T00:00:00.000Z"
  }
}
```

### DELETE /api/addresses/:id
Delete an address

**Headers**
```
Authorization: Bearer <jwt_token>
```

**Response (200)**
```json
{
  "success": true,
  "message": "Address deleted successfully"
}
```

## Payments

### POST /api/payment/create-checkout-session
Create a Stripe Checkout session

**Headers**
```
Authorization: Bearer <jwt_token>
```

**Request**
```json
{
  "successUrl": "https://shopsphere.com/order-confirmation",
  "cancelUrl": "https://shopsphere.com/cart"
}
```

**Response (200)**
```json
{
  "id": "cs_test_a123456789"
}
```

### POST /api/payment/webhook
Stripe webhook handler

**Headers**
```
Stripe-Signature: <stripe_signature>
```

**Request**
```json
{
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_test_a123456789",
      "metadata": {
        "userId": "user_id",
        "addressId": "address_id",
        "subtotal": "899.00",
        "shipping": "9.99",
        "tax": "71.92"
      },
      "payment_intent": "pi_123456789"
    }
  }
}
```

**Response (200)**
```json
{
  "received": true
}
```

## Admin

### GET /api/admin/users
Get all users (admin only)

**Headers**
```
Authorization: Bearer <jwt_token>
```

**Response (200)**
```json
{
  "success": true,
  "users": [
    {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer",
      "email_verified": true,
      "created_at": "2023-12-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "pages": 10,
    "limit": 10
  }
}
```

### POST /api/admin/coupons
Create a coupon (admin only)

**Headers**
```
Authorization: Bearer <jwt_token>
```

**Request**
```json
{
  "code": "WELCOME10",
  "discount_type": "percent",
  "discount_value": 10,
  "min_order_value": 50,
  "expiry_date": "2024-12-31T00:00:00.000Z",
  "usage_limit": 100
}
```

**Response (201)**
```json
{
  "success": true,
  "coupon": {
    "_id": "coupon_id",
    "code": "WELCOME10",
    "discount_type": "percent",
    "discount_value": 10,
    "min_order_value": 50,
    "expiry_date": "2024-12-31T00:00:00.000Z",
    "usage_limit": 100,
    "used_count": 0,
    "created_at": "2023-12-05T00:00:00.000Z"
  }
}
```

## Seller

### GET /api/seller/orders
Get seller's orders

**Headers**
```
Authorization: Bearer <jwt_token>
```

**Response (200