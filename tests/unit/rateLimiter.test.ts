import { describe, it, expect, vi } from 'vitest';
import { apiLimiter, authLimiter, searchLimiter, paymentLimiter } from '../../server/src/middleware/rateLimiter';
import { Redis } from 'ioredis';

// Mock Redis
vi.mock('ioredis', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      on: vi.fn(),
    })),
  };
});

// Mock express-rate-limit
vi.mock('express-rate-limit', () => {
  return {
    default: vi.fn().mockImplementation((options) => ({
      store: options.store,
      windowMs: options.windowMs,
      max: options.max,
      message: options.message,
    })),
  };
});

// Mock rate-limit-redis
vi.mock('rate-limit-redis', () => {
  return {
    default: vi.fn().mockImplementation(() => ({})),
  };
});

describe('Rate Limiters', () => {
  it('configures API limiter correctly', () => {
    expect(apiLimiter.windowMs).toBe(60 * 1000); // 1 minute
    expect(apiLimiter.max).toBe(100);
    expect(apiLimiter.message).toEqual({
      error: 'Too many requests, please try again later.',
      retryAfter: 60,
    });
  });

  it('configures auth limiter correctly', () => {
    expect(authLimiter.windowMs).toBe(15 * 60 * 1000); // 15 minutes
    expect(authLimiter.max).toBe(5);
    expect(authLimiter.message).toEqual({
      error: 'Too many requests, please try again later.',
      retryAfter: 900,
    });
  });

  it('configures search limiter correctly', () => {
    expect(searchLimiter.windowMs).toBe(60 * 1000); // 1 minute
    expect(searchLimiter.max).toBe(30);
  });

  it('configures payment limiter correctly', () => {
    expect(paymentLimiter.windowMs).toBe(60 * 1000); // 1 minute
    expect(paymentLimiter.max).toBe(10);
  });
});