# ShopSphere E-Commerce Platform

ShopSphere is a full-featured Amazon-like e-commerce platform built with React, Express, MongoDB, and Stripe. It features user authentication, product catalog, cart, checkout, order management, seller/admin dashboards, and advanced e-commerce functionality.

## 🚀 Features

### User Features
- Register/Login with email/password or Google/Facebook OAuth
- Email verification & password reset
- User profile with address management
- Order history with tracking
- Wishlist and recently viewed products
- Product reviews and Q&A

### Product & Catalog
- Homepage with banners, deals, and featured categories
- Product listing with filters and sorting
- Product detail page with image gallery, variants, and recommendations
- Search with autocomplete and filters

### Cart & Checkout
- Add to cart with quantity selector
- Multi-step checkout with address, delivery, and payment selection
- Stripe payments with coupon support
- Order confirmation and email

### Order Management
- Real-time order status tracking
- Cancel orders and request returns
- Download invoices as PDF
- Rate products after delivery

### Seller & Admin
- Seller dashboard to manage products and orders
- Admin panel for platform management
- Analytics and reporting
- Promo code and banner management

### Advanced Features
- AI-powered recommendations
- Dark mode toggle
- Responsive mobile design
- SEO-optimized pages
- Lazy loading and performance optimizations

## 🛠️ Tech Stack

**Frontend**
- React.js with Vite
- TypeScript
- Tailwind CSS with shadcn/ui
- Zustand for state management
- React Router for routing

**Backend**
- Node.js with Express.js
- MongoDB with Mongoose ORM
- JWT authentication
- Stripe API for payments
- AWS S3 for file storage
- Resend for email

**Infrastructure**
- Vercel (frontend hosting)
- Railway/Render (backend hosting)
- GitHub Actions (CI/CD)

## 📦 Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB instance
- Stripe account
- AWS S3 bucket
- Resend email service

### Installation

1. Clone the repository:
```bash
git clone https://github.com/trd-network/shopsphere.git
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

3. Create environment files:
```bash
# Create .env files from examples
cp .env.example server/.env
cp .env.example client/.env
```

4. Configure environment variables in `server/.env`:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/shopsphere

# JWT
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_REFRESH_SECRET=your_refresh_token_secret_here

# OAuth - Google
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# OAuth - Facebook
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

# Email - Resend
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=noreply@shopsphere.com

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
STRIPE_SUCCESS_URL=http://localhost:3000/order-confirmation
STRIPE_CANCEL_URL=http://localhost:3000/cart

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
S3_BUCKET=shopsphere-uploads

# Algolia Search
ALGOLIA_APP_ID=your_algolia_app_id
ALGOLIA_API_KEY=your_algolia_admin_key
ALGOLIA_INDEX_NAME=products
```

5. Start the development servers:
```bash
# Start backend server
cd server
npm run dev

# Start frontend client
cd ../client
npm run dev

# Start admin dashboard
cd ../admin
npm run dev
```

6. Seed the database (optional):
```bash
cd server
npm run seed
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/oauth/google` - Google OAuth redirect
- `GET /api/auth/oauth/google/callback` - Google OAuth callback

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/profile/picture` - Upload profile picture
- `GET /api/users/addresses` - List user addresses
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
- `GET /api/admin/sellers/applications` - Seller applications
- `PUT /api/admin/sellers/:id/approve` - Approve seller
- `PUT /api/admin/sellers/:id/reject` - Reject seller
- `POST /api/admin/banners` - Create banner
- `PUT /api/admin/banners/:id` - Update banner
- `DELETE /api/admin/banners/:id` - Delete banner
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/:id` - Update category
- `POST /api/admin/coupons` - Create coupon
- `GET /api/admin/analytics` - Platform analytics

## 📁 Folder Structure

```
shopsphere/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── stores/         # Zustand stores
│   │   ├── lib/            # Utilities and API clients
│   │   ├── assets/         # Static assets
│   │   └── App.tsx         # Main app component
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
├── server/                 # Express backend
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # Mongoose models
│   │   ├── middleware/     # Express middleware
│   │   ├── services/       # Business logic services
│   │   └── utils/          # Utility functions
│   ├── package.json
│   └── tsconfig.json
├── admin/                  # Admin/Seller dashboard
│   ├── src/
│   │   ├── pages/          # Dashboard pages
│   │   ├── components/     # Dashboard components
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
├── db/                     # Database scripts
│   ├── seed.ts             # Database seeding
│   └── migrate/            # Migration scripts
├── .env.example            # Environment variables template
├── README.md
└── package.json            # Root package.json for monorepo scripts
```

## 🚦 Development Scripts

```bash
# Start development servers
npm run dev:client
npm run dev:server
npm run dev:admin

# Build for production
npm run build:client
npm run build:server
npm run build:admin

# Run tests
npm run test
npm run test:watch

# Lint code
npm run lint
npm run lint:fix

# Seed database
npm run seed

# Generate documentation
npm run docs
```

## 🔐 Security

ShopSphere implements multiple security measures:

- JWT with refresh token rotation
- Input validation using Zod
- Rate limiting on authentication endpoints
- CORS policy with strict origin validation
- Content Security Policy (CSP) headers
- Password hashing with bcrypt
- Secure cookie settings
- CSRF protection
- Role-based access control (RBAC)

## 📈 Performance

The application includes several performance optimizations:

- React.memo for component memoization
- Debounced filter and sort updates
- Lazy loading for images
- Request deduplication
- API response caching
- Code splitting for routes
- Image optimization with WebP
- Service worker for offline support

## 📬 Email Setup

ShopSphere uses Resend for transactional emails. To configure:

1. Create a Resend account at [resend.com](https://resend.com)
2. Get your API key from the dashboard
3. Add it to your environment variables
4. Verify your sending domain
5. Update the `EMAIL_FROM` address to use your verified domain

See `EMAIL_SETUP.md` for detailed instructions.

## 💳 Payment Setup

ShopSphere uses Stripe for payments. To configure:

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the dashboard
3. Set up webhook endpoints for `checkout.session.completed` and `payment_intent.succeeded`
4. Add the webhook secret to your environment variables
5. Test with Stripe test card numbers

See `PAYMENT_SETUP.md` for detailed instructions.

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd client
vercel --prod
```

### Backend (Railway)
```bash
cd server
railway up
```

### Environment Variables
Ensure all required environment variables are set in your hosting platform.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📬 Contact

For support or inquiries, please contact [support@trd-network.com](mailto:support@trd-network.com)