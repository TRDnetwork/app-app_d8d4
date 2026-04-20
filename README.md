# ShopSphere

Builds a full-featured Amazon-like e-commerce platform with user, seller, and admin roles.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (v6+)
- Redis (v7+)
- Stripe account
- Resend account (for emails)
- AWS S3 bucket (for file storage)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/trd-network/shopsphere.git
cd shopsphere
```

2. **Install dependencies**
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Install admin dashboard dependencies
cd ../admin
npm install
```

3. **Set up environment variables**

Create `.env` files in each directory:

**server/.env**
```env
# Database
MONGODB_URI=mongodb://localhost:27017/shopsphere
MONGODB_DB_NAME=shopsphere

# Redis (for job queues)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
REDIS_TLS=false

# File upload
UPLOAD_DIR=/tmp/shopsphere-imports

# Server
PORT=3001
NODE_ENV=development
SERVER_URL=http://localhost:3001

# Security
JWT_SECRET=your-jwt-secret-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key-change-in-production

# Frontend
CLIENT_URL=http://localhost:5173

# Email
RESEND_API_KEY=your-resend-api-key
EMAIL_FROM=ShopSphere <onboarding@resend.dev>

# Stripe
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key

# Logging
LOG_LEVEL=info

# OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
```

**client/.env**
```env
VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
VITE_API_BASE_URL=http://localhost:3001/api
VITE_RESEND_API_KEY=your-resend-api-key
```

**admin/.env**
```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
```

4. **Set up MongoDB**

Start MongoDB and apply migrations:
```bash
# Start MongoDB (if using Docker)
docker run -d -p 27017:27017 --name mongodb mongo:6

# Apply migrations
cd server
mongo shopsphere db/migrate/apply.js
```

5. **Seed the database**
```bash
cd server
mongo shopsphere db/seed.js
```

6. **Start the applications**

In separate terminals:
```bash
# Start server
cd server
npm run dev

# Start client
cd client
npm run dev

# Start admin dashboard
cd admin
npm run dev
```

## 🔧 Features

### User Features
- Register/Login with email & password or Google/Facebook OAuth
- Email verification & password reset flow
- User profile page with editable name, address, phone, profile picture
- Order history with detailed order tracking
- Wishlist / Save for Later
- Product reviews & star ratings (with edit/delete)
- Recently viewed products
- Multiple saved addresses

### Product & Catalog Features
- Homepage with hero banner, deals of the day, featured categories, sponsored products
- Product listing pages with filters and sorting
- Product detail page with image gallery, variants, and reviews
- Search bar with auto-suggest and filters

### Cart & Checkout
- Add to Cart with quantity selector
- Cart page showing items and subtotal
- Save for Later from cart
- Coupon/promo code input
- Multi-step checkout with address, delivery, and payment selection

### Order Management
- Real-time order status tracking
- Order tracking page with timeline UI
- Cancel order (before dispatch)
- Return/refund request flow
- Download invoice as PDF

### Seller & Admin Panel
- Seller registration and dashboard
- Add/edit/delete products with image upload
- Manage inventory & stock levels
- View & process incoming orders
- Revenue analytics dashboard
- Admin panel for managing users, sellers, and platform content

## 🛠 API Endpoints

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout
- `POST /api/auth/verify-email` - Verify email with token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/oauth/google` - Google OAuth redirect
- `GET /api/auth/oauth/google/callback` - Google OAuth callback
- `GET /api/auth/oauth/facebook` - Facebook OAuth redirect
- `GET /api/auth/oauth/facebook/callback` - Facebook OAuth callback

### Users
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/profile/picture` - Upload profile picture
- `GET /api/users/addresses` - List user addresses
- `POST /api/users/addresses` - Add new address
- `PUT /api/users/addresses/:id` - Update address
- `DELETE /api/users/addresses/:id` - Delete address

### Products
- `GET /api/products` - List products with filters
- `GET /api/products/:slug` - Get product by slug
- `GET /api/products/:id/reviews` - Get product reviews
- `GET /api/products/:id/questions` - Get product Q&A
- `POST /api/products/:id/questions` - Ask a question
- `PUT /api/products/questions/:id/answer` - Seller answer question
- `GET /api/products/recently-viewed` - Get recently viewed products
- `GET /api/products/recommendations` - Get product recommendations

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:id` - Update cart item quantity
- `DELETE /api/cart/items/:id` - Remove item from cart
- `POST /api/cart/apply-coupon` - Apply coupon to cart

### Wishlist
- `GET /api/wishlist` - Get user wishlist
- `POST /api/wishlist/:product_id` - Add to wishlist
- `DELETE /api/wishlist/:product_id` - Remove from wishlist

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - List user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/cancel` - Cancel order
- `POST /api/orders/:id/return` - Request return
- `GET /api/orders/:id/invoice` - Download invoice PDF

### Reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Edit review
- `DELETE /api/reviews/:id` - Delete review
- `POST /api/reviews/:id/helpful` - Mark review as helpful

### Seller (auth: seller)
- `POST /api/seller/products` - Create product
- `PUT /api/seller/products/:id` - Update product
- `DELETE /api/seller/products/:id` - Delete product
- `GET /api/seller/orders` - List seller orders
- `PUT /api/seller/orders/:id/status` - Update order status
- `GET /api/seller/analytics` - Get revenue analytics

### Admin (auth: admin)
- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/:id/role` - Change user role
- `GET /api/admin/sellers/applications` - List seller applications
- `PUT /api/admin/sellers/:id/approve` - Approve seller
- `PUT /api/admin/sellers/:id/reject` - Reject seller
- `POST /api/admin/banners` - Create banner
- `PUT /api/admin/banners/:id` - Update banner
- `DELETE /api/admin/banners/:id` - Delete banner
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/:id` - Update category
- `POST /api/admin/coupons` - Create coupon
- `GET /api/admin/analytics` - Get platform analytics

## 📂 Project Structure

```
shopsphere/
├── client/           # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Page components
│   │   ├── stores/        # Zustand stores
│   │   ├── lib/           # Utilities and API clients
│   │   └── App.tsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
├── admin/            # Admin/Seller dashboard
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.tsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
├── server/           # Express backend
│   ├── src/
│   │   ├── index.ts
│   │   ├── routes/        # API routes
│   │   ├── controllers/   # Route handlers
│   │   ├── models/        # MongoDB models
│   │   ├── middleware/    # Express middleware
│   │   ├── services/      # Business logic
│   │   ├── utils/         # Utilities
│   │   └── config/        # Configuration
│   ├── package.json
│   └── tsconfig.json
├── db/               # Database scripts
│   ├── migrate/       # Database migrations
│   ├── seed.js        # Seed data
│   └── schema.sql     # Schema documentation
├── .env.example       # Environment variables template
└── README.md
```

## 🚨 Security

### Implemented Security Measures
- JWT with refresh token rotation
- Rate limiting on auth and payment endpoints
- Input validation and sanitization
- HTTPS enforced in production
- XSS and CSRF protection
- Role-based access control (Customer, Seller, Admin)
- Path traversal protection in file uploads
- Environment variables for sensitive configuration
- Secure Redis configuration with TLS support
- Email verification and password reset tokens with expiration

### Security Headers
- Content Security Policy (CSP)
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Strict-Transport-Security (HSTS)

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run specific test file
npm test tests/app.test.ts

# Run with coverage
npm test -- --coverage
```

### Test Coverage
- Frontend component tests
- API endpoint tests
- Authentication flow tests
- Payment processing tests
- Data import/export functionality

## 🚀 Deployment

### Production Setup
1. Set environment variables for production
2. Use HTTPS with valid SSL certificate
3. Set up proper logging and monitoring
4. Configure backup strategy for MongoDB
5. Set up CI/CD pipeline

### Environment Variables for Production
```env
# Production environment
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shopsphere

# Security
JWT_SECRET=long-random-string-for-production
JWT_REFRESH_SECRET=long-random-string-for-production

# Production URLs
CLIENT_URL=https://shopsphere.com
SERVER_URL=https://api.shopsphere.com

# Stripe production keys
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### Docker Deployment
```dockerfile
# Dockerfile for server
FROM node:18-alpine

WORKDIR /app
COPY server/package*.json ./
RUN npm ci --only=production

COPY server/src ./src
COPY server/tsconfig.json ./

EXPOSE 3001
CMD ["npm", "start"]
```

## 📈 Performance

### Optimizations
- React.memo for component memoization
- Skeleton loaders for async content
- WebP image format with JPEG fallback
- Lazy loading for images
- Route-based code splitting
- Service worker for offline support
- Caching headers for static assets

### Performance Metrics
- Bundle size: 1.15MB (4% reduction)
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📬 Contact

For support or questions, please open an issue on GitHub.