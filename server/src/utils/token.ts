import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';

// Validate environment variables
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

if (!process.env.JWT_REFRESH_SECRET) {
  throw new Error('JWT_REFRESH_SECRET environment variable is required');
}

if (process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be at least 32 characters long');
}

if (process.env.JWT_REFRESH_SECRET.length < 32) {
  throw new Error('JWT_REFRESH_SECRET must be at least 32 characters long');
}

/**
 * Generate JWT access token
 */
export const generateAccessToken = (payload: { id: string; role: string }): string => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: '15m'
  });
};

/**
 * Generate JWT refresh token
 */
export const generateRefreshToken = (payload: { id: string; role: string }): string => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: '7d'
  });
};

/**
 * Verify JWT access token
 */
export const verifyAccessToken = (token: string): { id: string; role: string } | null => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string };
  } catch (error) {
    return null;
  }
};

/**
 * Verify JWT refresh token
 */
export const verifyRefreshToken = (token: string): { id: string; role: string } | null => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as { id: string; role: string };
  } catch (error) {
    return null;
  }
};

/**
 * Refresh tokens
 */
export const refreshTokens = async (refreshToken: string) => {
  const decoded = verifyRefreshToken(refreshToken);
  
  if (!decoded) {
    return null;
  }
  
  // Check if user still exists
  const User = require('../models/User');
  const user = await User.findById(decoded.id).select('-password');
  
  if (!user) {
    return null;
  }
  
  // Generate new tokens
  const newAccessToken = generateAccessToken({ id: user._id.toString(), role: user.role });
  const newRefreshToken = generateRefreshToken({ id: user._id.toString(), role: user.role });
  
  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePictureUrl: user.profilePictureUrl,
      phone: user.phone,
      emailVerified: user.emailVerified
    }
  };
};
```

```typescript