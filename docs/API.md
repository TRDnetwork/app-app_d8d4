# ShopSphere API Documentation

## Authentication

### Register User
- **Endpoint**: `POST /api/auth/register`
- **Description**: Register a new user with email and password
- **Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```
- **Response**:
```json
{
  "user": {
    "_id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "customer"
  },
  "token": "jwt_token"
}
```
- **Example**:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","name":"John Doe"}'
```

### Login User
- **Endpoint**: `POST /api/auth/login`
- **Description**: Login with email and password
- **Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
- **Response**:
```json
{
  "user": {
    "_id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "customer"
  },
  "token": "jwt_token",
  "refreshToken": "refresh_token"
}
```
- **Example**:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Refresh Token
- **Endpoint**: `POST /api/auth/refresh`
- **Description**: Refresh access token using refresh token
- **Request Body**:
```json
{
  "refreshToken": "refresh_token"
}
```
- **Response**:
```json
{
  "token": "new_jwt_token"
}
```
- **Example**:
```bash
curl -X POST http://localhost:5000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"refresh_token"}'
```

### Verify Email
- **Endpoint**: `POST /api/auth/verify-email`
- **Description**: Verify user email with token
- **Request Body**:
```json
{
  "token": "verification_token"
}
```
- **Response**: `200 OK`
- **Example**:
```bash
curl -X POST http://localhost:5000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{"token":"verification_token"}'
```

### Forgot Password
- **Endpoint**: `POST /api/auth/forgot-password`
- **Description**: Send password reset email
- **Request Body**:
```json
{
  "email": "user@example.com"
}
```
- **Response**: `200 OK`
- **Example**:
```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

### Reset Password
- **Endpoint**: `POST /api/auth/reset-password`
- **Description**: Reset password with token
- **Request Body**:
```json
{
  "token": "reset_token",
  "newPassword": "new_password123"
}
```
- **Response**: `200 OK`
- **Example**:
```bash
curl -X POST http://localhost:5000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"reset_token","newPassword":"new_password123"}'
```

## Users

### Get Profile
- **Endpoint**: `GET /api/users/profile`
- **Description**: Get current user profile
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
```json
{
  "user": {
    "_id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "+1234567890",
    "profile_picture_url": "https://example.com/avatar.jpg",
    "loyalty_points": 250,
    "role": "customer"
  }
}
```
- **Example**:
```bash
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer jwt_token"
```

### Update Profile
- **Endpoint**: `PUT /api/users/profile`
- **Description**: Update user profile
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "name": "John Doe",
  "phone": "+1234567890"
}
```
- **Response**:
```json
{
  "user": {
    "_id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "+1234567890",
    "profile_picture_url": "https://example.com/avatar.jpg",
    "loyalty_points": 250,
    "role": "customer"
  }
}
```
- **Example**:
```bash
curl -X PUT http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer jwt_token" \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","phone":"+1234567890"}'
```

### Upload Profile Picture
- **Endpoint**: `PUT /api/users/profile/picture`
- **Description**: Upload profile picture to S3
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**: `multipart/form-data` with file
- **Response**:
```json
{
  "url": "https://s3.amazonaws.com/shopsphere-uploads/profiles/user_id.jpg"
}
```
- **Example**:
```bash
curl -X PUT http://localhost:5000/api/users/profile/picture \
  -H "Authorization: Bearer jwt_token" \
  -F "file=@/path/to/image.jpg"
```

### List Addresses
- **Endpoint**: `GET /api/users/addresses`
- **Description**: Get user's saved addresses
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
```json
{
  "addresses": [
    {
      "_id": "address_id",
      "type": "home",
      "line1": "123 Main Street",
      "city": "New York",
      "state": "NY",
      "postal_code": "10001",
      "country": "USA",
      "is_default": true
    }
  ]
}
```
- **Example**:
```bash
curl -X GET http://localhost:5000/api/users/addresses \
  -H "Authorization: Bearer jwt_token"
```

### Add Address
- **Endpoint**: `POST /api/users/addresses`
- **Description**: Add new address
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "type": "home",
  "line1": "123 Main Street",
  "city": "New York",
  "state": "NY",
  "postal_code": "10001",
  "country": "USA",
  "is_default": true
}
```
- **Response**:
```json
{
  "address": {
    "_id": "address_id",
    "type": "home",
    "line1": "123 Main Street",
    "city": "New York",
    "state": "NY",
    "postal_code": "10001",
    "country": "USA",
    "is_default": true
  }
}
```
- **Example**:
```bash
curl -X POST http://localhost:5000/api/users/addresses \
  -H "Authorization: Bearer jwt_token" \
  -H "Content-Type: application/json" \
  -d '{"type":"home","line1":"123 Main Street","city":"New York","state":"NY","postal_code":"10001","country":"USA","is_default":true}'
