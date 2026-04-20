# 🛍️ ShopSphere - E-Commerce Marketplace Platform

ShopSphere is a full-featured e-commerce platform similar to Amazon, built with modern technologies to provide a seamless shopping experience. The platform includes comprehensive features for customers, sellers, and administrators, with robust security, payment processing, and search capabilities.

## 🚀 Features

### 👤 User Features
- **Authentication**: Register/Login with email/password or Google/Facebook OAuth
- **Email Verification**: Secure email verification flow with token-based validation
- **Password Reset**: Secure password reset with time-limited tokens
- **User Profile**: Editable name, address, phone, and profile picture
- **Order History**: Detailed order tracking with status updates
- **Wishlist**: Save products for later purchase
- **Product Reviews**: Star ratings and detailed reviews with image uploads
- **Recently Viewed**: Track recently viewed products
- **Multiple Addresses**: Save and manage multiple shipping addresses

### 🛍️ Product & Catalog Features
- **Homepage**: Hero banner, deals of the day, featured categories, and sponsored products
- **Product Listing**: Filter by price, brand, rating, category, and availability
- **Sorting**: Sort by price (low to high, high to low), newest, best seller, and average rating
- **Pagination**: Infinite scroll or pagination for product listings
- **Product Detail**: Multiple image gallery with zoom, size/color/variant selector, stock availability, price with discount, EMI/delivery options
- **Frequently Bought Together**: Product bundling suggestions
- **Customers Also Viewed**: Personalized recommendations
- **Q&A Section**: Users can ask questions, sellers can answer
- **Detailed Reviews**: Reviews with images and helpful votes
- **Search**: Auto-suggest/autocomplete, search history, filters within results, "Did you mean?" correction

### 🛒 Cart & Checkout
- **Add to Cart**: Quantity selector and variant selection
- **Cart Page**: Item listing, subtotal, delivery estimate
- **Save for Later**: Move items from cart to wishlist
- **Coupon/Promo Code**: Apply discount codes
- **Multi-Step Checkout**:
  - Address selection or add new address
  - Choose delivery speed (standard, express, same-day)
  - Payment method selection (card via Stripe, UPI, COD, saved cards)
  - Order review and placement
- **Order Confirmation**: Order summary with order ID
- **Email Confirmation**: Automated order confirmation emails

### 📦 Order Management
- **Real-time Order Status**: Placed → Confirmed → Shipped → Out for Delivery → Delivered
- **Order Tracking**: Timeline UI for order status visualization
- **Order Cancellation**: Cancel orders before dispatch
- **Return/Refund**: Request return/refund flow
- **Invoice Download**: Download order invoice as PDF
- **Post-Delivery Reviews**: Rate and review products after delivery

### 🏪 Seller & Admin Panel
- **Seller Dashboard**: Separate registration and dashboard for sellers
- **Product Management**: Add/edit/delete products with image uploads to AWS S3
- **Inventory Management**: Track and update stock levels
- **Order Processing**: View and process incoming orders
- **Revenue Analytics**: Sales charts (daily/weekly/monthly)
- **Review Management**: Manage customer reviews and Q&A responses
- **Super Admin Panel**: Manage all users, sellers, and products
- **Seller Approval**: Approve/reject seller applications
- **Content Management**: Banner/ad management, category/subcategory management
- **Promo Codes**: Create and manage discount codes
- **Platform Analytics**: GMV, active users, top products, refund rate

### 💡 Advanced Features
- **AI Recommendations**: Collaborative filtering for product recommendations
- **Product Comparison**: Side-by-side product specification comparison
- **Flash Sales**: Countdown timer for limited-time deals
- **Push Notifications**: Order update notifications
- **Loyalty Program**: Points and rewards system
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Fully responsive mobile-first design (PWA-ready)
- **Multi-language**: Internationalization support
- **Multi-currency**: Support for multiple currencies
- **SEO Optimization**: Meta tags, Open Graph, structured data
- **Performance**: Lazy loading for images, skeleton loaders for async content

## 🏗️ Tech Stack

