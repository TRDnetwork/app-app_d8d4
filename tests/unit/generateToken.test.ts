import { describe, it, expect } from 'vitest';
import { generateToken, generateRefreshToken, verifyToken } from '../../server/src/utils/generateToken';

// Mock environment variables
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';

describe('Token Generation', () => {
  const payload = { id: 'user123', role: 'customer' };

  it('generates a valid JWT access token', () => {
    const token = generateToken(payload);
    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3);
  });

  it('generates a valid JWT refresh token', () => {
    const token = generateRefreshToken(payload);
    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3);
  });

  it('verifies a valid token', () => {
    const token = generateToken(payload);
    const decoded = verifyToken(token, process.env.JWT_SECRET!);
    expect(decoded).toEqual(expect.objectContaining(payload));
  });

  it('returns null for invalid token', () => {
    const invalidToken = 'invalid.token.here';
    const decoded = verifyToken(invalidToken, process.env.JWT_SECRET!);
    expect(decoded).toBeNull();
  });

  it('returns null for expired token', () => {
    // Create a token with very short expiration
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2023, 0, 1));
    
    const token = generateToken(payload);
    
    // Advance time beyond expiration
    vi.setSystemTime(new Date(2023, 0, 2));
    
    const decoded = verifyToken(token, process.env.JWT_SECRET!);
    expect(decoded).toBeNull();
    
    vi.useRealTimers();
  });
});
```