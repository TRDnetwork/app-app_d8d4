# ShopSphere - Full-Featured E-Commerce Platform

![ShopSphere Logo](https://via.placeholder.com/150/1E293B/FF9900?text=ShopSphere)

ShopSphere is a production-ready, Amazon-like e-commerce platform built with modern technologies. It features a comprehensive suite of e-commerce capabilities including user authentication, product catalog, shopping cart, multi-step checkout with Stripe payments, order management, seller/admin dashboards, and advanced features like search, recommendations, and analytics.

## 🚀 Features

### 👤 User Features
- Register/Login with email & password or Google/Facebook OAuth
- Email verification & password reset flow
- User profile page with editable name, address, phone, profile picture
- Order history with detailed order tracking
- Wishlist / Save for Later
- Product reviews & star ratings (with edit/delete)
- Recently viewed products
- Multiple saved addresses

### 🛍️ Product & Catalog Features
- Homepage with hero banner, deals of the day, featured categories, sponsored products
- Product listing pages with filters (price, brand, rating) and sorting
- Product detail page with image gallery, variant selector, stock availability, and recommendations
- Search bar with auto-suggest, search history, and filters

### 🛒 Cart & Checkout
- Add to Cart with quantity selector
- Cart page showing items, subtotal, delivery estimate
- Save for Later from cart
- Coupon/promo code input
- Multi-step checkout with address selection, delivery options, and payment methods
- Order confirmation page with order ID
- Email confirmation after placing order

### 📦 Order Management
- Real-time order status tracking
- Order tracking page with timeline UI
- Cancel order (before dispatch)
- Return/refund request flow
- Download invoice as PDF
- Rate & review product after delivery

### 🏪 Seller & Admin Panel
- Separate seller registration and dashboard
- Add/edit/delete products with image upload to AWS S3
- Manage inventory & stock levels
- View & process incoming orders
- Revenue analytics dashboard
- Admin panel for managing users, sellers, products, and platform content

### 💡 Advanced Features
- Search with Algolia/Elasticsearch integration
- Dark mode toggle
- Fully responsive mobile design (PWA-ready)
- SEO-optimized pages
- Lazy loading for images
- Skeleton loaders for async content

## 🏗️ Tech Stack

### Frontend
- **Framework**: React.js with Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: Zustand
- **Routing**: React Router
- **Forms**: Zod for validation

### Backend
- **Framework**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ORM
- **Authentication**: JWT with refresh token rotation
- **Payments**: Stripe API
- **File Storage**: AWS S3
- **Search**: Algolia/Elasticsearch
- **Email**: Resend
- **Background Jobs**: BullMQ with Redis

### Infrastructure
- **Hosting**: Vercel (frontend) + Railway/Render (backend)
- **Environment**: TypeScript throughout
- **Security**: Helmet, rate limiting, input validation, CORS

## 📁 Project Structure

```
shop-sphere/
├── client/                 # React frontend application
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── stores/         # Zustand state stores
│   │   ├── lib/            # Utilities and API clients
│   │   ├── assets/         # Static assets
│   │   └── App.tsx         # Main application component
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
├── server/                 # Express backend application
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Express middleware
│   │   ├── services/       # Business logic services
│   │   ├── utils/          # Utility functions
│   │   └── index.ts        # Server entry point
│   ├── package.json
│   └── tsconfig.json
├── .env.example            # Environment variables template
├── package.json            # Root package.json (if monorepo)
└── README.md
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- AWS account (for S3 storage)
- Stripe account (for payments)
- Algolia/Elasticsearch account (for search)
- Resend account (for emails)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/shop-sphere.git
cd shop-sphere
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the server directory based on the example:

```bash
cd server
cp .env.example .env
```

Edit the `.env` file with your actual credentials:

```env
# Environment
NODE_ENV=development
PORT=3000

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_must_be_at_least_32_characters_long
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your_refresh_token_secret_must_be_at_least_32_characters_long
REFRESH_TOKEN_EXPIRES_IN=7d

# Database
MONGODB_URI=mongodb://localhost:27017/shopsphere

# OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
OAUTH_CALLBACK_URL=http://localhost:3000/api/auth/oauth/callback

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-s3-bucket-name

# Email (Resend)
RESEND_API_KEY=re_...
EMAIL_FROM=shop@shopsphere.com

# Search (Algolia)
ALGOLIA_APP_ID=your_algolia_app_id
ALGOLIA_ADMIN_KEY=your_algolia_admin_key
ALGOLIA_SEARCH_KEY=your_algolia_search_key
ALGOLIA_INDEX_NAME=products

# Client-side (prefix with VITE_ to expose in Vite)
VITE_API_URL=http://localhost:3000/api
VITE_STRIPE_PUBLIC_KEY=pk_test_...
VITE_ENABLE_MOCK_API=false
```

### 4. Start the Development Servers

In one terminal, start the backend:
```bash
cd server
npm run dev
```

In another terminal, start the frontend:
```bash
cd client
npm run dev
```

The application will be available at `http://localhost:5173`.

### 5. Database Setup
The application will automatically create the necessary MongoDB collections on first run. To seed initial data:

```bash
# Run the seed script (if available)
cd server
npm run seed
```

## 🛠️ API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user with email and password.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123!"
}
```

**Response (201 Created):**
```json
{
  "message": "Registration successful. Please check your email to verify your account.",
  "user": {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "email_verified": false
  }
}
```

#### POST `/api/auth/login`
Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123!"
}
```

**Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "email_verified": true
  }
}
```

#### POST `/api/auth/refresh`
Refresh the access token using the refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST `/api/auth/verify-email`
Verify email address using verification token.

**Request Body:**
```json
{
  "token": "verification-token-from-email"
}
```

**Response (200 OK):**
```json
{
  "message": "Email verified successfully"
}
```

#### POST `/api/auth/forgot-password`
Send password reset email.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (200 OK):**
```json
{
  "message": "Password reset email sent"
}
```

#### POST `/api/auth/reset-password`
Reset password using reset token.

**Request Body:**
```json
{
  "token": "reset-token-from-email",
  "newPassword": "newSecurePassword123!"
}
```

**Response (200 OK):**
```json
{
  "message": "Password reset successful"
}
```

### User Endpoints

#### GET `/api/users/profile` (Protected)
Get current user profile.

**Response (200 OK):**
```json
{
  "user": {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "profile_picture_url": "https://example.com/avatar.jpg",
    "role": "customer",
    "addresses": [
      {
        "_id": "60d21b4667d0d8992e610c86",
        "type": "home",
        "line1": "123 Main St",
        "line2": "Apt 4B",
        "city": "New York",
        "state": "NY",
        "postal_code": "10001",
        "country": "US",
        "is_default": true
      }
    ]
  }
}
```

#### PUT `/api/users/profile` (Protected)
Update user profile.

**Request Body:**
```json
{
  "name": "John Smith",
  "phone": "+1987654321"
}
```

**Response (200 OK):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "John Smith",
    "email": "john@example.com",
    "phone": "+1987654321",
    "role": "customer"
  }
}
```

#### PUT `/api/users/profile/picture` (Protected)
Upload profile picture to AWS S3.

**Request Body:** Multipart form data with file
**Response (200 OK):**
```json
{
  "message": "Profile picture uploaded successfully",
  "url": "https://your-bucket.s3.amazonaws.com/profile-pictures/123.jpg"
}
```

#### GET `/api/users/addresses` (Protected)
Get user addresses.

**Response (200 OK):**
```json
{
  "addresses": [
    {
      "_id": "60d21b4667d0d8992e610c86",
      "type": "home",
      "line1": "123 Main St",
      "line2": "Apt 4B",
      "city": "New York",
      "state": "NY",
      "postal_code": "10001",
      "country": "US",
      "is_default": true
    }
  ]
}
```

