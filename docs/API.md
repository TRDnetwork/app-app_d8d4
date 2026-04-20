# ShopSphere API Documentation

This document details all API endpoints for the ShopSphere e-commerce platform.

## Authentication

### Register User
- **Endpoint**: `POST /api/auth/register`
- **Description**: Register a new user with email and password
- **Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "User registered successfully. Please check your email to verify your account."
}
```
- **Example**:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

### Login User
- **Endpoint**: `POST /api/auth/login`
- **Description**: Authenticate user and get JWT tokens
- **Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response**:
```json
{
  "success": true,
  "accessToken": "jwt-token",
  "user": {
    "_id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```
- **Example**:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Verify Email
- **Endpoint**: `POST /api/auth/verify-email`
- **Description**: Verify user's email address using verification token
- **Request Body**:
```json
{
  "token": "verification-token"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

### Forgot Password
- **Endpoint**: `POST /api/auth/forgot-password`
- **Description**: Request password reset link
- **Request Body**:
```json
{
  "email": "john@example.com"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "If your email is registered, you will receive a password reset link"
}
```

### Reset Password
- **Endpoint**: `POST /api/auth/reset-password`
- **Description**: Reset password using reset token
- **Request Body**:
```json
{
  "token": "reset-token",
  "password": "new-password123"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

### Refresh Token
- **Endpoint**: `POST /api/auth/refresh`
- **Description**: Refresh JWT access token using refresh token cookie
- **Response**:
```json
{
  "success": true,
  "accessToken": "new-jwt-token",
  "user": {
    "_id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

### Logout User
- **Endpoint**: `POST /api/auth/logout`
- **Description**: Clear refresh token cookie
- **Response**:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Users

### Get Current User Profile
- **Endpoint**: `GET /api/users/me`
- **Description**: Get current authenticated user's profile
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**:
```json
{
  "success": true,
  "user": {
    "_id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "profilePictureUrl": "https://example.com/avatar.jpg",
    "phone": "+1234567890",
    "emailVerified": true
  }
}
```

### Update User Profile
- **Endpoint**: `PUT /api/users/me`
- **Description**: Update current user's profile
- **Headers**: `Authorization: Bearer <access_token>`
- **Request Body**:
```json
{
  "name": "John Smith",
  "phone": "+1987654321"
}
```
- **Response**:
```json
{
  "success": true,
  "user": {
    "_id": "user-id",
    "name": "John Smith",
    "email": "john@example.com",
    "role": "customer",
    "phone": "+1987654321",
    "emailVerified": true
  }
}
```

### Upload Profile Picture
- **Endpoint**: `POST /api/users/me/avatar`
- **Description**: Upload and set user's profile picture
- **Headers**: `Authorization: Bearer <access_token>`
- **Request Body**: `multipart/form-data` with file
- **Response**:
```json
{
  "success": true,
  "user": {
    "_id": "user-id",
    "profilePictureUrl": "https://s3.amazonaws.com/shopsphere-uploads/avatars/user-id.jpg"
  }
}
```

### Get User Addresses
- **Endpoint**: `GET /api/users/me/addresses`
- **Description**: Get all saved addresses for current user
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**:
```json
{
  "success": true,
  "addresses": [
    {
      "_id": "address-id",
      "label": "Home",
      "street": "123 Main St",
      "city": "San Francisco",
      "state": "CA",
      "zip": "94107",
      "country": "USA",
      "is_default": true
    }
  ]
}
```

### Add Address
- **Endpoint**: `POST /api/users/me/addresses`
- **Description**: Add a new address for current user
- **Headers**: `Authorization: Bearer <access_token>`
- **Request Body**:
```json
{
  "label": "Work",
  "street": "456 Market St",
  "city": "San Francisco",
  "state": "CA",
  "zip": "94103",
  "country": "USA",
  "is_default": false
}
```
- **Response**:
```json
{
  "success": true,
  "address": {
    "_id": "new-address-id",
    "label": "Work",
    "street": "456 Market St",
    "city": "San Francisco",
    "state": "CA",
    "zip": "94103",
    "country": "USA",
    "is_default": false
  }
}
```

### Update Address
- **Endpoint**: `PUT /api/users/me/addresses/:id`
- **Description**: Update an existing address
- **Headers**: `Authorization: Bearer <access_token>`
- **Request Body**:
```json
{
  "label": "Work",
  "street": "456 Market St",
  "city": "San Francisco",
  "state": "CA",
  "zip": "94103",
  "country": "USA",
  "is_default": true
}
```
- **Response**:
```json
{
  "success": true,
  "address": {
    "_id": "address-id",
    "label": "Work",
    "street": "456 Market St",
    "city": "San Francisco",
    "state": "CA",
    "zip": "94103",
    "country": "USA",
    "is_default": true
  }
}
```

### Delete Address
- **Endpoint**: `DELETE /api/users/me/addresses/:id`
- **Description**: Delete a saved address
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**:
```json
{
  "success": true,
  "message": "Address deleted successfully"
}
```

## Products

### List Products
- **Endpoint**: `GET /api/products`
- **Description**: Get list of products with filtering and pagination
- **Query Parameters**:
  - `category`: Filter by category
  - `brand`: Filter by brand
  - `min_price`: Minimum price
  - `max_price`: Maximum price
  - `rating`: Minimum rating
  - `sort`: Sort by (price_asc, price_desc, newest, rating)
  - `page`: Page number
  - `limit`: Items per page
- **Response**:
```json
{
  "success": true,
  "products": [
    {
      "_id": "product-id",
      "title": "Wireless Headphones",
      "description": "Premium noise-canceling headphones",
      "category": "Electronics",
      "brand": "SoundMax",
      "price": 199.99,
      "original_price": 299.99,
      "discount_percent": 33,
      "images": ["https://example.com/image1.jpg"],
      "variants": [
        {
          "size": null,
          "color": "Black",
          "sku": "HP-BLK-001",
          "stock": 50
        }
      ],
      "stock_total": 50,
      "status": "active",
      "avg_rating": 4.5,
      "review_count": 124,
      "view_count": 500
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

### Get Product Detail
- **Endpoint**: `GET /api/products/:id`
- **Description**: Get detailed information about a specific product
- **Response**:
```json
{
  "success": true,
  "product": {
    "_id": "product-id",
    "title": "Wireless Headphones",
    "description": "Premium noise-canceling headphones",
    "category": "Electronics",
    "brand": "SoundMax",
    "price": 199.99,
    "original_price": 299.99,
    "discount_percent": 33,
    "images": ["https://example.com/image1.jpg"],
    "variants": [
      {
        "size": null,
        "color": "Black",
        "sku": "HP-BLK-001",
        "stock": 50
      }
    ],
    "stock_total": 50,
    "status": "active",
    "avg_rating": 4.5,
    "review_count": 124,
    "view_count": 500,
    "tags": ["audio", "wireless", "premium"]
  }
}
```

### Get Related Products
- **Endpoint**: `GET /api/products/:id/related`
- **Description**: Get products related to the specified product
- **Response**:
```json
{
  "success": true,
  "products": [
    {
      "_id": "related-product-id",
      "title": "Premium Earbuds",
      "price": 149.99,
      "images": ["https://example.com/earbuds.jpg"],
      "avg_rating": 4.3,
      "review_count": 89
    }
  ]
}
```

### Get Product Questions
- **Endpoint**: `GET /api/products/:id/questions`
- **Description**: Get all questions and answers for a product
- **Response**:
```json
{
  "success": true,
  "questions": [
    {
      "_id": "question-id",
      "question": "Does this come with a carrying case?",
      "answer": "Yes, a soft zippered case is included in the box.",
      "answered_by": "seller-id",
      "answered_at": "2023-01-15T10:30:00Z",
      "created_at": "2023-01-14T15:20:00Z"
    }
  ]
}
```

### Ask Question
- **Endpoint**: `POST /api/products/:id/questions`
- **Description**: Ask a question about a product
- **Headers**: `Authorization: Bearer <access_token>`
- **Request Body**:
```json
{
  "question": "Does this come with a carrying case?"
}
```
- **Response**:
```json
{
  "success": true,
  "question": {
    "_id": "new-question-id",
    "question": "Does this come with a carrying case?",
    "created_at": "2023-01-14T15:20:00Z"
  }
}
```

### Increment View Count
- **Endpoint**: `PUT /api/products/:id/view`
- **Description**: Increment the view count for a product
- **Response**:
```json
{
  "success": true,
  "view_count": 501
}
```

## Cart

### Get Cart
- **Endpoint**: `GET /api/cart`
- **Description**: Get current user's cart
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**:
```json
{
  "success": true,
  "cart": {
    "items": [
      {
        "product_id": "product-id",
        "variant_id": "HP-BLK-001",
        "quantity": 1,
        "price_snapshot": 199.99,
        "product": {
          "title": "Wireless Headphones",
          "images": ["https://example.com/image1.jpg"]
        }
      }
    ],
    "subtotal": 199.99,
    "total_items": 1
  }
}
```

### Add to Cart
- **Endpoint**: `POST /api/cart/items`
- **Description**: Add an item to the cart
- **Headers**: `Authorization: Bearer <access_token>`
- **Request Body**:
```json
{
  "product_id": "product-id",
  "variant_id": "HP-BLK-001",
  "quantity": 1
}
```
- **Response**:
```json
{
  "success": true,
  "cart": {
    "items": [
      {
        "product_id": "product-id",
        "variant_id": "HP-BLK-001",
        "quantity": 1,
        "price_snapshot": 199.99
      }
    ]
  }
}
```

### Update Cart Item
- **Endpoint**: `PUT /api/cart/items/:id`
- **Description**: Update the quantity of a cart item
- **Headers**: `Authorization: Bearer <access_token>`
- **Request Body**:
```json
{
  "quantity": 2
}
```
- **Response**:
```json
{
  "success": true,
  "cart": {
    "items": [
      {
        "product_id": "product-id",
        "variant_id": "HP-BLK-001",
        "quantity": 2,
        "price_snapshot": 199.99
      }
    ]
  }
}
```

### Remove from Cart
- **Endpoint**: `DELETE /api/cart/items/:id`
- **Description**: Remove an item from the cart
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**:
```json
{
  "success": true,
  "cart": {
    "items": []
  }
}
```

### Apply Coupon
- **Endpoint**: `POST /api/cart/apply-coupon`
- **Description**: Apply a coupon code to the cart
- **Headers**: `Authorization: Bearer <access_token>`
- **Request Body**:
```json
{
  "code": "WELCOME10"
}
```
- **Response**:
```json
{
  "success": true,
  "cart": {
    "items": [...],
    "subtotal": 199.99,
    "discount_amount": 19.99,
    "total": 180.00
  }
}
```

## Wishlist

### Get Wishlist
- **Endpoint**: `GET /api/wishlist`
- **Description**: Get current user's wishlist
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**:
```json
{
  "success": true,
  "wishlist": {
    "product_ids": ["product-id-1", "product-id-2"]
  }
}
```

### Add to Wishlist
- **Endpoint**: `POST /api/wishlist/:productId`
- **Description**: Add a product to wishlist
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**:
```json
{
  "success": true,
  "message": "Product added to wishlist"
}
```

### Remove from Wishlist
- **Endpoint**: `DELETE /api/wishlist/:productId`
- **Description**: Remove a product from wishlist
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**:
```json
{
  "success": true,
  "message": "Product removed from wishlist"
}
```

## Orders

### Get Order History
- **Endpoint**: `GET /api/orders`
- **Description**: Get current user's order history
- **Headers**: `Authorization: Bearer <access_token>`
- **Query Parameters**:
  - `status`: Filter by order status
  - `page`: Page number
  - `limit`: Items per page
- **Response**:
```json
{
  "success": true,
  "orders": [
    {
      "_id": "order-id",
      "order_number": "ORD-1001",
      "items": [
        {
          "product_id": "product-id",
          "title": "Wireless Headphones",
          "price": 199.99,
          "quantity": 1,
          "seller_id": "seller-id"
        }
      ],
      "total_amount": 229.98,
      "payment_method": "card",
      "payment_status": "completed",
      "order_status": "delivered",
      "address": {
        "label": "Home",
        "street": "123 Main St",
        "city": "San Francisco",
        "state": "CA",
        "zip": "94107",
        "country": "USA"
      },
      "tracking_number": "TRK123456789",
      "delivered_at": "2023-01-15T10:30:00Z",
      "created_at": "2023-01-10T09:15:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "pages": 1
  }
}
```

### Create Order
- **Endpoint**: `POST /api/orders`
- **Description**: Create a new order from cart
- **Headers**: `Authorization: Bearer <access_token>`
- **Request Body**:
```json
{
  "address_id": "address-id",
  "delivery_speed": "standard",
  "payment_method": "card",
  "coupon_code": "WELCOME10"
}
```
- **Response**:
```json
{
  "success": true,
  "order": {
    "_id": "new-order-id",
    "order_number": "ORD-1002",
    "items": [...],
    "total_amount": 229.98,
    "order_status": "placed",
    "created_at": "2023-01-16T14:20:00Z"
  }
}
```

### Get Order Detail
- **Endpoint**: `GET /api/orders/:id`
- **Description**: Get detailed information about a specific order
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**:
```json
{
  "success": true,
  "order": {
    "_id": "order-id",
    "order_number": "ORD-1001",
    "items": [
      {
        "product_id": "product-id",
        "title": "Wireless Headphones",
        "price": 199.99,
        "quantity": 1,
        "seller_id": "seller-id",
        "product": {
          "images": ["https://example.com/image1.jpg"]
        }
      }
    ],
    "total_amount": 229.98,
    "discount_amount": 19.99,
    "delivery_fee": 5.99,
    "tax_amount": 18.40,
    "payment_method": "card",
    "payment_status": "completed",
    "order_status": "delivered",
    "address": {
      "label": "Home",
      "street": "123 Main St",
      "city": "San Francisco",
      "state": "CA",
      "zip": "94107",
      "country": "USA"
    },
    "tracking_number": "TRK123456789",
    "delivery_speed": "standard",
    "coupon_code": "WELCOME10",
    "delivered_at": "2023-01-15T10:30:00Z",
    "created_at": "2023-01-10T09:15:00Z",
    "updated_at": "2023-01-15T10:30:00Z"
  }
}
```

### Cancel Order
- **Endpoint**: `PUT /api/orders/:id/cancel`
- **Description**: Cancel an order (before dispatch)
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**:
```json
{
  "success": true,
  "order": {
    "_id": "order-id",
    "order_status": "cancelled",
    "cancelled_at": "2023-01-11T11:00:00Z"
  }
}
```

### Request Return
- **Endpoint**: `POST /api/orders/:id/return`
- **Description**: Request a return for an order
- **Headers**: `Authorization: Bearer <access_token>`
- **Request Body**:
```json
{
  "reason": "Item damaged",
  "comments": "Box was crushed during shipping"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Return request submitted successfully"
}
```

## Reviews

### Get Reviews
- **Endpoint**: `GET /api/reviews`
- **Description**: Get reviews for a product
- **Query Parameters**:
  - `product_id`: Product ID
  - `page`: Page number
  - `limit`: Items per page
  - `sort`: Sort by (newest, oldest, helpful)
- **Response**:
```json
{
  "success": true,
  "reviews": [
    {
      "_id": "review-id",
      "product_id": "product-id",
      "user_id": "user-id",
      "rating": 5,
      "title": "Outstanding Sound Quality",
      "comment": "These headphones are amazing!",
      "images": [],
      "helpful_votes": 12,
      "verified_purchase": true,
      "created_at": "2023-01-12T14:30:00Z",
      "user": {
        "name": "John Doe"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 124,
    "pages": 13
  }
}
```

### Create Review
- **Endpoint**: `POST /api/reviews`
- **Description**: Create a review for a product
- **Headers**: `Authorization: Bearer <access_token>`
- **Request Body**:
```json
{
  "product_id": "product-id",
  "order_id": "order-id",
  "rating": 5,
  "title": "Outstanding Sound Quality",
  "comment": "These headphones are amazing!"
}
```
- **Response**:
```json
{
  "success": true,
  "review": {
    "_id": "new-review-id",
    "product_id": "product-id",
    "user_id": "user-id",
    "rating": 5,
    "title": "Outstanding Sound Quality",
    "comment": "These headphones are amazing!",
    "helpful_votes": 0,
    "verified_purchase": true,
    "created_at": "2023-01-12T14:30:00Z"
  }
}
```

### Update Review
- **Endpoint**: `PUT /api/reviews/:id`
- **Description**: Update an existing review
- **Headers**: `Authorization: Bearer <access_token>`
- **Request Body**:
```json
{
  "rating": 5,
  "title": "Outstanding Sound Quality",
  "comment": "These headphones are even better than I thought!"
}
```
- **Response**:
```json
{
  "success": true,
  "review": {
    "_id": "review-id",
    "rating": 5,
    "title": "Outstanding Sound Quality",
    "comment": "These headphones are even better than I thought!",
    "updated_at": "2023-01-13T09:15:00Z"
  }
}
```

### Delete Review
- **Endpoint**: `DELETE /api/reviews/:id`
- **Description**: Delete a review
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**:
```json
{
  "success": true,
  "message": "Review deleted successfully"
}
```

### Mark Review Helpful
- **Endpoint**: `POST /api/reviews/:id/helpful`
- **Description**: Mark a review as helpful
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**:
```json
{
  "success": true,
  "helpful_votes": 13
}
```

## Search

### Search Products
- **Endpoint**: `GET /api/search`
- **Description**: Search products with Algolia/Elasticsearch
- **Query Parameters**:
  - `q`: Search query
  - `category`: Filter by category
  - `brand`: Filter by brand
  - `min_price`: Minimum price
  - `max_price`: Maximum price
  - `rating`: Minimum rating
  - `sort`: Sort by (price_asc, price_desc, newest, rating)
  - `page`: Page number
  - `limit`: Items per page
- **Response**:
```json
{
  "success": true,
  "products": [
    {
      "_id": "product-id",
      "title": "Wireless Headphones",
      "description": "Premium noise-canceling headphones",
      "category": "Electronics",
      "brand": "SoundMax",
      "price": 199.99,
      "original_price": 299.99,
      "discount_percent": 33,
      "images": ["https://example.com/image1.jpg"],
      "avg_rating": 4.5,
      "review_count": 124
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  },
  "query": "wireless headphones",
  "filters": {
    "category": "Electronics"
  }
}
```

### Search Suggestions
- **Endpoint**: `GET /api/search/suggestions`
- **Description**: Get autocomplete suggestions for search
- **Query Parameters**:
  - `q`: Search query
- **Response**:
```json
{
  "success": true,
  "suggestions": [
    "wireless headphones",
    "wireless earbuds",
    "wireless speaker",
    "wireless charger"
  ]
}
```

## Seller Dashboard

### Create Product
- **Endpoint**: `POST /api/seller/products`
- **Description**: Create a new product (seller only)
- **Headers**: `Authorization: Bearer <access_token>`
- **Request Body**:
```json
{
  "title": "Wireless Headphones",
  "description": "Premium noise-canceling headphones",
  "category": "Electronics",
  "brand": "SoundMax",
  "price": 199.99,
  "original_price": 299.99,
  "images": ["https://example.com/image1.jpg"],
  "variants": [
    {
      "size": null,
      "color": "Black",
      "sku": "HP-BLK-001",
      "stock": 50
    }
  ],
  "stock_total": 50,
  "status": "active"
}
```
- **Response**:
```json
{
  "success": true,
  "product": {
    "_id": "new-product-id",
    "title": "Wireless Headphones",
    "description": "Premium noise-canceling headphones",
    "category": "Electronics",
    "brand": "SoundMax",
    "price": 199.99,
    "original_price": 299.99,
    "discount_percent": 33,
    "images": ["https://example.com/image1.jpg"],
    "variants": [
      {
        "size": null,
        "color": "Black",
        "sku": "HP-BLK-001",
        "stock": 50
      }
    ],
    "stock_total": 50,
    "status": "active",
    "avg_rating": 0,
    "review_count": 0,
    "view_count": 0
  }
}
```

### Update Product
- **Endpoint**: `PUT /api/seller/products/:id`
- **Description**: Update an existing product (seller only)
- **Headers**: `Authorization: Bearer <access_token>`
- **Request Body**:
```json
{
  "price": 179.99,
  "variants": [
    {
      "size": null,
      "color": "Black",
      "sku": "HP-BLK-001",
      "stock": 45
    }
  ],
  "stock_total": 45
}
```
- **Response**:
```json
{
  "success": true,
  "product": {
    "_id": "product-id",
    "title": "Wireless Headphones",
    "price": 179.99,
    "variants": [
      {
        "size": null,
        "color": "Black",
        "sku": "HP-BLK-001",
        "stock": 45
      }
    ],
    "stock_total": 45,
    "updated_at": "2023-01-14T16:20:00Z"
  }
}
```

### Archive Product
- **Endpoint**: `DELETE /api/seller/products/:id`
- **Description**: Archive a product (seller only)
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**:
```json
{
  "success": true,
  "message": "Product archived successfully"
}
```

### Get Seller Orders
- **Endpoint**: `GET /api/seller/orders`
- **Description**: Get orders for seller's products
- **Headers**: `Authorization: Bearer <access_token>`
- **Query Parameters**:
  - `status`: Filter by order status
  - `page`: Page number
  - `limit`: Items per page
- **Response**:
```json
{
  "success": true,
  "orders": [
    {
      "_id": "order-id",
      "order_number": "ORD-1001",
      "items": [
        {
          "product_id": "product-id",
          "title": "Wireless Headphones",
          "price": 199.99,
          "quantity": 1,
          "seller_id": "seller-id"
        }
      ],
      "total_amount": 229.98,
      "payment_status": "completed",
      "order_status": "delivered",
      "address": {
        "label": "Home",
        "street": "123 Main St",
        "city": "San Francisco",
        "state": "CA",
        "zip": "94107",
        "country": "USA"
      },
      "tracking_number": "TRK123456789",
      "delivered_at": "2023-01-15T10:30:00Z",
      "created_at": "2023-01-10T09:15:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### Update Order Status
- **Endpoint**: `PUT /api/seller/orders/:id/status`
- **Description**: Update order status (seller only)
- **Headers**: `Authorization: Bearer <access_token>`
- **Request Body**:
```json
{
  "status": "shipped",
  "tracking_number": "TRK987654321"
}
```
- **Response**:
```json
{
  "success": true,
  "order": {
    "_id": "order-id",
    "order_status": "shipped",
    "tracking_number": "TRK987654321",
    "updated_at": "2023-01-11T10:00:00Z"
  }
}
```

### Get Seller Analytics
- **Endpoint**: `GET /api/seller/analytics`
- **Description**: Get sales analytics for seller
- **Headers**: `Authorization: Bearer <access_token>`
- **Query Parameters**:
  - `period`: Time period (day, week, month, year)
  - `start_date`: Start date
  - `end_date`: End date
- **Response**:
```json
{
  "success": true,
  "analytics": {
    "total_sales": 25000,
    "total_orders": 150,
    "average_order_value": 166.67,
    "top_products": [