### Frontend
- **Framework**: React.js with Vite
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: Zustand with persistence
- **Routing**: React Router DOM
- **UI Components**: shadcn/ui (Button, Input, Card, Dialog, Toast, etc.)

### Backend
- **Framework**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ORM
- **Authentication**: JWT with refresh token rotation and OAuth (Google/Facebook)
- **Payments**: Stripe API for secure payment processing
- **File Storage**: AWS S3 for product and profile images
- **Search**: Elasticsearch/Algolia integration
- **Email**: Resend for transactional emails

### Infrastructure
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Railway/Render
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry for error tracking

## 📁 Folder Structure

```
shop-sphere/
├── client/                   # React frontend
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utilities and API clients
│   │   ├── stores/           # Zustand stores
│   │   ├── assets/           # Images and other assets
│   │   ├── App.tsx           # Main application component
│   │   └── main.tsx          # Entry point
│   ├── index.html            # HTML template
│   └── package.json
├── server/                   # Express backend
│   ├── src/
│   │   ├── models/           # Mongoose models
│   │   ├── routes/           # API routes
│   │   ├── controllers/      # Route controllers
│   │   ├── middleware/       # Authentication and validation
│   │   ├── services/         # Business logic services
│   │   ├── utils/            # Helper functions
│   │   └── index.ts          # Server entry point
│   └── package.json
├── .env.example              # Environment variables template
├── package.json              # Root package.json
└── README.md                 # Project documentation
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- AWS account for S3 storage
- Stripe account for payments
- Resend account for emails
- Algolia/Elasticsearch for search

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/your-username/shop-sphere.git
cd shop-sphere
```

2. **Install dependencies:**
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. **Set up environment variables:**
Create a `.env` file in the root directory and add the following variables:

```env
# Frontend Environment Variables
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Backend Environment Variables
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/shopsphere
JWT_SECRET=your_jwt_secret_key_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=shopsphere-media

# Email Configuration
RESEND_API_KEY=re_...
EMAIL_FROM=hello@shopsphere.com

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Search Configuration
ALGOLIA_APP_ID=your_algolia_app_id
ALGOLIA_API_KEY=your_algolia_api_key
ALGOLIA_INDEX_NAME=products
```

4. **Start the development servers:**
```bash
# In one terminal, start the backend
cd server
npm run dev

# In another terminal, start the frontend
cd client
npm run dev
```

5. **Access the application:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 🛠️ Usage Guide

### Development
```bash
# Start frontend in development mode
npm run dev:client

# Start backend in development mode
npm run dev:server

# Run tests
npm run test

# Build for production
npm run build
```

### Production Deployment
```bash
# Build the frontend
cd client
npm run build

# The built files will be in client/dist/
# Deploy to Vercel or similar platform
```

## 🔐 Security

ShopSphere implements multiple security measures:

- **JWT Authentication**: Secure token-based authentication with refresh token rotation
- **Rate Limiting**: Protection against brute force attacks on auth endpoints
- **Input Validation**: Comprehensive validation using Mongoose schemas
- **HTTPS Enforcement**: Secure connections in production
- **CORS Protection**: Properly configured CORS headers
- **CSRF Protection**: SameSite cookies and CSRF tokens
- **Secure Cookies**: HTTP-only and secure cookies for session management
- **Environment Variables**: Sensitive data stored in environment variables
- **Webhook Verification**: Stripe webhook signature verification
- **Password Security**: Bcrypt hashing for passwords
- **XSS Protection**: Sanitization of user inputs

## 📈 API Documentation

For detailed API endpoints, see [API.md](docs/API.md).

## 🧪 Testing

The application includes comprehensive testing:

- **Unit Tests**: Testing individual components and functions
- **Integration Tests**: Testing API endpoints and database interactions
- **End-to-End Tests**: Testing user flows from login to checkout

## 🚀 Deployment

### Frontend
Deploy the client application to Vercel:

1. Push code to GitHub repository
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Backend
Deploy the server application to Railway or Render:

1. Push code to GitHub repository
2. Connect repository to Railway/Render
3. Set environment variables
4. Deploy

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📬 Support

For support, please open an issue on GitHub or contact the development team at support@shopsphere.com.