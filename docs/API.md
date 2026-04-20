# ShopSphere API Documentation

This document provides comprehensive details of all API endpoints available in the ShopSphere e-commerce platform. The API follows REST conventions and uses JSON for request and response bodies.

## Authentication

All protected endpoints require a valid JWT token in the Authorization header or as an HTTP-only cookie.

### Token Format
```
Authorization: Bearer <token>
```

## Authentication Endpoints

### Register User
Create a new user account.

- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Access**: Public
- **Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
- **Success Response**:
```json
{
  "success": true,
  "message": "User registered. Please check your email to verify your account."
}
```
- **Error Responses**:
  - `400 Bad Request`: User already exists
  - `500 Internal Server Error`: Email could not be sent

### Verify Email
Verify a user's email address using a verification token.

- **URL**: `/api/auth/verify-email`
- **Method**: `POST`
- **Access**: Public
- **Request Body**:
```json
{
  "token": "verification_token_here"
}
```
- **Success Response**:
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```
- **Error Responses**:
  - `400 Bad Request`: Invalid or expired token

### Login User
Authenticate a user and receive JWT tokens.

- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Access**: Public
- **Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Success Response**:
```json
{
  "success": true,
  "token": "jwt_access_token",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "profilePictureUrl": null,
    "phone": null
  }
}
```
- **Error Responses**:
  - `401 Unauthorized`: Invalid email or password
  - `401 Unauthorized`: Email not verified

### Refresh Token
Refresh an expired JWT access token using a refresh token cookie.

- **URL**: `/api/auth/refresh-token`
- **Method**: `POST`
- **Access**: Public (requires refresh token cookie)
- **Success Response**:
```json
{
  "success": true,
  "token": "new_jwt_access_token",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "profilePictureUrl": null,
    "phone": null
  }
}
```
- **Error Responses**:
  - `401 Unauthorized`: No refresh token
  - `401 Unauthorized`: Invalid refresh token

### Logout User
Clear the refresh token cookie.

- **URL**: `/api/auth/logout`
- **Method**: `POST`
- **Access**: Private
- **Success Response**:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Forgot Password
Request a password reset link.

- **URL**: `/api/auth/forgot-password`
- **Method**: `POST`
- **Access**: Public
- **Request Body**:
```json
{
  "email": "john@example.com"
}
```
- **Success Response**:
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```
- **Error Responses**:
  - `404 Not Found`: User not found
  - `500 Internal Server Error`: Email could not be sent

### Reset Password
Reset a user's password using a reset token.

- **URL**: `/api/auth/reset-password`
- **Method**: `POST`
- **Access**: Public
- **Request Body**:
```json
{
  "token": "reset_token_here",
  "password": "new_password123"
}
```
- **Success Response**:
```json
{
  "success": true,
  "message": "Password reset successful"
}
```
- **Error Responses**:
  - `400 Bad Request`: Invalid or expired token

## OAuth Endpoints

### Google OAuth Login
Initiate Google OAuth login flow.

- **URL**: `/api/auth/oauth/google`
- **Method**: `GET`
- **Access**: Public
- **Redirects to**: Google OAuth consent screen

### Google OAuth Callback
Handle Google OAuth callback.

- **URL**: `/api/auth/oauth/google/callback`
- **Method**: `GET`
- **Access**: Google OAuth
- **Redirects to**: Frontend with token query parameter

### Facebook OAuth Login
Initiate Facebook OAuth login flow.

- **URL**: `/api/auth/oauth/facebook`
- **Method**: `GET`
- **Access**: Public
- **Redirects to**: Facebook OAuth consent screen

### Facebook OAuth Callback
Handle Facebook OAuth callback.

- **URL**: `/api/auth/oauth/facebook/callback`
- **Method**: `GET`
- **Access**: Facebook OAuth
- **Redirects to**: Frontend with token query parameter

## Product Endpoints

### List Products
Get a list of products with optional filtering and sorting.

- **URL**: `/api/products`
- **Method**: `GET`
- **Access**: Public
- **Query Parameters**:
  - `category`: Filter by category ID
  - `brand`: Filter by brand
  - `minPrice`: Minimum price
  - `maxPrice`: Maximum price
  - `rating`: Minimum rating
  - `sort`: Sort by (priceLowToHigh, priceHighToLow, newest, bestSeller, avgRating)
  - `page`: Page number
  - `limit`: Items per page
