```ts
import jwt from 'jsonwebtoken';
import { config } from '../config/env';

// Validate JWT secrets at module load
if (!config.JWT_SECRET || config.JWT_SECRET.length < 32) {
  throw new Error('❌ Invalid or missing JWT_SECRET (must be at least 32 characters)');
}

if (!config.REFRESH_TOKEN_SECRET || config.REFRESH_TOKEN_SECRET.length < 32) {
  throw new Error('❌ Invalid or missing REFRESH_TOKEN_SECRET (must be at least 32 characters)');
}

interface TokenPayload {
  userId: string;
  role: string;
}

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
    algorithm: 'HS256',
  });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, config.REFRESH_TOKEN_SECRET, {
    expiresIn: config.REFRESH_TOKEN_EXPIRES_IN,
    algorithm: 'HS256',
  });
};

export const verifyAccessToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, config.JWT_SECRET, {
      algorithms: ['HS256'],
    }) as TokenPayload;
  } catch (error) {
    console.error('Invalid access token:', error);
    return null;
  }
};

export const verifyRefreshToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, config.REFRESH_TOKEN_SECRET, {
      algorithms: ['HS256'],
    }) as TokenPayload;
  } catch (error) {
    console.error('Invalid refresh token:', error);
    return null;
  }
};
```