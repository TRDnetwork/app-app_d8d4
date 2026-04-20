import { Request, Response } from 'express';
import { User } from '../models/User';
import { generateAccessToken, generateRefreshToken, refreshTokens } from '../utils/token';
import { hashPassword, verifyPassword, validatePasswordStrength } from '../utils/password';
import { validateEmail } from '../utils/validation';
import { StatusCodes } from 'http-status-codes';
import crypto from 'crypto';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    // Validate input
    if (!name || !email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Validate email
    if (!validateEmail(email)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Password does not meet requirements',
        errors: passwordValidation.errors,
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiresAt,
    });

    // In production, send verification email
    // await sendVerificationEmail(user.email, verificationToken);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'User registered successfully. Please check your email to verify your account.',
    });
  } catch (error: any) {
    // If email fails, delete the user
    if (error.message.includes('Email could not be sent')) {
      await User.deleteOne({ _id: (error as any).userId });
    }
    
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Verify email
// @route   POST /api/auth/verify-email
// @access  Public
export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.body;

  try {
    if (!token) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Verification token is required',
      });
    }

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid or expired verification token',
      });
    }

    // Update user
    user.emailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Email verified successfully',
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    
    // Use generic error message to prevent user enumeration
    if (!user || !(await verifyPassword(password, user.password))) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Please verify your email before logging in',
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
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
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
        emailVerified: user.emailVerified,
      },
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken: refreshTokenCookie } = req.cookies;

  if (!refreshTokenCookie) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Not authorized, no refresh token',
    });
  }

  try {
    const result = await refreshTokens(refreshTokenCookie);
    
    if (!result) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid refresh token',
      });
    }

    // Set new refresh token as HTTP-only cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      accessToken: result.accessToken,
      user: result.user,
    });
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Invalid refresh token',
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = (req: Request, res: Response) => {
  res.clearCookie('refreshToken');
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    // Validate input
    if (!email) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Please provide your email address',
      });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    // Use generic response to prevent timing attacks
    // Always return success to prevent user enumeration
    const user = await User.findOne({ email });
    
    if (user) {
      // Generate password reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = await hashPassword(resetToken);
      const resetTokenExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Update user
      user.resetPasswordToken = hashedToken;
      user.resetPasswordTokenExpiresAt = resetTokenExpiresAt;
      await user.save();

      // In production, send password reset email
      // await sendPasswordResetEmail(user.email, resetToken);
    }

    // Always return success to prevent timing attacks
    res.json({
      success: true,
      message: 'If your email is registered, you will receive a password reset link',
    });
  } catch (error) {
    // Always return success to prevent timing attacks
    res.json({
      success: true,
      message: 'If your email is registered, you will receive a password reset link',
    });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req: Request, res: Response) => {
  const { token, password } = req.body;

  try {
    // Validate input
    if (!token || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Please provide token and new password',
      });
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Password does not meet requirements',
        errors: passwordValidation.errors,
      });
    }

    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }

    // Verify token
    const tokenValid = await verifyPassword(token, user.resetPasswordToken!);
    if (!tokenValid) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid token',
      });
    }

    // Update password
    user.password = await hashPassword(password);
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiresAt = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successful',
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Server error',
    });
  }
};
```

```typescript