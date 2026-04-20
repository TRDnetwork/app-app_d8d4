# ShopSphere API Documentation

This document provides comprehensive details about the ShopSphere API endpoints, including request/response formats, authentication requirements, and example usage.

## Authentication

All API endpoints require authentication except for public routes. Authentication is performed using JWT tokens.

### Token Storage
- Access tokens are returned in the response body
- Refresh tokens are stored in httpOnly cookies
- Access tokens should be included in the Authorization header for subsequent requests

### Authentication Headers
```
Authorization: Bearer <access_token>
Cookie: refreshToken=<refresh_token>
```

## Public Endpoints

### Register User
Create a new user account.

- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Authentication**: None
- **Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "message": "User registered. Please check your email to verify your account."
}
```
- **Response (400 Bad Request)**:
```json
{
  "success": false,
  "message": "User already exists"
}
```
- **Example cURL**:
```bash
curl -X POST https://api.shopsphere.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login User
Authenticate a user and receive JWT tokens.

- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Authentication**: None
- **Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60d214a1e9b9b92d8c4b1234",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "profilePictureUrl": null,
    "phone": null
  }
}
```
- **Response (401 Unauthorized)**:
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```
- **Example cURL**:
```bash
curl -X POST https://api.shopsphere.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Verify Email
Verify a user's email address using a verification token.

- **URL**: `/api/auth/verify-email`
- **Method**: `POST`
- **Authentication**: None
- **Request Body**:
```json
{
  "token": "verification_token_from_email"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```
- **Response (400 Bad Request)**:
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```
- **Example cURL**:
```bash
curl -X POST https://api.shopsphere.com/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "token": "verification_token_from_email"
  }'
```

### Forgot Password
Request a password reset link.

- **URL**: `/api/auth/forgot-password`
- **Method**: `POST`
- **Authentication**: None
- **Request Body**:
```json
{
  "email": "john@example.com"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```
- **Response (404 Not Found)**:
```json
{
  "success": false,
  "message": "User not found"
}
```
- **Example cURL**:
```bash
curl -X POST https://api.shopsphere.com/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com"
  }'
```

### Reset Password
Reset a user's password using a reset token.

- **URL**: `/api/auth/reset-password`
- **Method**: `POST`
- **Authentication**: None
- **Request Body**:
```json
{
  "token": "reset_token_from_email",
  "password": "new_password123"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Password reset successful"
}
```
- **Response (400 Bad Request)**:
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```
- **Example cURL**:
```bash
curl -X POST https://api.shopsphere.com/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "reset_token_from_email",
    "password": "new_password123"
  }'
```

## Product Endpoints

### List Products
Get a list of products with filtering and pagination.

- **URL**: `/api/products`
- **Method**: `GET`
- **Authentication**: None (public), JWT for personalized recommendations
- **Query Parameters**:
  - `q`: Search query
  - `category`: Category ID
  - `brand`: Brand name
  - `minPrice`: Minimum price
  - `maxPrice`: Maximum price
  - `rating`: Minimum rating (1-5)
  - `sort`: Sort order (price-asc, price-desc, newest, best-seller, rating)
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 20)
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "60d214a1e9b9b92d8c4b1235",
      "seller_id": "60d214a1e9b9b92d8c4b1234",
      "title": "iPhone 15 Pro",
      "description": "Latest Apple smartphone with A17 chip...",
      "brand": "Apple",
      "category_id": "60d214a1e9b9b92d8c4b1236",
      "price": 999,
      "discount_percent": 10,
      "stock": 50,
      "images": [
        "https://example.com/iphone15pro-1.jpg",
        "https://example.com/iphone15pro-2.jpg"
      ],
      "variants": [
        {
          "size": "6.1\"",
          "color": "Titanium Blue",
          "sku": "IP15P-TB-128",
          "price": 999,
          "stock": 20
        }
      ],
      "tags": ["smartphone", "ios", "camera", "apple"],
      "status": "active",
      "created_at": "2023-06-15T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```
- **Example cURL**:
```bash
curl -X GET "https://api.shopsphere.com/api/products?q=iphone&category=60d214a1e9b9b92d8c4b1236&minPrice=500&maxPrice=1500&sort=price-asc&page=1&limit=10"
```

### Get Product Details
Get detailed information about a specific product.

