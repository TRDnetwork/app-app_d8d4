# ShopSphere API Documentation

This document provides comprehensive details of all API endpoints available in the ShopSphere e-commerce platform.

## Authentication Endpoints

### Register User
Create a new user account with email and password.

**Endpoint**: `POST /api/auth/register`  
**Authentication**: None  
**Rate Limit**: 5 attempts per hour per IP

```bash
curl -X POST https://api.shopsphere.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123!"
  }'
```

**Request Body**:
```json
{
  "name": "string (min 2 characters)",
  "email": "string (valid email format)",
  "password": "string (min 12 characters, must include uppercase, lowercase, number, and special character)"
}
```

**Success Response (201)**:
```json
{
  "message": "Registration successful. Please check your email to verify your account.",
  "user": {
    "_id": "string",
    "email": "string",
    "name": "string",
    "role": "customer",
    "email_verified": false,
    "created_at": "string (ISO date)"
  }
}
```

**Error Responses**:
- `400 Bad Request`: Invalid input data
- `400 Bad Request`: Email already exists
- `500 Internal Server Error`: Registration failed