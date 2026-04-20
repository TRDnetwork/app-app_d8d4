# ShopSphere - Premium E-Commerce Platform

ShopSphere is a full-featured e-commerce platform built with React, Node.js, MongoDB, and Stripe, designed to deliver an Amazon-like shopping experience with advanced features, robust security, and seamless performance.

## 🚀 Features

### User Experience
- **Authentication**: Email/password, Google, and Facebook OAuth with JWT
- **User Profiles**: Editable name, address, phone, profile picture
- **Order Management**: Complete order history with tracking timeline
- **Wishlist**: Save products for later purchase
- **Reviews & Ratings**: Star ratings with image uploads and helpful votes
- **Recently Viewed**: Track and display recently viewed products
- **Multiple Addresses**: Save and manage multiple shipping addresses

### Product & Catalog
- **Homepage**: Hero banners, deals of the day, featured categories, sponsored products
- **Product Listings**: Filters (price, brand, rating), sorting, pagination
- **Product Detail**: Image gallery with zoom, variant selector, stock indicator, EMI options
- **Recommendations**: "Frequently Bought Together" and "Customers Also Viewed"
- **Q&A Section**: Users can ask questions, sellers can provide answers
- **Search**: Auto-suggest, search history, filters, and "Did you mean?" correction

### Cart & Checkout
- **Cart Management**: Add items, update quantities, save for later
- **Coupon System**: Apply promo codes with validation
- **Multi-Step Checkout**: Address selection, delivery speed, payment method, order review
- **Payment Options**: Stripe (cards), UPI, and Cash on Delivery
- **Order Confirmation**: Detailed confirmation page with order ID and download options

### Order Management
- **Real-Time Tracking**: Visual timeline from placed to delivered
- **Order Actions**: Cancel orders (before dispatch), request returns/refunds
- **Invoice Generation**: Download order invoices as PDF
- **Post-Delivery**: Rate and review products after delivery

### Seller & Admin Panels
- **Seller Dashboard**: Add/edit/delete products, manage inventory, process orders
- **Revenue Analytics**: Sales charts (daily/weekly/monthly)
- **Review Management**: Respond to customer reviews and Q&A
- **Admin Panel**: User/seller management, banner/ad management, category management
- **Promo Codes**: Create and manage discount codes
- **Platform Analytics**: GMV, active users, top products, refund rate

### Advanced Features
- **AI Recommendations**: Collaborative filtering for personalized suggestions
- **Product Comparison**: Side-by-side comparison of product specifications
- **Flash Sales**: Countdown timer for limited-time deals
- **Push Notifications**: Real-time order updates
- **Loyalty Program**: Points system for customer rewards
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Mobile-first PWA-ready interface
- **Multi-language**: Internationalization support
- **Multi-currency**: Support for different currencies
- **SEO Optimization**: Meta tags, Open Graph, structured data
- **Performance**: Lazy loading, skeleton loaders, optimized images

## 🔐 Security

ShopSphere implements enterprise-grade security measures:

### Authentication Security
- JWT with refresh token rotation and CSRF protection
- OAuth state token verification to prevent injection attacks
- Rate limiting on authentication endpoints
- Input validation using Zod with enhanced password requirements
- Generic error messages to prevent user enumeration
- Account lockout after multiple failed login attempts

### Data Protection
- Environment variables validated with envalid
- API keys and secrets never hardcoded
- Input sanitization to prevent XSS attacks
- Path traversal protection for file operations
- Helmet middleware for security headers
- Content Security Policy to prevent XSS

### Payment Security
- Stripe integration with webhook signature verification
- Idempotency keys to prevent duplicate processing
- Payment secrets never exposed to frontend
- Secure session management

### Infrastructure Security
- Redis connection with TLS in production
- S3 pre-signed URLs with expiration for secure uploads
- Database indexing for performance and security
- Proper CORS configuration
- Secure file upload handling

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js with Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: Zustand
- **Routing**: React Router
- **UI Components**: shadcn/ui primitives
- **Icons**: Lucide React

### Backend
- **Framework**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ORM
- **Authentication**: JWT + OAuth (Google/Facebook)
- **Payments**: Stripe API
- **File Storage**: AWS S3
- **Search**: Algolia
- **Email**: Resend
- **Job Queue**: BullMQ with Redis

### DevOps
- **Hosting**: Vercel (frontend), Railway/Render (backend)
- **CI/CD**: GitHub Actions
- **Monitoring**: Logging and error tracking
- **Testing**: Vitest, React Testing Library

## 📦 Folder Structure

