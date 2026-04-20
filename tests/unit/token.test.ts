import { describe, it, expect, beforeEach } from 'vitest';
import { generateAccessToken, generateRefreshToken, refreshTokens } from '../../server/src/utils/token';
import { User } from '../../server/src/models/User';

// Mock environment variables
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.JWT_REFRESH_SECRET = 'test-jwt-refresh-secret';

// Mock User.findById
vi.mock('../../server/src/models/User', () => ({
  User: {
    findById: vi.fn()
  }
}));

describe('Token Utilities', () => {
  const mockPayload = { id: 'user123', role: 'customer' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateAccessToken', () => {
    it('generates a valid JWT access token', () => {
      const token = generateAccessToken(mockPayload);
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });
  });

  describe('generateRefreshToken', () => {
    it('generates a valid JWT refresh token', () => {
      const token = generateRefreshToken(mockPayload);
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });
  });

  describe('refreshTokens', () => {
    it('returns null for invalid refresh token', async () => {
      const result = await refreshTokens('invalid-token');
      expect(result).toBeNull();
    });

    it('returns null when user does not exist', async () => {
      // Mock invalid token verification that returns payload
      vi.mock('../../server/src/utils/token', async (importOriginal) => {
        const actual = await importOriginal();
        return {
          ...actual,
          verifyRefreshToken: vi.fn().mockReturnValue(mockPayload)
        };
      });

      // Mock User.findById to return null
      (User.findById as vi.Mock).mockResolvedValue(null);

      const result = await refreshTokens('valid-token');
      expect(result).toBeNull();
      expect(User.findById).toHaveBeenCalledWith(mockPayload.id);
    });

    it('returns new tokens when refresh is successful', async () => {
      // Mock valid user
      const mockUser = {
        _id: 'user123',
        name: 'Test User',
        email: 'test@example.com',
        role: 'customer',
        profilePictureUrl: 'https://example.com/avatar.jpg',
        phone: '1234567890',
        emailVerified: true,
        save: vi.fn()
      };

      // Mock token verification
      vi.mock('../../server/src/utils/token', async (importOriginal) => {
        const actual = await importOriginal();
        return {
          ...actual,
          verifyRefreshToken: vi.fn().mockReturnValue(mockPayload)
        };
      });

      // Mock User.findById to return user
      (User.findById as vi.Mock).mockResolvedValue(mockUser);

      const result = await refreshTokens('valid-token');

      expect(result).not.toBeNull();
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result).toHaveProperty('user');
      expect(result?.user._id).toBe(mockUser._id);
      expect(result?.user.name).toBe(mockUser.name);
      expect(result?.user.email).toBe(mockUser.email);
      expect(result?.user.role).toBe(mockUser.role);
    });
  });
});