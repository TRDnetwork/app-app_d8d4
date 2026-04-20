# ShopSphere E-Commerce Platform

ShopSphere is a full-featured Amazon-like e-commerce platform built with modern web technologies. It features user authentication, product catalog, cart and checkout with Stripe payments, order management, seller/admin dashboards, and advanced features like AI recommendations and real-time tracking.

## 🛠️ Tech Stack

- **Frontend**: React.js + Vite + Tailwind CSS + shadcn/ui
- **Backend**: Node.js + Express.js
- **Database**: MongoDB (Mongoose ORM)
- **Authentication**: JWT + OAuth (Google/Facebook)
- **Payments**: Stripe API
- **File Storage**: AWS S3
- **Search**: Algolia/Elasticsearch
- **State Management**: Zustand
- **Hosting**: Vercel (frontend) + Railway/Render (backend)

## 🚀 Features

### User Features
- Register/Login with email/password or Google/Facebook OAuth
- Email verification & password reset flow
- User profile with editable details and profile picture
- Order history with detailed tracking
- Wishlist and recently viewed products
- Product reviews with star ratings
- Multiple saved addresses

### Product & Catalog
- Homepage with hero banner, deals, and featured categories
- Product listing with filters (price, brand, rating) and sorting
- Product detail page with image gallery, variants, and stock info
- Search with autocomplete, filters, and "Did you mean?" correction

### Cart & Checkout
- Add to cart with quantity selector
- Cart page with subtotal and delivery estimate
- Multi-step checkout flow (address → delivery → payment → review)
- Stripe payments with coupon support
- Order confirmation with email notification

### Order Management
- Real-time order status tracking
- Cancel orders before dispatch
- Return/refund request flow
- Download invoice as PDF
- Rate products after delivery

### Seller & Admin Panels
- Seller dashboard to manage products and orders
- Admin panel to manage users, sellers, and platform content
- Revenue analytics with charts
- Promo code and banner management

### Advanced Features
- AI-powered product recommendations
- "Compare Products" feature
- Flash sales with countdown timers
- Push notifications for order updates
- Loyalty points system
- Dark mode toggle
- Fully responsive mobile design
- Multi-language and multi-currency support

## 🔐 Security

ShopSphere implements comprehensive security measures:
- JWT with refresh token rotation
- Rate limiting on auth and payment endpoints
- Input validation and sanitization
- HTTPS enforcement
- XSS and CSRF protection
- Role-based access control (Customer, Seller, Admin)
- Secure Stripe integration with webhook signature verification
- CORS configured with specific origins
- Content Security Policy without unsafe-inline scripts

## 📦 Installation

### Prerequisites
- Node.js (v18+)
- MongoDB
- Stripe account
- AWS S3 bucket
- Algolia/Elasticsearch (optional)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/your-username/shopsphere.git
cd shopsphere
```

2. Install dependencies:
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

3. Create `.env` file in the server directory:
```env
# Environment
NODE_ENV=development
PORT=3000

# Database
MONGODB_URI=mongodb://localhost:27017/shopsphere

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here

# Frontend URLs
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:3000

# OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/oauth/google/callback

FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_REDIRECT_URI=http://localhost:3000/api/auth/oauth/facebook/callback

# Email
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=hello@shopsphere.com

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=shopsphere-uploads

# Algolia (optional)
ALGOLIA_APP_ID=your_algolia_app_id
ALGOLIA_API_KEY=your_algolia_api_key
ALGOLIA_INDEX_NAME=products
```

4. Run database migrations and seed data:
```bash
# Run migrations
npm run migrate

# Seed database
npm run seed
```

5. Start the development servers:
```bash
# Start server
cd server
npm run dev

# Start client
cd ../client
npm run dev

# Start admin dashboard
cd ../admin
npm run dev
```

## 🧪 Testing

ShopSphere includes comprehensive testing:

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run security scan
npm run security:scan

# Run performance audit
npm run performance:audit
```

