import { describe, it, expect, beforeEach, vi } from 'vitest';
import { validateEnv } from '../../server/src/config/env';

// Mock environment variables
beforeEach(() => {
  vi.resetAllMocks();
  process.env = {
    PORT: '5000',
    MONGODB_URI: 'mongodb://localhost:27017/test',
    JWT_SECRET: 'test-jwt-secret-that-is-at-least-32-characters-long',
    JWT_REFRESH_SECRET: 'test-jwt-refresh-secret-that-is-at-least-32-characters-long',
    STRIPE_SECRET_KEY: 'sk_test_123',
    STRIPE_WEBHOOK_SECRET: 'whsec_123',
    AWS_ACCESS_KEY_ID: 'AKIA123',
    AWS_SECRET_ACCESS_KEY: 'secret123',
    AWS_S3_BUCKET: 'test-bucket',
    AWS_REGION: 'us-east-1',
    RESEND_API_KEY: 're_123',
    FRONTEND_URL: 'http://localhost:3000',
    NODE_ENV: 'test'
  };
});

describe('Environment Validation', () => {
  it('validates all required environment variables are present', () => {
    expect(() => validateEnv()).not.toThrow();
  });

  it('throws error when required environment variables are missing', () => {
    delete process.env.JWT_SECRET;
    expect(() => validateEnv()).toThrow('Missing required environment variables: JWT_SECRET');
  });

  it('validates JWT_SECRET length is at least 32 characters', () => {
    process.env.JWT_SECRET = 'short';
    expect(() => validateEnv()).toThrow('JWT_SECRET must be at least 32 characters long');
  });

  it('validates JWT_REFRESH_SECRET length is at least 32 characters', () => {
    process.env.JWT_REFRESH_SECRET = 'short';
    expect(() => validateEnv()).toThrow('JWT_REFRESH_SECRET must be at least 32 characters long');
  });

  it('validates STRIPE_SECRET_KEY starts with sk_', () => {
    process.env.STRIPE_SECRET_KEY = 'pk_test_123';
    expect(() => validateEnv()).toThrow('STRIPE_SECRET_KEY must start with sk_');
  });

  it('validates STRIPE_WEBHOOK_SECRET starts with whsec_', () => {
    process.env.STRIPE_WEBHOOK_SECRET = 'not-whsec';
    expect(() => validateEnv()).toThrow('STRIPE_WEBHOOK_SECRET must start with whsec_');
  });

  it('validates AWS_ACCESS_KEY_ID has reasonable length', () => {
    process.env.AWS_ACCESS_KEY_ID = 'short';
    expect(() => validateEnv()).toThrow('AWS_ACCESS_KEY_ID appears to be invalid');
  });

  it('validates FRONTEND_URL is a valid URL', () => {
    process.env.FRONTEND_URL = 'not-a-url';
    expect(() => validateEnv()).toThrow('FRONTEND_URL must be a valid URL');
  });
});