- **URL**: `/api/products/:id`
- **Method**: `GET`
- **Authentication**: None (public), JWT for personalized recommendations
- **Path Parameters**:
  - `id`: Product ID
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "_id": "60d214a1e9b9b92d8c4b1235",
    "seller_id": "60d214a1e9b9b92d8c4b1234",
    "title": "iPhone 15 Pro",
    "description": "Latest Apple smartphone with A17 chip...",
    "brand": "Apple",
    "category_id": "60d214a1e9b9b92d8c4b1236",
    "subcategory_id": "60d214a1e9b9b92d8c4b1237",
    "price": 999,
    "discount_percent": 10,
    "stock": 50,
    "images": [
      "https://example.com/iphone15pro-1.jpg",
      "https://example.com/iphone15pro-2.jpg"
    ],
    "variants": [
      {
        "size": "6.1\"",
        "color": "Titanium Blue",
        "sku": "IP15P-TB-128",
        "price": 999,
        "stock": 20
      }
    ],
    "tags": ["smartphone", "ios", "camera", "apple"],
    "status": "active",
    "created_at": "2023-06-15T10:00:00.000Z",
    "reviews": [
      {
        "_id": "60d214a1e9b9b92d8c4b1238",
        "user_id": "60d214a1e9b9b92d8c4b1239",
        "rating": 5,
        "title": "Amazing phone!",
        "comment": "The camera quality is incredible...",
        "images": [],
        "helpful_votes": [],
        "created_at": "2023-06-16T14:30:00.000Z"
      }
    ],
    "questions": [
      {
        "_id": "60d214a1e9b9b92d8c4b1240",
        "user_id": "60d214a1e9b9b92d8c4b1241",
        "question": "Does it come with a charger?",
        "answer": "No, Apple no longer includes chargers with iPhones.",
        "answered_at": "2023-06-17T09:15:00.000Z",
        "created_at": "2023-06-17T08:30:00.000Z"
      }
    ]
  }
}
```
- **Response (404 Not Found)**:
```json
{
  "success": false,
  "message": "Product not found"
}
```
- **Example cURL**:
```bash
curl -X GET https://api.shopsphere.com/api/products/60d214a1e9b9b92d8c4b1235
```

### Create Product (Seller)
Create a new product (seller only).

- **URL**: `/api/products`
- **Method**: `POST`
- **Authentication**: JWT (seller role)
- **Request Body**:
```json
{
  "title": "MacBook Air M2",
  "description": "Ultrafast Apple laptop with M2 chip...",
  "brand": "Apple",
  "category_id": "60d214a1e9b9b92d8c4b1236",
  "price": 1199,
  "stock": 30,
  "images": [
    "https://example.com/macbookair-1.jpg",
    "https://example.com/macbookair-2.jpg"
  ],
  "tags": ["laptop", "mac", "apple", "m2"],
  "status": "active"
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "_id": "60d214a1e9b9b92d8c4b1242",
    "seller_id": "60d214a1e9b9b92d8c4b1234",
    "title": "MacBook Air M2",
    "description": "Ultrafast Apple laptop with M2 chip...",
    "brand": "Apple",
    "category_id": "60d214a1e9b9b92d8c4b1236",
    "price": 1199,
    "stock": 30,
    "images": [
      "https://example.com/macbookair-1.jpg",
      "https://example.com/macbookair-2.jpg"
    ],
    "tags": ["laptop", "mac", "apple", "m2"],
    "status": "active",
    "created_at": "2023-06-18T11:20:00.000Z"
  }
}
```
- **Response (400 Bad Request)**:
```json
{
  "success": false,
  "message": "Title is required"
}
```
- **Response (403 Forbidden)**:
```json
{
  "success": false,
  "message": "User role customer is not authorized to access this route"
}
```
- **Example cURL**:
```bash
curl -X POST https://api.shopsphere.com/api/products \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "title": "MacBook Air M2",
    "description": "Ultrafast Apple laptop with M2 chip...",
    "brand": "Apple",
    "category_id": "60d214a1e9b9b92d8c4b1236",
    "price": 1199,
    "stock": 30,
    "images": [
      "https://example.com/macbookair-1.jpg",
      "https://example.com/macbookair-2.jpg"
    ],
    "tags": ["laptop", "mac", "apple", "m2"],
    "status": "active"
  }'
```

### Update Product (Seller)
Update an existing product (seller only).

- **URL**: `/api/products/:id`
- **Method**: `PUT`
- **Authentication**: JWT (seller role, must be the product's seller)
- **Path Parameters**:
  - `id`: Product ID
- **Request Body**:
```json
{
  "price": 1099,
  "stock": 25,
  "status": "active"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "_id": "60d214a1e9b9b92d8c4b1242",
    "seller_id": "60d214a1e9b9b92d8c4b1234",
    "title": "MacBook Air M2",
    "description": "Ultrafast Apple laptop with M2 chip...",
    "brand": "Apple",
    "category_id": "60d214a1e9b9b92d8c4b1236",
    "price": 1099,
    "stock": 25,
    "images": [
      "https://example.com/macbookair-1.jpg",
      "https://example.com/macbookair-2.jpg"
    ],
    "tags": ["laptop", "mac", "apple", "m2"],
    "status": "active",
    "created_at": "2023-06-18T11:20:00.000Z",
    "updated_at": "2023-06-19T14:45:00.000Z"
  }
}
```
- **Response (403 Forbidden)**:
```json
{
  "success": false,
  "message": "You can only update your own products"
}
```
- **Example cURL**:
```bash
curl -X PUT https://api.shopsphere.com/api/products/60d214a1e9b9b92d8c4b1242 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "price": 1099,
    "stock": 25,
    "status": "active"
  }'
