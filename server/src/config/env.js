// Environment validation and configuration
// Ensures all required secrets are present and valid

const dotenv = require('dotenv');
dotenv.config();

// List of required environment variables
const required = [
  'PORT',
  'MONGODB_URI',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'AWS_S3_BUCKET',
  'AWS_REGION',
  'RESEND_API_KEY',
  'FRONTEND_URL',
  'NODE_ENV'
];

// Validate environment
const validateEnv = () => {
  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  // Validate JWT secrets are strong
  if (process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long');
  }
  if (process.env.JWT_REFRESH_SECRET.length < 32) {
    throw new Error('JWT_REFRESH_SECRET must be at least 32 characters long');
  }

  // Validate Stripe keys
  if (!process.env.STRIPE_SECRET_KEY.startsWith('sk_')) {
    throw new Error('STRIPE_SECRET_KEY must start with sk_');
  }
  if (!process.env.STRIPE_WEBHOOK_SECRET.startsWith('whsec_')) {
    throw new Error('STRIPE_WEBHOOK_SECRET must start with whsec_');
  }

  // Validate AWS keys
  if (process.env.AWS_ACCESS_KEY_ID.length < 16) {
    throw new Error('AWS_ACCESS_KEY_ID appears to be invalid');
  }

  // Validate URLs
  try {
    new URL(process.env.FRONTEND_URL);
  } catch {
    throw new Error('FRONTEND_URL must be a valid URL');
  }
};

module.exports = { validateEnv };