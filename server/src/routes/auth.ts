import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { generateAccessToken, generateRefreshToken } from '../utils/token';
import { authenticateToken } from '../middleware/auth';
import { config } from '../config/env';
import { sendEmail } from '../utils/sendEmail';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ 
        error: 'Name, email, and password are required' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        error: 'User with this email already exists' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: 'customer'
    });

    await user.save();

    // Generate tokens
    const accessToken = generateAccessToken({ 
      userId: user._id.toString(), 
      role: user.role 
    });
    const refreshToken = generateRefreshToken({ 
      userId: user._id.toString(), 
      role: user.role 
    });

    // Send verification email
    const verificationToken = jwt.sign(
      { userId: user._id },
      config.JWT_SECRET,
      { expiresIn: '24h' }
    );

    await sendEmail({
      email: user.email,
      subject: 'Verify your email address',
      message: `Click this link to verify your email: ${config.CLIENT_URL}/verify-email?token=${verificationToken}`
    });

    res.status(201).json({ 
      message: 'User registered successfully. Please check your email to verify your account.',
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified
      }
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Registration failed' 
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid credentials' 
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        error: 'Invalid credentials' 
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken({ 
      userId: user._id.toString(), 
      role: user.role 
    });
    const refreshToken = generateRefreshToken({ 
      userId: user._id.toString(), 
      role: user.role 
    });

    res.json({ 
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Login failed' 
    });
  }
});

// Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ 
        error: 'Refresh token required' 
      });
    }

    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      return res.status(403).json({ 
        error: 'Invalid or expired refresh token' 
      });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken({ 
      userId: payload.userId, 
      role: payload.role 
    });

    res.json({ 
      accessToken: newAccessToken 
    });
  } catch (error: any) {
    console.error('Token refresh error:', error);
    res.status(500).json({ 
      error: 'Token refresh failed' 
    });
  }
});

// Logout
router.post('/logout', authenticateToken, async (req, res) => {
  // In a real app, you might want to blacklist the refresh token
  // For now, we just rely on the client to remove tokens
  res.json({ 
    message: 'Logged out successfully' 
  });
});

// Verify email
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ 
        error: 'Verification token required' 
      });
    }

    const payload = jwt.verify(token, config.JWT_SECRET) as { userId: string };
    
    const user = await User.findById(payload.userId);
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    user.emailVerified = true;
    await user.save();

    res.json({ 
      message: 'Email verified successfully' 
    });
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({ 
        error: 'Invalid verification token' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ 
        error: 'Verification token has expired' 
      });
    }

    console.error('Email verification error:', error);
    res.status(500).json({ 
      error: 'Email verification failed' 
    });
  }
});

// Resend verification email
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        error: 'Email is required' 
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({ 
        error: 'Email is already verified' 
      });
    }

    // Generate verification token
    const verificationToken = jwt.sign(
      { userId: user._id },
      config.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Send verification email
    await sendEmail({
      email: user.email,
      subject: 'Verify your email address',
      message: `Click this link to verify your email: ${config.CLIENT_URL}/verify-email?token=${verificationToken}`
    });

    res.json({ 
      message: 'Verification email sent successfully' 
    });
  } catch (error: any) {
    console.error('Resend verification email error:', error);
    res.status(500).json({ 
      error: 'Failed to send verification email' 
    });
  }
});

// Forgot password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        error: 'Email is required' 
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists
      return res.json({ 
        message: 'If an account with this email exists, a password reset link has been sent' 
      });
    }

    // Generate password reset token
    const resetToken = jwt.sign(
      { userId: user._id },
      config.JWT_SECRET,
      { expiresIn: '10m' }
    );

    // Send password reset email
    await sendEmail({
      email: user.email,
      subject: 'Reset Your Password',
      message: `Click this link to reset your password: ${config.CLIENT_URL}/reset-password?token=${resetToken}`
    });

    res.json({ 
      message: 'If an account with this email exists, a password reset link has been sent' 
    });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    res.status(500).json({ 
      error: 'Password reset request failed' 
    });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ 
        error: 'Token and new password are required' 
      });
    }

    // Verify token
    const payload = jwt.verify(token, config.JWT_SECRET) as { userId: string };
    
    // Find user
    const user = await User.findById(payload.userId);
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.json({ 
      message: 'Password reset successfully' 
    });
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({ 
        error: 'Invalid reset token' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ 
        error: 'Reset token has expired' 
      });
    }

    console.error('Reset password error:', error);
    res.status(500).json({ 
      error: 'Password reset failed' 
    });
  }
});

