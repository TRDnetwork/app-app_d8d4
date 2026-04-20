# 📡 ShopSphere API Documentation

This document details all API endpoints for the ShopSphere e-commerce platform. All endpoints are protected by JWT authentication unless otherwise specified.

## 🔐 Authentication

### Register User
- **Endpoint**: `POST /api/auth/register`
- **Description**: Register a new user with email and password
- **Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "User registered. Please check your email to verify your account."
}
```
- **Status Codes**:
  - `201 Created`: User successfully registered
  - `400 Bad Request`: Invalid input data
  - `409 Conflict`: User already exists

### Verify Email
- **Endpoint**: `POST /api/auth/verify-email`
- **Description**: Verify user email with token
- **Request Body**:
```json
{
  "token": "verification_token_here"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```
- **Status Codes**:
  - `200 OK`: Email successfully verified
  - `400 Bad Request`: Invalid or expired token
  - `404 Not Found`: User not found

### Login
- **Endpoint**: `POST /api/auth/login`
- **Description**: Authenticate user and get JWT tokens
- **Request Body**:
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```
- **Response**:
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "profilePictureUrl": "https://example.com/avatar.jpg",
    "phone": "1234567890",
    "emailVerified": true
  }
}
```
- **Status Codes**:
  - `200 OK`: Successfully authenticated
  - `401 Unauthorized`: Invalid credentials
  - `403 Forbidden`: Email not verified

### Refresh Token
- **Endpoint**: `POST /api/auth/refresh`
- **Description**: Refresh JWT access token using refresh token cookie
- **Headers**: None (uses HTTP-only refresh token cookie)
- **Response**:
```json
{
  "success": true,
  "token": "new_jwt_token_here",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "profilePictureUrl": "https://example.com/avatar.jpg",
    "phone": "1234567890",
    "emailVerified": true
  }
}
```
- **Status Codes**:
  - `200 OK`: Successfully refreshed token
  - `401 Unauthorized`: Invalid or missing refresh token

### Logout
- **Endpoint**: `POST /api/auth/logout`
- **Description**: Clear refresh token cookie and log out user
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```
- **Status Codes**:
  - `200 OK`: Successfully logged out

### Forgot Password
- **Endpoint**: `POST /api/auth/forgot-password`
- **Description**: Request password reset email
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
  "message": "Password reset email sent"
}
```
- **Status Codes**:
  - `200 OK`: Password reset email sent
  - `400 Bad Request`: Invalid email format

### Reset Password
- **Endpoint**: `POST /api/auth/reset-password`
- **Description**: Reset password using reset token
- **Request Body**:
```json
{
  "token": "reset_token_here",
  "password": "newSecurePassword123"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Password reset successful"
}
```
- **Status Codes**:
  - `200 OK`: Password successfully reset
  - `400 Bad Request`: Invalid or expired token

### Google OAuth
- **Endpoint**: `GET /api/auth/oauth/google`
- **Description**: Redirect to Google OAuth login
- **Response**: Redirect to Google OAuth consent screen

### Facebook OAuth
- **Endpoint**: `GET /api/auth/oauth/facebook`
- **Description**: Redirect to Facebook OAuth login
- **Response**: Redirect to Facebook OAuth consent screen

## 👤 Users

### Get Current User
- **Endpoint**: `GET /api/users/me`
- **Description**: Get current user profile
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "customer",
  "profilePictureUrl": "https://example.com/avatar.jpg",
  "phone": "1234567890",
  "emailVerified": true,
  "addresses": [
    {
      "_id": "address_id",
      "label": "Home",
      "street": "123 Main St",
      "city": "Mumbai",
      "state": "Maharashtra",
      "zip": "400001",
      "country": "India",
      "is_default": true
    }
  ]
}
```
- **Status Codes**:
  - `200 OK`: User data returned
  - `401 Unauthorized`: Invalid or missing token

