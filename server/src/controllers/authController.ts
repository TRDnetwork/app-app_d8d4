import { Request, Response } from 'express';
import User, { IUser, UserRole } from '../models/User';
import { generateToken, generateRefreshToken, verifyToken } from '../utils/generateToken';
import { sendEmail } from '../utils/sendEmail';
import { StatusCodes } from 'http-status-codes';
import crypto from 'crypto';

// Register user
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create user
    const user = new User({
      name,
      email,
      password,
      role: 'customer' // Default role
    });

    // Save user
    await user.save();

    // Generate email verification token
    const verificationToken = user.generateEmailVerificationToken();
    await user.save();

    // Send verification email
    await sendEmail({
      email: user.email,
      subject: 'Verify your email address',
      message: `Your verification code is: ${verificationToken}`
    });

    // Generate tokens
    const payload = { id: user._id, role: user.role };
    const accessToken = generateToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'User registered successfully. Please verify your email.',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          emailVerified: user.emailVerified
        },
        accessToken
      }
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Registration failed'
    });
  }
};

// Login user
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if password is correct
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Please verify your email address'
      });
    }

    // Generate tokens
    const payload = { id: user._id, role: user.role };
    const accessToken = generateToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          emailVerified: user.emailVerified,
          profilePictureUrl: user.profilePictureUrl,
          phone: user.phone,
          loyaltyPoints: user.loyaltyPoints
        },
        accessToken
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Login failed'
    });
  }
};

// Logout user
export const logout = async (req: Request, res: Response) => {
  try {
    // Clear refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error: any) {
    console.error('Logout error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Logout failed'
    });
  }
};

// Refresh access token
export const refresh = async (req: Request, res: Response) => {
  try {
    // Get refresh token from cookie
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    // Verify refresh token
    const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET!);
    
    if (!decoded) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid or expired refresh token'
      });
    }

    // Find user
    const user = await User.findById(decoded.id).select('-password -emailVerificationToken -passwordResetToken -passwordResetExpires -oauthProvider -oauthId');
    
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate new access token
    const payload = { id: user._id, role: user.role };
    const accessToken = generateToken(payload);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken
      }
    });
  } catch (error: any) {
    console.error('Refresh token error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Token refresh failed'
    });
  }
};

// Verify email
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    // Validate input
    if (!token) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Verification token is required'
      });
    }

    // Find user with matching verification token
    const user = await User.findOne({ 
      emailVerificationToken: token,
      emailVerified: false 
    });

    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    // Verify email
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error: any) {
    console.error('Email verification error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Email verification failed'
    });
  }
};

// Resend verification email
export const resendVerificationEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Validate input
    if (!email) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Find user
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if email is already verified
    if (user.emailVerified) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Email is already verified'
      });
    }

    // Generate new verification token
    const verificationToken = user.generateEmailVerificationToken();
    await user.save();

    // Send verification email
    await sendEmail({
      email: user.email,
      subject: 'Verify your email address',
      message: `Your verification code is: ${verificationToken}`
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Verification email sent successfully'
    });
  } catch (error: any) {
    console.error('Resend verification email error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to send verification email'
    });
  }
};

// Forgot password
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Validate input
    if (!email) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Find user
    const user = await User.findOne({ email });
    
    if (!user) {
      // Don't reveal if user exists for security
      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'If an account with this email exists, a password reset link has been sent'
      });
    }

    // Generate password reset token
    const resetToken = user.generatePasswordResetToken();
    await user.save();

    // Send password reset email
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Request',
      message: `Your password reset code is: ${resetToken}`
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'If an account with this email exists, a password reset link has been sent'
    });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Password reset request failed'
    });
  }
};

// Reset password
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    // Validate input
    if (!token || !newPassword) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Token and new password are required'
      });
    }

    // Find user with matching reset token
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
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error: any) {
    console.error('Reset password error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Password reset failed'
    });
  }
};

// Get current user
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Authentication required'
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        user: req.user
      }
    });
  } catch (error: any) {
    console.error('Get current user error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to get user information'
    });
  }
};

// Update user profile
export const updateProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const { name, phone, profilePictureUrl } = req.body;

    // Update user
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, profilePictureUrl },
      { new: true, runValidators: true }
    ).select('-password -emailVerificationToken -passwordResetToken -passwordResetExpires -oauthProvider -oauthId');

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user
      }
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Profile update failed'
    });
  }
};
```

```typescript