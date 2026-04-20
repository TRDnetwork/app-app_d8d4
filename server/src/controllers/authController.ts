import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { sendEmail } from '../utils/sendEmail';
import { generateToken, generateRefreshToken, verifyToken } from '../utils/generateToken';
import { config } from '../config/env';
import { logger } from '../utils/logger';
import { apiResponse } from '../utils/apiResponse';

// Rate limiting for auth endpoints
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

// Helper function to check rate limiting
const isRateLimited = (ip: string): boolean => {
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 5;
  
  const record = loginAttempts.get(ip);
  const now = Date.now();
  
  if (!record) {
    loginAttempts.set(ip, { count: 1, lastAttempt: now });
    return false;
  }
  
  const { count, lastAttempt } = record;
  
  if (now - lastAttempt > windowMs) {
    // Reset counter if window has passed
    loginAttempts.set(ip, { count: 1, lastAttempt: now });
    return false;
  }
  
  if (count >= maxAttempts) {
    return true; // Rate limited
  }
  
  // Increment counter
  loginAttempts.set(ip, { count: count + 1, lastAttempt: now });
  return false;
};

// Helper function to clear expired rate limit records
const clearExpiredRecords = () => {
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const now = Date.now();
  
  for (const [ip, record] of loginAttempts.entries()) {
    if (now - record.lastAttempt > windowMs) {
      loginAttempts.delete(ip);
    }
  }
};

// Clear expired records every 5 minutes
setInterval(clearExpiredRecords, 5 * 60 * 1000);

// Register user
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    
    // Input validation
    if (!name || !email || !password) {
      return res.status(400).json(apiResponse(400, 'Name, email, and password are required'));
    }
    
    if (name.length < 2) {
      return res.status(400).json(apiResponse(400, 'Name must be at least 2 characters'));
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json(apiResponse(400, 'Invalid email format'));
    }
    
    if (password.length < 8) {
      return res.status(400).json(apiResponse(400, 'Password must be at least 8 characters'));
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json(apiResponse(409, 'User with this email already exists'));
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    // Create user
    const user = new User({
      name,
      email,
      password_hash: passwordHash,
      role: 'customer',
      email_verified: false,
      email_verification_token: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      created_at: new Date(),
      updated_at: new Date()
    });
    
    await user.save();
    
    // Send verification email
    try {
      await sendEmail({
        email: user.email,
        subject: 'Verify your email address',
        message: `Click the link to verify your email: ${config.CLIENT_URL}/verify-email?token=${user.email_verification_token}`
      });
    } catch (error) {
      logger.error('Failed to send verification email:', error);
      // Don't fail registration if email fails
    }
    
    // Generate tokens
    const payload = { id: user._id, role: user.role };
    const accessToken = generateToken(payload);
    const refreshToken = generateRefreshToken(payload);
    
    // Remove password hash from response
    const userResponse = user.toObject();
    delete userResponse.password_hash;
    
    res.status(201).json(apiResponse(201, 'User registered successfully. Please check your email to verify your account.', {
      user: userResponse,
      tokens: { accessToken, refreshToken }
    }));
  } catch (error: any) {
    logger.error('Registration error:', error);
    res.status(500).json(apiResponse(500, 'Failed to register user'));
  }
};

// Login user
export const login = async (req: Request, res: Response) => {
  const ip = req.ip || req.socket.remoteAddress || '';
  
  try {
    const { email, password } = req.body;
    
    // Input validation
    if (!email || !password) {
      return res.status(400).json(apiResponse(400, 'Email and password are required'));
    }
    
    // Check rate limiting
    if (isRateLimited(ip)) {
      return res.status(429).json(apiResponse(429, 'Too many login attempts. Please try again later.'));
    }
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json(apiResponse(401, 'Invalid credentials'));
    }
    
    // Check if email is verified
    if (!user.email_verified) {
      return res.status(401).json(apiResponse(401, 'Please verify your email address'));
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json(apiResponse(401, 'Invalid credentials'));
    }
    
    // Generate tokens
    const payload = { id: user._id, role: user.role };
    const accessToken = generateToken(payload);
    const refreshToken = generateRefreshToken(payload);
    
    // Remove password hash from response
    const userResponse = user.toObject();
    delete userResponse.password_hash;
    
    res.json(apiResponse(200, 'Login successful', {
      user: userResponse,
      tokens: { accessToken, refreshToken }
    }));
  } catch (error: any) {
    logger.error('Login error:', error);
    res.status(500).json(apiResponse(500, 'Failed to login'));
  }
};