### Update User Profile
- **Endpoint**: `PUT /api/users/me`
- **Description**: Update current user profile
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "name": "John Smith",
  "phone": "9876543210"
}
```
- **Response**:
```json
{
  "_id": "user_id",
  "name": "John Smith",
  "email": "john@example.com",
  "role": "customer",
  "profilePictureUrl": "https://example.com/avatar.jpg",
  "phone": "9876543210",
  "emailVerified": true
}
```
- **Status Codes**:
  - `200 OK`: Profile successfully updated
  - `401 Unauthorized`: Invalid or missing token
  - `400 Bad Request`: Invalid input data

### Upload Profile Picture
- **Endpoint**: `POST /api/users/me/avatar`
- **Description**: Upload and update user profile picture
- **Headers**: `Authorization: Bearer <token>`
- **Form Data**:
  - `avatar`: Image file (JPEG/PNG)
- **Response**:
```json
{
  "success": true,
  "profilePictureUrl": "https://shopsphere-media.s3.amazonaws.com/avatars/user_id.jpg"
}
```
- **Status Codes**:
  - `200 OK`: Image uploaded successfully
  - `401 Unauthorized`: Invalid or missing token
  - `400 Bad Request`: Invalid file type or size

### Get User Addresses
- **Endpoint**: `GET /api/users/me/addresses`
- **Description**: Get all saved addresses for current user
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
```json
[
  {
    "_id": "address_id_1",
    "label": "Home",
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zip": "400001",
    "country": "India",
    "is_default": true
  },
  {
    "_id": "address_id_2",
    "label": "Office",
    "street": "456 Business Ave",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zip": "400002",
    "country": "India",
    "is_default": false
  }
]
```
- **Status Codes**:
  - `200 OK`: Addresses returned
  - `401 Unauthorized`: Invalid or missing token

### Add Address
- **Endpoint**: `POST /api/users/me/addresses`
- **Description**: Add a new address for current user
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "label": "Parents' Home",
  "street": "789 Family St",
  "city": "Mumbai",
  "state": "Maharashtra",
  "zip": "400003",
  "country": "India",
  "is_default": false
}
```
- **Response**:
```json
{
  "_id": "address_id_3",
  "label": "Parents' Home",
  "street": "789 Family St",
  "city": "Mumbai",
  "state": "Maharashtra",
  "zip": "400003",
  "country": "India",
  "is_default": false
}
```
- **Status Codes**:
  - `201 Created`: Address successfully added
  - `401 Unauthorized`: Invalid or missing token
  - `400 Bad Request`: Invalid input data

