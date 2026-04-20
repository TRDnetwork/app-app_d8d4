import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { generateAccessToken, generateRefreshToken } from '../utils/token';
import { sendEmail } from '../utils/sendEmail';
import { logger } from '../middleware/logging';
import { config } from '../config/env';
import { apiResponse } from '../utils/apiResponse';

/**
 * User registration
 * Creates new user with hashed password and sends verification email
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json(apiResponse(400, 'Name, email, and password are required'));
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json(apiResponse(409, 'User with this email already exists'));
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate verification token
    const verificationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      emailVerificationToken: verificationToken,
      role: 'customer',
    });

    await user.save();

    // Send verification email
    await sendEmail({
      email: user.email,
      subject: 'Verify your email address',
      message: `Please verify your email by clicking this link: ${config.CLIENT_URL}/verify-email?token=${verificationToken}`,
    });

    logger.info({
      type: 'user_registration',
      message: 'User registered successfully',
      userId: user._id,
      email: user.email,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });

    res.status(201).json(
      apiResponse(201, 'User registered successfully. Please check your email to verify your account.', {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          emailVerified: user.emailVerified,
        },
      })
    );
  } catch (error: any) {
    logger.error({
      type: 'registration_error',
      message: 'Registration failed',
      error: error.message,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });
    res.status(500).json(apiResponse(500, 'Registration failed'));
  }
};

/**
 * User login
 * Verifies credentials and returns JWT tokens
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json(apiResponse(400, 'Email and password are required'));
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json(apiResponse(401, 'Invalid credentials'));
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return res.status(401).json(apiResponse(401, 'Please verify your email before logging in'));
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json(apiResponse(401, 'Invalid credentials'));
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user._id.toString(),
      role: user.role,
    });

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    logger.info({
      type: 'user_login',
      message: 'User logged in successfully',
      userId: user._id,
      email: user.email,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });

    res.json(
      apiResponse(200, 'Login successful', {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profilePictureUrl: user.profilePictureUrl,
          emailVerified: user.emailVerified,
        },
        tokens: {
          accessToken,
          refreshToken,
        },
      })
    );
  } catch (error: any) {
    logger.error({
      type: 'login_error',
      message: 'Login failed',
      error: error.message,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });
    res.status(500).json(apiResponse(500, 'Login failed'));
  }
};

/**
 * Refresh access token
 * Uses refresh token to generate new access token
 */
export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json(apiResponse(401, 'Refresh token required'));
    }

    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      return res.status(403).json(apiResponse(403, 'Invalid or expired refresh token'));
    }

    // Verify user still exists and is active
    const user = await User.findById(payload.userId);
    if (!user) {
      return res.status(403).json(apiResponse(403, 'User not found'));
    }

    // Generate new access token
    const newAccessToken = generateAccessToken({
      userId: user._id.toString(),
      role: user.role,
    });

    logger.info({
      type: 'token_refresh',
      message: 'Access token refreshed',
      userId: user._id,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });

    res.json(
      apiResponse(200, 'Token refreshed successfully', {
        accessToken: newAccessToken,
      })
    );
  } catch (error: any) {
    logger.error({
      type: 'refresh_error',
      message: 'Token refresh failed',
      error: error.message,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });
    res.status(500).json(apiResponse(500, 'Token refresh failed'));
  }
};

/**
 * Logout user
 * Currently just invalidates the token on client side
 */
export const logout = async (req: Request, res: Response) => {
  // In a stateless JWT system, we can't invalidate the token server-side
  // The client should remove the token from storage
  logger.info({
    type: 'user_logout',
    message: 'User logged out',
    userId: req.user?.id,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  res.json(apiResponse(200, 'Logged out successfully'));
};

/**
 * Verify email address
 * Validates email verification token
 */
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json(apiResponse(400, 'Verification token required'));
    }

    // Find user with this verification token
    const user = await User.findOne({ emailVerificationToken: token });
    if (!user) {
      return res.status(400).json(apiResponse(400, 'Invalid or expired verification token'));
    }

    // Update user
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    logger.info({
      type: 'email_verification',
      message: 'Email verified successfully',
      userId: user._id,
      email: user.email,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });

    res.json(apiResponse(200, 'Email verified successfully'));
  } catch (error: any) {
    logger.error({
      type: 'email_verification_error',
      message: 'Email verification failed',
      error: error.message,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });
    res.status(500).json(apiResponse(500, 'Email verification failed'));
  }
};

/**
 * Request password reset
 * Sends password reset email with token
 */
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json(apiResponse(400, 'Email is required'));
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists for security
      return res.json(apiResponse(200, 'If an account with this email exists, a password reset link has been sent'));
    }

    // Generate reset token
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = resetTokenExpiry;
    await user.save();

    // Send reset email
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Request',
      message: `You requested a password reset. Click this link to reset your password: ${config.CLIENT_URL}/reset-password?token=${resetToken}`,
    });

    logger.info({
      type: 'password_reset_request',
      message: 'Password reset requested',
      userId: user._id,
      email: user.email,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });

    res.json(apiResponse(200, 'If an account with this email exists, a password reset link has been sent'));
  } catch (error: any) {
    logger.error({
      type: 'forgot_password_error',
      message: 'Forgot password failed',
      error: error.message,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });
    res.status(500).json(apiResponse(500, 'Forgot password failed'));
  }
};

/**
 * Reset password
 * Validates reset token and updates password
 */
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json(apiResponse(400, 'Token and new password are required'));
    }

    // Find user with this reset token
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json(apiResponse(400, 'Invalid or expired reset token'));
    }

    // Hash new password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    logger.info({
      type: 'password_reset',
      message: 'Password reset successfully',
      userId: user._id,
      email: user.email,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });

    res.json(apiResponse(200, 'Password reset successfully'));
  } catch (error: any) {
    logger.error({
      type: 'reset_password_error',
      message: 'Password reset failed',
      error: error.message,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });
    res.status(500).json(apiResponse(500, 'Password reset failed'));
  }
};
```

```typescript