## 🚦 API Endpoints

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
- `PUT /api/users/profile` - Update profile
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
- `PUT /api/products/questions/:id/answer` - Seller answer question

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:id` - Update cart item
- `DELETE /api/cart/items/:id` - Remove item from cart
- `POST /api/cart/apply-coupon` - Apply coupon

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - List user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/cancel` - Cancel order
- `POST /api/orders/:id/return` - Request return
- `GET /api/orders/:id/invoice` - Download invoice

### Seller (Auth: Seller role)
- `POST /api/seller/products` - Create product
- `PUT /api/seller/products/:id` - Update product
- `DELETE /api/seller/products/:id` - Delete product
- `GET /api/seller/orders` - List seller orders
- `PUT /api/seller/orders/:id/status` - Update order status
- `GET /api/seller/analytics` - Revenue analytics

### Admin (Auth: Admin role)
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
- `GET /api/admin/analytics` - Platform analytics

### Payment
- `POST /api/stripe/create-checkout-session` - Create Stripe session
- `GET /api/stripe/session/:session_id` - Verify session
- `POST /api/stripe/webhook` - Stripe webhook handler

## 📁 Project Structure

```
shop-sphere/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Page components
│   │   ├── stores/         # Zustand stores
│   │   ├── lib/            # Utilities and API clients
│   │   ├── assets/         # Static assets
│   │   └── App.tsx         # Main app component
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
├── admin/                  # Admin/Seller dashboard
│   ├── src/
│   │   ├── pages/          # Admin pages
│   │   ├── components/     # Admin components
│   │   └── App.tsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
├── server/                 # Express backend
│   ├── src/
│   │   ├── index.ts        # Server entry point
│   │   ├── routes/         # API routes
│   │   ├── controllers/    # Route handlers
│   │   ├── models/         # Mongoose models
│   │   ├── middleware/     # Express middleware
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions
│   │   └── config/         # Configuration
│   ├── package.json
│   └── tsconfig.json
├── db/                     # Database scripts
│   ├── seed.ts             # Database seeding
│   └── migrations/         # Database migrations
├── .env.example            # Environment variables template
├── README.md
└── package.json
```

## 🛡️ Security Best Practices

1. **Environment Variables**: Never commit sensitive data to version control. Use `.env` files and environment-specific configurations.

2. **Authentication**: 
   - Use strong JWT secrets (32+ characters)
   - Implement refresh token rotation
   - Validate OAuth state tokens
   - Rate limit authentication endpoints

3. **Input Validation**:
   - Validate all user input on both client and server
   - Use libraries like Zod or Joi for schema validation
   - Sanitize input to prevent XSS attacks

4. **Database Security**:
   - Use parameterized queries to prevent injection
   - Implement proper indexing for performance
   - Use MongoDB JSON schema validation
   - Limit array sizes to prevent performance issues

5. **Payment Security**:
   - Never expose Stripe secret keys in client code
   - Verify webhook signatures
   - Use idempotency keys for critical operations
   - Store minimal payment data

6. **CORS**: Configure CORS with specific origins, not wildcards.

7. **Content Security Policy**: Implement strict CSP without unsafe-inline scripts.

8. **Rate Limiting**: Apply rate limiting to prevent abuse of critical endpoints.

9. **Logging**: Implement secure logging without sensitive data.

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd client
vercel
```

### Backend (Railway/Render)
```bash
cd server
railway up
# or
render deploy
```

### Environment Variables
Set all required environment variables in your hosting platform's dashboard.

### Database
- Set up MongoDB Atlas or self-hosted MongoDB
- Configure connection string in environment variables
- Run migrations and seed data on first deployment

### SSL/HTTPS
Ensure HTTPS is enabled for all environments.

## 📊 Monitoring

ShopSphere includes monitoring capabilities:
- Application performance monitoring
- Error tracking
- Payment success rate monitoring
- User activity tracking
- System health checks

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📬 Support

For support, please open an issue on GitHub or contact the development team at support@shopsphere.com.