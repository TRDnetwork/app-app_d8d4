import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { correlationId } from './middleware/correlationId';
import { requestLogger } from './middleware/requestLogger';
import { performanceMonitor } from './middleware/performanceMonitor';
import authRoutes from './routes/authRoutes';
import oauthRoutes from './routes/oauthRoutes';
import healthRoutes from './routes/healthRoutes';
import productRoutes from './routes/productRoutes';
import categoryRoutes from './routes/categoryRoutes';
import cartRoutes from './routes/cartRoutes';
import orderRoutes from './routes/orderRoutes';
import reviewRoutes from './routes/reviewRoutes';
import wishlistRoutes from './routes/wishlistRoutes';
import searchRoutes from './routes/searchRoutes';
import sellerRoutes from './routes/sellerRoutes';
import adminRoutes from './routes/adminRoutes';
import paymentRoutes from './routes/paymentRoutes';
import importRoutes from './routes/importRoutes';
import exportRoutes from './routes/exportRoutes';
import jobRoutes from './routes/jobRoutes';
import billingRoutes from './routes/billingRoutes';
import billingControllerRoutes from './routes/billingControllerRoutes';
import { initSentry, captureError } from './utils/monitoring';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';

dotenv.config();

// Initialize Sentry
initSentry();

// Validate required environment variables
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

if (!process.env.JWT_REFRESH_SECRET) {
  throw new Error('JWT_REFRESH_SECRET environment variable is required');
}

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is required');
}

if (!process.env.CLIENT_URL) {
  throw new Error('CLIENT_URL environment variable is required');
}

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY environment variable is required');
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error('STRIPE_WEBHOOK_SECRET environment variable is required');
}

const app = express();

// Request ID middleware must be first
app.use(correlationId);

// Sentry request handler must be after correlationId
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "https:", "data:"],
      connectSrc: ["'self'", "https:"],
      frameSrc: ["'self'"]
    }
  }
}));

// Use exact origin matching instead of dynamic origin
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Performance monitoring middleware
app.use(performanceMonitor);

// Request logging middleware
app.use(requestLogger);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth/oauth', oauthRoutes);
app.use('/api', healthRoutes);
app.use('/api', productRoutes);
app.use('/api', categoryRoutes);
app.use('/api', cartRoutes);
app.use('/api', orderRoutes);
app.use('/api', reviewRoutes);
app.use('/api', wishlistRoutes);
app.use('/api', searchRoutes);
app.use('/api', sellerRoutes);
app.use('/api', adminRoutes);
app.use('/api', paymentRoutes);
app.use('/api', importRoutes);
app.use('/api', exportRoutes);
app.use('/api', jobRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/billing', billingControllerRoutes);

// Error handling middleware
app.use(Sentry.Handlers.errorHandler());
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global error handler
process.on('unhandledRejection', (err: Error) => {
  captureError