import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import productRoutes from './routes/product';
import cartRoutes from './routes/cart';
import wishlistRoutes from './routes/wishlist';
import orderRoutes from './routes/order';
import reviewRoutes from './routes/review';
import searchRoutes from './routes/search';
import sellerRoutes from './routes/seller';
import adminRoutes from './routes/admin';
import stripeRoutes from './routes/stripe';
import emailRoutes from './routes/email';
import analyticsRoutes from './routes/analytics';
import healthRoutes from './routes/health';
import { errorHandler } from './middleware/errorHandler';
import { rateLimit } from './middleware/rateLimit';
import { securityHeaders } from './middleware/securityHeaders';
import { requestLogger, correlationId } from './middleware/logging';
import Sentry from './config/sentry';

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'REFRESH_TOKEN_SECRET',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'AWS_S3_BUCKET',
  'AWS_REGION',
  'NODE_ENV',
  'SENTRY_DSN'
];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`${varName} is required`);
  }
});

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Sentry Express integration
Sentry.Handlers.requestHandler();
Sentry.Handlers.tracingHandler();

// Middleware
app.use(correlationId);
app.use(requestLogger);
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
app.use(securityHeaders);
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting for analytics and auth endpoints
app.use('/api/analytics', rateLimit);
app.use('/api/auth', rateLimit);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api