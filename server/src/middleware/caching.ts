import { Request, Response, NextFunction } from 'express';
import { redisClient } from './rateLimiter';
import { createHash } from 'crypto';

// Create cache key from request
const getCacheKey = (req: Request): string => {
  const keyData = `${req.baseUrl}${req.path}:${JSON.stringify(req.query)}`;
  const hash = createHash('md5').update(keyData).digest('hex');
  return `cache:${keyData}:${hash}`;
};

// Cache middleware with configurable TTL
export const cacheMiddleware = (ttl: number = 300) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const key = getCacheKey(req);
      
      // Try to get cached response
      const cachedResponse = await redisClient.get(key);
      
      if (cachedResponse) {
        // Return cached response
        res.setHeader('X-Cache', 'HIT');
        return res.json(JSON.parse(cachedResponse));
      }
      
      // If no cache, continue to route handler
      // Store original json method to override
      const originalJson = res.json;
      
      res.json = function (body) {
        // Set cache header
        res.setHeader('X-Cache', 'MISS');
        
        // Cache the response
        redisClient.setex(key, ttl, JSON.stringify(body));
        
        // Call original json method
        return originalJson.call(this, body);
      };
      
      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

// Product cache middleware (5 minute TTL)
export const productCache = cacheMiddleware(300);

// Category cache middleware (10 minute TTL)
export const categoryCache = cacheMiddleware(600);

// Home page cache middleware (15 minute TTL)
export const homePageCache = cacheMiddleware(900);

// Invalidate cache by pattern
export const invalidateCache = async (pattern: string): Promise<void> => {
  try {
    const keys = await redisClient.keys(`cache:*${pattern}*`);
    if (keys.length > 0) {
      await redisClient.del(...keys);
    }
  } catch (error) {
    console.error('Error invalidating cache:', error);
  }
};

// Export getCacheKey for testing
(global as any).getCacheKey = getCacheKey;
(global as any).redisClient = redisClient;
(global as any).invalidateCache = invalidateCache;