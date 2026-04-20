import { describe, it, expect, vi } from 'vitest';
import { Request, Response } from 'express';
import { register, verifyEmail, login, forgotPassword, resetPassword } from '../../server/src/controllers/authController';
import User from '../../server/src/models/User';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

// Mock dependencies
vi.mock('crypto', () => ({
  randomBytes: vi.fn().mockReturnValue({
    toString: vi.fn().mockReturnValue('mock_token'),
  }),
}));

vi.mock('bcryptjs', () => ({
  hash: vi.fn().mockResolvedValue('hashed_password'),
  compare: vi.fn().mockResolvedValue(true),
}));

vi.mock('../../server/src/utils/sendEmail', () => ({
  sendEmail: vi.fn().mockResolvedValue(undefined),
}));

describe('AuthController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('registers user successfully', async () => {
      const req = {
        body: {
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        },
      } as Request;

      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;

      // Mock User.findOne to return null (user doesn't exist)
      vi.spyOn(User, 'findOne').mockResolvedValue(null);
      // Mock User.create
      vi.spyOn(User, 'create').mockResolvedValue({
        _id: 'user_123',
        email: 'john@example.com',
        verificationToken: 'mock_token',
        verificationTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      } as any);

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User registered. Please check your email to verify your account.',
      });
    });

    it('returns error if user already exists', async () => {
      const req = {
        body: {
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        },
      } as Request;

      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;

      // Mock User.findOne to return existing user
      vi.spyOn(User, 'findOne').mockResolvedValue({
        _id: 'user_123',
        email: 'john@example.com',
      } as any);

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User already exists',
      });
    });
  });

  describe('verifyEmail', () => {
    it('verifies email successfully', async () => {
      const req = {
        body: {
          token: 'valid_token',
        },
      } as Request;

      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;

      // Mock User.findOne to return user with valid token
      vi.spyOn(User, 'findOne').mockResolvedValue({
        _id: 'user_123',
        emailVerified: false,
        verificationToken: 'valid_token',
        verificationTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        save: vi.fn().mockResolvedValue(undefined),
      } as any);

      await verifyEmail(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: 'Email verified successfully',
      });
    });

    it('returns error for invalid token', async () => {
      const req = {
        body: {
          token: 'invalid_token',
        },
      } as Request;

      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;

      // Mock User.findOne to return null (invalid token)
      vi.spyOn(User, 'findOne').mockResolvedValue(null);

      await verifyEmail(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid or expired token',
      });
    });
  });

  describe('login', () => {
    it('logs in user successfully', async () => {
      const req = {
        body: {
          email: 'john@example.com',
          password: 'password123',
        },
      } as Request;

      const res = {
        cookie: vi.fn(),
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;

      // Mock User.findOne to return user
      vi.spyOn(User, 'findOne').mockResolvedValue({
        _id: 'user_123',
        email: 'john@example.com',
        name: 'John Doe',
        role: 'customer',
        emailVerified: true,
        comparePassword: vi.fn().mockResolvedValue(true),
      } as any);

      // Mock generateToken and generateRefreshToken
      vi.mock('../../server/src/utils/generateToken', () => ({
        generateToken: vi.fn().mockReturnValue('jwt_token'),
        generateRefreshToken: vi.fn().mockReturnValue('refresh_token'),
      }));

      await login(req, res);

      expect(res.cookie).toHaveBeenCalledWith('refreshToken', 'refresh_token', {
        httpOnly: true,
        secure: expect.any(Boolean),
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      expect(res.json).toHaveBeenCalledWith({
        token: 'jwt_token',
        user: {
          _id: 'user_123',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'customer',
          profilePictureUrl: undefined,
          phone: undefined,
        },
      });
    });

    it('returns error for invalid credentials', async () => {
      const req = {
        body: {
          email: 'john@example.com',
          password: 'wrong_password',
        },
      } as Request;

      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;

      // Mock User.findOne to return user
      vi.spyOn(User, 'findOne').mockResolvedValue({
        _id: 'user_123',
        email: 'john@example.com',
        comparePassword: vi.fn().mockResolvedValue(false),
      } as any);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid email or password',
      });
    });
  });

  describe('forgotPassword', () => {
    it('sends password reset email successfully', async () => {
      const req = {
        body: {
          email: 'john@example.com',
        },
      } as Request;

      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;

      // Mock User.findOne to return user
      vi.spyOn(User, 'findOne').mockResolvedValue({
        _id: 'user_123',
        email: 'john@example.com',
        save: vi.fn().mockResolvedValue(undefined),
      } as any);

      // Mock crypto.createHash
      vi.spyOn(crypto, 'createHash').mockReturnValue({
        update: vi.fn().mockReturnThis(),
        digest: vi.fn().mockReturnValue('hashed_token'),
      } as any);

      await forgotPassword(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: 'Password reset email sent',
      });
    });

    it('returns error if user not found', async () => {
      const req = {
        body: {
          email: 'nonexistent@example.com',
        },
      } as Request;

      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;

      // Mock User.findOne to return null
      vi.spyOn(User, 'findOne').mockResolvedValue(null);

      await forgotPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User not found',
      });
    });
  });

  describe('resetPassword', () => {
    it('resets password successfully', async () => {
      const req = {
        body: {
          token: 'valid_token',
          password: 'new_password123',
        },
      } as Request;

      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;

      // Mock crypto.createHash
      vi.spyOn(crypto, 'createHash').mockReturnValue({
        update: vi.fn().mockReturnThis(),
        digest: vi.fn().mockReturnValue('hashed_token'),
      } as any);

      // Mock User.findOne to return user with valid reset token
      vi.spyOn(User, 'findOne').mockResolvedValue({
        _id: 'user_123',
        email: 'john@example.com',
        resetPasswordToken: 'hashed_token',
        resetPasswordTokenExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
        save: vi.fn().mockResolvedValue(undefined),
      } as any);

      await resetPassword(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: 'Password reset successful',
      });
    });

    it('returns error for invalid reset token', async () => {
      const req = {
        body: {
          token: 'invalid_token',
          password: 'new_password123',
        },
      } as Request;

      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;

      // Mock crypto.createHash
      vi.spyOn(crypto, 'createHash').mockReturnValue({
        update: vi.fn().mockReturnThis(),
        digest: vi.fn().mockReturnValue('hashed_invalid_token'),
      } as any);

      // Mock User.findOne to return null (invalid token)
      vi.spyOn(User, 'findOne').mockResolvedValue(null);

      await resetPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid or expired token',
      });
    });
  });
});