- **Success Response**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "product_id",
      "seller_id": "seller_id",
      "title": "Product Title",
      "description": "Product description",
      "brand": "Brand Name",
      "category_id": "category_id",
      "price": 99.99,
      "discount_percent": 10,
      "stock": 50,
      "images": ["image_url_1", "image_url_2"],
      "variants": [
        {
          "sku": "SKU001",
          "size": "Large",
          "color": "Blue",
          "stock": 25
        }
      ],
      "tags": ["tag1", "tag2"],
      "status": "active",
      "created_at": "2023-01-01T00:00:00.000Z",
      "updated_at": "2023-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalProducts": 100,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Get Product Details
Get detailed information about a specific product.

- **URL**: `/api/products/:id`
- **Method**: `GET`
- **Access**: Public
- **Success Response**:
```json
{
  "success": true,
  "data": {
    "_id": "product_id",
    "seller_id": "seller_id",
    "title": "Product Title",
    "description": "Product description",
    "brand": "Brand Name",
    "category_id": "category_id",
    "price": 99.99,
    "discount_percent": 10,
    "stock": 50,
    "images": ["image_url_1", "image_url_2"],
    "variants": [
      {
        "sku": "SKU001",
        "size": "Large",
        "color": "Blue",
        "stock": 25
      }
    ],
    "tags": ["tag1", "tag2"],
    "status": "active",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z",
    "seller": {
      "_id": "seller_id",
      "name": "Seller Name",
      "profilePictureUrl": "seller_image_url"
    },
    "averageRating": 4.5,
    "totalReviews": 124,
    "frequentlyBoughtTogether": [
      {
        "_id": "product_id_2",
        "title": "Related Product",
        "price": 49.99,
        "image": "related_product_image_url"
      }
    ],
    "customersAlsoViewed": [
      {
        "_id": "product_id_3",
        "title": "Similar Product",
        "price": 79.99,
        "image": "similar_product_image_url"
      }
    ]
  }
}
```
- **Error Responses**:
  - `404 Not Found`: Product not found

### Create Product
Create a new product (seller only).

- **URL**: `/api/products`
- **Method**: `POST`
- **Access**: Private (seller role)
- **Request Body**:
```json
{
  "title": "Product Title",
  "description": "Product description",
  "brand": "Brand Name",
  "category_id": "category_id",
  "price": 99.99,
  "discount_percent": 10,
  "stock": 50,
  "images": ["image_url_1", "image_url_2"],
  "variants": [
    {
      "sku": "SKU001",
      "size": "Large",
      "color": "Blue",
      "stock": 25
    }
  ],
  "tags": ["tag1", "tag2"]
}
```
- **Success Response**:
```json
{
  "success": true,
  "data": {
    "_id": "new_product_id",
    "seller_id": "seller_id",
    "title": "Product Title",
    "description": "Product description",
    "brand": "Brand Name",
    "category_id": "category_id",
    "price": 99.99,
    "discount_percent": 10,
    "stock": 50,
    "images": ["image_url_1", "image_url_2"],
    "variants": [
      {
        "sku": "SKU001",
        "size": "Large",
        "color": "Blue",
        "stock": 25
      }
    ],
    "tags": ["tag1", "tag2"],
    "status": "active",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  }
}
```
- **Error Responses**:
  - `400 Bad Request`: Validation errors
  - `403 Forbidden`: Insufficient permissions

### Update Product
Update an existing product (seller only).

- **URL**: `/api/products/:id`
- **Method**: `PUT`
- **Access**: Private (seller role, must own product)
- **Request Body**:
```json
{
  "title": "Updated Product Title",
  "price": 89.99,
  "stock": 45
}
```
- **Success Response**:
```json
{
  "success": true,
  "data": {
    "_id": "product_id",
    "seller_id": "seller_id",
    "title": "Updated Product Title",
    "description": "Product description",
    "brand": "Brand Name",
    "category_id": "category_id",
    "price": 89.99,
    "discount_percent": 10,
    "stock": 45,
    "images": ["image_url_1", "image_url_2"],
    "variants": [
      {
        "sku": "SKU001",
        "size": "Large",
        "color": "Blue",
        "stock": 25
      }
    ],
    "tags": ["tag1", "tag2"],
    "status": "active",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-02T00:00:00.000Z"
  }
}
```
- **Error Responses**:
  - `400 Bad Request`: Validation errors
  - `403 Forbidden`: Insufficient permissions
  - `404 Not Found`: Product not found

