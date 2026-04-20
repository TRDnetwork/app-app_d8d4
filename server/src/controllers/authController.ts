import { Request, Response } from 'express';
import crypto from 'crypto';
import { StatusCodes } from 'http-status-codes';
import { User } from '../models/User';
import { generateAccessToken, generateRefreshToken } from '../utils/token';
import { validateEmail, validatePasswordStrength } from '../utils/validation';
import { authRateLimit, passwordResetRateLimit } from '../middleware/rateLimit';
import EmailService from '../services/emailService';

/**
 * @desc    Register user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = [
  authRateLimit,
  async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;

      // Validate input
      if (!name || !email || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Please provide all required fields'
        });
      }

      // Validate email
      if (!validateEmail(email)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Please provide a valid email address'
        });
      }

      // Validate password strength
      const passwordValidation = validatePasswordStrength(password);
      if (!passwordValidation.isValid) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Password does not meet requirements',
          errors: passwordValidation.errors
        });
      }

      // Check if user already exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'User already exists with this email'
        });
      }

      // Create verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

      // Create user
      const user = await User.create({
        name,
        email,
        password,
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationTokenExpires
      });

      // Send verification email
      await EmailService.sendEmailVerification(email, verificationToken);

      res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'User registered successfully. Please check your email to verify your account.'
      });
    } catch (error: any) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Registration failed'
      });
    }
  }
];

/**
 * @desc    Verify email
 * @route   POST /api/auth/verify-email
 * @access  Public
 */
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Verification token is required'
      });
    }

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    // Update user
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Email verification failed'
    });
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = [
  authRateLimit,
  async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Please provide email and password'
        });
      }

      // Find user by email
      const user = await User.findOne({ email });
      
      // Use generic error message to prevent user enumeration
      if (!user || !(await user.comparePassword(password))) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Check if email is verified
      if (!user.emailVerified) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: 'Please verify your email before logging in'
        });
      }

      // Generate tokens
      const payload = { id: user._id.toString(), role: user.role };
      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      // Set refresh token as HTTP-only cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.json({
        success: true,
        accessToken,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profilePictureUrl: user.profilePictureUrl,
          phone: user.phone,
          emailVerified: user.emailVerified
        }
      });
    } catch (error: any) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Login failed'
      });
    }
  }
];

/**
 * @desc    Refresh token
 * @route   POST /api/auth/refresh
 * @access  Public
 */
export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken: refreshTokenCookie } = req.cookies;

  if (!refreshTokenCookie) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Not authorized, no refresh token'
    });
  }

  try {
    const result = await refreshTokens(refreshTokenCookie);
    
    if (!result) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Set new refresh token as HTTP-only cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      accessToken: result.accessToken,
      user: result.user
    });
  } catch (error: any) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
};

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = (req: Request, res: Response) => {
  res.clearCookie('refreshToken');
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
};

/**
 * @desc    Forgot password
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = [
  passwordResetRateLimit,
  async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      // Validate input
      if (!email) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Please provide your email address'
        });
      }

      // Validate email format
      if (!validateEmail(email)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Please provide a valid email address'
        });
      }

      // Use generic response to prevent timing attacks
      // Always return success to prevent user enumeration
      const user = await User.findOne({ email });
      
      if (user) {
        // Generate password reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = await hashPassword(resetToken);
        const resetTokenExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        // Update user
        user.passwordResetToken = hashedToken;
        user.passwordResetExpires = resetTokenExpires;
        await user.save();

        // Send password reset email
        await EmailService.sendPasswordReset(email, resetToken);
      }

      // Always return success to prevent timing attacks
      res.json({
        success: true,
        message: 'If your email is registered, you will receive a password reset link'
      });
    } catch (error: any) {
      // Generic error response to prevent information leakage
      res.json({
        success: true,
        message: 'If your email is registered, you will receive a password reset link'
      });
    }
  }
];

/**
 * @desc    Reset password
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    // Validate input
    if (!token || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Please provide token and new password'
      });
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Password does not meet requirements',
        errors: passwordValidation.errors
      });
    }

    // Find user by reset token
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Update password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successful'
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Password reset failed'
    });
  }
};
```

```typescript