// Get current user session
router.get('/session', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    res.json({ user });
  } catch (error: any) {
    console.error('Get session error:', error);
    res.status(500).json({ 
      error: 'Failed to get session' 
    });
  }
});

// OAuth routes will be handled by the backend
router.get('/oauth/:provider', (req, res) => {
  const { provider } = req.params;
  
  // Redirect to appropriate OAuth provider
  if (provider === 'google') {
    // Google OAuth flow
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${config.GOOGLE_CLIENT_ID}&redirect_uri=${config.OAUTH_CALLBACK_URL}&response_type=code&scope=openid%20profile%20email&access_type=offline`;
    res.redirect(googleAuthUrl);
  } else if (provider === 'facebook') {
    // Facebook OAuth flow
    const facebookAuthUrl = `https://www.facebook.com/v12.0/dialog/oauth?client_id=${config.FACEBOOK_APP_ID}&redirect_uri=${config.OAUTH_CALLBACK_URL}&scope=email`;
    res.redirect(facebookAuthUrl);
  } else {
    res.status(400).json({ error: 'Invalid provider' });
  }
});

// OAuth callback
router.get('/oauth/:provider/callback', async (req, res) => {
  const { provider } = req.params;
  const { code, error } = req.query;

  if (error) {
    return res.redirect(`/login?error=${error}&error_description=${req.query.error_description}`);
  }

  if (!code) {
    return res.status(400).json({ error: 'Authorization code required' });
  }

  try {
    let accessToken;
    let userData;

    if (provider === 'google') {
      // Exchange code for access token
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: config.GOOGLE_CLIENT_ID,
          client_secret: config.GOOGLE_CLIENT_SECRET,
          code: code as string,
          redirect_uri: config.OAUTH_CALLBACK_URL,
          grant_type: 'authorization_code',
        }),
      });

      const tokenData = await tokenResponse.json();
      accessToken = tokenData.access_token;

      // Get user data
      const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      userData = await userResponse.json();
    } else if (provider === 'facebook') {
      // Exchange code for access token
      const tokenResponse = await fetch(`https://graph.facebook.com/v12.0/oauth/access_token?client_id=${config.FACEBOOK_APP_ID}&client_secret=${config.FACEBOOK_APP_SECRET}&redirect_uri=${config.OAUTH_CALLBACK_URL}&code=${code}`);
      const tokenData = await tokenResponse.json();
      accessToken = tokenData.access_token;

      // Get user data
      const userResponse = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`);
      userData = await userResponse.json();
    } else {
      return res.status(400).json({ error: 'Invalid provider' });
    }

    // Find or create user
    let user = await User.findOne({ 
      $or: [
        { email: userData.email },
        { 'oauth.googleId': userData.id },
        { 'oauth.facebookId': userData.id }
      ]
    });

    if (!user) {
      // Create new user
      user = new User({
        name: userData.name,
        email: userData.email,
        emailVerified: true,
        role: 'customer',
        oauth: {
          [provider]: {
            id: userData.id,
            accessToken,
          }
        }
      });

      await user.save();
    } else {
      // Update existing user with OAuth data
      user.oauth = user.oauth || {};
      user.oauth[provider] = {
        id: userData.id,
        accessToken,
      };
      await user.save();
    }

    // Generate JWT tokens
    const jwtAccessToken = generateAccessToken({ 
      userId: user._id.toString(), 
      role: user.role 
    });
    const jwtRefreshToken = generateRefreshToken({ 
      userId: user._id.toString(), 
      role: user.role 
    });

    // Redirect to frontend with tokens
    res.redirect(`/auth-callback?access_token=${jwtAccessToken}&refresh_token=${jwtRefreshToken}`);
  } catch (error: any) {
    console.error(`OAuth ${provider} callback error:`, error);
    res.redirect(`/login?error=oauth_failed&error_description=${error.message}`);
  }
});

export default router;
```

```typescript