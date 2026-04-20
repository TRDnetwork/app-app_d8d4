# ShopSphere API Documentation

## Authentication Endpoints

### Register User
Create a new user account.

**POST** `/api/auth/register`

#### Request Body
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "message": "User registered successfully. Please verify your email.",
  "data": {
    "user": {
      "_id": "64a1b2c3d4e5f6a7b8c9d0e1",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer",
      "emailVerified": false
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Example cURL
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login User
Authenticate user with email and password.

**POST** `/api/auth/login`

#### Request Body
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "64a1b2c3d4e5f6a7b8c9d0e1",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer",
      "emailVerified": true,
      "profilePictureUrl": "",
      "phone": "",
      "loyaltyPoints": 0
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Example cURL
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Refresh Access Token
Get a new access token using the refresh token cookie.

**POST** `/api/auth/refresh`

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Example cURL
```bash
curl -X POST http://localhost:3001/api/auth/refresh \
  -H "Content-Type: application/json" \
  -H "Cookie: refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Verify Email
Verify user's email address using verification token.

**POST** `/api/auth/verify-email`

#### Request Body
```json
{
  "token": "123456"
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

#### Example cURL
```bash
curl -X POST http://localhost:3001/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "token": "123456"
  }'
```

### Forgot Password
Request password reset link.

**POST** `/api/auth/forgot-password`

#### Request Body
```json
{
  "email": "john@example.com"
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "If an account with this email exists, a password reset link has been sent"
}
```

#### Example cURL
```bash
curl -X POST http://localhost:3001/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com"
  }'
```

### Reset Password
Reset password using reset token.

**POST** `/api/auth/reset-password`

#### Request Body
```json
{
  "token": "123456",
  "newPassword": "newpassword123"
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

#### Example cURL
```bash
curl -X POST http://localhost:3001/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "123456",
    "newPassword": "newpassword123"
  }'
```

### Get Current User
Get current authenticated user's profile.

**GET** `/api/auth/me`

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "64a1b2c3d4e5f6a7b8c9d0e1",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer",
      "emailVerified": true,
      "profilePictureUrl": "",
      "phone": "",
      "loyaltyPoints": 0,
      "createdAt": "2023-07-01T10:00:00.000Z",
      "updatedAt": "2023-07-01T10:00:00.000Z"
    }
  }
}
```

#### Example cURL
```bash
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Update User Profile
Update current user's profile information.

**PATCH** `/api/auth/me`

#### Request Body
```json
{
  "name": "John Smith",
  "phone": "+14155552671",
  "profilePictureUrl": "https://example.com/images/profile.jpg"
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "_id": "64a1b2c3d4e5f6a7b8c9d0e1",
      "name": "John Smith",
      "email": "john@example.com",
      "role": "customer",
      "emailVerified": true,
      "profilePictureUrl": "https://example.com/images/profile.jpg",
      "phone": "+14155552671",
      "loyaltyPoints": 0,
      "createdAt": "2023-07-01T10:00:00.000Z",
      "updatedAt": "2023-07-02T15:30:00.000Z"
    }
  }
}
```

#### Example cURL
```bash
curl -X PATCH http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "phone": "+14155552671",
    "profilePictureUrl": "https://example.com/images/profile.jpg"
  }'
```

## User Management Endpoints

### List User Addresses
Get all addresses for the current user.

**GET** `/api/users/addresses`

#### Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "_id": "64a1b2c3d4e5f6a7b8c9d0e2",
      "user_id": "64a1b2c3d4e5f6a7b8c9d0e1",
      "type": "home",
      "line1": "123 Main St",
      "city": "New York",
      "state": "NY",
      "postal_code": "10001",
      "country": "USA",
      "is_default": true,
      "created_at": "2023-07-01T10:00:00.000Z"
    },
    {
      "_id": "64a1b2c3d4e5f6a7b8c9d0e3",
      "user_id": "64a1b2c3d4e5f6a7b8c9d0e1",
      "type": "work",
      "line1": "456 Office Ave",
      "city": "New York",
      "state": "NY",
      "postal_code": "10002",
      "country": "USA",
      "is_default": false,
      "created_at": "2023-07-02T14:20:00.000Z"
    }
  ]
}
```

