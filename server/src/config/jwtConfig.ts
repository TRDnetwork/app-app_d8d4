// JWT configuration
export const jwtConfig = {
  secret: process.env.JWT_SECRET,
  refreshSecret: process.env.JWT_REFRESH_SECRET,
  accessTokenExpiry: process.env.JWT_ACCESS_TOKEN_EXPIRY || '15m',
  refreshTokenExpiry: process.env.JWT_REFRESH_TOKEN_EXPIRY || '7d',
};

// Validate required JWT configuration
if (!jwtConfig.secret) {
  throw new Error('JWT_SECRET is required');
}

if (!jwtConfig.refreshSecret) {
  throw new Error('JWT_REFRESH_SECRET is required');
}
```

```typescript
// SECURITY FIX: Use environment variables for database configuration