```

### Update Address
- **Endpoint**: `PUT /api/users/addresses/:id`
- **Description**: Update existing address
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "type": "home",
  "line1": "123 Main Street",
  "city": "New York",
  "state": "NY",
  "postal_code": "10001",
  "country": "USA",
  "is_default": true
}
```
- **Response**:
```json
{
  "address": {
    "_id": "address_id",
    "type": "home",
    "line1": "123 Main Street",
    "city": "New York",
    "state": "NY",
    "postal_code": "10001",
    "country": "USA",
    "is_default": true
  }
}
```
- **Example**:
```bash
curl -X PUT http://localhost:5000/api/users/addresses/address_id \
  -H "Authorization: Bearer jwt_token" \
  -H "Content-Type: application/json" \
  -d '{"type":"home","line1":"123 Main Street","city":"New York","state":"NY","postal_code":"10001","country":"USA","is_default":true}'
```

### Delete Address
- **Endpoint**: `DELETE /api/users/addresses/:id`
- **Description**: Delete address
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `204 No Content`
- **Example**:
```bash
curl -X DELETE http://localhost:5000/api/users/addresses/address_id \
  -H "Authorization: Bearer jwt_token"
```

## Products

### List Products
- **Endpoint**: `GET /api/products`
- **Description**: Get list of products with filters and pagination
- **Query Parameters**:
  - `search`: Search term
  - `category`: Category ID
  - `brand`: Brand name
  - `min_price`: Minimum price
  - `max_price`: Maximum price
  - `rating`: Minimum rating
  - `sort`: Sort field (e.g., "price_asc", "price_desc", "created_at_desc")
  - `page`: Page number
  - `limit`: Items per page
- **Response**:
```json
{
  "products": [
    {
      "_id": "product_id",
      "title": "Wireless Headphones",
      "price": 299.99,
      "original_price": 399.99,
      "discount_percent": 25,
      "brand": "SoundMax",
      "images": ["https://example.com/image.jpg"],
      "rating": 4.5,
      "review_count": 127,
      "in_stock": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```
- **Example**:
```bash
curl -X GET "http://localhost:5000/api/products?search=headphones&min_price=100&max_price=500&sort=price_asc&page=1&limit=10"
```

### Get Product Detail
- **Endpoint**: `GET /api/products/:slug`
- **Description**: Get product details by slug
- **Response**:
```json
{
  "product": {
    "_id": "product_id",
    "title": "Wireless Headphones",
    "slug": "wireless-headphones",
    "description": "Premium wireless headphones with active noise cancellation.",
    "category_id": "category_id",
    "brand": "SoundMax",
    "price": 299.99,
    "original_price": 399.99,
    "discount_percent": 25,
    "sku": "SM-HD-001",
    "stock_quantity": 50,
    "images": [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg"
    ],
    "variants": [
      {
        "name": "Color",
        "values": ["Black", "Silver", "Blue"],
        "price_modifier": 0
      }
    ],
    "tags": ["audio", "wireless"],
    "is_featured": true,
    "is_sponsored": true,
    "status": "active",
    "rating": 4.5,
    "review_count": 127,
    "frequently_bought_together": [
      {
        "_id": "product_id",
        "title": "Audio Cable",
        "price": 19.99,
        "image": "https://example.com/image.jpg"
      }
    ],
    "customers_also_viewed": [
      {
        "_id": "product_id",
        "title": "Earbuds",
        "price": 149.99,
        "image": "https://example.com/image.jpg"
      }
    ]
  }
}
```
- **Example**:
```bash
curl -X GET http://localhost:5000/api/products/wireless-headphones
```

### Get Product Reviews
- **Endpoint**: `GET /api/products/:id/reviews`
- **Description**: Get reviews for a product
- **Query Parameters**:
  - `page`: Page number
  - `limit`: Reviews per page
  - `rating`: Filter by rating
- **Response**:
```json
{
  "reviews": [
    {
      "_id": "review_id",
      "user_id": "user_id",
      "rating": 5,
      "title": "Excellent Sound Quality",
      "comment": "These headphones are amazing!",
      "images": ["https://example.com/review_image.jpg"],
      "helpful_votes": 12,
      "verified_purchase": true,
      "created_at": "2024-01-15T10:00:00Z",
      "user": {
        "name": "John Doe",
        "profile_picture_url": "https://example.com/avatar.jpg"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 127,
    "totalPages": 13
  },
  "stats": {
    "average_rating": 4.5,
    "rating_breakdown": {
      "5": 85,
      "4": 30,
      "3": 8,
      "2": 3,
      "1": 1
    },
    "total_reviews": 127,
    "verified_reviews": 112
  }
}
```
- **Example**:
```bash
curl -X GET "http://localhost:5000/api/products/product_id/reviews?page=1&limit=10"
```

