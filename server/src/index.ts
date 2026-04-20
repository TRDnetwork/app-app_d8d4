```ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env';
import { securityHeaders } from './middleware/securityHeaders';
import { genericLimiter } from './middleware/rateLimit';

// Validate environment at startup
console.log('🔍 Validating environment configuration...');
// The config import will throw if validation fails
import './config/env';
console.log('✅ Environment validated successfully');

import { authRoutes } from './routes/authRoutes';
import { userRoutes } from './routes/userRoutes';
import { productRoutes } from './routes/productRoutes';
import { cartRoutes } from './routes/cartRoutes';
import { orderRoutes } from './routes/orderRoutes';
import { stripeRoutes } from './routes/stripeRoutes';

const app = express();

// Security middleware
app.use(helmet({ contentSecurityPolicy: false })); // We'll use our own CSP
app.use(securityHeaders);
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://shopsphere.com'] 
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));

// Rate limiting
app.use(genericLimiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/stripe', stripeRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    environment: config.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

const port = config.PORT;
app.listen(port, () => {
  console.log(`✅ Server running in ${config.NODE_ENV} mode`);
  console.log(`🚀 Server listening on port ${port}`);
  console.log(`🔐 Secure environment validation enabled`);
});

export default app;
```