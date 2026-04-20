# ShopSphere

Builds a full-featured Amazon-like e-commerce platform with multi-role support, real-time order tracking, and integrated payments.

## Features

- **User Features**: Register/Login with email & password or Google/Facebook OAuth, Email verification & password reset flow, User profile page with editable name, address, phone, profile picture, Order history with detailed order tracking, Wishlist / Save for Later, Product reviews & star ratings (with edit/delete), Recently viewed products, Multiple saved addresses
- **Product & Catalog Features**: Homepage with hero banner, deals of the day, featured categories, sponsored products, Product listing pages with filters (price range, brand, rating, category, availability), Sort by (Price: Low to High, High to Low, Newest, Best Seller, Avg Rating), Pagination or infinite scroll, Product detail page with multiple image gallery with zoom, Size/color/variant selector, Stock availability indicator, Price with discount % and original price, EMI / delivery options, "Frequently Bought Together" section, "Customers Also Viewed" carousel, Q&A section (users can ask questions, sellers answer), Detailed reviews with images, helpful votes
- **Cart & Checkout**: Add to Cart with quantity selector, Cart page showing items, subtotal, delivery estimate, Save for Later from cart, Coupon/promo code input, Checkout flow: Step 1: Address selection or add new address, Step 2: Choose delivery speed (standard, express, same-day), Step 3: Payment method (card via Stripe, UPI, COD, saved cards), Step 4: Order review & place order, Order confirmation page with order ID, Email confirmation after placing order
- **Order Management**: Real-time order status: Placed → Confirmed → Shipped → Out for Delivery → Delivered, Order tracking page with timeline UI, Cancel order (before dispatch), Return/refund request flow, Download invoice as PDF, Rate & review product after delivery
- **Seller / Admin Panel**: Separate seller registration and dashboard, Add/edit/delete products with image upload, Manage inventory & stock levels, View & process incoming orders, Revenue analytics dashboard (charts: daily/weekly/monthly sales), Manage reviews and Q&A responses
- **Super Admin Panel**: Manage all users, sellers, and products, Approve/reject seller applications, Banner/ad management, Category and subcategory management, Promo code / discount creation, Platform-wide analytics: GMV, active users, top products, refund rate
- **Advanced Features**: AI-powered product recommendations (collaborative filtering), "Compare Products" feature (side-by-side specs), Flash sale / countdown timer deals, Push notifications for order updates, Loyalty points / rewards system, Dark mode toggle, Fully responsive mobile design (PWA-ready), Multi-language support (i18n), Multi-currency support, SEO-optimized pages (meta tags, Open Graph, structured data), Lazy loading for images, Skeleton loaders for all async content
- **Security**: JWT with refresh token rotation, Rate limiting on auth & payment endpoints, Input validation & sanitization (Zod / Joi), HTTPS enforced, XSS & CSRF protection, Role-based access control (Customer, Seller, Admin)

## Tech Stack

