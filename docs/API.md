# ShopSphere API Documentation

## Base URL
```
https://api.shopsphere.com/api
```

## Authentication

All endpoints require authentication except for public routes. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Register User
Create a new user account.

**Endpoint**: `POST /api/auth/register`

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123!"
}
```

**Success Response (201)**:
```json
{
  "success": true,
  "statusCode": 201,
  "message": "User registered successfully. Please check your email to verify your account.",
  "data": {
    "user": {
      "_id": "60d5ecf9c456789012345678",
      "email": "john@example.com",
      "name": "John Doe",
      "role": "customer",
      "email_verified": false,
      "created_at": "2023-06-15T10:30:00.000Z",
      "updated_at": "2023-06-15T10:30:00.000Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

**Error Responses**:
- `400 Bad Request`: Missing required fields
- `409 Conflict`: User with this email already exists
- `500 Internal Server Error`: Failed to register user

**Example cURL**:
```bash
curl -X POST https://api.shopsphere.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123!"
  }'
```

### Login User
Authenticate user and get JWT tokens.

**Endpoint**: `POST /api/auth/login`

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "securePassword123!"
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "60d5ecf9c456789012345678",
      "email": "john@example.com",
      "name": "John Doe",
      "role": "customer",
      "email_verified": true,
      "created_at": "2023-06-15T10:30:00.000Z",
      "updated_at": "2023-06-15T10:30:00.000Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

**Error Responses**:
- `400 Bad Request`: Missing email or password
- `401 Unauthorized`: Invalid credentials
- `403 Forbidden`: Email not verified
- `429 Too Many Requests`: Rate limited
- `500 Internal Server Error`: Failed to login

**Example cURL**:
```bash
curl -X POST https://api.shopsphere.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123!"
  }'
```

### Refresh Access Token
Get a new access token using refresh token.

**Endpoint**: `POST /api/auth/refresh`

**Request Body**:
```json
{
  "refreshToken": "your-refresh-token"
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Token refreshed",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses**:
- `400 Bad Request`: Refresh token required
- `403 Forbidden`: Invalid or expired refresh token
- `404 Not Found`: User not found
- `500 Internal Server Error`: Failed to refresh token

**Example cURL**:
```bash
curl -X POST https://api.shopsphere.com/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "your-refresh-token"
  }'
```

### Logout User
Invalidate the current session.

**Endpoint**: `POST /api/auth/logout`

**Headers**:
```
Authorization: Bearer <your-jwt-token>
```

**Success Response (200)**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Logged out successfully"
}
```

**Error Responses**:
- `401 Unauthorized`: Authentication required
- `500 Internal Server Error`: Failed to logout

**Example cURL**:
```bash
curl -X POST https://api.shopsphere.com/api/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Verify Email
Verify user's email address using verification token.

**Endpoint**: `POST /api/auth/verify-email`

**Request Body**:
```json
{
  "token": "verification-token-from-email"
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Email verified successfully"
}
```

**Error Responses**:
- `400 Bad Request`: Verification token required
- `400 Bad Request`: Invalid or expired verification token
- `500 Internal Server Error`: Failed to verify email

**Example cURL**:
```bash
curl -X POST https://api.shopsphere.com/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "token": "verification-token-from-email"
  }'
```

### Forgot Password
Request password reset link.

**Endpoint**: `POST /api/auth/forgot-password`

**Request Body**:
```json
{
  "email": "john@example.com"
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "If an account with this email exists, a password reset link has been sent"
}
```

**Error Responses**:
- `400 Bad Request`: Email required
- `500 Internal Server Error`: Failed to process request

**Example cURL**:
```bash
curl -X POST https://api.shopsphere.com/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com"
  }'
```

### Reset Password
Reset password using reset token.

**Endpoint**: `POST /api/auth/reset-password`

**Request Body**:
```json
{
  "token": "reset-token-from-email",
  "newPassword": "newSecurePassword123!"
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Password reset successfully"
}
```

**Error Responses**:
- `400 Bad Request`: Token and new password required
- `400 Bad Request`: Password must be at least 8 characters
- `400 Bad Request`: Invalid or expired reset token
- `500 Internal Server Error`: Failed to reset password

**Example cURL**:
```bash
curl -X POST https://api.shopsphere.com/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "reset-token-from-email",
    "newPassword": "newSecurePassword123!"
  }'
