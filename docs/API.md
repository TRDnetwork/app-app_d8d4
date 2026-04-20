# ShopSphere API Documentation

## Authentication

### Register User
`POST /api/auth/register`

Register a new user with email and password.

**Request**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201)**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_1",
      "email": "john@example.com",
      "name": "John Doe",
      "role": "customer",
      "email_verified": false,
      "created_at": "2024-01-01T00:00:00.000Z"
    },
    "tokens": {
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token"
    }
  }
}
```

**Validation Errors (400)**
```json
{
  "success": false,
  "message": "Name is required"
}
```