#### POST `/api/users/addresses` (Protected)
Add new address.

**Request Body:**
```json
{
  "type": "work",
  "line1": "456 Office Ave",
  "city": "New York",
  "state": "NY",
  "postal_code": "10002",
  "country": "US",
  "is_default": false
}
```

**Response (201 Created):**
```json
{
  "message": "Address added successfully",
  "address": {
    "_id": "60d21b4667d0d8992e610c87",
    "type": "work",
    "line1": "456 Office Ave",
    "city": "New York",
    "state": "NY",
    "postal_code": "10002",
    "country": "US",
    "is_default": false
  }
}
```

### Product Endpoints

#### GET `/api/products`
Get list of products with filtering and pagination.

**Query Parameters:**
- `category`: Filter by category slug
- `brand`: Filter by brand
- `min_price`: Minimum price
- `max_price`: Maximum price
- `min_rating`: Minimum average rating
- `sort`: Sort by (price_asc, price_desc, newest, best_seller, avg_rating)
- `limit`: Number of items per page (default: 20)
- `page`: Page number (default: 1)

**Response (200 OK):**
```json
{
  "data": [
    {
      "_id": "60d21b4667d0d8992e610c88",
      "title": "Wireless Headphones",
      "slug": "wireless-headphones",
      "description": "High-quality wireless headphones with noise cancellation.",
      "category_id": "60d21b4667d0d8992e610c89",
      "brand": "AudioTech",
      "price": 99.99,
      "original_price": 129.99,
      "discount_percent": 23,
      "stock_quantity": 50,
      "images": [
        "https://example.com/images/headphones-1.jpg",
        "https://example.com/images/headphones-2.jpg"
      ],
      "variants": [
        {
          "name": "color",
          "values": ["black", "white", "blue"]
        }
      ],
      "is_featured": true,
      "is_sponsored": false,
      "status": "active",
      "created_at": "2023-06-15T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 150,
    "pages": 8,
    "page": 1,
    "limit": 20
  }
}
```

#### GET `/api/products/:slug`
Get product by slug.

**Response (200 OK):**
```json
{
  "data": {
    "_id": "60d21b4667d0d8992e610c88",
    "title": "Wireless Headphones",
    "slug": "wireless-headphones",
    "description": "High-quality wireless headphones with noise cancellation.",
    "category_id": "60d21b4667d0d8992e610c89",
    "brand": "AudioTech",
    "price": 99.99,
    "original_price": 129.99,
    "discount_percent": 23,
    "stock_quantity": 50,
    "images": [
      "https://example.com/images/headphones-1.jpg",
      "https://example.com/images/headphones-2.jpg"
    ],
    "variants": [
      {
        "name": "color",
        "values": ["black", "white", "blue"]
      }
    ],
    "tags": ["audio", "wireless", "noise-cancellation"],
    "is_featured": true,
    "is_sponsored": false,
    "status": "active",
    "views": 1250,
    "created_at": "2023-06-15T10:00:00.000Z",
    "updated_at": "2023-06-15T10:00:00.000Z"
  }
}
```

#### GET `/api/products/:id/reviews`
Get reviews for a product.

**Response (200 OK):**
```json
{
  "data": [
    {
      "_id": "60d21b4667d0d8992e610c8a",
      "product_id": "60d21b4667d0d8992e610c88",
      "user_id": "60d21b4667d0d8992e610c85",
      "order_id": "60d21b4667d0d8992e610c8b",
      "rating": 5,
      "title": "Excellent sound quality",
      "comment": "These headphones sound amazing and the noise cancellation works perfectly.",
      "images": [
        "https://example.com/reviews/headphones-review-1.jpg"
      ],
      "helpful_votes": 12,
      "verified_purchase": true,
      "created_at": "2023-06-16T14:30:00.000Z",
      "user": {
        "name": "John Smith",
        "profile_picture_url": "https://example.com/avatar.jpg"
      }
    }
  ],
  "pagination": {
    "total": 25,
    "pages": 3,
    "page": 1,
    "limit": 10
  },
  "stats": {
    "average_rating": 4.7,
    "total_reviews": 25,
    "rating_breakdown": {
      "5": 18,
      "4": 5,
      "3": 1,
      "2": 1,
      "1": 0
    }
  }
}
```