### Get Product Q&A
- **Endpoint**: `GET /api/products/:id/questions`
- **Description**: Get questions and answers for a product
- **Query Parameters**:
  - `page`: Page number
  - `limit`: Questions per page
- **Response**:
```json
{
  "questions": [
    {
      "_id": "question_id",
      "user_id": "user_id",
      "question": "Does this work with Android phones?",
      "answer": "Yes, these headphones are compatible with all Bluetooth-enabled devices.",
      "answered_by": "seller_id",
      "created_at": "2024-01-10T09:00:00Z",
      "answered_at": "2024-01-10T10:00:00Z",
      "user": {
        "name": "Jane Smith"
      },
      "answered_by_user": {
        "name": "Seller User"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  }
}
```
- **Example**:
```bash
curl -X GET "http://localhost:5000/api/products/product_id/questions?page=1&limit=10"
```

### Ask Question
- **Endpoint**: `POST /api/products/:id/questions`
- **Description**: Ask a question about a product
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "question": "Does this work with Android phones?"
}
```
- **Response**:
```json
{
  "question": {
    "_id": "question_id",
    "user_id": "user_id",
    "question": "Does this work with Android phones?",
    "created_at": "2024-01-10T09:00:00Z",
    "user": {
      "name": "Jane Smith"
    }
  }
}
```
- **Example**:
```bash
curl -X POST http://localhost:5000/api/products/product_id/questions \
  -H "Authorization: Bearer jwt_token" \
  -H "Content-Type: application/json" \
  -d '{"question":"Does this work with Android phones?"}'
```

### Answer Question
- **Endpoint**: `PUT /api/products/questions/:id/answer`
- **Description**: Answer a product question (seller only)
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "answer": "Yes, these headphones are compatible with all Bluetooth-enabled devices."
}
```
- **Response**:
```json
{
  "question": {
    "_id": "question_id",
    "user_id": "user_id",
    "question": "Does this work with Android phones?",
    "answer": "Yes, these headphones are compatible with all Bluetooth-enabled devices.",
    "answered_by": "seller_id",
    "created_at": "2024-01-10T09:00:00Z",
    "answered_at": "2024-01-10T10:00:00Z",
    "user": {
      "name": "Jane Smith"
    },
    "answered_by_user": {
      "name": "Seller User"
    }
    }
  }
}
```
- **Example**:
```bash
curl -X PUT http://localhost:5000/api/products/questions/question_id/answer \
  -H "Authorization: Bearer jwt_token" \
  -H "Content-Type: application/json" \
  -d '{"answer":"Yes, these headphones are compatible with all Bluetooth-enabled devices."}'
```

### Get Recently Viewed Products
- **Endpoint**: `GET /api/products/recently-viewed`
- **Description**: Get user's recently viewed products
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `limit`: Number of products to return (default: 10)
- **Response**:
```json
{
  "products": [
    {
      "_id": "product_id",
      "title": "Wireless Headphones",
      "price": 299.99,
      "image": "https://example.com/image.jpg",
      "viewed_at": "2024-01-15T10:00:00Z"
    }
  ]
}
```
- **Example**:
```bash
curl -X GET "http://localhost:5000/api/products/recently-viewed?limit=5" \
  -H "Authorization: Bearer jwt_token"
```

### Get Product Recommendations
- **Endpoint**: `GET /api/products/recommendations`
- **Description**: Get AI-powered product recommendations
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `limit`: Number of recommendations (default: 10)
- **Response**:
```json
{
  "recommendations": [
    {
      "_id": "product_id",
      "title": "Wireless Headphones",
      "price": 299.99,
      "image": "https://example.com/image.jpg",
      "reason": "Based on your purchase history"
    }
  ]
}
```
- **Example**:
```bash
curl -X GET "http://localhost:5000/api/products/recommendations?limit=5" \
  -H "Authorization: Bearer jwt_token"
```

