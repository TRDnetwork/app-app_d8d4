# ShopSphere - E-Commerce Marketplace Platform

![ShopSphere Screenshot](https://i.imgur.com/8Zk9X7l.png)

ShopSphere is a full-featured e-commerce platform inspired by Amazon, built with modern technologies to provide a seamless shopping experience for customers, sellers, and administrators.

## 🏗️ Tech Stack

- **Frontend**: React.js + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand
- **Backend**: Node.js + Express.js
- **Database**: MongoDB (Mongoose ORM)
- **Authentication**: JWT + OAuth (Google/Facebook)
- **Payments**: Stripe API
- **File Storage**: AWS S3
- **Search**: Algolia
- **Email**: Resend
- **Hosting**: Vercel (frontend) + Railway/Render (backend)

## ✨ Features

### 👤 User Features
- Register/Login with email & password or Google/Facebook OAuth
- Email verification & password reset flow
- User profile page with editable details
- Order history with detailed tracking
- Wishlist and recently viewed products
- Product reviews & ratings
- Multiple saved addresses

### 🛍️ Product & Catalog
- Homepage with hero banners and featured categories
- Advanced product listing with filters and sorting
- Product detail page with image gallery and variants
- Search with autocomplete and suggestions
- "Frequently Bought Together" and "Customers Also Viewed"

### 🛒 Cart & Checkout
- Multi-step checkout process
- Address management
- Delivery speed selection
- Coupon/promo code support
- Stripe-powered payments
- Order confirmation

### 📦 Order Management
- Real-time order status tracking
- Cancel and return requests
- Invoice download
- Post-delivery reviews

### 🏪 Seller & Admin Panels
- Seller dashboard for product management
- Admin panel for platform-wide control
- Analytics and reporting
- Content management

### 💡 Advanced Features
- Dark mode toggle
- Fully responsive design
- SEO-optimized pages
- Lazy loading and skeleton loaders
- Multi-language and multi-currency support

## 🔐 Security

ShopSphere implements robust security measures:
- JWT with refresh token rotation
- Rate limiting on auth endpoints
- Input validation with Zod
- HTTPS enforcement
- XSS and CSRF protection
- Role-based access control (Customer, Seller, Admin)

## 📁 Folder Structure

```
shop-sphere/
├── client/                   # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── stores/           # Zustand stores
│   │   ├── lib/              # Utilities and API clients
│   │   └── assets/           # Static assets
│   ├── index.html
│   └── package.json
├── server/                   # Express backend
│   ├── src/
│   │   ├── controllers/      # Route handlers
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic
│   │   ├── middleware/       # Auth and security
│   │   ├── utils/            # Helper functions
│   │   └── config/           # Configuration
│   └── package.json
├── .env.example              # Environment variables template
├── package.json              # Monorepo root
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Stripe account
- Resend account
- AWS account (for S3)
- Algolia account

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/shop-sphere.git
cd shop-sphere
```

### 2. Install Dependencies
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

### 3. Configure Environment Variables
Create a `.env` file in the root directory and add your environment variables:

```bash
# Copy the example file
cp .env.example .env

# Edit the .env file with your actual values
nano .env
```

### 4. Start the Development Servers
```bash
# Start the backend server
cd server
npm run dev

# In a new terminal, start the frontend
cd client
npm run dev
```

### 5. Access the Application
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## 🛠️ API Documentation

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset confirmation

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile
- `POST /api/users/me/avatar` - Upload profile picture
- `GET /api/users/me/addresses` - Get user addresses
- `POST /api/users/me/addresses` - Add new address

### Products
- `GET /api/products` - List products with filters
- `GET /api/products/:id` - Get product details
- `GET /api/products/:id/related` - Get related products
- `GET /api/products/:id/questions` - Get product Q&A

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:id` - Update cart item quantity
- `DELETE /api/cart/items/:id` - Remove item from cart

### Orders
- `GET /api/orders` - Get user order history
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/cancel` - Cancel order

## 🧪 Testing

Run tests with:
```bash
# Run frontend tests
cd client
npm test

# Run backend tests
cd server
npm test
```

## 🚢 Deployment

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

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing
Contributions are welcome! Please read the CONTRIBUTING.md file for details on our code of conduct and the process for submitting pull requests.

## 📬 Contact
For support or questions, please open an issue on GitHub.