### Cart Endpoints

#### GET `/api/cart` (Protected)
Get user's cart.

**Response (200 OK):**
```json
{
  "cart": {
    "_id": "60d21b4667d0d8992e610c8c",
    "user_id": "60d21b4667d0d8992e610c85",
    "items": [
      {
        "product_id": "60d21b4667d0d8992e610c88",
        "variant_id": "color-black",
        "quantity": 1,
        "price_snapshot": 99.99,
        "product": {
          "title": "Wireless Headphones",
          "images": ["https://example.com/images/headphones-1.jpg"],
          "stock_quantity": 50
        }
      }
    ],
    "subtotal": 99.99,
    "coupon_code": "SUMMER20",
    "discount": 19.99,
    "total": 80.00,
    "updated_at": "2023-06-17T09:15:00.000Z"
  }
}
```

#### POST `/api/cart/items` (Protected)
Add item to cart.

**Request Body:**
```json
{
  "product_id": "60d21b4667d0d8992e610c88",
  "variant_id": "color-black",
  "quantity": 1
}
```

**Response (200 OK):**
```json
{
  "message": "Item added to cart",
  "cart": {
    "_id": "60d21b4667d0d8992e610c8c",
    "items": [
      {
        "product_id": "60d21b4667d0d8992e610c88",
        "variant_id": "color-black",
        "quantity": 1,
        "price_snapshot": 99.99
      }
    ],
    "subtotal": 99.99,
    "total": 99.99
  }
}
```

#### PUT `/api/cart/items/:id` (Protected)
Update cart item quantity.

**Request Body:**
```json
{
  "quantity": 2
}
```

**Response (200 OK):**
```json
{
  "message": "Cart updated",
  "cart": {
    "_id": "60d21b4667d0d8992e610c8c",
    "items": [
      {
        "product_id": "60d21b4667d0d8992e610c88",
        "variant_id": "color-black",
        "quantity": 2,
        "price_snapshot": 99.99
      }
    ],
    "subtotal": 199.98,
    "total": 199.98
  }
}
```

#### DELETE `/api/cart/items/:id` (Protected)
Remove item from cart.

**Response (200 OK):**
```json
{
  "message": "Item removed from cart",
  "cart": {
    "_id": "60d21b4667d0d8992e610c8c",
    "items": [],
    "subtotal": 0,
    "total": 0
  }
}
```

#### POST `/api/cart/apply-coupon` (Protected)
Apply coupon code to cart.

**Request Body:**
```json
{
  "code": "SUMMER20"
}
```

**Response (200 OK):**
```json
{
  "message": "Coupon applied successfully",
  "cart": {
    "_id": "60d21b4667d0d8992e610c8c",
    "items": [
      {
        "product_id": "60d21b4667d0d8992e610c88",
        "variant_id": "color-black",
        "quantity": 1,
        "price_snapshot": 99.99
      }
    ],
    "subtotal": 99.99,
    "coupon_code": "SUMMER20",
    "discount": 19.99,
    "total": 80.00
  }
}
```

### Order Endpoints

#### POST `/api/orders` (Protected)
Create a new order.

**Request Body:**
```json
{
  "address_id": "60d21b4667d0d8992e610c86",
  "delivery_speed": "express",
  "payment_method": "stripe",
  "coupon_code": "SUMMER20"
}
```