```
shopsphere/
├── client/                    # React frontend
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Application pages
│   │   ├── stores/            # Zustand state stores
│   │   ├── lib/               # Utilities and API clients
│   │   ├── assets/            # Images and media
│   │   └── App.tsx            # Main application component
│   ├── index.html
│   └── package.json
│
├── server/                    # Express backend
│   ├── src/
│   │   ├── routes/            # API route definitions
│   │   ├── controllers/       # Route handlers
│   │   ├── models/            # Mongoose models
│   │   ├── middleware/        # Express middleware
│   │   ├── services/          # Business logic services
│   │   ├── utils/             # Utility functions
│   │   └── index.ts           # Server entry point
│   └── package.json
│
├── admin/                     # Admin/Seller dashboard
│   ├── src/
│   │   ├── pages/             # Admin pages
│   │   ├── components/        # Admin components
│   │   └── App.tsx
│   └── package.json
│
├── db/                        # Database scripts
│   └── seed.ts                # Seed data script
│
├── .env.example               # Environment variables template
├── README.md
└── package.json               # Root package.json (if monorepo)
```

## 🚦 Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Stripe account
- AWS account (for S3)
- Resend account (for email)
- Algolia account (for search)
- Redis (for job queue)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/shopsphere.git
cd shopsphere
```

### 2. Install Dependencies
```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install

# Install admin dashboard dependencies
cd ../admin
npm install
```

### 3. Configure Environment Variables

Create `.env` files in each directory:

**client/.env:**
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

**server/.env:**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/shopsphere
JWT_SECRET=your_jwt_secret_key_must_be_32_characters
JWT_REFRESH_SECRET=your_refresh_secret_must_be_32_characters
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@shopsphere.com
STRIPE_SECRET_KEY=sk_...
STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_SUCCESS_URL=http://localhost:5173/order-confirmation
STRIPE_CANCEL_URL=http://localhost:5173/checkout
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=shopsphere-uploads
ALGOLIA_APP_ID=your_app_id
ALGOLIA_ADMIN_KEY=your_admin_key
ALGOLIA_SEARCH_KEY=your_search_key
ALGOLIA_INDEX_NAME=products
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
BASE_URL=http://localhost:5173
API_BASE_URL=http://localhost:5000/api
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_TLS_ENABLED=false
```

### 4. Set Up Database
Start MongoDB and ensure it's running on the default port.

### 5. Run the Application
```bash
# In one terminal, start the server
cd server
npm run dev

# In another terminal, start the client
cd client
npm run dev

# In another terminal, start the admin dashboard
cd admin
npm run dev
```

The application will be available at:
- Client: http://localhost:5173
- Server: http://localhost:5000
- Admin: http://localhost:5174

### 6. Seed Database (Optional)
```bash
cd db
npm install
node seed.ts
```

## 🧪 Testing

ShopSphere includes comprehensive test coverage:

```bash
# Run client tests
cd client
npm test

# Run server tests
cd server
npm test
```

Test coverage includes:
- Component rendering and interaction
- API client functionality
- Authentication flows
- Form validation
- Error handling

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd client
vercel --prod
```

### Backend (Railway/Render)
```bash
cd server
# Deploy to Railway
railway up

# Or deploy to Render
render deploy
```

### Environment Variables in Production
Ensure all environment variables are configured in your hosting platform, especially:
- Database connection strings
- API keys and secrets
- Domain-specific URLs
- SMTP credentials

## 🔧 API Documentation

### Authentication
```bash
# Register a new user
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123!"
}

# Login
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "securePassword123!"
}

# Verify email
POST /api/auth/verify-email
{
  "token": "verification_token_from_email"
}

# Forgot password
POST /api/auth/forgot-password
{
  "email": "john@example.com"
}

# Reset password
POST /api/auth/reset-password
{
  "token": "reset_token_from_email",
  "password": "newSecurePassword123!"
}
```

### User Management
```bash
# Get user profile
GET /api/users/profile
Authorization: Bearer <access_token>

# Update profile
PUT /api/users/profile
Authorization: Bearer <access_token>
{
  "name": "John Smith",
  "phone": "+1234567890"
}

# Upload profile picture
PUT /api/users/profile/picture
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
# File upload
```

### Products
```bash
# Get products with filters
GET /api/products?category=electronics&min_price=100&max_price=500&sort=price_asc

# Get product by slug
GET /api/products/{product-slug}

# Get product reviews
GET /api/products/{productId}/reviews