### Compare Products
- **Endpoint**: `POST /api/products/compare`
- **Description**: Compare multiple products
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "product_ids": ["product_id_1", "product_id_2", "product_id_3"]
}
```
- **Response**:
```json
{
  "products": [
    {
      "_id": "product_id_1",
      "title": "Wireless Headphones",
      "price": 299.99,
      "brand": "SoundMax",
      "specs": {
        "Battery Life": "30 hours",
        "Noise Cancellation": "Active",
        "Connectivity": "Bluetooth 5.0"
      }
    },
    {
      "_id": "product_id_2",
      "title": "Premium Earbuds",
      "price": 199.99,
      "brand": "AudioPro",
      "specs": {
        "Battery Life": "20 hours",
        "Noise Cancellation": "Active",
        "Connectivity": "Bluetooth 5.2"
      }
    }
  ]
}
```
- **Example**:
```bash
curl -X POST http://localhost:5000/api/products/compare \
  -H "Authorization: Bearer jwt_token" \
  -H "Content-Type: application/json" \
  -d '{"product_ids":["product_id_1","product_id_2"]}'
```

## Categories

### List Categories
- **Endpoint**: `GET /api/categories`
- **Description**: Get list of categories
- **Response**:
```json
{
  "categories": [
    {
      "_id": "category_id",
      "name": "Electronics",
      "slug": "electronics",
      "image_url": "https://example.com/category_image.jpg",
      "order": 1,
      "children": []
    }
  ]
}
```
- **Example**:
```bash
curl -X GET http://localhost:5000/api/categories
```

## Cart

### Get Cart
- **Endpoint**: `GET /api/cart`
- **Description**: Get user's cart
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
```json
{
  "cart": {
    "_id": "cart_id",
    "user_id": "user_id",
    "items": [
      {
        "product_id": "product_id",
        "variant_id": "variant_id",
        "quantity": 1,
        "price_snapshot": 299.99,
        "product": {
          "title": "Wireless Headphones",
          "price": 299.99,
          "image": "https://example.com/image.jpg"
        }
      }
    ],
    "subtotal": 299.99,
    "discount": 0,
    "total": 299.99,
    "coupon": null
  }
}
```
- **Example**:
```bash
curl -X GET http://localhost:5000/api/cart \
  -H "Authorization: Bearer jwt_token"
```

### Add to Cart
- **Endpoint**: `POST /api/cart/items`
- **Description**: Add item to cart
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "product_id": "product_id",
  "variant_id": "variant_id",
  "quantity": 1
}
```
- **Response**:
```json
{
  "cart": {
    "_id": "cart_id",
    "user_id": "user_id",
    "items": [
      {
        "product_id": "product_id",
        "variant_id": "variant_id",
        "quantity": 1,
        "price_snapshot": 299.99,
        "product": {
          "title": "Wireless Headphones",
          "price": 299.99,
          "image": "https://example.com/image.jpg"
        }
      }
    ],
    "subtotal": 299.99,
    "discount": 0,
    "total": 299.99,
    "coupon": null
  }
}
```
- **Example**:
```bash
curl -X POST http://localhost:5000/api/cart/items \
  -H "Authorization: Bearer jwt_token" \
  -H "Content-Type: application/json" \
  -d '{"product_id":"product_id","variant_id":"variant_id","quantity":1}'
```

### Update Cart Item
- **Endpoint**: `PUT /api/cart/items/:id`
- **Description**: Update cart item quantity
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "quantity": 2
}
```
- **Response**:
```json
{
  "cart": {
    "_id": "cart_id",
    "user_id": "user_id",
    "items": [
      {
        "product_id": "product_id",
        "variant_id": "variant_id",
        "quantity": 2,
        "price_snapshot": 299.99,
        "product": {
          "title": "Wireless Headphones",
          "price": 299.99,
          "image": "https://example.com/image.jpg"
        }
      }
    ],
    "subtotal": 599.98,
    "discount": 0,
    "total": 599.98,
    "coupon": null
  }
}
```
- **Example**:
```bash
curl -X PUT http://localhost:5000/api/cart/items/item_id \
  -H "Authorization: Bearer jwt_token" \
  -H "Content-Type: application/json" \
  -d '{"quantity":2}'
```

### Remove from Cart
- **Endpoint**: `DELETE /api/cart/items/:id`
- **Description**: Remove item from cart
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
```json
{
  "cart": {
    "_id": "cart_id",
    "user_id": "user_id",
    "items": [],
    "subtotal": 0,
    "discount": 0,
    "total": 0,
    "coupon": null
  }
}
```
- **Example**:
```bash
curl -X DELETE http://localhost:5000/api/cart/items/item_id \
  -H "Authorization: Bearer jwt_token"
