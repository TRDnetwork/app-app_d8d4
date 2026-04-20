# ShopSphere E-Commerce Platform

A full-featured Amazon-like e-commerce platform built with React, Express, and MongoDB.

## 🛠️ Tech Stack

- **Frontend**: React.js + Vite + Tailwind CSS + shadcn/ui
- **Backend**: Node.js + Express.js + MongoDB (Mongoose)
- **Authentication**: JWT + OAuth (Google/Facebook)
- **Payments**: Stripe API
- **File Storage**: AWS S3
- **Search**: Algolia
- **State Management**: Zustand
- **Analytics**: PostHog
- **Error Tracking**: Sentry

## 📦 Features

- User authentication with email verification & password reset
- Product catalog with search, filters, sorting, and detailed pages
- Cart, wishlist, and multi-step checkout with Stripe payments
- Order management with real-time tracking and return requests
- Seller and admin dashboards for product and platform management
- AI-powered recommendations, loyalty points, dark mode, PWA support

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB
- Stripe account
- AWS S3 bucket
- Algolia account
- Resend email API
- Google/Facebook OAuth credentials

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/shopsphere.git
cd shopsphere
```

2. Install dependencies:
```bash
# Install client dependencies
cd client && npm install
cd ../admin && npm install
cd ../server && npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your credentials
```

4. Start the development servers:
```bash
# Terminal 1: Start backend
cd server && npm run dev

# Terminal 2: Start frontend
cd client && npm run dev

# Terminal 3: Start admin panel
cd admin && npm run dev
```

5. Seed the database:
```bash
cd server && npm run seed
```

## 🌐 Environment Variables

See `.env.example` for required environment variables.

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage
```

## 🛡️ Security

- JWT with refresh token rotation
- Rate limiting on auth endpoints
- Input validation with Zod
- HTTPS enforced
- XSS and CSRF protection
- Role-based access control (Customer, Seller, Admin)

## 📊 Analytics & Monitoring

- PostHog for product analytics
- Sentry for error tracking
- Structured logging
- Health checks

## 📁 Project Structure

```
shopsphere/
├── client/           # React frontend (customer-facing)
├── admin/            # React admin dashboard (seller/admin)
├── server/           # Express backend API
├── db/               # Database migrations and seed
├── .env.example      # Environment variables template
└── README.md
```

## 📄 License

MIT License