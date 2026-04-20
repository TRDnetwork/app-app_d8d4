# ShopSphere API Documentation

## Authentication Endpoints

### Register User
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Description**: Register a new user with email and password
- **Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123!"
}
```
- **Response**:
```json
{
  "message": "Registration successful. Please check your email to verify your account.",
  "user": {
    "_id": "60d5ecf9f654821f8c5a3b1a",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "customer",
    "email_verified": false
  }
}
```
- **Example**:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"securePassword123!"}'
```

### Login User
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Description**: Authenticate user and return JWT tokens
- **Request Body**:
```json
{
  "email": "john@example.com",
  "password": "securePassword123!"
}
```
- **Response**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60d5ecf9f654821f8c5a3b1a",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "customer",
    "email_verified": true
  }
}
```
- **Example**:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"securePassword123!"}'
```

### Refresh Token
- **URL**: `/api/auth/refresh`
- **Method**: `POST`
- **Description**: Refresh expired access token using refresh token
- **Request Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
- **Response**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
- **Example**:
```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}'
```

### Verify Email
- **URL**: `/api/auth/verify-email`
- **Method**: `POST`
- **Description**: Verify user's email address using verification token
- **Request Body**:
```json
{
  "token": "a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8"
}
```
- **Response**:
```json
{
  "message": "Email verified successfully"
}
```
- **Example**:
```bash
curl -X POST http://localhost:3000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{"token":"a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8"}'
```

### Forgot Password
- **URL**: `/api/auth/forgot-password`
- **Method**: `POST`
- **Description**: Request password reset link to be sent to user's email
- **Request Body**:
```json
{
  "email": "john@example.com"
}
```
- **Response**:
```json
{
  "message": "Password reset link sent to your email"
}
```
- **Example**:
```bash
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com"}'
```

### Reset Password
- **URL**: `/api/auth/reset-password`
- **Method**: `POST`
- **Description**: Reset user's password using reset token
- **Request Body**:
```json
{
  "token": "a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8",
  "password": "newSecurePassword123!"
}
```
- **Response**:
```json
{
  "message": "Password reset successfully"
}
```
- **Example**:
```bash
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8","password":"newSecurePassword123!"}'
```

## User Management Endpoints

### Get Current User
- **URL**: `/api/users/me`
- **Method**: `GET`
- **Description**: Get current authenticated user's profile
- **Headers**: `Authorization: Bearer <accessToken>`
- **Response**:
```json
{
  "_id": "60d5ecf9f654821f8c5a3b1a",
  "email": "john@example.com",
  "name": "John Doe",
  "phone": "+1234567890",
  "profile_picture_url": "https://s3.amazonaws.com/shopsphere-media-bucket/uploads/abc123.jpg",
  "role": "customer",
  "email_verified": true,
  "created_at": "2023-06-25T10:00:00.000Z",
  "updated_at": "2023-06-25T10:00:00.000Z"
}
```
- **Example**:
```bash
curl -X GET http://localhost:3000/api/users/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Update User Profile
- **URL**: `/api/users/me`
- **Method**: `PUT`
- **Description**: Update current user's profile information
- **Headers**: `Authorization: Bearer <accessToken>`
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
  "message": "Profile updated successfully",
  "user": {
    "_id": "60d5ecf9f654821f8c5a3b1a",
    "email": "john@example.com",
    "name": "John Smith",
    "phone": "+1987654321",
    "profile_picture_url": "https://s3.amazonaws.com/shopsphere-media-bucket/uploads/abc123.jpg",
    "role": "customer",
    "email_verified": true
  }
}
```
- **Example**:
```bash
curl -X PUT http://localhost:3000/api/users/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"name":"John Smith","phone":"+1987654321"}'
```

### Upload Profile Picture
- **URL**: `/api/users/me/avatar`
- **Method**: `POST`
- **Description**: Upload and update user's profile picture
- **Headers**: `Authorization: Bearer <accessToken>`
- **Request Body**: Multipart form data with file
- **Response**:
```json
{
  "message": "Profile picture uploaded successfully",
  "url": "https://s3.amazonaws.com/shopsphere-media-bucket/uploads/def456.jpg"
}
```
- **Example**:
```bash
curl -X POST http://localhost:3000/api/users/me/avatar \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -F "file=@/path/to/profile.jpg"
```

