import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import { generateToken, generateRefreshToken } from '../utils/generateToken';
import { sendEmail } from '../utils/sendEmail';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ 
      success: false,
      message: 'User already exists' 
    });
  }

  // Create verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  const user = await User.create({
    name,
    email,
    password,
    role: 'customer',
    verificationToken,
    verificationTokenExpiresAt,
  });

  const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Verify your email address',
      message: `
        <h2>Welcome to ShopSphere</h2>
        <p>Please verify your email by clicking the link below:</p>
        <a href="${verificationUrl}">Verify Email</a>
        <p>This link expires in 24 hours.</p>
      `,
    });

    res.status(201).json({
      success: true,
      message: 'User registered. Please check your email to verify your account.',
    });
  } catch (error) {
    // Rollback user creation if email fails
    await User.deleteOne({ _id: user._id });
    return res.status(500).json({ 
      success: false,
      message: 'Email could not be sent' 
    });
  }
};

// @desc    Verify email
// @route   POST /api/auth/verify-email
// @access  Public
export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.body;

  const user = await User.findOne({
    verificationToken: token,
    verificationTokenExpiresAt: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ 
      success: false,
      message: 'Invalid or expired token' 
    });
  }

  user.emailVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpiresAt = undefined;
  await user.save();

  res.json({ 
    success: true,
    message: 'Email verified successfully' 
  });
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json({ 
      success: false,
      message: 'Invalid email or password' 
    });
  }

  if (!(await user.comparePassword(password))) {
    return res.status(401).json({ 
      success: false,
      message: 'Invalid email or password' 
    });
  }

  if (!user.emailVerified) {
    return res.status(401).json({
      success: false,
      message:
        'Email not verified. Please check your inbox to verify your email.',
    });
  }

  const payload = { id: user._id, role: user.role };

  const token = generateToken(payload);
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
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePictureUrl: user.profilePictureUrl,
      phone: user.phone,
    },
  });
};

// @desc    Refresh token
// @route   POST /api/auth/refresh-token
// @access  Public
export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken: refreshTokenCookie } = req.cookies;

  if (!refreshTokenCookie) {
    return res.status(401).json({ 
      success: false,
      message: 'Not authorized, no refresh token' 
    });
  }

  try {
    const decoded = jwt.verify(
      refreshTokenCookie,
      process.env.JWT_REFRESH_SECRET!
    ) as { id: string; role: string };

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    const token = generateToken({ id: user._id, role: user.role });
    const newRefreshToken = generateRefreshToken({ id: user._id, role: user.role });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePictureUrl: user.profilePictureUrl,
        phone: user.phone,
      },
    });
  } catch (error) {
    return res.status(401).json({ 
      success: false,
      message: 'Invalid refresh token' 
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
    message: 'Logged out successfully' 
  });
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ 
      success: false,
      message: 'User not found' 
    });
  }

  // SECURITY FIX: Use longer random token and hash before storing
  const resetToken = crypto.randomBytes(64).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  
  user.resetPasswordToken = hashedToken;
  user.resetPasswordTokenExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Request',
      message: `
        <h2>Password Reset</h2>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link expires in 10 minutes.</p>
      `,
    });

    res.json({ 
      success: true,
      message: 'Password reset email sent' 
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiresAt = undefined;
    await user.save();
    return res.status(500).json({ 
      success: false,
      message: 'Email could not be sent' 
    });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req: Request, res: Response) => {
  const { token, password } = req.body;

  // SECURITY FIX: Hash the token before searching
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordTokenExpiresAt: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ 
      success: false,
      message: 'Invalid or expired token' 
    });
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpiresAt = undefined;
  await user.save();

  res.json({ 
    success: true,
    message: 'Password reset successful' 
  });
};
```

```typescript