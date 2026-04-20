# 🛍️ ShopSphere — Amazon-like E-Commerce Platform

A full-featured e-commerce marketplace built with React, Express, and MongoDB. Features user authentication, product catalog, cart, checkout with Stripe, order tracking, seller/admin dashboards, and more.

## 🚀 Features

- **User Auth**: JWT + OAuth (Google/Facebook) with email verification
- **Product Catalog**: Search, filters, sorting, detailed product pages
- **Cart & Checkout**: Multi-step flow with coupon support and Stripe payments
- **Order Management**: Real-time tracking, cancellation, returns
- **Seller Dashboard**: Add products, manage orders, view analytics
- **Admin Panel**: User/seller management, content moderation, platform analytics
- **Advanced**: AI recommendations, dark mode, PWA, i18n, SEO

## 🛠️ Tech Stack

- **Frontend**: React + Vite + Tailwind + shadcn/ui
- **Backend**: Node.js + Express + MongoDB (Mongoose)
- **Auth**: JWT with refresh tokens
- **Payments**: Stripe
- **Storage**: AWS S3
- **Search**: Algolia
- **Email**: Resend
- **State**: Zustand
- **Hosting**: Vercel (frontend), Railway/Render (backend)

## 📦 Prerequisites

- Node.js v18+
- MongoDB
- AWS S3 bucket
- Stripe account
- Resend email API
- Algolia account

## 🔧 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/shopsphere.git
cd shopsphere
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
# Edit .env with your actual keys
```

### 4. Run the development servers

```bash
npm run dev
```

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

### 5. Seed the database (optional)

```bash
npm run seed
```

## 🧪 Testing

```bash
# Run frontend tests
cd client && npm test

# Run backend tests
cd server && npm test
```

## 🏗️ Folder Structure

```
.
├── client/           # React frontend
├── server/           # Express backend
├── db/               # Database schemas and seed
├── .env.example      # Environment template
└── README.md
```

## 📄 License

MIT