#### Example cURL
```bash
curl -X GET http://localhost:3001/api/users/addresses \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Add User Address
Add a new address for the current user.

**POST** `/api/users/addresses`

#### Request Body
```json
{
  "type": "home",
  "line1": "789 Park Ave",
  "city": "New York",
  "state": "NY",
  "postal_code": "10016",
  "country": "USA",
  "is_default": false
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "_id": "64a1b2c3d4e5f6a7b8c9d0e4",
    "user_id": "64a1b2c3d4e5f6a7b8c9d0e1",
    "type": "home",
    "line1": "789 Park Ave",
    "city": "New York",
    "state": "NY",
    "postal_code": "10016",
    "country": "USA",
    "is_default": false,
    "created_at": "2023-07-03T11:15:00.000Z"
  }
}
```

#### Example cURL
```bash
curl -X POST http://localhost:3001/api/users/addresses \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "type": "home",
    "line1": "789 Park Ave",
    "city": "New York",
    "state": "NY",
    "postal_code": "10016",
    "country": "USA",
    "is_default": false
  }'
```

### Update User Address
Update an existing address.

**PUT** `/api/users/addresses/:id`

#### Request Body
```json
{
  "is_default": true
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "_id": "64a1b2c3d4e5f6a7b8c9d0e2",
    "user_id": "64a1b2c3d4e5f6a7b8c9d0e1",
    "type": "home",
    "line1": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postal_code": "10001",
    "country": "USA",
    "is_default": true,
    "created_at": "2023-07-01T10:00:00.000Z"
  }
}
```

#### Example cURL
```bash
curl -X PUT http://localhost:3001/api/users/addresses/64a1b2c3d4e5f6a7b8c9d0e2 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "is_default": true
  }'
```

### Delete User Address
Delete an address.

**DELETE** `/api/users/addresses/:id`

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Address deleted successfully"
}
```

#### Example cURL
```bash
curl -X DELETE http://localhost:3001/api/users/addresses/64a1b2c3d4e5f6a7b8c9d0e4 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Product Endpoints

### List Products
Get a list of products with filtering and sorting.

**GET** `/api/products`

#### Query Parameters
| Parameter | Type | Description |
|---------|------|-------------|
| `category_id` | string | Filter by category ID |
| `brand` | string | Filter by brand |
| `min_price` | number | Minimum price |
| `max_price` | number | Maximum price |
| `rating` | number | Minimum rating |
| `in_stock` | boolean | Filter by stock availability |
| `sort` | string | Sort by field (e.g., "-price" for descending price) |
| `limit` | number | Number of results per page |
| `page` | number | Page number |

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "_id": "64a1b2c3d4e5f6a7b8c9d0e5",
        "seller_id": "64a1b2c3d4e5f6a7b8c9d0e6",
        "title": "iPhone 14 Pro",
        "slug": "iphone-14-pro",
        "description": "Latest iPhone with A16 chip and 48MP main camera.",
        "category_id": "64a1b2c3d4e5f6a7b8c9d0e7",
        "brand": "Apple",
        "price": 999,
        "original_price": 1099,
        "discount_percent": 9,
        "sku": "IP14P-256GB",
        "stock_quantity": 50,
        "images": [
          "https://example.com/images/iphone14pro-1.jpg",
          "https://example.com/images/iphone14pro-2.jpg"
        ],
        "variants": [
          {
            "name": "Color",
            "values": ["Space Black", "Silver", "Gold", "Deep Purple"],
            "price_modifier": 0
          },
          {
            "name": "Storage",
            "values": ["128GB", "256GB", "512GB", "1TB"],
            "price_modifier": 0
          }
        ],
        "tags": ["smartphone", "apple", "ios"],
        "is_featured": true,
        "is_sponsored": false,
        "status": "active",
        "views": 150,
        "created_at": "2023-07-01T09:00:00.000Z",
        "updated_at": "2023-07-01T09:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "pages": 5,
      "limit": 20
    }
  }
}
```

