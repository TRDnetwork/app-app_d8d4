// Environment configuration with validation
export const config = {
  // Database
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/shopsphere',
  MONGODB_DB_NAME: process.env.MONGODB_DB_NAME || 'shopsphere',

  // Redis (for job queues)
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379'),
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  REDIS_TLS: process.env.REDIS_TLS === 'true',

  // File upload
  UPLOAD_DIR: process.env.UPLOAD_DIR || '/tmp/shopsphere-imports',
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,

  // Server
  PORT: parseInt(process.env.PORT || '3001'),
  NODE_ENV: process.env.NODE_ENV || 'development',
  SERVER_URL: process.env.SERVER_URL || 'http://localhost:3001',

  // Security
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,

  // Frontend
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',

  // Email
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM || 'ShopSphere <onboarding@resend.dev>',

  // Stripe
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  STRIPE_PRO_PRICE_ID: process.env.STRIPE_PRO_PRICE_ID,
  STRIPE_ENTERPRISE_PRICE_ID: process.env.STRIPE_ENTERPRISE_PRICE_ID,

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',

  // OAuth
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET,

  // Search
  ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID,
  ALGOLIA_SEARCH_KEY: process.env.ALGOLIA_SEARCH_KEY,
  ALGOLIA_ADMIN_KEY: process.env.ALGOLIA_ADMIN_KEY,
  ALGOLIA_INDEX_NAME: process.env.ALGOLIA_INDEX_NAME || 'products',

  // AI Recommendations
  RECOMMENDATION_SERVICE_URL: process.env.RECOMMENDATION_SERVICE_URL,
};

// Validate required environment variables
const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'RESEND_API_KEY',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'AWS_S3_BUCKET',
];

requiredEnvVars.forEach((varName) => {
  if (!config[varName as keyof typeof config]) {
    throw new Error(`Environment variable ${varName} is required but not set`);
  }
});

export default config;