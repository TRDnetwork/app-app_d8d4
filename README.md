# ShopSphere - Premium E-Commerce Platform

ShopSphere is a full-featured Amazon-like e-commerce platform built with modern technologies, offering a seamless shopping experience for customers, sellers, and administrators.

## 🚀 Features

### User Features
- Register/Login with email & password or Google/Facebook OAuth
- Email verification & password reset flow
- User profile with editable details and profile picture
- Order history with detailed tracking
- Wishlist and save for later functionality
- Product reviews and star ratings
- Recently viewed products
- Multiple saved addresses

### Product & Catalog
- Homepage with hero banners, deals, and featured categories
- Advanced product listing with filters and sorting
- Detailed product pages with image gallery and variants
- Search with autocomplete and filters
- Q&A section for products

### Cart & Checkout
- Add to cart with quantity selector
- Cart page with subtotal and delivery estimate
- Multi-step checkout with address, delivery, and payment selection
- Coupon/promo code support
- Order confirmation and email notifications

### Order Management
- Real-time order status tracking
- Cancel orders before dispatch
- Return/refund request flow
- Download invoices as PDF
- Post-delivery product reviews

### Seller & Admin Panels
- Seller dashboard for product management and order processing
- Admin panel for platform-wide management
- Revenue analytics and sales charts
- Content and promotion management

### Advanced Features
- AI-powered product recommendations
- "Compare Products" feature
- Flash sales with countdown timers
- Push notifications
- Loyalty points system
- Dark mode toggle
- Fully responsive mobile design
- Multi-language and multi-currency support
- SEO-optimized pages
- Lazy loading and skeleton loaders

## 🏗️ Tech Stack

### Frontend
- **Framework**: React.js with Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: Zustand
- **Routing**: React Router
- **UI Components**: shadcn/ui

### Backend
- **Framework**: Node.js with Express.js
- **Database**: MongoDB (Mongoose ORM)
- **Authentication**: JWT with refresh token rotation
- **Payments**: Stripe API
- **File Storage**: AWS S3
- **Search**: Elasticsearch/Algolia
- **Email**: Resend

### Infrastructure
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Railway/Render
- **Monitoring**: Sentry

## 🔐 Security

ShopSphere implements comprehensive security measures:
- JWT with refresh token rotation
- Rate limiting on auth and payment endpoints
- Input validation with Zod
- HTTPS enforcement
- XSS and CSRF protection
- Role-based access control (RBAC)
- Secure headers (CSP, HSTS, etc.)
- Environment variable validation
- Secure Stripe webhook handling

## 📁 Project Structure

```
shop-sphere/
├── client/                 # React frontend
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── stores/         # Zustand stores
│   │   ├── lib/            # Utilities and helpers
│   │   ├── assets/         # Images and media
│   │   ├── main.tsx        # Entry point
│   │   └── App.tsx         # Root component
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
│
├── server/                 # Express backend
│   ├── src/
│   │   ├── index.ts        # Entry point
│   │   ├── routes/         # API routes
│   │   ├── controllers/    # Route handlers
│   │   ├── models/         # Mongoose models
│   │   ├── middleware/     # Express middleware
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Helper functions
│   │   └── config/         # Configuration
│   ├── package.json
│   └── tsconfig.json
│
├── db/                     # Database scripts
│   ├── seed.ts             # Database seeding
│   ├── indexes.ts          # Database indexes
│   └── validate-schema.ts  # Schema validation
│
├── .env.example            # Environment variables template
├── package.json            # Root package.json
└── README.md
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- AWS account for S3
- Stripe account
- Resend account for emails

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/shop-sphere.git
cd shop-sphere
```

2. Install dependencies:
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..

# Install server dependencies
cd server
npm install
cd ..
```

3. Set up environment variables:
```bash
# Copy the example file
cp .env.example .env

# Edit .env with your configuration
# See .env.example for required variables
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=3001

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_must_be_at_least_32_characters
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_secret_key_must_be_at_least_32_characters
JWT_REFRESH_EXPIRES_IN=7d

# Database
MONGODB_URI=mongodb://localhost:27017/shopsphere

# OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
OAUTH_CALLBACK_URL=http://localhost:3001/api/auth/oauth/callback

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLIC_KEY=pk_test_...

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=your_bucket_name