```

### Google OAuth
Redirect to Google OAuth login.

**Endpoint**: `GET /api/auth/oauth/google`

**Success Response**: Redirects to Google OAuth page.

**Example cURL**:
```bash
curl -X GET https://api.shopsphere.com/api/auth/oauth/google
```

### Google OAuth Callback
Handle Google OAuth callback.

**Endpoint**: `GET /api/auth/oauth/google/callback`

**Query Parameters**:
- `code`: Authorization code from Google

**Success Response**: Redirects to frontend with tokens.

**Example cURL**:
```bash
curl -X GET "https://api.shopsphere.com/api/auth/oauth/google/callback?code=authorization-code"
```

### Facebook OAuth
Redirect to Facebook OAuth login.

**Endpoint**: `GET /api/auth/oauth/facebook`

**Success Response**: Redirects to Facebook OAuth page.

**Example cURL**:
```bash
curl -X GET https://api.shopsphere.com/api/auth/oauth/facebook
```

### Facebook OAuth Callback
Handle Facebook OAuth callback.

**Endpoint**: `GET /api/auth/oauth/facebook/callback`

**Query Parameters**:
- `code`: Authorization code from Facebook

**Success Response**: Redirects to frontend with tokens.

**Example cURL**:
```bash
curl -X GET "https://api.shopsphere.com/api/auth/oauth/facebook/callback?code=authorization-code"
```

## Users

### Get User Profile
Get current user's profile information.

**Endpoint**: `GET /api/users/profile`

**Headers**:
```
Authorization: Bearer <your-jwt-token>
```

**Success Response (200)**:
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "user": {
      "_id": "60d5ecf9c456789012345678",
      "email": "john@example.com",
      "name": "John Doe",
      "phone": "+15551234567",
      "profile_picture_url": "https://example.com/images/profile.jpg",
      "email_verified": true,
      "role": "customer",
      "loyalty_points": 150,
      "created_at": "2023-06-15T10:30:00.000Z",
      "updated_at": "2023-06-15T10:30:00.000Z"
    }
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Authentication required
- `404 Not Found`: User not found
- `500 Internal Server Error`: Failed to get profile

**Example cURL**:
```bash
curl -X GET https://api.shopsphere.com/api/users/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Update User Profile
Update user's profile information.

**Endpoint**: `PUT /api/users/profile`

**Headers**:
```
Authorization: Bearer <your-jwt-token>
```

**Request Body**:
```json
{
  "name": "John Smith",
  "phone": "+15559876543"
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "_id": "60d5ecf9c456789012345678",
      "email": "john@example.com",
      "name": "John Smith",
      "phone": "+15559876543",
      "profile_picture_url": "https://example.com/images/profile.jpg",
      "email_verified": true,
      "role": "customer",
      "loyalty_points": 150,
      "created_at": "2023-06-15T10:30:00.000Z",
      "updated_at": "2023-06-15T11:00:00.000Z"
    }
  }
}
```

**Error Responses**:
- `400 Bad Request`: Name must be at least 2 characters
- `401 Unauthorized`: Authentication required
- `404 Not Found`: User not found
- `500 Internal Server Error`: Failed to update profile

**Example cURL**:
```bash
curl -X PUT https://api.shopsphere.com/api/users/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "phone": "+15559876543"
  }'
```

### Upload Profile Picture
Upload user's profile picture to AWS S3.

**Endpoint**: `PUT /api/users/profile/picture`

**Headers**:
```
Authorization: Bearer <your-jwt-token>
Content-Type: multipart/form-data
```

**Request Body**:
- `file`: Image file (JPEG, PNG, WebP)

**Success Response (200)**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Profile picture uploaded successfully",
  "data": {
    "profile_picture_url": "https://shopsphere-uploads.s3.amazonaws.com/profile/60d5ecf9c456789012345678.jpg"
  }
}
```

**Error Responses**:
- `400 Bad Request`: File is required
- `400 Bad Request`: Invalid file type
- `400 Bad Request`: File size too large
- `401 Unauthorized`: Authentication required
- `404 Not Found`: User not found
- `500 Internal Server Error`: Failed to upload picture

**Example cURL**:
```bash
curl -X PUT https://api.shopsphere.com/api/users/profile/picture \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -F "file=@/path/to/profile.jpg"
```

### List User Addresses
Get all saved addresses for the user.

**Endpoint**: `GET /api/users/addresses`

**Headers**:
```
Authorization: Bearer <your-jwt-token>
```

**Success Response (200)**:
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "addresses": [
      {
        "_id": "60d5ecf9c456789012345679",
        "user_id": "60d5ecf9c456789012345678",
        "type": "home",
        "line1": "123 Main St",
        "line2": "Apt 4B",
        "city": "San Francisco",
        "state": "CA",
        "postal_code": "94105",
        "country": "USA",
        "is_default": true,
        "created_at": "2023-06-15T10:30:00.000Z"
      },
      {
        "_id": "60d5ecf9c456789012345680",
        "user_id": "60d5ecf9c456789012345678",
        "type": "work",
        "line1": "456 Market St",
        "city": "San Francisco",
        "state": "CA",
        "postal_code": "94105",
        "country": "USA",
        "is_default": false,
        "created_at": "2023-06-15T10:35:00.000Z"
      }
    ]
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Authentication required
- `404 Not Found`: User not found
- `500 Internal Server Error`: Failed to get addresses

**Example cURL**:
```bash
curl -X GET https://api.shopsphere.com/api/users/addresses \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Add User Address
Add a new address for the user.

