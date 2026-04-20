# ShopSphere API Documentation

## Base URL
```
https://api.shopsphere.com/v1
```

## Authentication

All endpoints require authentication via JWT token, except for public endpoints.

### Authentication Headers
```
Authorization: Bearer <access_token>
```

### Token Refresh
When access token expires, use refresh token to get new access token:

```
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "your_refresh_token"
}
```

## Public Endpoints

### Register User
Create a new user account.

```
POST /api/auth/register
```

**Request Body**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (201 Created)**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "User registered successfully. Please check your email to verify your account.",
  "data": {
    "user": {
      "_id": "60d5ecf9f6578d001c54a3b1",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer",
      "emailVerified": false
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Curl Command**
```bash
curl -X POST https://api.shopsphere.com/v1/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

### Login User
Authenticate user and get JWT tokens.

```
POST /api/auth/login
```

**Request Body**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK)**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "60d5ecf9f6578d001c54a3b1",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer",
      "profilePictureUrl": null,
      "emailVerified": true
    },
    "tokens": {
      "accessToken": "your_access_token",
      "refreshToken": "your_refresh_token"
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Curl Command**
```bash
curl -X POST https://api.shopsphere.com/v1/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

### Verify Email
Verify user's email address using verification token.

```
POST /api/auth/verify-email
```

**Request Body**
```json
{
  "token": "verification_token_from_email"
}
```

**Response (200 OK)**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Email verified successfully",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Curl Command**
```bash
curl -X POST https://api.shopsphere.com/v1/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "token": "verification_token_from_email"
  }'
```

### Forgot Password
Request password reset link.

```
POST /api/auth/forgot-password
```

**Request Body**
```json
{
  "email": "john@example.com"
}
```

**Response (200 OK)**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "If an account with this email exists, a password reset link has been sent",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Curl Command**
```bash
curl -X POST https://api.shopsphere.com/v1/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com"
  }'
```

### Reset Password
Reset password using reset token.

```
POST /api/auth/reset-password
```

**Request Body**
```json
{
  "token": "reset_token_from_email",
  "newPassword": "newSecurePassword123"
}
```

**Response (200 OK)**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Password reset successfully",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Curl Command**
```bash
curl -X POST https://api.shopsphere.com/v1/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "reset_token_from_email",
    "newPassword": "newSecurePassword123"
  }'
```

## User Endpoints

### Get User Profile
Get current user's profile information.

```
GET /api/users/profile
```

**Response (200 OK)**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "User profile retrieved successfully",
  "data": {
    "user": {
      "_id": "60d5ecf9f6578d001c54a3b1",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "profilePictureUrl": "https://s3.amazonaws.com/shopsphere/profiles/john.jpg",
      "role": "customer",
      "loyaltyPoints": 250,
      "emailVerified": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Curl Command**
```bash
curl -X GET https://api.shopsphere.com/v1/api/users/profile \
  -H "Authorization: Bearer your_access_token"
```

### Update User Profile
Update user's profile information.

```
PUT /api/users/profile
```

**Request Body**
```json
{
  "name": "John Smith",
  "phone": "+1987654321"
}
```

**Response (200 OK)**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "User profile updated successfully",
  "data": {
    "user": {
      "_id": "60d5ecf9f6578d001c54a3b1",
      "name": "John Smith",
      "email": "john@example.com",
      "phone": "+1987654321",
      "profilePictureUrl": "https://s3.amazonaws.com/shopsphere/profiles/john.jpg",
      "role": "customer",
      "loyaltyPoints": 250,
      "emailVerified": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Curl Command**
```bash
curl -X PUT https://api.shopsphere.com/v1/api/users/profile \
  -H "Authorization: Bearer your_access_token" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "phone": "+1987654321"
  }'
```

### Upload Profile Picture
Upload and update user's profile picture.

```
PUT /api/users/profile/picture
```

**Request Body (multipart/form-data)**
- `file`: Image file (JPG, PNG, WebP)

**Response (200 OK)**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Profile picture updated successfully",
  "data": {
    "profilePictureUrl": "https://s3.amazonaws.com/shopsphere/profiles/john-new.jpg"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Curl Command**
```bash
curl -X PUT https://api.shopsphere.com/v1/api/users/profile/picture \
  -H "Authorization: Bearer your_access_token" \
  -F "file=@/path/to/profile.jpg"
```

### List Addresses
Get all saved addresses for the user.

```
GET /api/users/addresses
```

**Response (200 OK)**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Addresses retrieved successfully",
  "data": {
    "addresses": [
      {
        "_id": "60d5ecf9f6578d001c54a3b2",
        "type": "home",
        "line1": "123 Main St",
        "line2": "Apt 4B",
        "city": "San Francisco",
        "state": "CA",
        "postalCode": "94107",
        "country": "USA",
        "isDefault": true,
        "createdAt": "2024-01-01T00:00:00.000Z"
      },
      {
        "_id": "60d5ecf9f6578d001c54a3b3",
        "type": "work",
        "line1": "456 Business Ave",
        "city": "San Francisco",
        "state": "CA",
        "postalCode": "94105",
        "country": "USA",
        "isDefault": false,
        "createdAt": "2024-01-05T00:00:00.000Z"
      }
    ]
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Curl Command**
```bash
curl -X GET https://api.shopsphere.com/v1/api/users/addresses \
  -H "Authorization: Bearer your_access_token"
```

### Add Address
Add a new address for the user.

```
POST /api/users/addresses
```

**Request Body**
```json
{
  "type": "home",
  "line1": "789 Oak St",
  "city": "San Francisco",
  "state": "CA",
  "postalCode": "94110",
  "country": "USA",
  "isDefault": false
}
```

**Response (201 Created)**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Address added successfully",
  "data": {
    "address": {
      "_id": "60d5ecf9f6578d001c54a3b4",
      "type": "home",
      "line1": "789 Oak St",
      "city": "San Francisco",
      "state": "CA",
      "postalCode": "94110",
      "country": "USA",
      "isDefault": false,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Curl Command**
```bash
curl -X POST https://api.shopsphere.com/v1/api/users/addresses \
  -H "Authorization: Bearer your_access_token" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "home",
    "line1": "789 Oak St",
    "city": "San Francisco",
    "state": "CA",
    "postalCode": "94110",
    "country": "USA",
    "isDefault": false
  }'
```

### Update Address
Update an existing address.

```
PUT /api/users/addresses/:id
```

**Request Body**
```json
{
  "line1": "789 Oak St",
  "line2": "Unit 2",
  "isDefault": true
}
```

**Response (200 OK)**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Address updated successfully",
  "data": {
    "address": {
      "_id": "60d5ecf9f6578d001c54a3b4",
      "type": "home",
      "line1": "789 Oak St",
      "line2": "Unit 2",
      "city": "San Francisco",
      "state": "CA",
      "postalCode": "94110",
      "country": "USA",
      "isDefault": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:35:00.000Z"
    }
  },
  "timestamp": "2024-01-15T10:35:00.000Z"
}
```

**Curl Command**
```bash
curl -X PUT https://api.shopsphere.com/v1/api/users/addresses/60d5ecf9f6578d001c54a3b4 \
  -H "Authorization: Bearer your_access_token" \
  -H "Content-Type: application/json" \
  -d '{
    "line1": "789 Oak St",
    "line2": "Unit 2",
    "isDefault": true
  }'
```

### Delete Address
Delete an address.

```
DELETE /api/users/addresses/:id
```

**Response (200 OK)**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Address deleted successfully",
  "timestamp": "2024-01-15T10:35:00.000Z"
}
```

**Curl Command**
```bash
curl -X DELETE https://api.shopsphere.com/v1/api/users/addresses/60d5ecf9f6578d001c54a3b4 \
  -H "Authorization: Bearer your_access_token"
```

## Product Endpoints

### List Products
Get a list of products with filtering and pagination.

```
GET /api/products
```

**Query Parameters**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 50)
- `category`: Filter by category ID
- `brand`: Filter by brand
- `minPrice`: Minimum price
- `maxPrice`: Maximum price
- `rating`: Minimum rating (1-5)
- `inStock`: Filter by stock status (true/false)
- `sort`: Sort by (priceAsc, priceDesc, newest, bestSelling, rating)
- `search`: Search query

**Response (200 OK)**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Products retrieved successfully",
  "data": {
    "products": [
      {
        "_id": "60d5ecf9f6578d001c54a3b5",
        "title": "iPhone 15 Pro",
        "slug": "iphone-15-pro",
        "description": "Latest Apple smartphone with A17 chip and titanium design.",
        "category": {
          "_id": "60d5ecf9f6578d001c54a3b6",
          "name": "Smartphones"
        },
        "brand": "Apple",
        "price": 999,
        "originalPrice": 1099,
        "discountPercent": 9,
        "sku": "IP15P-256GB-NATURAL",
        "stockQuantity": 50,
        "images": [
          "https://s3.amazonaws.com/shopsphere/products/iphone15pro-1.jpg",
          "https://s3.amazonaws.com/shopsphere/products/iphone15pro-2.jpg"
        ],
        "variants": [
          {
            "name": "Storage",
            "values": ["128GB", "256GB", "512GB"],
            "priceModifier": 0
          }
        ],
        "tags": ["smartphone", "apple", "ios"],
        "isFeatured": true,
        "isSponsored": true,
        "status": "active",
        "views": 150,
        "createdAt": "2024-01-10T00:00:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8,
      "hasNext": true,
      "hasPrev": false
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Curl Command**
```bash
curl -X GET "https://api.shopsphere.com/v1/api/products?page=1&limit=10&category=60d5ecf9f6578d001c54a3b6&minPrice=500&sort=priceAsc" \
  -H "Authorization: Bearer your_access_token"
```

### Get Product by Slug
Get a product by its slug.

```
GET /api/products/:slug
```

**Response (200 OK)**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Product retrieved successfully",
  "data": {
    "product": {
      "_id": "60d5ecf9f6578d001c54a3b5",
      "title": "iPhone 15 Pro",
      "slug": "iphone-15-pro",
      "description": "Latest Apple smartphone with A17 chip and titanium design.",
      "category": {
        "_id": "60d5ecf9f6578d001c54a3b6",
        "name": "Smartphones"
      },
      "brand": "Apple",
      "price": 999,
      "originalPrice": 1099,
      "discountPercent": 9,
      "sku": "IP15P-256GB-NATURAL",
      "stockQuantity": 50,
      "images": [
        "https://s3.amazonaws.com/shopsphere/products/iphone15pro-1.jpg",
        "https://s3.amazonaws.com/shopsphere/products/iphone15pro-2.jpg"
      ],
      "variants": [
        {
          "name": "Storage",
          "values": ["128GB", "256GB", "512GB"],
          "priceModifier": 0
        }
      ],
      "tags": ["smartphone", "apple", "ios"],
      "isFeatured": true,
      "isSponsored": true,
      "status": "active",
      "views": 150,
      "createdAt": "2024-01-10T00:00:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Curl Command**
```bash
curl -X GET https://api.shopsphere.com/v1/api/products/iphone-15-pro \
  -H "Authorization: Bearer your_access_token"
```

### Get Product Reviews
Get reviews for a product.

```
GET /api/products/:id/reviews
```

**Query Parameters**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 20)
- `sort`: Sort by (newest, oldest, highestRating, lowestRating)

**Response (200 OK)**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Product reviews retrieved successfully",
  "data": {
    "reviews": [
      {
        "_id": "60d5ecf9f6578d001c54a3b7",
        "product": {
          "_id": "60d5ecf9f6578d001c54a3b5",
          "title": "iPhone 15 Pro"
        },
        "user": {
          "_id": "60d5ecf9f6578d001c54a3b1",
          "name": "John Doe"
        },
        "order": {
          "_id": "60d5ecf9f6578d001c54a3b8"
        },
        "rating": 5,
        "title": "Amazing phone!",
        "comment": "The iPhone 15 Pro is incredible. The camera quality is outstanding and the performance is lightning fast.",
        "images": [
          "https://s3.amazonaws.com/shopsphere/reviews/iphone15pro-review1.jpg"
        ],
        "helpfulVotes": 12,
        "verifiedPurchase": true,
        "createdAt": "2024-01-12T10:30:00.000Z",
        "updatedAt": "2024-01-12T10:30:00.000Z"