#### Example cURL
```bash
curl -X GET "http://localhost:3001/api/products?category_id=64a1b2c3d4e5f6a7b8c9d0e7&min_price=500&max_price=1500&sort=-discount_percent&limit=10&page=1" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Get Product by Slug
Get a product by its slug.

**GET** `/api/products/:slug`

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "_id": "64a1b2c3d4e5f6a7b8c9d0e5",
    "seller_id": "64a1b2c3d4e5f6a7b8c9d0e6",
    "title": "iPhone 14 Pro",
    "slug": "iphone-14-pro",
    "description": "Latest iPhone with A16 chip and 48MP main camera.",
    "category_id": "64a1b2c3d4e5f6a7b8c9d0e7",
    "brand": "Apple",
    "price": 999,
    "original_price": 1099,
    "discount_percent": 9,
    "sku": "IP14P-256GB",
    "stock_quantity": 50,
    "images": [
      "https://example.com/images/iphone14pro-1.jpg",
      "https://example.com/images/iphone14pro-2.jpg"
    ],
    "variants": [
      {
        "name": "Color",
        "values": ["Space Black", "Silver", "Gold", "Deep Purple"],
        "price_modifier": 0
      },
      {
        "name": "Storage",
        "values": ["128GB", "256GB", "512GB", "1TB"],
        "price_modifier": 0
      }
    ],
    "tags": ["smartphone", "apple", "ios"],
    "is_featured": true,
    "is_sponsored": false,
    "status": "active",
    "views": 150,
    "created_at": "2023-07-01T09:00:00.000Z",
    "updated_at": "2023-07-01T09:00:00.000Z"
  }
}
```

#### Example cURL
```bash
curl -X GET http://localhost:3001/api/products/iphone-14-pro \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Get Product Reviews
Get reviews for a product.

**GET** `/api/products/:id/reviews`

#### Query Parameters
| Parameter | Type | Description |
|---------|------|-------------|
| `sort` | string | Sort by field (e.g., "-created_at" for newest first) |
| `limit` | number | Number of results per page |
| `page` | number | Page number |

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "_id": "64a1b2c3d4e5f6a7b8c9d0e8",
        "product_id": "64a1b2c3d4e5f6a7b8c9d0e5",
        "user_id": "64a1b2c3d4e5f6a7b8c9d0e1",
        "order_id": "64a1b2c3d4e5f6a7b8c9d0e9",
        "rating": 5,
        "title": "Amazing phone!",
        "comment": "Great product with excellent camera quality.",
        "images": [],
        "helpful_votes": 12,
        "verified_purchase": true,
        "created_at": "2023-07-02T14:30:00.000Z",
        "updated_at": "2023-07-02T14:30:00.000Z"
      }
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "pages": 3,
      "limit": 10
    },
    "stats": {
      "average_rating": 4.8,
      "total_reviews": 25,
      "rating_breakdown": {
        "5": 20,
        "4": 3,
        "3": 1,
        "2": 1,
        "1": 0
      }
    }
  }
}
```

#### Example cURL
```bash
curl -X GET "http://localhost:3001/api/products/64a1b2c3d4e5f6a7b8c9d0e5/reviews?sort=-created_at&limit=5" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Ask Product Question
Ask a question about a product.

**POST** `/api/products/:id/questions`

#### Request Body
```json
{
  "question": "Does this phone come with a charger?"
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "_id": "64a1b2c3d4e5f6a7b8c9d0ea",
    "product_id": "64a1b2c3d4e5f6a7b8c9d0e5",
    "user_id": "64a1b2c3d4e5f6a7b8c9d0e1",
    "question": "Does this phone come with a charger?",
    "answer": null,
    "answered_by": null,
    "created_at": "2023-07-03T16:45:00.000