// Refresh access token
export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json(apiResponse(401, 'Refresh token required'));
    }
    
    // Verify refresh token
    const decoded = verifyToken(refreshToken, config.JWT_REFRESH_SECRET);
    if (!decoded) {
      return res.status(403).json(apiResponse(403, 'Invalid or expired refresh token'));
    }
    
    // Find user
    const user = await User.findById(decoded.id).select('-password_hash');
    if (!user) {
      return res.status(404).json(apiResponse(404, 'User not found'));
    }
    
    // Generate new access token
    const payload = { id: user._id, role: user.role };
    const accessToken = generateToken(payload);
    
    res.json(apiResponse(200, 'Token refreshed', { accessToken }));
  } catch (error: any) {
    logger.error('Refresh token error:', error);
    res.status(500).json(apiResponse(500, 'Failed to refresh token'));
  }
};

// Logout user
export const logout = async (req: Request, res: Response) => {
  // In JWT-based auth, we can't invalidate the token on the server
  // The client should remove the token from storage
  res.json(apiResponse(200, 'Logged out successfully'));
};

// Verify email
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json(apiResponse(400, 'Verification token required'));
    }
    
    // Find user with verification token
    const user = await User.findOne({ email_verification_token: token });
    if (!user) {
      return res.status(400).json(apiResponse(400, 'Invalid or expired verification token'));
    }
    
    // Update user
    user.email_verified = true;
    user.email_verification_token = undefined;
    user.updated_at = new Date();
    
    await user.save();
    
    res.json(apiResponse(200, 'Email verified successfully'));
  } catch (error: any) {
    logger.error('Email verification error:', error);
    res.status(500).json(apiResponse(500, 'Failed to verify email'));
  }
};

// Forgot password
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json(apiResponse(400, 'Email required'));
    }
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists
      return res.json(apiResponse(200, 'If an account with this email exists, a password reset link has been sent'));
    }
    
    // Generate reset token
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour
    
    // Update user
    user.password_reset_token = resetToken;
    user.password_reset_expires = resetExpires;
    user.updated_at = new Date();
    
    await user.save();
    
    // Send reset email
    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Request',
        message: `Click the link to reset your password: ${config.CLIENT_URL}/reset-password?token=${resetToken}`
      });
    } catch (error) {
      logger.error('Failed to send password reset email:', error);
      // Don't fail the request if email fails
    }
    
    res.json(apiResponse(200, 'If an account with this email exists, a password reset link has been sent'));
  } catch (error: any) {
    logger.error('Forgot password error:', error);
    res.status(500).json(apiResponse(500, 'Failed to process password reset request'));
  }
};

// Reset password
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json(apiResponse(400, 'Token and new password required'));
    }
    
    if (newPassword.length < 8) {
      return res.status(400).json(apiResponse(400, 'Password must be at least 8 characters'));
    }
    
    // Find user with reset token
    const user = await User.findOne({ 
      password_reset_token: token,
      password_reset_expires: { $gt: new Date() }
    });
    
    if (!user) {
      return res.status(400).json(apiResponse(400, 'Invalid or expired reset token'));
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);
    
    // Update user
    user.password_hash = passwordHash;
    user.password_reset_token = undefined;
    user.password_reset_expires = undefined;
    user.updated_at = new Date();
    
    await user.save();
    
    res.json(apiResponse(200, 'Password reset successfully'));
  } catch (error: any) {
    logger.error('Reset password error:', error);
    res.status(500).json(apiResponse(500, 'Failed to reset password'));
  }
};
```

```typescript