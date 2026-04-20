# ShopSphere API Documentation

This document provides comprehensive documentation for all API endpoints in the ShopSphere e-commerce platform.

## Authentication

### Register User
Create a new user account.

**Endpoint:** `POST /api/auth/register`  
**Authentication:** None

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "customer",
    "email_verified": false
  }
}
```

**Example cURL:**
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
Authenticate user and receive JWT token.

**Endpoint:** `POST /api/auth/login`  
**Authentication:** None

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "token": "jwt_token_here",
  "refresh_token": "refresh_token_here",
  "user": {
    "id": "user_id",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "customer",
    "email_verified": true
  }
}
```

**Example cURL:**
```bash
curl -X POST https://api.shopsphere.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Verify Email
Verify user's email address using verification token.

**Endpoint:** `POST /api/auth/verify-email`  
**Authentication:** None

**Request Body:**
```json
{
  "token": "verification_token_here"
}
```

**Response (200 OK):**
```json
{
  "message": "Email verified successfully",
  "user": {
    "id": "user_id",
    "email": "john@example.com",
    "name": "John Doe",
    "email_verified": true
  }
}
```

**Example cURL:**
```bash
curl -X POST https://api.shopsphere.com/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "token": "verification_token_here"
  }'
```

### Forgot Password
Request password reset email.

**Endpoint:** `POST /api/auth/forgot-password`  
**Authentication:** None

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (200 OK):**
```json
{
  "message": "Password reset email sent if account exists"
}
```

**Example cURL:**
```bash
curl -X POST https://api.shopsphere.com/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com"
  }'
```

### Reset Password
Reset password using reset token.

**Endpoint:** `POST /api/auth/reset-password`  
**Authentication:** None

**Request Body:**
```json
{
  "token": "reset_token_here",
  "password": "new_password123"
}
```

**Response (200 OK):**
```json
{
  "message": "Password reset successfully"
}
```

**Example cURL:**
```bash
curl -X POST https://api.shopsphere.com/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "reset_token_here",
    "password": "new_password123"
  }'
```

### Google OAuth
Redirect to Google OAuth login.

**Endpoint:** `GET /api/auth/oauth/google`  
**Authentication:** None

**Response:** Redirect to Google OAuth page

**Example cURL:**
```bash
curl -X GET https://api.shopsphere.com/api/auth/oauth/google
```

### Google OAuth Callback
Handle Google OAuth callback.

**Endpoint:** `GET /api/auth/oauth/google/callback`  
**Authentication:** None

**Query Parameters:**
- `code`: Authorization code from Google
- `state`: CSRF protection state

**Response:** Redirect to frontend with JWT token

**Example cURL:**
```bash
curl -X GET "https://api.shopsphere.com/api/auth/oauth/google/callback?code=auth_code&state=csrf_state"
```

## Users

### Get User Profile
Get current user's profile information.

**Endpoint:** `GET /api/users/profile`  
**Authentication:** Bearer Token

**Response (200 OK):**
```json
{
  "id": "user_id",
  "email": "john@example.com",
  "name": "John Doe",
  "phone": "+1234567890",
  "profile_picture_url": "https://example.com/avatar.jpg",
  "role": "customer",
  "loyalty_points": 150,
  "email_verified": true,
  "created_at": "2023-01-15T10:30:00Z"
}
```

**Example cURL:**
```bash
curl -X GET https://api.shopsphere.com/api/users/profile \
  -H "Authorization: Bearer jwt_token_here"
```

### Update User Profile
Update user's profile information.

**Endpoint:** `PUT /api/users/profile`  
**Authentication:** Bearer Token

**Request Body:**
```json
{
  "name": "John Smith",
  "phone": "+1234567890"
}
```

**Response (200 OK):**
```json
{
  "id": "user_id",
  "email": "john@example.com",
  "name": "John Smith",
  "phone": "+1234567890",
  "profile_picture_url": "https://example.com/avatar.jpg",
  "role": "customer",
  "loyalty_points": 150,
  "email_verified": true,
  "created_at": "2023-01-15T10:30:00Z",
  "updated_at": "2023-01-20T14:20:00Z"
}
```

**Example cURL:**
```bash
curl -X PUT https://api.shopsphere.com/api/users/profile \
  -H "Authorization: Bearer jwt_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "phone": "+1234567890"
  }'