# Ask a question
POST /api/products/{productId}/questions
Authorization: Bearer <access_token>
{
  "question": "Does this product come with a warranty?"
}
```

### Cart
```bash
# Get cart
GET /api/cart
Authorization: Bearer <access_token>

# Add item to cart
POST /api/cart/items
Authorization: Bearer <access_token>
{
  "product_id": "product_id",
  "quantity": 2
}

# Update item quantity
PUT /api/cart/items/{itemId}
Authorization: Bearer <access_token>
{
  "quantity": 3
}

# Remove item from cart
DELETE /api/cart/items/{itemId}
Authorization: Bearer <access_token>

# Apply coupon
POST /api/cart/apply-coupon
Authorization: Bearer <access_token>
{
  "code": "WELCOME10"
}
```

### Orders
```bash
# Create order
POST /api/orders
Authorization: Bearer <access_token>
{
  "address_id": "address_id",
  "delivery_speed": "express",
  "payment_method": "stripe"
}

# Get user orders
GET /api/orders
Authorization: Bearer <access_token>

# Get order details
GET /api/orders/{orderId}
Authorization: Bearer <access_token>

# Cancel order
PUT /api/orders/{orderId}/cancel
Authorization: Bearer <access_token>

# Request return
POST /api/orders/{orderId}/return
Authorization: Bearer <access_token>
{
  "reason": "Item damaged"
}

# Download invoice
GET /api/orders/{orderId}/invoice
Authorization: Bearer <access_token>
```

### Seller Endpoints
```bash
# Create product (seller only)
POST /api/seller/products
Authorization: Bearer <access_token>
{
  "title": "Wireless Headphones",
  "description": "Premium wireless headphones with noise cancellation",
  "category_id": "category_id",
  "price": 99.99,
  "stock_quantity": 50,
  "images": ["image_url1", "image_url2"]
}

# Get seller orders
GET /api/seller/orders
Authorization: Bearer <access_token>

# Update order status
PUT /api/seller/orders/{orderId}/status
Authorization: Bearer <access_token>
{
  "status": "shipped",
  "tracking_number": "1234567890"
}
```

### Admin Endpoints
```bash
# Get all users
GET /api/admin/users
Authorization: Bearer <admin_token>

# Change user role
PUT /api/admin/users/{userId}/role
Authorization: Bearer <admin_token>
{
  "role": "seller"
}

# Get seller applications
GET /api/admin/sellers/applications
Authorization: Bearer <admin_token>

# Approve seller
PUT /api/admin/sellers/{userId}/approve
Authorization: Bearer <admin_token>

# Create banner
POST /api/admin/banners
Authorization: Bearer <admin_token>
{
  "title": "Summer Sale",
  "image_url": "banner_image_url",
  "link_url": "/sale",
  "order": 1
}
```

## 📈 Performance Optimization

ShopSphere is optimized for speed and efficiency:

### Frontend Optimizations
- Code splitting with dynamic imports
- Lazy loading of images and components
- Skeleton loaders for async content
- Efficient state management with Zustand
- Memoized components to prevent unnecessary re-renders
- Optimized asset delivery

### Backend Optimizations
- Database indexing on frequently queried fields
- Caching with Redis for frequently accessed data
- Efficient MongoDB queries with proper projections
- Rate limiting to prevent abuse
- Connection pooling
- Background job processing for non-critical operations

### Search Optimization
- Algolia integration for fast, relevant search results
- Auto-suggest with debounced queries
- Faceted search with filters
- Typo tolerance and "Did you mean?" suggestions

## 🛡️ Security Best Practices

### Authentication
- JWT tokens with short expiration (15 minutes)
- Refresh tokens with longer expiration (7 days) and rotation
- Secure token storage (httpOnly cookies for production)
- CSRF protection with state tokens
- Rate limiting on authentication endpoints

### Input Validation
- Zod schemas for all API endpoints
- Server-side validation even when client-side validation exists
- Sanitization of user inputs to prevent XSS
- Validation of file types and sizes for uploads

### Data Protection
- Environment variables for all secrets
- No hardcoded credentials
- Proper error handling without leaking sensitive information
- Secure headers (CSP, XSS protection, etc.)
- HTTPS enforcement

### Payment Security
- PCI compliance through Stripe integration
- No direct handling of credit card information
- Webhook signature verification
- Idempotency keys to prevent duplicate processing
- Secure session management

## 🤝 Contributing

We welcome contributions to ShopSphere! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a pull request

Please ensure your code follows the existing style and includes appropriate tests.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📬 Support

For support, please open an issue on GitHub or contact the development team at support@shopsphere.com.