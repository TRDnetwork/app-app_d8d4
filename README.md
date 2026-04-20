# ShopSphere

A full-featured Amazon-like e-commerce platform built with React, Node.js, MongoDB, and Stripe. ShopSphere offers a seamless shopping experience with advanced features including product recommendations, real-time order tracking, and multi-role dashboards.

## 🏗️ Tech Stack

- **Frontend**: React.js + Tailwind CSS + shadcn/ui
- **Backend**: Node.js + Express.js
- **Database**: MongoDB (Mongoose ORM)
- **Authentication**: JWT + OAuth (Google/Facebook)
- **Payments**: Stripe API
- **File Storage**: AWS S3
- **Search**: Algolia
- **State Management**: Zustand
- **Hosting**: Vercel (frontend) + Railway/Render (backend)

## 🔧 Features

### User Features
- Register/Login with email/password or Google/Facebook OAuth
- Email verification & password reset flow
- User profile with address management
- Order history with real-time tracking
- Wishlist and recently viewed products
- Product reviews and Q&A
- Multiple saved addresses

### Product & Catalog
- Homepage with hero banners and featured products
- Advanced product listing with filters and sorting
- Product detail page with image gallery and variants
- Search with autocomplete and filters
- "Frequently Bought Together" and "Customers Also Viewed"

### Cart & Checkout
- Multi-step checkout with address, delivery, and payment selection
- Coupon/promo code support
- Stripe payment integration
- Order confirmation and email notifications

### Order Management
- Real-time order status tracking
- Cancel orders before dispatch
- Return/refund requests
- Download invoices as PDF
- Post-delivery product reviews

### Admin & Seller Panels
- Seller dashboard for product and order management
- Admin panel for platform-wide analytics and content management
- Revenue analytics with charts
- Banner and category management
- Promo code creation

### Advanced Features
- AI-powered product recommendations
- Compare products feature
- Flash sales with countdown timers
- Push notifications
- Loyalty points system
- Dark mode toggle
- Fully responsive mobile design
- Multi-language and multi-currency support
- SEO-optimized pages

## 🔐 Security

- JWT with refresh token rotation
- Rate limiting on auth and payment endpoints
- Input validation with Zod
- HTTPS enforcement
- XSS and CSRF protection
- Role-based access control (Customer, Seller, Admin)
- Secure Stripe webhook handling with signature verification
- CORS configuration with specific origins

## 📁 Folder Structure

```
shop-sphere/
├── client/           → React frontend
├── server/           → Express backend
├── admin/            → Admin/Seller dashboard
├── db/               → Database scripts
├── tests/            → Test files
├── docs/             → Documentation
├── api/              → Serverless functions
└── .env.example      → Environment variables template
```

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- Redis (for job queues)
- Stripe account
- AWS S3 bucket
- Algolia account
- Resend email service

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/shop-sphere.git
cd shop-sphere
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
# Create .env files in each directory
cp .env.example server/.env
cp .env.example client/.env
cp .env.example admin/.env
```

4. Configure environment variables in each `.env` file:
```env
# server/.env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/shopsphere
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET=your_s3_bucket_name
ALGOLIA_APP_ID=your_algolia_app_id
ALGOLIA_ADMIN_KEY=your_algolia_admin_key
RESEND_API_KEY=your_resend_api_key
FRONTEND_URL=http://localhost:5173
SERVER_URL=http://localhost:3000
```

```env
# client/.env
VITE_API_URL=http://localhost:3000/api
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
VITE_ALGOLIA_APP_ID=your_algolia_app_id
VITE_ALGOLIA_SEARCH_KEY=your_algolia_search_key
```

```env
# admin/.env
VITE_API_URL=http://localhost:3000/api
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
```

### Database Setup

1. Run database migrations:
```bash
cd server
npm run migrate
```

2. Seed the database with sample data:
```bash
npm run seed
```

### Running the Application

1. Start the backend server:
```bash
cd server
npm run dev
```

2. Start the frontend:
```bash
cd ../client
npm run dev
```

3. Start the admin dashboard:
```bash
cd ../admin
npm run dev
```

4. Access the applications:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Admin Dashboard: http://localhost:5174

### Testing

Run unit and integration tests:
```bash
cd client
npm test

cd ../server
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage
```

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd client
vercel
```

### Backend (Railway/Render)
```bash
cd server
# Follow Railway/Render deployment instructions
```

### Admin Dashboard (Vercel)
```bash
cd admin
vercel
```

## 📞 Support

For support, please open an issue on GitHub or contact the development team at support@shopsphere.com.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.