```

### Apply Coupon
- **Endpoint**: `POST /api/cart/apply-coupon`
- **Description**: Apply coupon to cart
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "code": "WELCOME10"
}
```
- **Response**:
```json
{
  "cart": {
    "_id": "cart_id",
    "user_id": "user_id",
    "items": [
      {
        "product_id": "product_id",
        "variant_id": "variant_id",
        "quantity": 1,
        "price_snapshot": 299.99,
        "product": {
          "title": "Wireless Headphones",
          "price": 299.99,
          "image": "https://example.com/image.jpg"
        }
      }
    ],
    "subtotal": 299.99,
    "discount": 29.99,
    "total": 269.99,
    "coupon": {
      "code": "WELCOME10",
      "type": "percentage",
      "value": 10,
      "discount": 29.99
    }
  }
}
```
- **Example**:
```bash
curl -X POST http://localhost:5000/api/cart/apply-coupon \
  -H "Authorization: Bearer jwt_token" \
  -H "Content-Type: application/json" \
  -d '{"code":"WELCOME10"}'
```

## Wishlist

### Get Wishlist
- **Endpoint**: `GET /api/wishlist`
- **Description**: Get user's wishlist
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
```json
{
  "wishlist": [
    {
      "_id": "wishlist_id",
      "product_id": "product_id",
      "added_at": "2024-01-10T09:00:00Z",
      "product": {
        "title": "Organic Cotton T-Shirt",
        "price": 29.99,
        "image": "https://example.com/image.jpg",
        "rating": 4.2
      }
    }
  ]
}
```
- **Example**:
```bash
curl -X GET http://localhost:5000/api/wishlist \
  -H "Authorization: Bearer jwt_token"
```

### Add to Wishlist
- **Endpoint**: `POST /api/wishlist/:product_id`
- **Description**: Add product to wishlist
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
```json
{
  "wishlist": [
    {
      "_id": "wishlist_id",
      "product_id": "product_id",
      "added_at": "2024-01-10T09:00:00Z",
      "product": {
        "title": "Organic Cotton T-Shirt",
        "price": 29.99,
        "image": "https://example.com/image.jpg",
        "rating": 4.2
      }
    }
  ]
}
```
- **Example**:
```bash
curl -X POST http://localhost:5000/api/wishlist/product_id \
  -H "Authorization: Bearer jwt_token"
```

### Remove from Wishlist
- **Endpoint**: `DELETE /api/wishlist/:product_id`
- **Description**: Remove product from wishlist
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `204 No Content`
- **Example**:
```bash
curl -X DELETE http://localhost:5000/api/wishlist/product_id \
  -H "Authorization: Bearer jwt_token"
```

## Orders

### Create Order
- **Endpoint**: `POST /api/orders`
- **Description**: Create order (pre-Stripe checkout)
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "address": {
    "line1": "123 Main Street",
    "city": "New York",
    "state": "NY",
    "postal_code": "10001",
    "country": "USA"
  },
  "delivery_speed": "standard",
  "payment_method": "stripe"
}
```
- **Response**:
```json
{
  "order": {
    "_id": "order_id",
    "order_number": "ORD-12345",
    "items": [
      {
        "product_id": "product_id",
        "seller_id": "seller_id",
        "variant": "Black",
        "quantity": 1,
        "price": 299.99,
        "status": "placed"
      }
    ],
    "address": {
      "line1": "123 Main Street",
      "city": "New York",
      "state": "NY",
      "postal_code": "10001",
      "country": "USA"
    },
    "delivery_speed": "standard",
    "payment_method": "stripe",
    "payment_status": "pending",
    "subtotal": 299.99,
    "discount": 0,
    "delivery_charge": 0,
    "total": 299.99,
    "status": "placed",
    "estimated_delivery": "2024-01-20T00:00:00Z",
    "created_at": "2024-01-15T10:00:00Z"
  }
}
```
- **Example**:
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer jwt_token" \
  -H "Content-Type: application/json" \
  -d '{"address":{"line1":"123 Main Street","city":"New York","state":"NY","postal_code":"10001","country":"USA"},"delivery_speed":"standard","payment_method":"stripe"}'
```

### List Orders
- **Endpoint**: `GET /api/orders`
- **Description**: Get user's order history
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `page`: Page number
  - `limit`: Orders per page
  - `status`: Filter by status (e.g., "delivered", "shipped")
- **Response**:
```json
{
  "orders": [
    {
      "_id": "order_id",
      "order_number": "ORD-12345",
      "items": [
        {
          "product_id": "product_id",
          "seller_id": "seller_id",
          "variant": "Black",
          "quantity": 1,
          "price": 299.99,
          "status": "delivered"
        }
      ],
      "address": {
        "line1": "123 Main Street",
        "city": "New York",
        "state": "NY",
        "postal_code": "10001",
        "country": "USA"
      },
      "delivery_speed": "standard",
      "payment