### Get User Addresses
- **URL**: `/api/users/me/addresses`
- **Method**: `GET`
- **Description**: Get all saved addresses for the current user
- **Headers**: `Authorization: Bearer <accessToken>`
- **Response**:
```json
[
  {
    "_id": "60d5ecf9f654821f8c5a3b1b",
    "label": "Home",
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zip": "10001",
    "country": "USA",
    "is_default": true,
    "created_at": "2023-06-25T10:00:00.000Z"
  },
  {
    "_id": "60d5ecf9f654821f8c5a3b1c",
    "label": "Work",
    "street": "456 Office Ave",
    "city": "New York",
    "state": "NY",
    "zip": "10002",
    "country": "USA",
    "is_default": false,
    "created_at": "2023-06-25T10:00:00.000Z"
  }
]
```
- **Example**:
```bash
curl -X GET http://localhost:3000/api/users/me/addresses \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Add New Address
- **URL**: `/api/users/me/addresses`
- **Method**: `POST`
- **Description**: Add a new address for the current user
- **Headers**: `Authorization: Bearer <accessToken>`
- **Request Body**:
```json
{
  "label": "Vacation Home",
  "street": "789 Beach Rd",
  "city": "Miami",
  "state": "FL",
  "zip": "33101",
  "country": "USA",
  "is_default": false
}
```
- **Response**:
```json
{
  "message": "Address added successfully",
  "address": {
    "_id": "60d5ecf9f654821f8c5a3b1d",
    "label": "Vacation Home",
    "street": "789 Beach Rd",
    "city": "Miami",
    "state": "FL",
    "zip": "33101",
    "country": "USA",
    "is_default": false,
    "created_at": "2023-06-25T10:00:00.000Z"
  }
}
```
- **Example**:
```bash
curl -X POST http://localhost:3000/api/users/me/addresses \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"label":"Vacation Home","street":"789 Beach Rd","city":"Miami","state":"FL","zip":"33101","country":"USA","is_default":false}'
```

## Product Endpoints

### List Products
- **URL**: `/api/products`
- **Method**: `GET`
- **Description**: Get list of products with filtering, sorting, and pagination
- **Query Parameters**:
  - `search`: Search term
  - `category`: Filter by category
  - `brand`: Filter by brand
  - `minPrice`: Minimum price
  - `maxPrice`: Maximum price
  - `rating`: Minimum rating (1-5)
  - `sort`: Sort by (priceAsc, priceDesc, newest, bestSelling, avgRating)
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 20)
- **Response**:
```json
{
  "products": [
    {
      "_id": "60d5ecf9f654821f8c5a3b1e",
      "title": "Wireless Earbuds",
      "description": "High-quality wireless earbuds with noise cancellation",
      "category": "Electronics",
      "brand": "SoundMax",
      "price": 99.99,
      "original_price": 149.99,
      "discount_percent": 33,
      "images": [
        "https://s3.amazonaws.com/shopsphere-media-bucket/products/earbuds1.jpg",
        "https://s3.amazonaws.com/shopsphere-media-bucket/products/earbuds2.jpg"
      ],
      "variants": [
        {
          "size": "",
          "color": "Black",
          "sku": "EARB-001-BLK",
          "stock": 50
        },
        {
          "size": "",
          "color": "White",
          "sku": "EARB-001-WHT",
          "stock": 30
        }
      ],
      "stock_total": 80,
      "status": "active",
      "avg_rating": 4.5,
      "review_count": 127,
      "view_count": 1543,
      "tags": ["wireless", "earbuds", "noise-cancellation"],
      "created_at": "2023-06-25T10:00:00.000Z",
      "updated_at": "2023-06-25T10:00:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "pages": 1,
  "limit": 20
}
```
- **Example**:
```bash
curl -X GET "http://localhost:3000/api/products?category=Electronics&minPrice=50&maxPrice=200&sort=priceAsc&page=1&limit=10" \
  -H "Content-Type: application/json"
```

### Get Product Details
- **URL**: `/api/products/:id`
- **Method**: `GET`
- **Description**: Get detailed information about a specific product
- **Response**:
```json
{
  "_id": "60d5ecf9f654821f8c5a3b1e",
  "title": "Wireless Earbuds",
  "description": "High-quality wireless earbuds with noise cancellation",
  "category": "Electronics",
  "brand": "SoundMax",
  "price": 99.99,
  "original_price": 149.99,
  "discount_percent": 33,
  "images": [
    "https://s3.amazonaws.com/shopsphere-media-bucket/products/earbuds1.jpg",
    "https://s3.amazonaws.com/shopsphere-media-bucket/products/earbuds2.jpg"
  ],
  "variants": [
    {
      "size": "",
      "color": "Black",
      "sku": "EARB-001-BLK",
      "stock": 50
    },
    {
      "size": "",
      "color": "White",
      "sku": "EARB-001-WHT",
      "stock": 30
    }
  ],
  "stock_total": 80,
  "status": "active",
  "avg_rating": 4.5,
  "review_count": 127,
  "view_count": 1543,
  "tags": ["wireless", "earbuds", "noise-cancellation"],
  "created_at": "2023-06-25T10:00:00.000Z",
  "updated_at": "2023-06-25T10:00:00.000Z",
  "seller": {
    "_id": "60d5ecf9f654821f8c5a3b1f",
    "name": "SoundMax Official",
    "role": "seller"
  }
}
```
- **Example**:
```bash
curl -X GET http://localhost:3000/api/products/60d5ecf9f654821f8c5a3b1e \
  -H "Content-Type: application/json"
```

### Get Related Products
- **URL**: `/api/products/:id/related`
- **Method**: `GET`
- **Description**: Get products related to the specified product
- **Response**:
```json
[
  {
    "_id": "60d5ecf9f654821f8c5a3b20",
    "title": "Bluetooth Headphones",
    "price": 149.99,
    "original_price": 199.99,
    "discount_percent": 25,
    "images": [
      "https://s3.amazonaws.com/shopsphere-media-bucket/products/headphones1.jpg"
    ],
    "avg_rating": 4.3,
    "review_count": 89
  },
  {
    "_id": "60d5ecf9f654821f8c5a3b21",
    "title": "Wireless Charging Pad",
    "price": 29.99,
    "images": [
      "https://s3.amazonaws.com/shopsphere-media-bucket/products/charger1.jpg"
    ],
    "avg_rating": 4.7,
    "review_count": 203
  }
]
```
- **Example**:
```bash
curl -X GET http://localhost:3000/api/products/60d5ecf9f654821f8c5a3b1e/related \
  -H "Content-Type: application/json"
```

### Get Product Questions
- **URL**: `/api/products/:id/questions`
- **Method**: `GET`
- **Description**: Get all questions and answers for a product
- **Response**:
```json
[
  {
    "_id": "60d5ecf9f654821f8c5a3b22",
    "question": "Do these earbuds work with Android phones?",
    "answer": "Yes, these earbuds are compatible with all Bluetooth-enabled devices including Android phones.",
    "answered_by": {
      "_id": "60d5ecf9f654821f8c5a3b1f",
      "name": "SoundMax Official"
    },
    "created_at": "2023-06-25T10:00:00.000Z",
    "answered_at": "2023-06-25T11:00:00.000Z"
  },
  {
    "_id": "60d5ecf9f654821f8c5a3b23",
    "question": "What's the battery life?",
    "answer": "The earbuds provide up to 8 hours of playback on a single charge, with an additional 24 hours from the charging case.",
    "answered_by": {
      "_id": "60d5ecf9f654821f8c5a3b1f",
      "name": "SoundMax Official"
    },
    "created_at": "2023-06-25T12:00:00.000Z",
    "answered_at": "2023-06-25T12:30:00.000Z"
  }
]
```
- **Example**:
```bash
curl -X GET http://localhost:3000/api/products/60d5ecf9f654821f8c5a3b1e/questions \
  -H "Content-Type: application/json"
```

### Ask Product Question
- **URL**: `/api/products/:id/questions`
- **Method**: `POST`
- **Description**: Ask a question about a product
- **Headers**: `Authorization: Bearer <accessToken>`
- **Request Body**:
```json
{
  "question": "Do these earbuds come with different ear tip sizes?"
}
```
- **Response**:
```json
{
  "message": "Question submitted successfully",
  "question": {
    "_id": "60d5ecf9f654821f8c5a3b24",
    "product_id": "60d5ecf9f654821f8c5a3b1e",
    "user_id": "60d5ecf9f654821f8c5a3b1a",
    "question": "Do these earbuds come with different ear tip sizes?",
    "created_at": "2023-06-25T13:00:00.000Z"
  }
}
```
- **Example**:
```bash
curl -X POST http://localhost:3000/api/products/60d5ecf9f654821f8c5a3b1e/questions \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"question":"Do these earbuds come with different ear tip sizes?"}'
```

## Cart Endpoints

### Get Cart
- **URL**: `/api/cart`
- **Method**: `GET`
- **Description**: Get current user's cart
- **Headers**: `Authorization: Bearer <accessToken>`
- **Response**:
```json
{
  "items": [
    {
      "_id": "60d5ecf9f654821f8c5a3b25",
      "product_id": "60d5ecf9f654821f8c5a3b1e",
      "variant_id": "60d5ecf9f654821f8c5a3b26",
      "quantity": 2,
      "price_snapshot": 99.99,
      "product_title": "Wireless Earbuds",
      "product_image": "https://s3.amazonaws.com/shopsphere-media-bucket/products/earbuds1.jpg"
    }
  ],
  "subtotal": 199.98,
  "discount": 0,
  "total": 199.98
}
```
- **Example**:
```bash
curl -X GET http://localhost:3000/api/cart \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Add Item to Cart
- **URL**: `/api/cart/items`
- **Method**: `POST`
- **Description**: Add an item to the user's cart
- **Headers**: `Authorization: Bearer <accessToken>`
- **Request Body**:
```json
{
  "product_id": "60d5ecf9f654821f8c5a3b1e",
  "variant_id": "60d5ecf9f654821f8c5a3b26",
  "quantity": 1
}
```
- **Response**:
```json
{
  "message": "Item added to cart",
  "cart": {
    "items": [
      {
        "_id": "60d5ecf9f654821f8c5a3b25",
        "product_id": "60d5ecf9f654821f8c5a3b1e",
        "variant_id": "60d5ecf9f654821f8c5a3b26",
        "quantity": 1,
        "price_snapshot": 99.99,
        "product_title": "Wireless Earbuds",
        "product_image": "https://s3.amazonaws.com/shopsphere-media-bucket/products/earbuds1.jpg"
      }
    ],
    "subtotal": 99.99,
    "discount": 0,
    "total": 99.99
  }
}
```
- **Example**:
```bash
curl -X POST http://localhost:3000/api/cart/items \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"product_id":"60d5ecf9f654821f8c5a3b1e","variant_id":"60d5ecf9f654821f8c5a3b26","quantity":1}'
```

### Update Cart Item
- **URL**: `/api/cart/items/:id`
- **Method**: `PUT`
- **Description**: Update the quantity of a cart item
- **Headers**: `Authorization: Bearer <accessToken>`
- **Request Body**:
```json
{
  "quantity": 3
}
```
- **Response**:
```json
{
  "message": "Cart item updated",
  "cart": {
    "items": [
      {
        "_id": "60d5ecf9f654821f8c5a3b25",
        "product_id": "60d5ecf9f654821f8c5a3b1e",
        "variant_id": "60d5ecf9f654821f8c5a3b26",
        "quantity": 3,
        "price_snapshot": 99.99,
        "product_title": "Wireless Earbuds",
        "product_image": "https://s3.amazonaws.com/shopsphere-media-bucket/products/earbuds1.jpg"
      }
    ],
    "subtotal": 299.97,
    "discount": 0,
    "total": 299.97
  }
}
```
- **Example**:
```bash
curl -X PUT http://localhost:3000/api/cart/items/60d5ecf9f654821f8c5a3b25 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"quantity":3}'
```

### Remove Cart Item
- **URL**: `/api/cart/items/:id`
- **Method**: `DELETE`
- **Description**: Remove an item from the cart
- **Headers**: `Authorization: Bearer <accessToken>`
- **Response**:
```json
{
  "message": "Item removed from cart",
  "cart": {
    "items": [],
    "subtotal": 0,
    "discount": 0,
    "total": 0
  }
}
```
- **Example**:
```bash
curl -X DELETE http://localhost:3000/api/cart/items/60d5ecf9f654821f8c5a3b25 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Apply Coupon
- **URL**: `/api/cart/apply-coupon`
- **Method**: `POST`
- **Description**: Apply a coupon code to the cart
- **Headers**: `Authorization: Bearer <accessToken>`
- **Request Body**:
```json
{
  "code": "SAVE10"
}
```
- **Response**:
```json
{
  "message": "Coupon applied successfully",
  "cart": {
    "items": [
      {
        "_id": "60d5ecf9f654821f8c5a3b25",
        "product_id": "60d5ecf9f654821f8c5a3b1e",
        "variant_id": "60d5ecf9f654821f8c5a3b26",
        "quantity": 1,
        "price_snapshot": 99.99,
        "product_title": "