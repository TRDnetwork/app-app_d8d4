import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

// Token generation and verification utilities
export const generateAccessToken = (payload: { id: string; role: string }): string => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: '15m',
  });
};

export const generateRefreshToken = (payload: { id: string; role: string }): string => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: '7d',
  });
};

export const verifyAccessToken = (token: string): { id: string; role: string } | null => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string };
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token: string): { id: string; role: string } | null => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as { id: string; role: string };
  } catch (error) {
    return null;
  }
};

// Token refresh utility
export const refreshTokens = async (refreshToken: string) => {
  const decoded = verifyRefreshToken(refreshToken);
  
  if (!decoded) {
    return null;
  }
  
  // Check if user still exists
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
      emailVerified: user.emailVerified,
    },
  };
};
```

```typescript