```

### Upload Profile Picture
Upload user's profile picture to AWS S3.

**Endpoint:** `PUT /api/users/profile/picture`  
**Authentication:** Bearer Token

**Request Body:** Multipart form data with file

**Response (200 OK):**
```json
{
  "profile_picture_url": "https://shopsphere-uploads.s3.amazonaws.com/user_id/avatar.jpg"
}
```

**Example cURL:**
```bash
curl -X PUT https://api.shopsphere.com/api/users/profile/picture \
  -H "Authorization: Bearer jwt_token_here" \
  -F "file=@/path/to/avatar.jpg"
```

### List User Addresses
Get all addresses for the current user.

**Endpoint:** `GET /api/users/addresses`  
**Authentication:** Bearer Token

**Response (200 OK):**
```json
[
  {
    "id": "address_id_1",
    "type": "home",
    "line1": "123 Main St",
    "line2": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "postal_code": "10001",
    "country": "US",
    "is_default": true,
    "created_at": "2023-01-15T10:30:00Z"
  },
  {
    "id": "address_id_2",
    "type": "work",
    "line1": "456 Business Ave",
    "city": "New York",
    "state": "NY",
    "postal_code": "10002",
    "country": "US",
    "is_default": false,
    "created_at": "2023-01-18T09:15:00Z"
  }
]
```

**Example cURL:**
```bash
curl -X GET https://api.shopsphere.com/api/users/addresses \
  -H "Authorization: Bearer jwt_token_here"
```

### Add User Address
Add a new address for the current user.

**Endpoint:** `POST /api/users/addresses`  
**Authentication:** Bearer Token

**Request Body:**
```json
{
  "type": "home",
  "line1": "123 Main St",
  "line2": "Apt 4B",
  "city": "New York",
  "state": "NY",
  "postal_code": "10001",
  "country": "US",
  "is_default": true
}
```

**Response (201 Created):**
```json
{
  "id": "address_id_3",
  "type": "home",
  "line1": "123 Main St",
  "line2": "Apt 4B",
  "city": "New York",
  "state": "NY",
  "postal_code": "10001",
  "country": "US",
  "is_default": true,
  "created_at": "2023-01-20T14:20:00Z"
}
```

**Example cURL:**
```bash
curl -X POST https://api.shopsphere.com/api/users/addresses \
  -H "Authorization: Bearer jwt_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "home",
    "line1": "123 Main St",
    "line2": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "postal_code": "10001",
    "country": "US",
    "is_default": true
  }'
```

### Update User Address
Update an existing address for the current user.

**Endpoint:** `PUT /api/users/addresses/:id`  
**Authentication:** Bearer Token

**Request Body:**
```json
{
  "type": "home",
  "line1": "123 Main St",
  "line2": "Apt 5C",
  "city": "New York",
  "state": "NY",
  "postal_code": "10001",
  "country": "US",
  "is_default": true
}
```

**Response (200 OK):**
```json
{
  "id": "address_id_1",
  "type": "home",
  "line1": "123 Main St",
  "line2": "Apt 5C",
  "city": "New York",
  "state": "NY",
  "postal_code": "10001",
  "country": "US",
  "is_default": true,
  "created_at": "2023-01-15T10:30:00Z",
  "updated_at": "2023-01-20T14:20:00Z"
}
```

**Example cURL:**
```bash
curl -X PUT https://api.shopsphere.com/api/users/addresses/address_id_1 \
  -H "Authorization: Bearer jwt_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "home",
    "line1": "123 Main St",
    "line2": "Apt 5C",
    "city": "New York",
    "state": "NY",
    "postal_code": "10001",
    "country": "US",
    "is_default": true
  }'
```

### Delete User Address
Delete an address for the current user.

**Endpoint:** `DELETE /api/users/addresses/:id`  
**Authentication:** Bearer Token

**Response (204 No Content):** Empty response

**Example cURL:**
```bash
curl -X DELETE https://api.shopsphere.com/api/users/addresses/address_id_1 \
  -H "Authorization: Bearer jwt_token_here"