```

### Delete Product (Seller)
Delete a product (seller only).

- **URL**: `/api/products/:id`
- **Method**: `DELETE`
- **Authentication**: JWT (seller role, must be the product's seller)
- **Path Parameters**:
  - `id`: Product ID
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```
- **Response (403 Forbidden)**:
```json
{
  "success": false,
  "message": "You can only delete your own products"
}
```
- **Example cURL**:
```bash
curl -X DELETE https://api.shopsphere.com/api/products/60d214a1e9b9b92d8c4b1242 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Category Endpoints

### List Categories
Get a list of all categories.

- **URL**: `/api/categories`
- **Method**: `GET`
- **Authentication**: None
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "60d214a1e9b9b92d8c4b1236",
      "name": "Electronics",
      "slug": "electronics",
      "parent_id": null,
      "image_url": "https://example.com/electronics.jpg"
    },
    {
      "_id": "60d214a1e9b9b92d8c4b1237",
      "name": "Smartphones",
      "slug": "smartphones",
      "parent_id": "60d214a1e9b9b92d8c4b1236",
      "image_url": "https://example.com/smartphones.jpg"
    }
  ]
}
```
- **Example cURL**:
```bash
curl -X GET https://api.shopsphere.com/api/categories
```

## Cart Endpoints

### Get Cart
Get the authenticated user's cart.

- **URL**: `/api/cart`
- **Method**: `GET`
- **Authentication**: JWT
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "_id": "60d214a1e9b9b92d8c4b1243",
    "user_id": "60d214a1e9b9b92d8c4b1234",
    "items": [
      {
        "product_id": "60d214a1e9b9b92d8c4b1235",
        "quantity": 1,
        "variant": {
          "size": "6.1\"",
          "color": "Titanium Blue"
        }
      }
    ],
    "updated_at": "2023-06-20T10:30:00.000Z"
  }
}
```
- **Example cURL**:
```bash
curl -X GET https://api.shopsphere.com/api/cart \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Add to Cart
Add an item to the authenticated user's cart.

- **URL**: `/api/cart`
- **Method**: `POST`
- **Authentication**: JWT
- **Request Body**:
```json
{
  "product_id": "60d214a1e9b9b92d8c4b1235",
  "quantity": 2,
  "variant": {
    "size": "6.1\"",
    "color": "Titanium Blue"
  }
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "_id": "60d214a1e9b9b92d8c4b1243",
    "user_id": "60d214a1e9b9b92d8c4b1234",
    "items": [
      {
        "product_id": "60d214a1e9b9b92d8c4b1235",
        "quantity": 2,
        "variant": {
          "size": "6.1\"",
          "color": "Titanium Blue"
        }
      }
    ],
    "updated_at": "2023-06-20T10:35:00.000Z"
  }
}
```
- **Response (400 Bad Request)**:
```json
{
  "success": false,
  "message": "Product not found or out of stock"
}
```
- **Example cURL**:
```bash
curl -X POST https://api.shopsphere.com/api/cart \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "60d214a1e9b9b92d8c4b1235",
    "quantity": 2,
    "variant": {
      "size": "6.1\"",
      "color": "Titanium Blue"
    }
  }'
```

### Remove from Cart
Remove an item from the authenticated user's cart.

- **URL**: `/api/cart/:itemId`
- **Method**: `DELETE`
- **Authentication**: JWT
- **Path Parameters**:
  - `itemId`: The ID of the cart item to remove
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Item removed from cart"
}
```
- **Example cURL**:
```bash
curl -X DELETE https://api.shopsphere.com/api/cart/60d214a1e9b9b92d8c4b1235 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Order Endpoints

### Create Order
Create a new order from the user's cart.

- **URL**: `/api/orders`
- **Method**: `POST`
- **Authentication**: JWT
- **Request Body**:
```json
{
  "address_id": "60d214a1e9b9b92d8c4b1244",
  "delivery_method": "standard",
  "payment_method": "card",
  "coupon_code": "SUMMER20"
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "_id": "60d214a1e9b9b92d8c4b1245",
    "user_id": "60d214a1e9b9b92d8c4b1234",
    "items": [
      {
        "product_id": "60d214a1e9b9b92d8c4b1235",
        "quantity": 1,
        "price_at_purchase": 899.1
      }
    ],
    "subtotal": 899.1,
    "tax": 71.93,
    "shipping_cost": 0,
    "total": 971.03,
    "address_id": "60d214a1e9b9b92d8c4b1244",
    "payment_method": "card",
    "payment_status": "succeeded",
    "order_status": "placed",
    "stripe_payment_intent_id": "pi_123456789",
    "created_at": "2023-06-21T15:20:00.000Z"
  }
}
```
- **Response (400 Bad Request)**:
```json
{
  "success": false,
  "message": "Cart is empty"
}
```
- **Example cURL