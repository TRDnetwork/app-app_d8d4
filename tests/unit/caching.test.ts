import { describe, it, expect, vi } from 'vitest';
import { cacheMiddleware, productCache, categoryCache, homePageCache } from '../../server/src/middleware/caching';
import { createHash } from 'crypto';

// Mock Redis
vi.mock('ioredis', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      on: vi.fn(),
      get: vi.fn(),
      setex: vi.fn(),
      keys: vi.fn(),
      del: vi.fn(),
    })),
  };
});

// Mock crypto
vi.mock('crypto', () => {
  return {
    createHash: vi.fn().mockReturnValue({
      update: vi.fn().mockReturnThis(),
      digest: vi.fn().mockReturnValue('mock_hash'),
    }),
  };
});

describe('Caching Middleware', () => {
  it('creates cache middleware with default TTL', () => {
    const middleware = cacheMiddleware();
    expect(typeof middleware).toBe('function');
  });

  it('creates cache middleware with custom TTL', () => {
    const middleware = cacheMiddleware(600);
    expect(typeof middleware).toBe('function');
  });

  it('creates product cache middleware', () => {
    expect(typeof productCache).toBe('function');
  });

  it('creates category cache middleware', () => {
    expect(typeof categoryCache).toBe('function');
  });

  it('creates home page cache middleware', () => {
    expect(typeof homePageCache).toBe('function');
  });

  it('generates correct cache key', () => {
    const req = {
      baseUrl: '/api',
      path: '/products',
      query: { category: 'electronics', sort: 'priceAsc' },
    } as any;
    
    const key = (global as any).getCacheKey(req);
    expect(key).toBe('cache:/api/products:mock_hash');
  });

  it('invalidates cache with pattern', async () => {
    const invalidateSpy = vi.spyOn((global as any).redisClient, 'del');
    await (global as any).invalidateCache('products');
    expect(invalidateSpy).toHaveBeenCalled();
  });
});