**Response (201 Created):**
```json
{
  "order": {
    "_id": "60d21b4667d0d8992e610c8d",
    "user_id": "60d21b4667d0d8992e610c85",
    "order_number": "ORD-ABC123",
    "items": [
      {
        "product_id": "60d21b4667d0d8992e610c88",
        "seller_id": "60d21b4667d0d8992e610c8e",
        "variant": "color-black",
        "quantity": 1,
        "price": 99.99,
        "status": "placed"
      }
    ],
    "address": {
      "line1": "123 Main St",
      "line2": "Apt 4B",
      "city": "New York",
      "state": "NY",
      "postal_code": "10001",
      "country": "US"
    },
    "delivery_speed": "express",
    "payment_method": "stripe",
    "payment_status": "pending",
    "subtotal": 99.99,
    "discount": 19.99,
    "coupon_code": "SUMMER20",
    "delivery_charge": 9.99,
    "total": 90.00,
    "status": "placed",
    "estimated_delivery": "2023-06-20T10:00:00.000Z",
    "created_at": "2023-06-17T10:00:00.000Z"
  }
}
```

#### GET `/api/orders` (Protected)
Get user's order history.

**Response (200 OK):**
```json
{
  "orders": [
    {
      "_id": "60d21b4667d0d8992e610c8d",
      "order_number": "ORD-ABC123",
      "items": [
        {
          "product_id": "60d21b4667d0d8992e610c88",
          "quantity": 1,
          "price": 99.99,
          "product": {
            "title": "Wireless Headphones",
            "images": ["https://example.com/images/headphones-1.jpg"]
          }
        }
      ],
      "total": 90.00,
      "status": "delivered",
      "created_at": "2023-06-17T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 5,
    "pages": 1,
    "page": 1,
    "limit": 10
  }
}
```

#### GET `/api/orders/:id` (Protected)
Get order details with tracking.

**Response (200 OK):**
```json
{
  "order": {
    "_id": "60d21b4667d0d8992e610c8d",
    "order_number": "ORD-ABC123",
    "items": [
      {
        "product_id": "60d21b4667d0d8992e610c88",
        "seller_id": "60d21b4667d0d8992e610c8e",
        "variant": "color-black",
        "quantity": 1,
        "price": 99.99,
        "status": "delivered",
        "product": {
          "title": "Wireless Headphones",
          "images": ["https://example.com/images/headphones-1.jpg"]
        }
      }
    ],
    "address": {
      "line1": "123 Main St",
      "line2": "Apt 4B",
      "city": "New York",
      "state": "NY",
      "postal_code": "10001",
      "country": "US"
    },
    "delivery_speed": "express",
    "payment_method": "stripe",
    "payment_status": "completed",
    "subtotal": 99.99,
    "discount": 19.99,
    "coupon_code": "SUMMER20",
    "delivery_charge": 9.99,
    "total": 90.00,
    "status": "delivered",
    "tracking_number": "1Z999AA1234567890",
    "estimated_delivery": "2023-06-20T10:00:00.000Z",
    "delivered_at": "2023-06-19T14:30:00.000Z",
    "created_at": "2023-06-17T10:00:00.000Z",
    "updated_at": "2023-06-19T14:30:00.000Z"
  },
  "tracking": [
    {
      "status": "placed",
      "timestamp": "2023-06-17T10:00:00.000Z",
      "location": "ShopSphere Warehouse",
      "details": "Order placed successfully"
    },
    {
      "status": "confirmed",
      "timestamp": "2023-06-17T12:00:00.000Z",
      "location": "ShopSphere Warehouse",
      "details": "Order confirmed and payment received"
    },
    {
      "status": "shipped",
      "timestamp": "2023-06-18T08:00:00.000Z",
      "location": "ShopSphere Warehouse",
      "details": "Order has been shipped"
    },
    {
      "status": "out_for_delivery",
      "timestamp": "2023-06-19T09:00:00.000Z",
      "location": "New York Distribution Center",
      "details": "Out for delivery"
    },
    {
      "status": "delivered",
      "timestamp": "2023-06-19T14:30:00.000Z",
      "location": "123 Main St, New York, NY",
      "details": "Delivered to recipient"
    }
  ]
}
```

#### PUT `/api/orders/:id/cancel` (Protected)
Cancel an order (before dispatch).

