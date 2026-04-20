```ts
import { Router } from 'express';
import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    nodeVersion: process.version,
  });
});

// Database health check
router.get('/health/db', async (req, res) => {
  try {
    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      return res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
        status: 'error',
        message: 'Database connection failed',
        timestamp: new Date().toISOString(),
      });
    }

    // Test database query
    await mongoose.connection.db.admin().ping();

    res.json({
      status: 'ok',
      message: 'Database connection successful',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
      status: 'error',
      message: 'Database health check failed',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// External dependencies health check
router.get('/health/deps', async (req, res) => {
  const checks = {
    stripe: false,
    algolia: false,
    s3: false,
  };

  const results: any = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {},
  };

  // Check Stripe
  if (process.env.STRIPE_SECRET_KEY) {
    try {
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      await stripe.charges.list({ limit: 1 });
      checks.stripe = true;
      results.services.stripe = { status: 'ok' };
    } catch (error: any) {
      results.status = 'error';
      results.services.stripe = { 
        status: 'error', 
        error: error.message 
      };
    }
  }

  // Check Algolia
  if (process.env.ALGOLIA_APP_ID && process.env.ALGOLIA_ADMIN_API_KEY) {
    try {
      const algoliasearch = require('algoliasearch');
      const client = algoliasearch(
        process.env.ALGOLIA_APP_ID,
        process.env.ALGOLIA_ADMIN_API_KEY
      );
      await client.listIndices();
      checks.algolia = true;
      results.services.algolia = { status: 'ok' };
    } catch (error: any) {
      results.status = 'error';
      results.services.algolia = { 
        status: 'error', 
        error: error.message 
      };
    }
  }

  // Check S3
  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && process.env.S3_BUCKET_NAME) {
    try {
      const { S3Client, ListObjectsCommand } = require('@aws-sdk/client-s3');
      const s3Client = new S3Client({
        region: process.env.AWS_REGION || 'us-east-1',
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
      });
      
      const command = new ListObjectsCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        MaxKeys: 1,
      });
      
      await s3Client.send(command);
      checks.s3 = true;
      results.services.s3 = { status: 'ok' };
    } catch (error: any) {
      results.status = 'error';
      results.services.s3 = { 
        status: 'error', 
        error: error.message 
      };
    }
  }

  // Set overall status
  if (Object.values(checks).some(check => !check)) {
    results.status = 'error';
  }

  res.status(results.status === 'ok' ? StatusCodes.OK : StatusCodes.SERVICE_UNAVAILABLE).json(results);
});

export default router;
```