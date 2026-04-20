# ShopSphere API Documentation

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
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token",
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer",
      "profilePictureUrl": "url_to_profile_picture",
      "phone": "1234567890",
      "emailVerified": true
    }
  }
  ```

### Refresh Token
- **Endpoint**: `POST /api/auth/refresh`
- **Description**: Refresh JWT access token using refresh token (sent as HTTP-only cookie)
- **Response**:
  ```json
  {
    "success": true,
    "accessToken": "new_jwt_access_token",
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer",
      "profilePictureUrl": "url_to_profile_picture",
      "phone": "1234567890",
      "emailVerified": true
    }
  }
  ```

### Verify Email
- **Endpoint**: `POST /api/auth/verify-email`
- **Description**: Verify user's email address using verification token
- **Request Body**:
  ```json
  {
    "token": "verification_token"
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
    "token": "reset_token",
    "password": "new_password123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Password reset successful"
  }
  ```

## Users

### Get Current User
- **Endpoint**: `GET /api/users/me`
- **Description**: Get current authenticated user's profile
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**:
  ```json
  {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "profilePictureUrl": "url_to_profile_picture",
    "phone": "1234567890",
    "emailVerified": true,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
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
    "phone": "0987654321"
  }
  ```
- **Response**:
  ```json
  {
    "_id": "user_id",
    "name": "John Smith",
    "email": "john@example.com",
    "role": "customer",
    "profilePictureUrl": "url_to_profile_picture",
    "phone": "0987654321",
    "emailVerified": true,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-02T00:00:00.000Z"
  }
  ```

### Upload Profile Picture
- **Endpoint**: `POST /api/users/me/avatar`
- **Description**: Upload and update user's profile picture
- **Headers**: `Authorization: Bearer <access_token>`
- **Request**: Form data with file field named "avatar"
- **Response**:
  ```json
  {
    "success": true,
    "profilePictureUrl": "https://s3.amazonaws.com/bucket/avatar.jpg"
  }
  ```

### Get User Addresses
- **Endpoint**: `GET /api/users/me/addresses`
- **Description**: Get current user's saved addresses
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**:
  ```json
  [
    {
      "_id": "address_id",
      "label": "Home",
      "street": "123 Main St",
      "city": "Anytown",
      "state": "CA",
      "zip": "12345",
      "country": "USA",
      "isDefault": true,
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  ]
  ```

### Add Address
- **Endpoint**: `POST /api/users/me/addresses`
- **Description**: Add a new address for current user
- **Headers**: `Authorization: Bearer <access_token>`
- **Request Body**:
  ```json
  {
    "label": "Work",
    "street": "456 Office Ave",
    "city": "Businesstown",
    "state": "CA",
    "zip": "67890",
    "country": "USA",
    "isDefault": false
  }
  ```
- **Response**:
  ```json
  {
    "_id": "new_address_id",
    "label": "Work",
    "street": "456 Office Ave",
    "city": "Businesstown",
    "state": "CA",
    "zip": "67890",
    "country": "USA",
    "isDefault": false,
    "createdAt": "2023-01-02T00:00:00.000Z"
  }
  ```

### Update Address
- **Endpoint**: `PUT /api/users/me/addresses/:id`
- **Description**: Update a specific address for current user
- **Headers**: `Authorization: Bearer <access_token>`
- **Request Body**:
  ```json
  {
    "label": "Work (Updated)",
    "isDefault": true
  }
  ```
- **Response**:
  ```json
  {
    "_id": "address_id",
    "label": "Work (Updated)",
    "street": "456 Office Ave",
    "city": "Businesstown",
    "state": "CA",
    "zip": "67890",
    "country": "USA",
    "isDefault": true,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-03T00:00:00.000Z"
  }
  ```

### Delete Address
- **Endpoint**: `DELETE /api/users/me/addresses/:id`
- **Description**: Delete a specific address for current user
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**: 204 No Content

## Products

### Get Products
- **Endpoint**: `GET /api/products`
- **Description**: Get list of products with filtering, sorting, and pagination
- **Query Parameters**:
  - `category`: Filter by category
  - `brand`: Filter by brand
  - `minPrice`: Minimum price
  - `maxPrice`: Maximum price
  - `rating`: Minimum rating (1-5)
  - `status`: Filter by status (active, draft, archived)
  - `sort`: Sort by field (e.g., "price", "-price", "created_at")
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
- **Response**:
  ```json
  {
    "products": [
      {
        "_id": "product_id",
        "seller_id": "seller_id",
        "title": "Product Name",
        "description": "Product description",
        "category": "Electronics",
        "brand": "Brand Name",
        "price": 99.99,
        "original_price": 129.99,
        "discount_percent": 23,
        "images": [
          "https://s3.amazonaws.com/bucket/image1.jpg",
          "https://s3.amazonaws.com/bucket/image2.jpg"
        ],
        "variants": [
          {
            "size": "M",
            "color": "Blue",
            "sku": "SKU123",
            "stock": 10
          }
        ],
        "stock_total": 10,
        "status": "active",
        "avg_rating": 4.5,
        "review_count": 123,
        "view_count": 500,
        "tags": ["tag1", "tag2"],
        "created_at": "2023-01-01T00:00:00.000Z",
        "updated_at": "2023-01-01T00:00:00.000Z"
      }
    ],
    "total": 100,
    "page": 1,
    "pages": 10
  }
  ```

### Get Product Detail
- **Endpoint**: `GET /api/products/:id`
- **Description**: Get detailed information about a specific product
- **Response**:
  ```json
  {
    "_id": "product_id",
    "seller_id": "seller_id",
    "title": "Product Name",
    "description": "Product description",
    "category": "Electronics",
    "brand": "Brand Name",
    "price": 99.99,
    "original_price": 129.99,
    "discount_percent": 23,
    "images": [
      "https://s3.amazonaws.com/bucket/image1.jpg",
      "https://s3.amazonaws.com/bucket/image2.jpg"
    ],
    "variants": [
      {
        "size": "M",
        "color": "Blue",
        "sku": "SKU123",
        "stock": 10
      }
    ],
    "stock_total": 10,
    "status": "active",
    "avg_rating": 4.5,
    "review_count": 123,
    "view_count": 500,
    "tags": ["tag1", "tag2"],
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  }
  ```

### Get Related Products
- **Endpoint**: `GET /api/products/:id/related`
- **Description**: Get products related to a specific product
- **Query Parameters**:
  - `limit`: Number of related products to return (default: 4)
- **Response**:
  ```json
  [
    {
      "_id": "related_product_id",
      "title": "Related Product Name",
      "price": 89.99,
      "image": "https://s3.amazonaws.com/bucket/related_image.jpg",
      "rating": 4.2,
      "reviewCount": 89
    }
  ]
  ```

### Get Product Questions
- **Endpoint**: `GET /api/products/:id/questions`
- **Description**: Get Q&A for a specific product
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
- **Response**:
  ```json
  {
    "questions": [
      {
        "_id": "question_id",
        "product_id": "product_id",
        "user_id": "user_id",
        "question": "What is the return policy?",
        "answer": "We offer a 30-day return policy.",
        "answered_by": "seller_id",
        "created_at": "2023-01-01T00:00:00.000Z",
        "answered_at": "2023-01-01T01:00:00.000Z"
      }
    ],
    "total": 5,
    "page": 1,
    "pages": 1
  }
  ```

### Ask Question
- **Endpoint**: `POST /api/products/:id/questions`
- **Description**: Ask a question about a product
- **Headers**: `Authorization: Bearer <access_token>`
- **Request Body**:
  ```json
  {
    "question": "What is the return policy?"
  }
  ```
- **Response**:
  ```json
  {
    "_id": "question_id",
    "product_id": "product_id",
    "user_id": "user_id",
    "question": "What is the return policy?",
    "created_at": "2023-01-01T00:00:00.000Z"
  }
  ```

### Increment View Count
- **Endpoint**: `PUT /api/products/:id/view`
- **Description**: Increment the view count for a product
- **Response**: 204 No Content

## Cart

### Get Cart
- **Endpoint**: `GET /api/cart`
- **Description**: Get current user's cart
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**:
  ```json
  {
    "items": [
      {
        "_id": "cart_item_id",
        "product_id": "product_id",
        "variant_id": "variant_id",
        "title": "Product Name",
        "price_snapshot": 99.99,
        "image": "https://s3.amazonaws.com/bucket/image.jpg",
        "quantity": 2,
        "created_at": "2023-01-01T00:00:00.000Z",
        "updated_at": "2023-01-01T00:00:00.000Z"
      }
    ],
    "total": 199.98
  }
  ```

### Add to Cart
- **Endpoint**: `POST /api/cart/items`
- **Description**: Add an item to the cart
- **Headers**: `Authorization: Bearer <access_token>`
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
    "_id": "cart_item_id",
    "product_id": "product_id",
    "variant_id": "variant_id",
    "title": "Product Name",
    "price_snapshot": 99.99,
    "image": "https://s3.amazonaws.com/bucket/image.jpg",
    "quantity": 1,
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  }
  ```

### Update Cart Item
- **Endpoint**: `PUT /api/cart/items/:id`
- **Description**: Update the quantity of a cart item
- **Headers**: `Authorization: Bearer <access_token>`
- **Request Body**:
  ```json
  {
    "quantity": 3
  }
  ```
- **Response**:
  ```json
  {
    "_id": "cart_item_id",
    "product_id": "product_id",
    "variant_id": "variant_id",
    "title": "Product Name",
    "price_snapshot": 99.99,
    "image": "https://s3.amazonaws.com/bucket/image.jpg",
    "quantity": 3,
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-02T00:00:00.000Z"
  }
  ```

### Remove from Cart
- **Endpoint**: `DELETE /api/cart/items/:id`
- **Description**: Remove an item from the cart
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**: 204 No Content

### Apply Coupon
- **Endpoint**: `POST /api/cart/apply-coupon`
- **Description**: Apply a coupon to the cart
- **Headers**: `Authorization: Bearer <access_token>`
- **Request Body**:
  ```json
  {
    "code": "SAVE10"
  }
  ```
- **Response**:
  ```json
  {
    "valid": true,
    "coupon": {
      "code": "SAVE10",
      "discount_type": "percent",
      "discount_value": 10,
      "min_order_value": 50,
      "max_uses": 100,
      "used_count": 5,
      "valid_from": "2023-01-01T00:00:00.000Z",
      "valid_until": "2023-12-31T23:59:59.999Z",
      "active": true
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
    "product_ids": ["product_id_1", "product_id_2"]
  }
  ```

### Add to Wishlist
- **Endpoint**: `POST /api/wishlist/:productId`
- **Description**: Add a product to the wishlist
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**: 204 No Content

### Remove from Wishlist
- **Endpoint**: `DELETE /api/wishlist/:productId`
- **Description**: Remove a product from the wishlist
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**: 204 No Content

## Orders

### Get Order History
- **Endpoint**: `GET /api/orders`
- **Description**: Get current user's order history
- **Headers**: `Authorization: Bearer <access_token>`
- **Query Parameters**:
  - `status`: Filter by order status
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
- **Response**:
  ```json
  {
    "orders": [
      {
        "_id": "order_id",
        "order_number": "ORD-123456",
        "items": [
          {
            "product_id": "product_id",
            "title": "Product Name",
            "price": 99.99,
            "quantity": 1,
            "seller_id": "seller_id"
          }
        ],
        "total_amount": 99.99,
        "discount_amount": 0,
        "delivery_fee": 5.99,
        "tax_amount": 8.50,
        "payment_method": "card",
        "payment_status": "completed",
        "order_status": "delivered",
        "address": {
          "label": "Home",
          "street": "123 Main St",
          "city": "Anytown",
          "state": "CA",
          "zip": "12345",
          "country": "USA"
        },
        "tracking_number": "1234567890",
        "delivery_speed": "standard",
        "coupon_code": null,
        "created_at": "2023-01-01T00:00:00.000Z",
        "updated_at": "2023-01-05T00:00:00.000Z",
        "delivered_at": "2023-01-05T00:00:00.000Z"
      }
    ],
    "total": 5,
    "page": 1,
    "pages": 1
  }
  ```

### Create Order
- **Endpoint**: `POST /api/orders`
- **Description**: Create a new order
- **Headers**: `Authorization: Bearer <access_token>`
- **Request Body**:
  ```json
  {
    "address_id": "address_id",
    "delivery_speed": "standard",
    "payment_method": "card",
    "coupon_code": "SAVE10"
  }
  ```
- **Response**:
  ```json
  {
    "_id": "order_id",
    "order_number": "ORD-123456",
    "items": [
      {
        "product_id": "product_id",
        "title": "Product Name",
        "price": 99.99,
        "quantity": 1,
        "seller_id": "seller_id"
      }
    ],
    "total_amount": 99.99,
    "discount_amount": 9.99,
    "delivery_fee": 5.99,
    "tax_amount": 8.50,
    "payment_method": "card",
    "payment_status": "pending",
    "order_status": "placed",
    "address": {
      "label": "Home",
      "street": "123 Main St",
      "city": "Anytown",
      "state": "CA",
      "zip": "12345",
      "country": "USA"
    },
    "tracking_number": null,
    "delivery_speed": "standard",
    "coupon_code": "SAVE10",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  }
  ```

### Get Order Detail
- **Endpoint**: `GET /api/orders/:id`
- **Description**: Get detailed information about a specific order
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**:
  ```json
  {
    "_id": "order_id",
    "order_number": "ORD-123456",
    "items": [
      {
        "product_id": "product_id",
        "title": "Product Name",
        "price": 99.99,
        "quantity": 1,
        "seller_id": "seller_id"
      }
    ],
    "total_amount": 99.99,
    "discount_amount": 9.99,
    "delivery_fee": 5.99,
    "tax_amount": 8.50,
    "payment_method": "card",
    "payment_status": "completed",
    "order_status": "delivered",
    "address": {
      "label": "Home",
      "street": "123 Main St",
      "city": "Anytown",
      "state": "CA",
      "zip": "12345",
      "country": "USA"
    },
    "tracking_number": "1234567890",
    "delivery_speed": "standard",
    "coupon_code": "SAVE10",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-05T00:00:00.000Z",
    "delivered_at": "2023-01-05T00:00:00.000Z",
    "status_history": [
      {
        "status": "placed",
        "timestamp": "2023-01-01T0