### Update Address
- **Endpoint**: `PUT /api/users/me/addresses/:id`
- **Description**: Update an existing address
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "label": "Parents' Home",
  "street": "789 Family St",
  "city": "Mumbai",
  "state": "Maharashtra",
  "zip": "400003",
  "country": "India",
  "is_default": true
}
```
- **Response**:
```json
{
  "_id": "address_id_3",
  "label": "Parents' Home",
  "street": "789 Family St",
  "city": "Mumbai",
  "state": "Maharashtra",
  "zip": "400003",
  "country": "India",
  "is_default": true
}
```
- **Status Codes**:
  - `200 OK`: Address successfully updated
  - `401 Unauthorized`: Invalid or missing token
  - `404 Not Found`: Address not found
  - `400 Bad Request`: Invalid input data

### Delete Address
- **Endpoint**: `DELETE /api/users/me/addresses/:id`
- **Description**: Delete an address
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `204 No Content`
- **Status Codes**:
  - `204 No Content`: Address successfully deleted
  - `401 Unauthorized`: Invalid or missing token
  - `404 Not Found`: Address not found

## 🛍️ Products

### List Products
- **Endpoint**: `GET /api/products`
- **Description**: Get list of products with filtering and pagination
- **Query Parameters**:
  - `category`: Filter by category
  - `brand`: Filter by brand
  - `minPrice`: Minimum price
  - `maxPrice`: Maximum price
  - `rating`: Minimum average rating
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 20)
  - `sort`: Sort by (price-asc, price-desc, newest, best-seller, rating)
- **Response**:
```json
{
  "products": [
    {
      "_id": "product_id_1",
      "title": "Wireless Earbuds Pro",
      "description": "Premium wireless earbuds with noise cancellation",
      "category": "Electronics",
      "brand": "SoundMaster",
      "price": 199.99,
      "original_price": 249.99,
      "discount_percent": 20,
      "images": [
        "https://shopsphere-media.s3.amazonaws.com/products/product_id_1_1.jpg",
        "https://shopsphere-media.s3.amazonaws.com/products/product_id_1_2.jpg"
      ],
      "variants": [
        {
          "size": null,
          "color": "Black",
          "sku": "SM-WE-001-BLACK",
          "stock": 50
        },
        {
          "size": null,
          "color": "White",
          "sku": "SM-WE-001-WHITE",
          "stock": 30
        }
      ],
      "stock_total": 80,
      "status": "active",
      "avg_rating": 4.5,
      "review_count": 124,
      "view_count": 2345,
      "tags": ["wireless", "earbuds", "noise-cancellation"],
      "created_at": "2023-01-15T10:30:00.000Z",
      "updated_at": "2023-01-15T10:30:00.000Z"
    }
  ],
  "total": 150,
  "page": 1,
  "pages": 8
}
```
- **Status Codes**:
  - `200 OK`: Products returned successfully

### Get Product Detail
- **Endpoint**: `GET /api/products/:id`
- **Description**: Get detailed information about a specific product
- **Response**:
```json
{
  "_id": "product_id_1",
  "title": "Wireless Earbuds Pro",
  "description": "Premium wireless earbuds with noise cancellation",
  "category": "Electronics",
  "brand": "SoundMaster",
  "price": 199.99,
  "original_price": 249.99,
  "discount_percent": 20,
  "images": [
    "https://shopsphere-media.s3.amazonaws.com/products/product_id_1_1.jpg",
    "https://shopsphere-media.s3.amazonaws.com/products/product_id_1_2.jpg"
  ],
  "variants": [
    {
      "size": null,
      "color": "Black",
      "sku": "SM-WE-001-BLACK",
      "stock": 50
    },
    {
      "size": null,
      "color": "White",
      "sku": "SM-WE-001-WHITE",
      "stock": 30
    }
  ],
  "stock_total": 80,
  "status": "active",
  "avg_rating": 4.5,
  "review_count": 124,
  "view_count": 2345,
  "tags": ["wireless", "earbuds", "noise-cancellation"],
  "created_at": "2023-01-15T10:30:00.000Z",
  "updated_at": "2023-01-15T10:30:00.000Z",
  "seller": {
    "_id": "seller_id",
    "name": "SoundMaster Official",
    "rating": 4.8,
    "review_count": 567
  }
}
```
- **Status Codes**:
  - `200 OK`: Product returned successfully
  - `404 Not Found`: Product not found

### Get Related Products
- **Endpoint**: `GET /api/products/:id/related`
- **Description**: Get products related to the specified product
- **Query Parameters**:
  - `limit`: Number of related products to return (default: 4)
- **Response**:
```json
[
  {
    "_id": "product_id_2",
    "title": "Wireless Earbuds Standard",
    "price": 99.99,
    "original_price": 149.99,
    "discount_percent": 33,
    "images": [
      "https://shopsphere-media.s3.amazonaws.com/products/product_id_2_1.jpg"
    ],
    "avg_rating": 4.2,
    "review_count": 89
  }
]
```
- **Status Codes**:
  - `200 OK`: Related products returned successfully
  - `404 Not Found`: Product not found

### Get Product Questions
- **Endpoint**: `GET /api/products/:id/questions`
- **Description**: Get all questions and answers for a product
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
- **Response**:
```json
{
  "questions": [
    {
      "_id": "question_id_1",
      "product_id": "product_id_1",
      "user_id": "user_id_1",
      "question": "Do these earbuds support wireless charging?",
      "answer": "Yes, these earbuds come with a wireless charging case.",
      "answered_by": "seller_id",
      "created_at": "2023-01-16T14:30:00.000Z",
  "answered_at": "2023-01-16T15:45:00.000Z",
      "user": {
        "name": "Customer1",
        "role": "customer"
      },
      "answered_by_user": {
        "name": "SoundMaster Official",
        "role": "seller"
      }
    }
  ],
  "total": 1,
  "page": 1,
  "pages": 1
}
```
- **Status Codes**:
  - `200 OK`: Questions returned successfully
  - `404 Not Found`: Product not found

### Ask Question
- **Endpoint**: `POST /api/products/:id/questions`
- **Description**: Ask a question about a product
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "question": "Do these earbuds support wireless charging?"
}
```
- **Response**:
```json
{
  "_id": "question_id_1",
  "product_id": "product_id_1",
  "user_id": "user_id_1",
  "question": "Do these earbuds support wireless charging?",
  "created_at": "2023-01-16T14:30:00.000Z",
  "user": {
    "name": "Customer1",
    "role": "customer"
  }
}
```
- **Status Codes**:
  - `201 Created`: Question successfully asked
  - `401 Unauthorized`: Invalid or missing token
  - `404 Not Found`: Product not found

### Increment View Count
- **Endpoint**: `PUT /api/products/:id/view`
- **Description**: Increment the view count for a product
- **Response**: `204 No Content`
- **Status Codes**:
  - `204 No Content`: View count incremented successfully
  - `404 Not Found`: Product not found

