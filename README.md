# ShopSphere - Full-Featured E-Commerce Marketplace

ShopSphere is a production-ready e-commerce platform built with modern technologies, offering Amazon-like functionality with multi-role support, secure payments, and advanced features. This fullstack application provides a complete marketplace experience for customers, sellers, and administrators.

## Features

### 🛍️ User Experience
- **Authentication**: Email/password login with JWT and OAuth (Google/Facebook)
- **User Management**: Profile editing, multiple addresses, order history
- **Product Discovery**: Advanced search with autocomplete, filters, and sorting
- **Shopping Cart**: Add/remove items, save for later, apply coupons
- **Checkout**: Multi-step flow with address selection, delivery options, and payment
- **Order Tracking**: Real-time status updates with timeline visualization
- **Reviews & Ratings**: Product reviews with star ratings and helpful votes
- **Wishlist**: Save products for later purchase
- **Responsive Design**: Fully mobile-optimized with PWA capabilities

### 🏪 Seller Dashboard
- **Product Management**: Add/edit/delete products with image uploads to AWS S3
- **Inventory Control**: Track stock levels and receive low-stock alerts
- **Order Processing**: View and manage incoming orders
- **Analytics**: Revenue dashboards with sales charts and performance metrics
- **Q&A Management**: Respond to customer questions about products

### 🔧 Admin Panel
- **User Management**: View and manage all users and sellers
- **Content Management**: Banner and ad management for homepage
- **Category Management**: Create and organize product categories and subcategories
- **Promotions**: Create promo codes and manage discounts
- **Platform Analytics**: Comprehensive analytics including GMV, active users, top products, and refund rates
- **Seller Approval**: Review and approve/reject seller applications

### 💡 Advanced Features
- **AI-Powered Recommendations**: Collaborative filtering for personalized product suggestions
- **Product Comparison**: Side-by-side comparison of product specifications
- **Flash Sales**: Countdown timer deals with limited availability
- **Push Notifications**: Real-time updates for order status changes
- **Loyalty Program**: Points and rewards system for repeat customers
- **Dark Mode**: Toggle between light and dark themes
- **Multi-language**: Internationalization support (i18n)
- **Multi-currency**: Support for different currencies
- **SEO Optimization**: Meta tags, Open Graph, and structured data for better search visibility

## Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: Redux Toolkit
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Validation**: Zod
- **UI Components**: Radix UI

### Backend
- **Framework**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ORM
- **Authentication**: JWT with refresh token rotation
- **Payments**: Stripe API integration
- **File Storage**: AWS S3 for product images
- **Search**: Elasticsearch/Algolia integration
- **Email**: Resend for transactional emails
- **Monitoring**: Sentry for error tracking

### Infrastructure
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Railway/Render
- **Database**: MongoDB Atlas
- **CI/CD**: GitHub Actions

## Setup Instructions

### Prerequisites
- Node.js v18 or higher
- MongoDB instance (local or cloud)
- Stripe account for payment processing
- AWS account for S3 storage
- Resend account for email delivery

### Installation

1. Clone the repository:
```bash
git clone https://github.com/trd-network/shopsphere.git
cd shopsphere
```

2. Install dependencies:
```bash
# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install

# Install root dependencies
cd .. && npm install
```

3. Create environment files:
```bash
# Create .env file in server directory
cp server/.env.example server/.env

# Create .env file in client directory
cp client/.env.example client/.env
```

4. Update environment variables in `server/.env`:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/shopsphere

# Security
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here_change_in_production

# OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
S3_BUCKET_NAME=your_s3_bucket_name

# Email
RESEND_API_KEY=your_resend_api_key
```

5. Run the development servers:
```bash
# Start the backend server
cd server && npm run dev

# In another terminal, start the frontend
cd ../client && npm run dev
```

6. Seed the database with sample data:
```bash
# Run the seed script
cd server && node db/seed.js
```

## Folder Structure

```
shopsphere/
├── client/                        # Next.js 14 frontend
│   ├── public/                    # Static assets
│   ├── src/
│   │   ├── app/                   # App Router pages
│   │   │   ├── page.tsx           # Homepage
│   │   │   ├── products/[id]/page.tsx
│   │   │   ├── checkout/page.tsx
│   │   │   ├── seller/page.tsx
│   │   │   └── admin/page.tsx
│   │   ├── components/            # Reusable UI components
│   │   ├── lib/                   # Utilities and API clients
│   │   ├── store/                 # Redux store
│   │   └── styles/                # Global styles
│   ├── .env.example
│   └── package.json
├── server/                        # Express backend
│   ├── src/
│   │   ├── models/                # Mongoose schemas
│   │   ├── routes/                # API routes
│   │   ├── controllers/           # Route handlers
│   │   ├── middleware/            # Auth, validation
│   │   ├── services/              # Stripe, S3, email
│   │   └── server.ts
│   ├── db/                        # Database scripts
│   │   ├── seed.js                # Sample data script
│   │   ├── init.js                # Database initialization
│   │   └── migrate.js             # Migration runner
│   ├── .env.example
│   └── package.json
├── admin/                         # Admin dashboard (separate app)
├── docs/                          # Documentation
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset

### Products
- `GET /api/products` - List products with filters
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (seller)
- `PUT /api/products/:id` - Update product (seller)
- `DELETE /api/products/:id` - Delete product (seller)

### Categories
- `GET /api/categories` - List all categories
- `GET /api/categories/:id` - Get category details

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `DELETE /api/cart/:itemId` - Remove item from cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - List user's orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/cancel` - Cancel order
- `PUT /api/orders/:id/return` - Request return

### Reviews
- `GET /api/reviews/:productId` - Get product reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Search
- `GET /api/search?q=` - Search products

### Payment
- `POST /api/payment/create-checkout-session` - Create Stripe checkout session
- `POST /api/payment/webhook` - Stripe webhook handler

### Admin
- `GET /api/admin/users` - List all users
- `GET /api/admin/sellers` - List all sellers
- `POST /api/admin/coupons` - Create coupon
- `GET /api/admin/analytics` - Platform analytics

## Usage Guide

### Development
```bash
# Start the development server
npm run dev

# Run tests
npm run test

# Run linting
npm run lint

# Build for production
npm run build
```

### Production Deployment
1. Set environment variables in your hosting platform
2. Run database migrations: `node db/migrate.js up`
3. Seed initial data: `node db/seed.js`
4. Build the application: `npm run build`
5. Start the server: `npm start`

## Security

ShopSphere implements multiple security measures:

- **Authentication**: JWT with refresh token rotation stored in httpOnly cookies
- **Input Validation**: Comprehensive validation using Zod and Mongoose
- **Rate Limiting**: Protection against brute force attacks on auth endpoints
- **XSS Protection**: React's built-in XSS protection and proper escaping
- **CSRF Protection**: CSRF tokens for form submissions
- **HTTPS**: Enforced in production
- **Secret Management**: All sensitive keys stored in environment variables
- **Password Security**: Bcrypt hashing with salt
- **CORS**: Restricted to trusted domains

## Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy the application

### Backend (Railway/Render)
1. Create a new service on Railway/Render
2. Connect to your GitHub repository
3. Set environment variables
4. Deploy the application

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue on GitHub or contact the development team at support@shopsphere.com.