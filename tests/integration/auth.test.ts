import { describe, it, expect, vi } from 'vitest';
import { Request, Response } from 'express';
import { register, verifyEmail, login, forgotPassword, resetPassword } from '../../server/src/controllers/authController';
import User from '../../server/src/models/User';

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

vi.mock('../../server/src/utils/generateToken', () => ({
  generateToken: vi.fn().mockReturnValue('jwt_token'),
  generateRefreshToken: vi.fn().mockReturnValue('refresh_token'),
}));

describe('Auth Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('completes full registration and login flow', async () => {
    // 1. Register user
    const registerReq = {
      body: {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      },
    } as Request;

    const registerRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    // Mock User.findOne to return null (user doesn't exist)
    vi.spyOn(User, 'findOne').mockImplementation((query) => {
      if (query.email === 'john@example.com') {
        return Promise.resolve(null);
      }
      return Promise.resolve(null);
    });
    
    // Mock User.create
    vi.spyOn(User, 'create').mockResolvedValue({
      _id: 'user_123',
      email: 'john@example.com',
      verificationToken: 'mock_token',
      verificationTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      save: vi.fn().mockResolvedValue(undefined),
    } as any);

    await register(registerReq, registerRes);

    expect(registerRes.status).toHaveBeenCalledWith(201);
    expect(registerRes.json).toHaveBeenCalledWith({
      message: 'User registered. Please check your email to verify your account.',
    });

    // 2. Verify email
    const verifyReq = {
      body: {
        token: 'mock_token',
      },
    } as Request;

    const verifyRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    // Mock User.findOne to return user with valid token
    vi.spyOn(User, 'findOne').mockImplementation((query) => {
      if (query.verificationToken === 'mock_token') {
        return Promise.resolve({
          _id: 'user_123',
          email: 'john@example.com',
          emailVerified: false,
          verificationToken: 'mock_token',
          verificationTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          save: vi.fn().mockResolvedValue(undefined),
        } as any);
      }
      return Promise.resolve(null);
    });

    await verifyEmail(verifyReq, verifyRes);

    expect(verifyRes.json).toHaveBeenCalledWith({
      message: 'Email verified successfully',
    });

    // 3. Login
    const loginReq = {
      body: {
        email: 'john@example.com',
        password: 'password123',
      },
    } as Request;

    const loginRes = {
      cookie: vi.fn(),
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    // Mock User.findOne to return verified user
    vi.spyOn(User, 'findOne').mockImplementation((query) => {
      if (query.email === 'john@example.com') {
        return Promise.resolve({
          _id: 'user_123',
          email: 'john@example.com',
          name: 'John Doe',
          role: 'customer',
          emailVerified: true,
          comparePassword: vi.fn().mockResolvedValue(true),
        } as any);
      }
      return Promise.resolve(null);
    });

    await login(loginReq, loginRes);

    expect(loginRes.cookie).toHaveBeenCalledWith('refreshToken', 'refresh_token', expect.any(Object));
    expect(loginRes.json).toHaveBeenCalledWith({
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

  it('completes password reset flow', async () => {
    // 1. Request password reset
    const forgotReq = {
      body: {
        email: 'john@example.com',
      },
    } as Request;

    const forgotRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    // Mock User.findOne to return user
    vi.spyOn(User, 'findOne').mockImplementation((query) => {
      if (query.email === 'john@example.com') {
        return Promise.resolve({
          _id: 'user_123',
          email: 'john@example.com',
          save: vi.fn().mockResolvedValue(undefined),
        } as any);
      }
      return Promise.resolve(null);
    });

    // Mock crypto.createHash
    vi.spyOn(require('crypto'), 'createHash').mockReturnValue({
      update: vi.fn().mockReturnThis(),
      digest: vi.fn().mockReturnValue('hashed_token'),
    } as any);

    await forgotPassword(forgotReq, forgotRes);

    expect(forgotRes.json).toHaveBeenCalledWith({
      message: 'Password reset email sent',
    });

    // 2. Reset password
    const resetReq = {
      body: {
        token: 'reset_token',
        password: 'new_password123',
      },
    } as Request;

    const resetRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    // Mock User.findOne to return user with valid reset token
    vi.spyOn(User, 'findOne').mockImplementation((query) => {
      if (query.resetPasswordToken === 'hashed_token') {
        return Promise.resolve({
          _id: 'user_123',
          email: 'john@example.com',
          resetPasswordToken: 'hashed_token',
          resetPasswordTokenExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
          save: vi.fn().mockResolvedValue(undefined),
        } as any);
      }
      return Promise.resolve(null);
    });

    await resetPassword(resetReq, resetRes);

    expect(resetRes.json).toHaveBeenCalledWith({
      message: 'Password reset successful',
    });
  });
});