```

## Products

### List Products
Get a list of products with filtering, sorting, and pagination.

**Endpoint:** `GET /api/products`  
**Authentication:** None

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `category`: Filter by category ID
- `brand`: Filter by brand
- `min_price`: Minimum price
- `max_price`: Maximum price
- `rating`: Minimum rating (1-5)
- `sort`: Sort field (price_asc, price_desc, newest, best_seller, rating_desc)
- `q`: Search query

**Response (200 OK):**
```json
{
  "products": [
    {
      "id": "product_id_1",
      "title": "Premium Wireless Headphones",
      "slug": "premium-wireless-headphones",
      "description": "High-quality wireless headphones with noise cancellation.",
      "category_id": "category_id_1",
      "brand": "AudioPro",
      "price": 299.99,
      "original_price": 399.99,
      "discount_percent": 25,
      "sku": "AP-WH-001",
      "stock_quantity": 50,
      "images": [
        "https://shopsphere-uploads.s3.amazonaws.com/product_id_1/image1.jpg",
        "https://shopsphere-uploads.s3.amazonaws.com/product_id_1/image2.jpg"
      ],
      "variants": [
        {
          "name": "Color",
          "values": ["Black", "White", "Blue"],
          "price_modifier": 0
        }
      ],
      "tags": ["audio", "wireless", "headphones"],
      "is_featured": true,
      "is_sponsored": false,
      "status": "active",
      "views": 1250,
      "created_at": "2023-01-10T09:00:00Z",
      "updated_at": "2023-01-15T11:30:00Z"
    }
  ],
  "total": 150,
  "page": 1,
  "pages": 8,
  "limit": 20
}
```

**Example cURL:**
```bash
curl -X GET "https://api.shopsphere.com/api/products?page=1&limit=10&category=category_id_1&min_price=100&max_price=500&sort=price_asc"
```

### Get Product by Slug
Get a product by its slug.

**Endpoint:** `GET /api/products/:slug`  
**Authentication:** None

**Response (200 OK):**
```json
{
  "id": "product_id_1",
  "title": "Premium Wireless Headphones",
  "slug": "premium-wireless-headphones",
  "description": "High-quality wireless headphones with noise cancellation.",
  "category_id": "category_id_1",
  "brand": "AudioPro",
  "price": 299.99,
  "original_price": 399.99,
  "discount_percent": 25,
  "sku": "AP-WH-001",
  "stock_quantity": 50,
  "images": [
    "https://shopsphere-uploads.s3.amazonaws.com/product_id_1/image1.jpg",
    "https://shopsphere-uploads.s3.amazonaws.com/product_id_1/image2.jpg"
  ],
  "variants": [
    {
      "name": "Color",
      "values": ["Black", "White", "Blue"],
      "price_modifier": 0
    }
  ],
  "tags": ["audio", "wireless", "headphones"],
  "is_featured": true,
  "is_sponsored": false,
  "status": "active",
  "views": 1250,
  "created_at": "2023-01-10T09:00:00Z",
  "updated_at": "2023-01-15T11:30:00Z",
  "average_rating": 4.8,
  "review_count": 127,
  "frequently_bought_together": [
    {
      "id": "product_id_2",
      "title": "Premium Earphone Case",
      "price": 29.99,
      "image": "https://shopsphere-uploads.s3.amazonaws.com/product_id_2/image1.jpg"
    }
  ],
  "customers_also_viewed": [
    {
      "id": "product_id_3",
      "title": "Wireless Charging Pad",
      "price": 49.99,
      "image": "https://shopsphere-uploads.s3.amazonaws.com/product_id_3/image1.jpg"
    }
  ]
}
```

**Example cURL:**
```bash
curl -X GET https://api.shopsphere.com/api/products/premium-wireless-headphones
```

### Get Product Reviews
Get reviews for a product.

**Endpoint:** `GET /api/products/:id/reviews`  
**Authentication:** None

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Reviews per page (default: 10)
- `sort`: Sort by (helpful, newest, rating_desc, rating_asc)

**Response (200 OK):**
```json
{
  "reviews": [
    {
      "id": "review_id_1",
      "product_id": "product_id_1",
      "user_id": "user_id_1",
      "order_id": "order_id_1",
      "rating": 5,
      "title": "Excellent sound quality",
      "comment": "These headphones have amazing sound quality and comfortable fit.",
      "images": [
        "https://shopsphere-uploads.s3.amazonaws.com/review_id_1/image1.jpg"
      ],
      "helpful_votes": 23,
      "verified_purchase": true,
      "created_at": "2023-01-12T14:30:00Z",
      "updated_at": "2023-01-12T14:30:00Z",
      "user": {
        "name": "Sarah Johnson",
        "profile_picture_url": "https://example.com/avatar1.jpg"
      }
    }
  ],
  "total": 127,
  "page": 1,
  "pages": 13,
  "limit": 10,
  "average_rating": 4.8,
  "rating_breakdown": {
    "5": 89,
    "4": 25,
    "3": 8,
    "2": 3,
    "1": 2
  }
}
```

**Example cURL:**
```bash
curl -X GET "https://api.shopsphere.com/api/products/product_id_1/reviews?page=1&limit=5&sort=helpful"
```

### Get Product Q&A
Get questions and answers for a product.

**Endpoint:** `GET /api/products/:id/questions`  
**Authentication:** None

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Questions per page (default: 10)
- `answered`: Filter by answered status (true, false, all)

**Response (200 OK):**
```json
{
  "questions": [
    {
      "id": "question_id_1",
      "product_id": "product_id_1",
      "user_id": "user_id_2",
      "question": "Do these headphones work with Android phones?",
      "answer": "Yes, these headphones are compatible with all Bluetooth-enabled devices including Android phones.",
      "answered_by": "user_id_3",
      "created_at": "2023-01-11T10:15:00Z",
      "answered_at": "2023-01-11T11:20:00Z",
      "user": {
        "name": "Mike Wilson",
        "profile_picture_url": "https://example.com/avatar2.jpg"
      },
      "answered_by_user": {
        "name": "AudioPro Support",
        "profile_picture_url": "https://example.com/support.jpg"
      }
    }
  ],
  "total": 15,
  "page": 1,
  "pages": 2,
  "limit": 10
}
```

**Example cURL:**
```bash
curl -X GET "https://api.shopsphere.com/api/products/product_id_1/questions?page=1&limit=5&answered=true"
```

### Ask Question
Ask a question about a product.

**Endpoint:** `POST /api/products/:id/questions`  
**Authentication:** Bearer Token

**Request Body:**
```json
{
  "question": "Do these headphones have a microphone for calls?"
}
```

**Response (201 Created):**
```json
{
  "id": "question_id_2",
  "product_id": "product_id_1",
  "user_id": "user_id_1",
  "question": "Do these headphones have a microphone for calls?",
  "created_at": "2023-01-20T14:20:00Z",
  "user": {
    "name": "John Smith",
    "profile_picture_url": "https://example.com/avatar.jpg"
  }
}
```

**Example cURL:**
```bash
curl -X POST https://api.shopsphere.com/api/products/product_id_1/questions \
  -H "Authorization: Bearer jwt_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Do these headphones have a microphone for calls?"
  }'