## 🛒 Cart

### Get Cart
- **Endpoint**: `GET /api/cart`
- **Description**: Get current user's cart
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
```json
{
  "_id": "cart_id",
  "user_id": "user_id",
  "items": [
    {
      "product_id": "product_id_1",
      "variant_id": "variant_id_1",
      "quantity": 2,
      "price_snapshot": 199.99
    }
  ],
  "created_at": "2023-01-17T10:00:00.000Z",
  "updated_at": "2023-01-17T10:00:00.000Z"
}
```
- **Status Codes**:
  - `200 OK`: Cart returned successfully
  - `401 Unauthorized`: Invalid or missing token

### Add Item to Cart
- **Endpoint**: `POST /api/cart/items`
- **Description**: Add an item to the cart
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "product_id": "product_id_1",
  "variant_id": "variant_id_1",
  "quantity": 2
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Item added to cart"
}
```
- **Status Codes**:
  - `200 OK`: Item successfully added
  - `400 Bad Request`: Invalid product or variant ID, insufficient stock
  - `401 Unauthorized`: Invalid or missing token

### Update Cart Item
- **Endpoint**: `PUT /api/cart/items/:id`
- **Description**: Update quantity of a cart item
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "quantity": 3
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Cart item updated"
}
```
- **Status Codes**:
  - `200 OK`: Cart item successfully updated
  - `400 Bad Request`: Invalid quantity, insufficient stock
  - `401 Unauthorized`: Invalid or missing token
  - `404 Not Found`: Cart item not found

### Remove Cart Item
- **Endpoint**: `DELETE /api/cart/items/:id`
- **Description**: Remove an item from the cart
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `204 No Content`
- **Status Codes**:
  - `204 No Content`: Item successfully removed
  - `401 Unauthorized`: Invalid or missing token
  - `404 Not Found`: Cart item not found

### Apply Coupon
- **Endpoint**: `POST /api/cart/apply-coupon`
- **Description**: Apply a coupon code to the cart
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
  "success": true,
  "discount_amount": 19.99,
  "total_amount": 379.99
}
```
- **Status Codes**:
  - `200 OK`: Coupon successfully applied
  - `400 Bad Request`: Invalid or expired coupon, minimum order value not met
  - `401 Unauthorized`: Invalid or missing token

## 🎁 Wishlist

### Get Wishlist
- **Endpoint**: `GET /api/wishlist`
- **Description**: Get current user's wishlist
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
```json
{
  "product_ids": [
    "product_id_1",
    "product_id_2"
  ]
}
```
- **Status Codes**:
  - `200 OK`: Wishlist returned successfully
  - `401 Unauthorized`: Invalid or missing token

### Add to Wishlist
- **Endpoint**: `POST /api/wishlist/:productId`
- **Description**: Add a product to wishlist
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
```json
{
  "success": true,
  "message": "Product added to wishlist"
}
```
- **Status Codes**:
  - `200 OK`: Product successfully added
  - `401 Unauthorized`: Invalid or missing token
  - `404 Not Found`: Product not found

### Remove from Wishlist
- **Endpoint**: `DELETE /api/wishlist/:productId`
- **Description**: Remove a product from wishlist
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `204 No Content`
- **Status Codes**:
  - `204 No Content`: Product successfully removed
  - `401 Unauthorized`: Invalid or missing token
  - `404 Not Found`: Product not found

## 📦 Orders

### List Orders
- **Endpoint**: `GET /api/orders`
- **Description**: Get current user's order history
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `status`: Filter by order status
- **Response**:
```json
{
  "orders": [
    {
      "_id": "order_id_1",
      "order_number": "ORD-1234567890-123",
      "items": [
        {
          "product_id": "product_id_1",
          "variant": "variant_id_1",
          "quantity": 2,
          "price": 199.99,
          "seller_id": "seller_id"
        }
      ],
      "total_amount": 399.98,
      "discount_amount": 0,
      "delivery_fee": 0,
      "tax_amount": 0,
      "payment_method": "card",
      "payment_status": "completed",
      "order_status": "delivered",
      "address": {
        "label": "Home",
        "street": "123 Main St",
        "city": "Mumbai",
        "state": "Maharashtra",
        "zip": "400001",
        "country": "India"
      },
      "tracking_number": "TN123456789IN",
      "delivery_speed": "standard",
      "coupon