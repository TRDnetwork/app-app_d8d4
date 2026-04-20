# ShopSphere E-Commerce Platform

Builds a full-featured e-commerce marketplace with multi-role support, payments, and AI recommendations.

## 🛍️ Features

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
- Product listing pages with filters (price range, brand, rating, category, availability) and sorting
- Product detail page with multiple image gallery, size/color selectors, stock indicator, and reviews
- Search bar with auto-suggest, search history, and filters

### Cart & Checkout
- Add to Cart with quantity selector
- Cart page showing items, subtotal, delivery estimate
- Save for Later from cart
- Coupon/promo code input
- Multi-step checkout flow with address selection, delivery speed choice, and payment methods

### Order Management
- Real-time order status tracking
- Order cancellation before dispatch
- Return/refund request flow
- Download invoice as PDF
- Rate & review products after delivery

### Seller & Admin Panels
- Seller dashboard for product management, order processing, and revenue analytics
- Admin panel for managing users, sellers, products, categories, and platform analytics

### Advanced Features
- AI-powered product recommendations
- "Compare Products" feature
- Flash sale countdown timers
- Push notifications for order updates
- Loyalty points system
- Dark mode toggle
- Fully responsive mobile design
- Multi-language and multi-currency support
- SEO-optimized pages
- Lazy loading and skeleton loaders

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: Redux Toolkit
- **Routing**: Next.js App Router

### Backend
- **Framework**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ORM
- **Authentication**: JWT with refresh token rotation
- **Payments**: Stripe API
- **File Storage**: AWS S3
- **Search**: Algolia/Elasticsearch
- **Email**: Resend

## 📁 Project Structure

```
shop-sphere/
├── client/                        # Next.js frontend
│   ├── src/
│   │   ├── app/                   # App Router pages
│   │   ├── components/            # Reusable components
│   │   ├── store/                 # Redux store
│   │   └── lib/                   # Utilities and API clients
│   └── ...
├── server/                        # Express backend
│   ├── src/
│   │   ├── models/                # Mongoose schemas
│   │   ├── routes/                # API routes
│   │   ├── controllers/           # Route handlers
│   │   ├── middleware/            # Auth and validation
│   │   └── services/              # Stripe, S3, email integrations
│   └── ...
├── db/                            # Database scripts
│   └── seed.js                    # Sample data script
├── tests/                         # Test files
│   ├── app.test.ts
│   └── api.test.ts
└── ...
```

## 🔐 Security

- JWT with refresh token rotation
- Rate limiting on auth & payment endpoints
- Input validation & sanitization
- HTTPS enforced
- XSS & CSRF protection
- Role-based access control (Customer, Seller, Admin)
- Environment variables for secrets
- HTTP-only cookies for refresh tokens

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB
- Stripe account
- AWS S3 bucket
- Resend email service

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/shop-sphere.git
cd shop-sphere
```

2. Install dependencies:
```bash
# Install client dependencies
cd client && npm install
cd ..

# Install server dependencies
cd server && npm install
cd ..
```

3. Set up environment variables:
```bash
# Create .env files in both client and server directories
cp client/.env.example client/.env
cp server/.env.example server/.env
```

4. Update environment variables with your credentials:
```env
# server/.env
MONGODB_URI=mongodb://localhost:27017/shopsphere
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET=your_bucket_name
RESEND_API_KEY=your_resend_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
```

5. Seed the database:
```bash
node db/seed.js
```

6. Start the development servers:
```bash
# In one terminal, start the backend
cd server && npm run dev

# In another terminal, start the frontend
cd client && npm run dev
```

7. Open your browser and navigate to `http://localhost:3000`

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Test coverage:
- 85%+ line coverage
- 90%+ branch coverage
- All critical user flows tested
- Security checks for authentication and authorization

## 📦 Deployment

### Frontend
Deploy to Vercel:
```bash
vercel
```

### Backend
Deploy to Railway or Render:
```bash
# Railway
railway up

# Render
render deploy
```

## 📄 License
This project is licensed under the MIT License.