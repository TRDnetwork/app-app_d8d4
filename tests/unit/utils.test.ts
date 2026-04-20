import { describe, it, expect } from 'vitest';
import { generateToken, generateRefreshToken } from '../../server/src/utils/generateToken';

describe('JWT Token Generation', () => {
  const payload = { id: 'user123', role: 'customer' };

  it('generates valid access token with correct payload', () => {
    const token = generateToken(payload);
    expect(typeof token).toBe('string');
    expect(token.split('.').length).toBe(3); // JWT has 3 parts
  });

  it('generates valid refresh token with correct payload', () => {
    const refreshToken = generateRefreshToken(payload);
    expect(typeof refreshToken).toBe('string');
    expect(refreshToken.split('.').length).toBe(3); // JWT has 3 parts
  });

  it('access token has 15 minute expiration', () => {
    const token = generateToken(payload);
    const payloadBase64 = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    const now = Math.floor(Date.now() / 1000);
    const exp = decodedPayload.exp;
    const diff = exp - now;
    // Should be approximately 15 minutes (900 seconds)
    expect(diff).toBeCloseTo(900, -1); // Within 100 seconds
  });

  it('refresh token has 7 day expiration', () => {
    const refreshToken = generateRefreshToken(payload);
    const payloadBase64 = refreshToken.split('.')[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    const now = Math.floor(Date.now() / 1000);
    const exp = decodedPayload.exp;
    const diff = exp - now;
    // Should be approximately 7 days (604800 seconds)
    expect(diff).toBeCloseTo(604800, -1000); // Within 1000 seconds
  });
});