# ShopSphere - Premium E-Commerce Marketplace

ShopSphere is a full-featured e-commerce platform built with modern technologies, offering a seamless shopping experience for customers, powerful tools for sellers, and comprehensive analytics for administrators. Inspired by Amazon, it includes product catalog management, multi-step checkout with Stripe payments, order tracking, user profiles, and advanced features like AI recommendations and seller dashboards.

## 🚀 Features

### Customer Features
- **Authentication**: Email/password login with JWT and OAuth (Google/Facebook)
- **User Management**: Profile editing, address management, order history
- **Product Discovery**: Search with autocomplete, filters, sorting, and pagination
- **Shopping Experience**: Product detail pages with image galleries, reviews, Q&A, and "Frequently Bought Together"
- **Cart & Checkout**: Multi-step checkout with address selection, delivery options, and Stripe payments
- **Order Management**: Real-time order tracking, cancellation, returns, and invoice downloads
- **Wishlist**: Save products for later purchase

### Seller Features
- **Product Management**: Add, edit, and delete products with image uploads to AWS S3
- **Order Processing**: View and manage incoming orders
- **Analytics Dashboard**: Revenue charts and sales performance metrics

### Admin Features
- **User Management**: Manage all users, sellers, and roles
- **Content Management**: Banner and ad management, category management
- **Promotions**: Create promo codes and discounts
- **Platform Analytics**: View GMV, active users, top products, and refund rates

### Advanced Features
- **AI Recommendations**: Collaborative filtering for personalized product suggestions
- **Flash Sales**: Countdown timer deals
- **Push Notifications**: Order status updates
- **Loyalty Program**: Points and rewards system
- **Multi-language & Currency**: International support
- **SEO Optimized**: Meta tags, Open Graph, and structured data
- **PWA Ready**: Fully responsive mobile design

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS with shadcn/ui components
- **UI Library**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Testing**: Vitest, React Testing Library

### Backend
- **Framework**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ORM
- **Authentication**: JWT with refresh token rotation
- **Payments**: Stripe API
- **File Storage**: AWS S3
- **Search**: Algolia (planned)
- **Email**: Resend
- **Job Processing**: Node-cron with MongoDB job queue

### Infrastructure
- **Hosting**: Vercel (frontend), Railway/Render (backend)
- **CI/CD**: GitHub Actions
- **Monitoring**: Custom logging and error tracking

## 📁 Project Structure

```
shopsphere/
├── client/                        # Next.js 14 frontend
│   ├── src/
│   │   ├── app/                   # App Router pages
│   │   │   ├── page.tsx           # Homepage
│   │   │   ├── products/[id]/page.tsx
│   │   │   ├── checkout/page.tsx
│   │   │   ├── orders/page.tsx
│   │   │   ├── profile/page.tsx
│   │   │   ├── wishlist/page.tsx
│   │   │   ├── seller/page.tsx    # Seller dashboard
│   │   │   └── admin/page.tsx     # Admin panel
│   │   ├── components/            # Reusable UI components
│   │   ├── lib/                   # Utilities and API clients
│   │   └── store/                 # Redux store
│   ├── public/
│   ├── next.config.js
│   ├── tailwind.config.ts
│   └── package.json
├── server/                        # Express backend
│   ├── src/
│   │   ├── models/                # Mongoose schemas
│   │   ├── routes/                # API routes
│   │   ├── controllers/           # Route handlers
│   │   ├── middleware/            # Auth, rate limiting
│   │   ├── services/              # Stripe, S3, email
│   │   ├── db/                    # Database migrations
│   │   └── server.js              # Server entry point
│   ├── .env.example
│   └── package.json
├── db/
│   ├── migrations/                # MongoDB migration scripts
│   └── seed.js                    # Sample data script
├── tests/
│   ├── app.test.ts                # Frontend component tests
│   └── api.test.ts                # Backend API tests
├── PAYMENT_SETUP.md               # Stripe integration guide
├── EMAIL_SETUP.md                 # Email configuration guide
├── .env.example                   # Environment variables template
└── README.md
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB Atlas account or local MongoDB instance
- Stripe account
- AWS account (for S3)
- Resend account (for email)
- Vercel and Railway/Render accounts (for deployment)

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/your-username/shopsphere.git
cd shopsphere
```

2. **Install dependencies**
```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. **Set up environment variables**
```bash
# Create .env files
cp .env.example .env
cd client && cp .env.local.example .env.local
```

4. **Configure environment variables**

**Server (.env):**
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/shopsphere

# JWT
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
STRIPE_PUBLIC_KEY=your_stripe_public_key

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=shopsphere-products

# Email
RESEND_API_KEY=your_resend_api_key
```