**Response (200 OK):**
```json
{
  "message": "Order cancelled successfully",
  "order": {
    "_id": "60d21b4667d0d8992e610c8d",
    "status": "cancelled",
    "updated_at": "2023-06-17T11:00:00.000Z"
  }
}
```

#### POST `/api/orders/:id/return` (Protected)
Request a return for an order.

**Request Body:**
```json
{
  "reason": "Item damaged",
  "comments": "The headphones arrived with a cracked case."
}
```

**Response (200 OK):**
```json
{
  "message": "Return request submitted successfully",
  "return": {
    "_id": "60d21b4667d0d8992e610c8f",
    "order_id": "60d21b4667d0d8992e610c8d",
    "user_id": "60d21b4667d0d8992e610c85",
    "reason": "Item damaged",
    "comments": "The headphones arrived with a cracked case.",
    "status": "pending",
    "created_at": "2023-06-20T10:00:00.000Z"
  }
}
```

#### GET `/api/orders/:id/invoice` (Protected)
Download order invoice as PDF.

**Response:** PDF file attachment

### Search Endpoint

#### GET `/api/search`
Search products with Algolia/Elasticsearch.

**Query Parameters:**
- `q`: Search query
- `category`: Filter by category
- `brand`: Filter by brand
- `min_price`: Minimum price
- `max_price`: Maximum price
- `rating`: Minimum rating
- `sort`: Sort by (relevance, price_asc, price_desc, newest)
- `limit`: Number of results per page
- `page`: Page number

**Response (200 OK):**
```json
{
  "data": [
    {
      "_id": "60d21b4667d0d8992e610c88",
      "title": "Wireless Headphones",
      "slug": "wireless-headphones",
      "description": "High-quality wireless headphones with noise cancellation.",
      "category_id": "60d21b4667d0d8992e610c89",
      "brand": "AudioTech",
      "price": 99.99,
      "original_price": 129.99,
      "discount_percent": 23,
      "stock_quantity": 50,
      "images": [
        "https://example.com/images/headphones-1.jpg",
        "https://example.com/images/headphones-2.jpg"
      ],
      "rating": 4.7,
      "review_count": 25,
      "is_featured": true,
      "is_sponsored": false,
      "status": "active",
      "created_at": "2023-06-15T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "pages": 1,
    "page": 1,
    "limit": 20
  },
  "query": "wireless headphones",
  "suggestions": [
    "wireless earbuds",
    "noise cancelling headphones",
    "bluetooth headphones"
  ]
}
```

#### GET `/api/search/suggest`
Get autocomplete suggestions.

**Query Parameters:**
- `q`: Partial search query

**Response (200 OK):**
```json
{
  "suggestions": [
    "wireless headphones",
    "wireless earbuds",
    "wireless mouse",
    "wireless keyboard",
    "wireless charger"
  ]
}
```

### Seller Endpoints (Protected - Seller Role)

#### POST `/api/seller/products`
Create a new product.

**Request Body:**
```json
{
  "title": "Wireless Headphones",
  "description": "High-quality wireless headphones with noise cancellation.",
  "category_id": "60d21b4667d0d8992e610c89",
  "brand": "AudioTech",
  "price": 99.99,
  "original_price": 129.99,
  "stock_quantity": 50,
  "images": [
    "https://example.com/images/headphones-1.jpg",
    "https://example.com/images/headphones-2.jpg"
  ],
  "variants": [
    {
      "name": "color",
      "values": ["black", "white", "blue"]
    }
  ],
  "tags": ["audio", "wireless", "noise-cancellation"],
  "is_featured": true
}
```

**Response (201 Created):**
```json
{
  "message": "Product created successfully",
  "product": {
    "_id": "60d21b4667d0d8992e610c88",
    "title": "Wireless Headphones",
    "slug": "wireless-headphones",
    "description": "High-quality wireless headphones with noise cancellation.",
    "category_id": "60d21b