### Delete Product
Delete a product (seller only).

- **URL**: `/api/products/:id`
- **Method**: `DELETE`
- **Access**: Private (seller role, must own product)
- **Success Response**:
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```
- **Error Responses**:
  - `403 Forbidden`: Insufficient permissions
  - `404 Not Found`: Product not found

## Category Endpoints

### List Categories
Get all categories.

- **URL**: `/api/categories`
- **Method**: `GET`
- **Access**: Public
- **Success Response**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "category_id",
      "name": "Electronics",
      "slug": "electronics",
      "parent_id": null,
      "image_url": "category_image_url",
      "created_at": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

## Cart Endpoints

### Get Cart
Get the authenticated user's cart.

- **URL**: `/api/cart`
- **Method**: `GET`
- **Access**: Private
- **Success Response**:
```json
{
  "success": true,
  "data": {
    "_id": "cart_id",
    "user_id": "user_id",
    "items": [
      {
        "product_id": {
          "_id": "product_id",
          "title": "Product Title",
          "price": 99.99,
          "discount_percent": 10,
          "images": ["product_image_url"]
        },
        "quantity": 2,
        "variant": {
          "size": "Large",
          "color": "Blue"
        }
      }
    ],
    "updated_at": "2023-01-01T00:00:00.000Z"
  }
}
```

### Add to Cart
Add an item to the cart.

- **URL**: `/api/cart`
- **Method**: `POST`
- **Access**: Private
- **Request Body**:
```json
{
  "product_id": "product_id",
  "quantity": 2,
  "variant": {
    "size": "Large",
    "color": "Blue"
  }
}
```
- **Success Response**:
```json
{
  "success": true,
  "data": {
    "_id": "cart_id",
    "user_id": "user_id",
    "items": [
      {
        "product_id": {
          "_id": "product_id",
          "title": "Product Title",
          "price": 99.99,
          "discount_percent": 10,
          "images": ["product_image_url"]
        },
        "quantity": 2,
        "variant": {
          "size": "Large",
          "color": "Blue"
        }
      }
    ],
    "updated_at": "2023-01-01T00:00:00.000Z"
  }
}
```
- **Error Responses**:
  - `400 Bad Request`: Product not found or out of stock

### Remove from Cart
Remove an item from the cart.

- **URL**: `/api/cart/:itemId`
- **Method**: `DELETE`
- **Access**: Private
- **Success Response**:
```json
{
  "success": true,
  "data": {
    "_id": "cart_id",
    "user_id": "user_id",
    "items": [],
    "updated_at": "2023-01-01T00:00:00.000Z"
  }
}
```

## Order Endpoints

### Place Order
Create a new order from the cart.

- **URL**: `/api/orders`
- **Method**: `POST`
- **Access**: Private
- **Request Body**:
```json
{
  "address_id": "address_id",
  "delivery_method": "standard",
  "payment_method": "card",
  "coupon_code": "DISCOUNT10"
}
```
- **Success Response**:
```json
{
  "success": true,
  "data": {
    "_id": "order_id",
    "user_id": "user_id",
    "items": [
      {
        "product_id": "product_id",
        "quantity": 2,
        "price_at_purchase": 89.99
      }
    ],
    "subtotal": 179.98,
    "tax": 14.40,
    "shipping_cost": 0,
    "total": 194.38,
    "address_id": "address_id",
    "payment_method": "card",
    "payment_status": "succeeded",
    "order_status": "placed",
    "tracking_number": "TRK123456789",
    "stripe_payment_intent_id": "pi_123456789",
    "created_at": "2023-01-01T00:00:00.000Z"
  }
}
```
- **Error Responses**:
  - `400 Bad Request`: Cart is empty or invalid data
  - `404 Not Found`: Address not found

### Get Order Details
Get details of a specific order.

- **URL**: `/api/orders/:id`
- **Method**: `GET`
- **Access**: Private (must own order)
- **Success Response**:
```json
{
  "success": true,
  "data": {
    "_id": "order_id",
    "user_id": "user_id",
    "items": [
      {
        "product_id": {
          "_id": "product_id",
          "title": "Product Title",
          "images": ["product_image_url"]
        },
        "quantity": 2,
        "price_at_purchase": 89.99
      }
    ],
    "subtotal": 179.98,
    "tax": 14.40,
    "shipping_cost": 0,
    "total": 194.38,
    "address_id": "address_id",
    "payment_method": "card",
    "payment_status": "succeeded",
    "order_status": "placed",
    "tracking_number": "TRK123456789",
    "stripe_payment_intent_id": "pi_123456789",
    "created_at": "2023-01-01T00:00:00.000Z",
    "address": {
      "address_line1": "123 Main St",
      "city": "Anytown",
      "state": "CA",
      "zip": "12345",
      "country": "US"
    }
  }
}
```
- **Error Responses**:
  - `403 Forbidden`: Insufficient permissions
  - `404 Not Found`: Order not found

### Cancel Order
Cancel an order (before dispatch).

- **URL**: `/api/orders/:id/cancel`
- **Method**: `PUT`
- **Access**: Private (must own order)
- **Success Response**:
```json
{
  "success": true,
  "data": {
    "_id": "order_id",
    "order_status": "cancelled",
    "updated_at": "2023-01-02T00:00:00.000Z"
  }
}
```
- **Error Responses**:
  - `400 Bad Request`: Order cannot be cancelled
  - `403 Forbidden`: Insufficient permissions

### Request Return
Request a return for an order.

- **URL**: `/api/orders/:id/return`
- **Method**: `PUT`
- **Access**: Private (must own order)
- **Request Body**:
```json
{
  "reason": "Item damaged",
  "comments": "Box was crushed during shipping"
}
```
- **Success Response**:
```json
{
  "success": true,
  "data": {
    "_id": "order_id",
    "order_status": "returned",
    "return_requested_at": "2023-01-02T00:00:00.000Z",
    "return_reason": "Item damaged",
    "return_comments": "Box was crushed during shipping",
    "updated_at": "2023-01-02T00:00:00.000Z"
  }
}
```

### List User Orders
Get all orders for the authenticated user.

- **URL**: `/api/orders`
- **Method**: `GET`
- **Access**: Private
- **Query Parameters**:
  - `status`: Filter by order status
  - `page`: Page number
  - `limit`: Items per page
- **Success Response**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "order_id",
      "items": [
        {
          "product_id": {
            "_id": "product_id",
            "title": "Product Title",
            "images": ["product_image_url"]
          },
          "quantity": 2,
          "price_at_purchase": 89.99
        }
      ],
      "total": 194.38,
      "order_status": "delivered",
      "created_at": "2023-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalOrders": 25,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Review Endpoints

### Create Review
Create a review for a product.

- **URL**: `/api/reviews`
- **Method**: `POST`
- **Access**: Private (must have purchased the product)
- **Request Body**:
```json
{
  "product_id": "product_id",
  "rating": 5,
  "title": "Excellent product!",
  "comment": "This product exceeded my expectations.",
  "images": ["review_image_url_1"]
}
```
- **Success Response**:
```json
{
  "success": true,
  "data": {
    "_id": "review_id",
    "product_id": "product_id",
    "user_id": "user_id",
    "rating": 5,
    "title": "Excellent product!",
    "comment": "This product exceeded my expectations.",
    "images": ["review_image_url_1"],
    "helpful_votes": [],
    "created_at": "2023-01-01T00:00:00.000Z"
  }
}
```
- **Error Responses**:
  - `400 Bad Request`: Validation errors
  - `403 Forbidden`: User has not purchased the product

### Get Product Reviews
Get all reviews for a product.

- **URL**: `/api/reviews/:productId`
- **Method**: `GET`
- **Access**: Public
- **Query Parameters**:
  - `sort`: Sort by (newest, oldest, highestRating, lowestRating)
  - `page`: Page number
  - `limit`: Items per page
- **Success Response**:
```json
{
  "success": true,
  "data": [
    {