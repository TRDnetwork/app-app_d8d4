import jwt from 'jsonwebtoken';

// Generate JWT access token
export const generateToken = (payload: { id: string; role: string }): string => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: '15m',
  });
};

// Generate JWT refresh token
export const generateRefreshToken = (payload: { id: string; role: string }): string => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: '7d',
  });
};

// Verify JWT token
export const verifyToken = (token: string, secret: string): any => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};
```

```typescript