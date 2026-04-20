import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import axios from 'axios';

const router = Router();

// Health check endpoint
router.get('/api/health', (req, res) => {
  res.status(StatusCodes.OK).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// Database health check
router.get('/api/health/db', async (req, res) => {
  try {
    // Check MongoDB connection
    const state = mongoose.connection.readyState;
    if (state !== 1) {
      return res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
        status: 'error',
        message: 'Database connection failed',
        state,
      });
    }

    // Test a simple query
    await mongoose.connection.db.admin().ping();
    
    res.status(StatusCodes.OK).json({
      status: 'ok',
      message: 'Database connection is healthy',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
      status: 'error',
      message: 'Database health check failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Dependencies health check
router.get('/api/health/deps', async (req, res) => {
  const services = {
    stripe: false,
    algolia: false,
    s3: false,
    resend: false,
  };

  const checks = [];

  // Check Stripe
  if (process.env.STRIPE_SECRET_KEY) {
    checks.push(
      axios.get('https://api.stripe.com/v1/account', {
        headers: {
          Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        },
      })
        .then(() => {
          services.stripe = true;
        })
        .catch(() => {
          services.stripe = false;
        })
    );
  }

  // Check Algolia
  if (process.env.ALGOLIA_APP_ID && process.env.ALGOLIA_SEARCH_KEY) {
    checks.push(
      axios.get(`https://${process.env.ALGOLIA_APP_ID}-dsn.algolia.net/1/searches`, {
        params: {
          requests: [
            {
              indexName: process.env.ALGOLIA_INDEX_NAME || 'products',
              params: 'query=',
            },
          ],
        },
        headers: {
          'X-Algolia-API-Key': process.env.ALGOLIA_SEARCH_KEY,
          'X-Algolia-Application-Id': process.env.ALGOLIA_APP_ID,
        },
      })
        .then(() => {
          services.algolia = true;
        })
        .catch(() => {
          services.algolia = false;
        })
    );
  }

  // Check S3
  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && process.env.S3_BUCKET_NAME) {
    checks.push(
      axios.get(`https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/`, {
        auth: {
          username: process.env.AWS_ACCESS_KEY_ID,
          password: process.env.AWS_SECRET_ACCESS_KEY,
        },
      })
        .then(() => {
          services.s3 = true;
        })
        .catch(() => {
          services.s3 = false;
        })
    );
  }

  // Check Resend
  if (process.env.RESEND_API_KEY) {
    checks.push(
      axios.get('https://api.resend.com/emails', {
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
      })
        .then(() => {
          services.resend = true;
        })
        .catch(() => {
          services.resend = false;
        })
    );
  }

  try {
    await Promise.all(checks);
    
    const allHealthy = Object.values(services).every(service => service);
    
    res.status(allHealthy ? StatusCodes.OK : StatusCodes.SERVICE_UNAVAILABLE).json({
      status: allHealthy ? 'ok' : 'error',
      services,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
      status: 'error',
      message: 'Dependency health check failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
```

```typescript
// SECURITY FIX: Use environment variables for logging