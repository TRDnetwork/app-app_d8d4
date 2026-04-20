import { describe, it, expect, vi } from 'vitest';
import jwt from 'jsonwebtoken';
import { 
  generateAccessToken, 
  generateRefreshToken, 
  verifyAccessToken, 
  verifyRefreshToken,
  refreshTokens 
} from '../../server/src/utils/token';
import { User } from '../../server/src/models/User';

// Mock environment variables
vi.mock('jsonwebtoken');
vi.mock('../../server/src/models/User');

describe('Token Utilities', () => {
  const mockPayload = { id: 'user123', role: 'customer' };
  const mockUser = {
    _id: 'user123',
    name: 'Test User',
    email: 'test@example.com',
    role: 'customer',
    emailVerified: true,
    select: vi.fn().mockReturnThis()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset environment variables
    process.env.JWT_SECRET = 'test-jwt-secret';
    process.env.JWT_REFRESH_SECRET = 'test-jwt-refresh-secret';
  });

  describe('generateAccessToken', () => {
    it('generates a JWT access token with correct payload and expiration', () => {
      const token = generateAccessToken(mockPayload);
      expect(jwt.sign).toHaveBeenCalledWith(
        mockPayload,
        'test-jwt-secret',
        { expiresIn: '15m' }
      );
      expect(token).toBeDefined();
    });
  });

  describe('generateRefreshToken', () => {
    it('generates a JWT refresh token with correct payload and expiration', () => {
      const token = generateRefreshToken(mockPayload);
      expect(jwt.sign).toHaveBeenCalledWith(
        mockPayload,
        'test-jwt-refresh-secret',
        { expiresIn: '7d' }
      );
      expect(token).toBeDefined();
    });
  });

  describe('verifyAccessToken', () => {
    it('verifies a valid access token', () => {
      (jwt.verify as vi.Mock).mockReturnValue(mockPayload);
      const result = verifyAccessToken('valid-token');
      expect(result).toEqual(mockPayload);
    });

    it('returns null for invalid access token', () => {
      (jwt.verify as vi.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });
      const result = verifyAccessToken('invalid-token');
      expect(result).toBeNull();
    });
  });

  describe('verifyRefreshToken', () => {
    it('verifies a valid refresh token', () => {
      (jwt.verify as vi.Mock).mockReturnValue(mockPayload);
      const result = verifyRefreshToken('valid-token');
      expect(result).toEqual(mockPayload);
    });

    it('returns null for invalid refresh token', () => {
      (jwt.verify as vi.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });
      const result = verifyRefreshToken('invalid-token');
      expect(result).toBeNull();
    });
  });

  describe('refreshTokens', () => {
    it('refreshes tokens with valid refresh token and existing user', async () => {
      (jwt.verify as vi.Mock).mockReturnValue(mockPayload);
      (User.findById as vi.Mock).mockResolvedValue(mockUser);
      
      const result = await refreshTokens('valid-refresh-token');
      
      expect(result).toBeDefined();
      expect(result?.accessToken).toBeDefined();
      expect(result?.refreshToken).toBeDefined();
      expect(result?.user).toEqual({
        _id: 'user123',
        name: 'Test User',
        email: 'test@example.com',
        role: 'customer',
        profilePictureUrl: undefined,
        phone: undefined,
        emailVerified: true
      });
    });

    it('returns null for invalid refresh token', async () => {
      (jwt.verify as vi.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });
      
      const result = await refreshTokens('invalid-refresh-token');
      expect(result).toBeNull();
    });

    it('returns null when user does not exist', async () => {
      (jwt.verify as vi.Mock).mockReturnValue(mockPayload);
      (User.findById as vi.Mock).mockResolvedValue(null);
      
      const result = await refreshTokens('valid-refresh-token');
      expect(result).toBeNull();
    });
  });
});