# Email
RESEND_API_KEY=re_...
EMAIL_FROM=hello@shopsphere.com

# Search
ALGOLIA_APP_ID=your_algolia_app_id
ALGOLIA_ADMIN_KEY=your_algolia_admin_key
ALGOLIA_SEARCH_KEY=your_algolia_search_key
ALGOLIA_INDEX_NAME=products

# Frontend
CLIENT_URL=http://localhost:5173
FRONTEND_URL=http://localhost:5173

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX=10
PAYMENT_RATE_LIMIT_MAX=20
```

### Database Setup

1. Start MongoDB (if using local instance):
```bash
mongod
```

2. Seed the database:
```bash
# From root directory
npm run seed
```

3. Create database indexes:
```bash
npm run indexes
```

### Running the Application

1. Start the backend server:
```bash
# From server directory
cd server
npm run dev
```

2. Start the frontend:
```bash
# From client directory
cd client
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/verify-email` - Verify email
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/oauth/google` - Google OAuth redirect
- `GET /api/auth/oauth/google/callback` - Google OAuth callback

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/profile/picture` - Upload profile picture
- `GET /api/users/addresses` - List addresses
- `POST /api/users/addresses` - Add address
- `PUT /api/users/addresses/:id` - Update address
- `DELETE /api/users/addresses/:id` - Delete address

### Products
- `GET /api/products` - List products with filters
- `GET /api/products/:slug` - Get product by slug
- `GET /api/products/:id/reviews` - Get product reviews
- `GET /api/products/:id/questions` - Get product Q&A
- `POST /api/products/:id/questions` - Ask question
- `PUT /api/products/questions/:id/answer` - Seller answer (auth: seller)
- `GET /api/products/recently-viewed` - Recently viewed products
- `GET /api/products/recommendations` - AI recommendations
- `POST /api/products/:id/compare` - Compare products

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:id` - Update cart item quantity
- `DELETE /api/cart/items/:id` - Remove item from cart
- `POST /api/cart/apply-coupon` - Apply coupon

### Wishlist
- `GET /api/wishlist` - Get user wishlist
- `POST /api/wishlist/:product_id` - Add to wishlist
- `DELETE /api/wishlist/:product_id` - Remove from wishlist

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - List user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/cancel` - Cancel order
- `POST /api/orders/:id/return` - Request return
- `GET /api/orders/:id/invoice` - Download invoice

### Reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Edit review
- `DELETE /api/reviews/:id` - Delete review
- `POST /api/reviews/:id/helpful` - Mark review helpful

### Seller (auth: seller role)
- `POST /api/seller/products` - Create product
- `PUT /api/seller/products/:id` - Update product
- `DELETE /api/seller/products/:id` - Delete product
- `GET /api/seller/orders` - List seller orders
- `PUT /api/seller/orders/:id/status` - Update order status
- `GET /api/seller/analytics` - Revenue analytics

### Admin (auth: admin role)
- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/:id/role` - Change user role
- `GET /api/admin/sellers/applications` - Pending seller applications
- `PUT /api/admin/sellers/:id/approve` - Approve seller
- `PUT /api/admin/sellers/:id/reject` - Reject seller
- `POST /api/admin/banners` - Create banner
- `PUT /api/admin/banners/:id` - Update banner
- `DELETE /api/admin/banners/:id` - Delete banner
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/:id` - Update category
- `POST /api/admin/coupons` - Create coupon
- `GET /api/admin/analytics` - Platform analytics

### Payment
- `POST /api/stripe/create-checkout-session` - Create Stripe session
- `GET /api/stripe/session/:session_id` - Verify session status
- `POST /api/stripe/webhook` - Stripe webhook handler

### Search
- `GET /api/search` - Search products
- `GET /api/search/suggest` - Search suggestions
- `POST /api/search/index` - Index product (internal)

## 🧪 Testing

The application includes comprehensive testing:

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test -- path/to/test/file.test.ts
```

## 🚀 Deployment

### Frontend (Vercel)
1. Push code to GitHub repository
2. Import project in Vercel dashboard
3. Set environment variables in Vercel
4. Deploy

### Backend (Railway/Render)
1. Push code to GitHub repository
2. Import project in Railway/Render dashboard
3. Set environment variables
4. Deploy

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## 📬 Contact

For support or questions, please open an issue on GitHub.