**Client (.env.local):**
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

5. **Run the development servers**
```bash
# Start the backend
cd server
npm run dev

# In another terminal, start the frontend
cd ../client
npm run dev
```

6. **Run database migrations and seed data**
```bash
# Run migrations
cd server
npm run migrate:up

# Seed sample data
npm run seed
```

### Testing

```bash
# Run frontend tests
cd client
npm test

# Run backend tests
cd server
npm test
```

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/refresh-token` - Refresh JWT token
- `POST /api/auth/logout` - Logout user

### OAuth
- `GET /api/auth/oauth/google` - Google OAuth login
- `GET /api/auth/oauth/google/callback` - Google OAuth callback
- `GET /api/auth/oauth/facebook` - Facebook OAuth login
- `GET /api/auth/oauth/facebook/callback` - Facebook OAuth callback

### Products
- `GET /api/products` - List products with filters
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (seller only)
- `PUT /api/products/:id` - Update product (seller only)
- `DELETE /api/products/:id` - Delete product (seller only)

### Categories
- `GET /api/categories` - List all categories

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `DELETE /api/cart/:itemId` - Remove item from cart

### Orders
- `POST /api/orders` - Place order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/cancel` - Cancel order
- `PUT /api/orders/:id/return` - Request return
- `GET /api/orders` - Get user's order history

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/:productId` - Get reviews for product

### Payments
- `POST /api/payment/create-checkout-session` - Create Stripe checkout session
- `POST /api/webhooks/stripe` - Stripe webhook handler

### Admin
- `GET /api/admin/users` - Get all users (admin only)
- `GET /api/admin/sellers` - Get all sellers (admin only)
- `POST /api/admin/coupons` - Create coupon (admin only)
- `GET /api/admin/analytics` - Get platform analytics (admin only)

### Data Import/Export
- `POST /api/import/:type` - Import data (admin only)
- `GET /api/export/:type` - Export data (admin only)
- `GET /api/import/status` - Get import/export status (admin only)

## 🛡️ Security

ShopSphere implements multiple security measures:

- **JWT Authentication**: Access tokens with 15-minute expiration and refresh tokens with 7-day expiration
- **Refresh Token Rotation**: New refresh token issued on each refresh
- **Rate Limiting**: 5 requests per 15 minutes on authentication endpoints
- **Input Validation**: Comprehensive validation using Mongoose schemas
- **Password Hashing**: bcrypt with salt rounds
- **HTTP-only Cookies**: Refresh tokens stored in HTTP-only cookies
- **Environment Variables**: All secrets stored in environment variables
- **CORS**: Properly configured for frontend-backend communication
- **XSS Protection**: React's built-in XSS protection
- **CSRF Protection**: JWT tokens provide CSRF protection

## 📈 Performance Optimization

- **Database Indexing**: Critical fields indexed for faster queries
- **Loading States**: Skeleton loaders for all async content
- **Image Optimization**: Next.js image optimization and lazy loading
- **Error Handling**: Comprehensive error handling and status code checking
- **Constant-time Comparison**: Prevents timing attacks on token validation
- **Connection Pooling**: MongoDB connection pooling for better performance

## 🚨 Known Issues and Limitations

1. **Search Functionality**: Currently uses MongoDB text search; Algolia integration is planned but not implemented
2. **AI Recommendations**: Collaborative filtering algorithm is defined but not fully implemented
3. **Multi-currency Support**: Currency conversion logic is defined but not fully implemented
4. **Push Notifications**: Service worker and push notification setup is defined but not fully implemented
5. **Advanced Analytics**: Some analytics endpoints are defined but not fully implemented

## 📦 Deployment

### Frontend (Vercel)
```bash
cd client
vercel --prod
```

### Backend (Railway/Render)
```bash
cd server
# For Railway
railway up

# For Render
render deploy
```

### Environment Variables on Production
Ensure all environment variables are set in your production environment, especially:
- Database connection strings
- API keys and secrets
- Domain-specific URLs

## 📚 Documentation

- **PAYMENT_SETUP.md**: Detailed guide for Stripe integration
- **EMAIL_SETUP.md**: Guide for configuring email with Resend
- **API.md**: Comprehensive API documentation (generated from code)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Next.js team for the excellent framework
- Vercel for hosting and tooling
- MongoDB for the flexible database
- Stripe for seamless payments
- Resend for reliable email delivery
- shadcn/ui for beautiful, accessible components
- The open-source community for countless libraries and tools