- Frontend: React.js + Tailwind CSS
- Backend: Node.js + Express.js
- Database: MongoDB (Mongoose ORM)
- Authentication: JWT + OAuth (Google/Facebook)
- Payments: Stripe API
- File Storage: AWS S3 (for product images)
- Search: Elasticsearch or Algolia
- State Management: Redux Toolkit
- Hosting: AWS / Vercel (frontend) + Railway/Render (backend)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB
- Stripe account
- AWS account (for S3)
- Elasticsearch or Algolia account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/shopsphere.git
   cd shopsphere
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/shopsphere

   # JWT
   JWT_SECRET=your_jwt_secret_key_here_must_be_at_least_32_characters_long
   JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here_must_be_at_least_32_characters_long

   # Stripe
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

   # AWS S3
   AWS_ACCESS_KEY_ID=your_aws_access_key_id
   AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
   AWS_S3_BUCKET=your_s3_bucket_name
   AWS_REGION=your_aws_region

   # Search
   ELASTICSEARCH_URL=http://localhost:9200
   # OR
   ALGOLIA_APP_ID=your_algolia_app_id
   ALGOLIA_API_KEY=your_algolia_api_key

   # Email
   EMAIL_HOST=smtp.example.com
   EMAIL_PORT=587
   EMAIL_USER=your_email_username
   EMAIL_PASS=your_email_password

   # Application
   NODE_ENV=development
   PORT=3000
   ```

4. Run the application:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Folder Structure

```
<project-root>/
├── client/                   # Vite React frontend
│   ├── src/
│   │   ├── main.tsx          # Entry point (MUST reference /src/main.tsx)
│   │   ├── App.tsx           # Root router
│   │   ├── pages/            # Customer pages
│   │   ├── seller/           # Seller dashboard pages
│   │   ├── admin/            # Admin panel pages
│   │   ├── components/       # Shared components
│   │   ├── stores/           # Zustand stores (auth, cart, wishlist)
│   │   ├── lib/              # API client, utils, cn helper
│   │   └── assets/           # Static assets
│   ├── index.html            # Vite entry HTML (references /src/main.tsx)
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── server/                   # Express backend
│   ├── src/
│   │   ├── index.ts          # Server entry
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # Express route handlers
│   │   ├── middleware/       # Auth, RBAC, rate limiting
│   │   ├── controllers/      # Business logic
│   │   ├── services/         # S3, Stripe, email, search services
│   │   ├── utils/            # Helpers, validation schemas
│   │   └── config/           # DB connection, env config
│   ├── package.json
│   └── tsconfig.json
├── db/
│   ├── schema.js             # Mongoose schema definitions
│   └── seed.js               # Sample data for testing
├── .env.example              # Environment variable template
├── package.json              # Monorepo root (workspaces)
└── README.md                 # Setup instructions
```

## API Endpoints

### Auth
- POST `/api/auth/register` — email/password registration
- POST `/api/auth/login` — JWT token generation
- POST `/api/auth/refresh` — refresh token rotation
- POST `/api/auth/verify-email` — email verification
- POST `/api/auth/forgot-password` — password reset request
- POST `/api/auth/reset-password` — password reset confirmation
- GET `/api/auth/oauth/google` — OAuth redirect
- GET `/api/auth/oauth/facebook` — OAuth redirect

### Users
- GET `/api/users/me` — current user profile
- PUT `/api/users/me` — update profile
- POST `/api/users/me/avatar` — upload profile picture (S3)
- GET `/api/users/me/addresses` — list addresses
- POST `/api/users/me/addresses` — add address
- PUT `/api/users/me/addresses/:id` — update address
- DELETE `/api/users/me/addresses/:id` — delete address

### Products
- GET `/api/products` — list with filters/sort/pagination
- GET `/api/products/:id` — single product detail
- GET `/api/products/:id/related` — related products
- GET `/api/products/:id/questions` — Q&A for product
- POST `/api/products/:id/questions` — ask question
- PUT `/api/products/:id/view` — increment view count

### Cart
- GET `/api/cart` — get user cart
- POST `/api/cart/items` — add item
- PUT `/api/cart/items/:id` — update quantity
- DELETE `/api/cart/items/:id` — remove item
- POST `/api/cart/apply-coupon` — validate and apply coupon

### Wishlist
- GET `/api/wishlist` — get wishlist
- POST `/api/wishlist/:productId` — add to wishlist
- DELETE `/api/wishlist/:productId` — remove from wishlist

### Orders
- GET `/api/orders` — user order history
- POST `/api/orders` — create order
- GET `/api/orders/:id` — order detail with tracking
- PUT `/api/orders/:id/cancel` — cancel order
- POST `/api/orders/:id/return` — request return

### Reviews
- GET `/api/reviews` — reviews for product (with filters)
- POST `/api/reviews` — create review (requires purchase verification)
- PUT `/api/reviews/:id` — edit own review
- DELETE `/api/reviews/:id` — delete own review
- POST `/api/reviews/:id/helpful` — mark review helpful

### Search
- GET `/api/search` — search products (Algolia/Elasticsearch integration)
- GET `/api/search/suggestions` — autocomplete

### Seller Dashboard
- POST `/api/seller/products` — create product
- PUT `/api/seller/products/:id` — update product
- DELETE `/api/seller/products/:id` — archive product
- GET `/api/seller/orders` — seller's orders
- PUT `/api/seller/orders/:id/status` — update order status
- GET `/api/seller/analytics` — sales analytics
- POST `/api/seller/products/:id/images` — upload product images (S3)

### Admin
- GET `/api/admin/users` — list all users
- PUT `/api/admin/users/:id/role` — change user role
- GET `/api/admin/seller-applications` — pending applications
- PUT `/api/admin/seller-applications/:id/approve` — approve seller
- POST `/api/admin/categories` — create category
- PUT `/api/admin/categories/:id` — update category
- POST `/api/admin/banners` — create banner
- POST `/api/admin/coupons` — create coupon
- GET `/api/admin/analytics` — platform-wide stats

### Payment
- POST `/api/stripe/create-checkout-session` — Stripe Checkout
- POST `/api/stripe/webhook` — Stripe webhook handler
- GET `/api/stripe/payment-status/:sessionId` — payment verification

### Email
- POST `/api/email/send` — send transactional emails (order confirmation, password reset)

### Search
- POST `/api/search/index` — index new product (background job)
- DELETE `/api/search/index/:productId` — remove from index

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)