**Endpoint**: `POST /api/users/addresses`

**Headers**:
```
Authorization: Bearer <your-jwt-token>
```

**Request Body**:
```json
{
  "type": "other",
  "line1": "789 Oak St",
  "city": "San Francisco",
  "state": "CA",
  "postal_code": "94105",
  "country": "USA",
  "is_default": false
}
```

**Success Response (201)**:
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Address added successfully",
  "data": {
    "address": {
      "_id": "60d5ecf9c456789012345681",
      "user_id": "60d5ecf9c456789012345678",
      "type": "other",
      "line1": "789 Oak St",
      "city": "San Francisco",
      "state": "CA",
      "postal_code": "94105",
      "country": "USA",
      "is_default": false,
      "created_at": "2023-06-15T10:40:00.000Z",
      "updated_at": "2023-06-15T10:40:00.000Z"
    }
  }
}
```

**Error Responses**:
- `400 Bad Request`: Missing required fields
- `401 Unauthorized`: Authentication required
- `404 Not Found`: User not found
- `500 Internal Server Error`: Failed to add address

**Example cURL**:
```bash
curl -X POST https://api.shopsphere.com/api/users/addresses \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "type": "other",
    "line1": "789 Oak St",
    "city": "San Francisco",
    "state": "CA",
    "postal_code": "94105",
    "country": "USA",
    "is_default": false
  }'
```

### Update User Address
Update an existing address.

**Endpoint**: `PUT /api/users/addresses/:id`

**Headers**:
```
Authorization: Bearer <your-jwt-token>
```

**Request Body**:
```json
{
  "line2": "Suite 100",
  "is_default": true
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Address updated successfully",
  "data": {
    "address": {
      "_id": "60d5ecf9c456789012345679",
      "user_id": "60d5ecf9c456789012345678",
      "type": "home",
      "line1": "123 Main St",
      "line2": "Suite 100",
      "city": "San Francisco",
      "state": "CA",
      "postal_code": "94105",
      "country": "USA",
      "is_default": true,
      "created_at": "2023-06-15T10:30:00.000Z",
      "updated_at": "2023-06-15T11:00:00.000Z"
    }
  }
}
```

**Error Responses**:
- `400 Bad Request`: Invalid address ID format
- `400 Bad Request`: Address not found
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Address does not belong to user
- `500 Internal Server Error`: Failed to update address

**Example cURL**:
```bash
curl -X PUT https://api.shopsphere.com/api/users/addresses/60d5ecf9c456789012345679 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "line2": "Suite 100",
    "is_default": true
  }'
```

### Delete User Address
Delete an address.

**Endpoint**: `DELETE /api/users/addresses/:id`

**Headers**:
```
Authorization: Bearer <your-jwt-token>
```

**Success Response (200)**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Address deleted successfully"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid address ID format
- `400 Bad Request`: Address not found
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Address does not belong to user
- `500 Internal Server Error`: Failed to delete address

**Example cURL**:
```bash
curl -X DELETE https://api.shopsphere.com/api/users/addresses/60d5ecf9c456789012345679 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Products

### List Products
Get a list of products with filtering, sorting, and pagination.

**Endpoint**: `GET /api/products`

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `category`: Filter by category ID
- `brand`: Filter by brand
- `min_price`: Minimum price
- `max_price`: Maximum price
- `rating`: Minimum rating (1-5)
- `status`: Filter by status (active/inactive/out_of_stock)
- `sort`: Sort by (price_asc, price_desc, newest, best_seller, avg_rating)
- `search`: Search term

**Success Response (200)**:
```json
{
  "