```

### Seller Answer Question
Answer a question about a product (seller only).

**Endpoint:** `PUT /api/products/questions/:id/answer`  
**Authentication:** Bearer Token (seller role)

**Request Body:**
```json
{
  "answer": "Yes, these headphones have a built-in microphone that provides clear voice quality for phone calls."
}
```

**Response (200 OK):**
```json
{
  "id": "question_id_2",
  "product_id": "product_id_1",
  "user_id": "user_id_1",
  "question": "Do these headphones have a microphone for calls?",
  "answer": "Yes, these headphones have a built-in microphone that provides clear voice quality for phone calls.",
  "answered_by": "user_id_4",
  "created_at": "2023-01-20T14:20:00Z",
  "answered_at": "2023-01-20T14:25:00Z",
  "user": {
    "name": "John Smith",
    "profile_picture_url": "https://example.com/avatar.jpg"
  },
  "answered_by_user": {
    "name": "AudioPro Seller",
    "profile_picture_url": "https://example.com/seller.jpg"
  }
}
```

**Example cURL:**
```bash
curl -X PUT https://api.shopsphere.com/api/products/questions/question_id_2/answer \
  -H "Authorization: Bearer jwt_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "answer": "Yes, these headphones have a built-in microphone that provides clear voice quality for phone calls."
  }'
```

### Get Recently Viewed Products
Get recently viewed products for the current user.

**Endpoint:** `GET /api/products/recently-viewed`  
**Authentication:** Bearer Token

**Query Parameters:**
- `limit`: Number of products to return (default: 10)

**Response (200 OK):**
```json
[