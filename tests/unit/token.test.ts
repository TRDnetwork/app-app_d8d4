import { describe, it, expect, vi } from 'vitest';
import { generateTokens, verifyAccessToken, verifyRefreshToken } from '../../server/src/utils/token';

// Mock environment variables
vi.mock('envalid', () => ({
  cleanEnv: vi.fn().mockReturnValue({
    JWT_SECRET: 'test-jwt-secret-123456789012345678901234',
    JWT_REFRESH_SECRET: 'test-jwt-refresh-secret-123456789012345678901234',
    JWT_EXPIRES_IN: '15m',
    JWT_REFRESH_EXPIRES_IN: '7d',
  }),
}));

describe('generateTokens', () => {
  it('generates valid access and refresh tokens', () => {
    const payload = {
      userId: 'user123',
      role: 'customer',
      email: 'user@example.com',
    };

    const tokens = generateTokens(payload);

    expect(tokens.accessToken).toBeDefined();
    expect(tokens.refreshToken).toBeDefined();
    expect(typeof tokens.accessToken).toBe('string');
    expect(typeof tokens.refreshToken).toBe('string');
    expect(tokens.accessToken).not.toBe(tokens.refreshToken);
  });

  it('includes security claims in tokens', () => {
    const payload = {
      userId: 'user123',
      role: 'customer',
      email: 'user@example.com',
    };

    const tokens = generateTokens(payload);

    // Tokens should contain the payload data
    const accessTokenPayload = JSON.parse(Buffer.from(tokens.accessToken.split('.')[1], 'base64').toString());
    expect(accessTokenPayload.userId).toBe('user123');
    expect(accessTokenPayload.role).toBe('customer');
    expect(accessTokenPayload.email).toBe('user@example.com');
    expect(accessTokenPayload.iss).toBe('ShopSphere-API');
    expect(accessTokenPayload.aud).toBe('ShopSphere-Client');
  });
});

describe('verifyAccessToken', () => {
  it('verifies valid access token', () => {
    const payload = {
      userId: 'user123',
      role: 'customer',
      email: 'user@example.com',
    };

    const tokens = generateTokens(payload);
    const result = verifyAccessToken(tokens.accessToken);

    expect(result).toBeDefined();
    expect(result?.userId).toBe('user123');
    expect(result?.role).toBe('customer');
    expect(result?.email).toBe('user@example.com');
  });

  it('returns null for invalid access token', () => {
    const result = verifyAccessToken('invalid-token');
    expect(result).toBeNull();
  });

  it('returns null for expired access token', () => {
    // Create a token with very short expiration
    vi.mock('envalid', () => ({
      cleanEnv: vi.fn().mockReturnValue({
        JWT_SECRET: 'test-jwt-secret-123456789012345678901234',
        JWT_REFRESH_SECRET: 'test-jwt-refresh-secret-123456789012345678901234',
        JWT_EXPIRES_IN: '1ms',
        JWT_REFRESH_EXPIRES_IN: '7d',
      }),
    }));

    const payload = {
      userId: 'user123',
      role: 'customer',
      email: 'user@example.com',
    };

    const tokens = generateTokens(payload);
    
    // Wait for token to expire
    vi.useFakeTimers();
    vi.advanceTimersByTime(2);
    
    const result = verifyAccessToken(tokens.accessToken);
    expect(result).toBeNull();
  });
});

describe('verifyRefreshToken', () => {
  it('verifies valid refresh token', () => {
    const payload = {
      userId: 'user123',
      role: 'customer',
      email: 'user@example.com',
    };

    const tokens = generateTokens(payload);
    const result = verifyRefreshToken(tokens.refreshToken);

    expect(result).toBeDefined();
    expect(result?.userId).toBe('user123');
    expect(result?.role).toBe('customer');
    expect(result?.email).toBe('user@example.com');
    expect(result?.jti).toBeDefined();
    expect(result?.iss).toBe('ShopSphere-API');
    expect(result?.aud).toBe('ShopSphere-Refresh');
  });

  it('returns null for invalid refresh token', () => {
    const result = verifyRefreshToken('invalid-token');
    expect(result).toBeNull();
  });
});