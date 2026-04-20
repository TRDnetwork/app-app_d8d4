// OAuth configuration
export const oauthConfig = {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackUrl: process.env.GOOGLE_CALLBACK_URL || '/api/auth/oauth/google/callback',
  },
  facebook: {
    appId: process.env.FACEBOOK_APP_ID,
    appSecret: process.env.FACEBOOK_APP_SECRET,
    callbackUrl: process.env.FACEBOOK_CALLBACK_URL || '/api/auth/oauth/facebook/callback',
  },
};

// Validate required OAuth configuration
if (!oauthConfig.google.clientId || !oauthConfig.google.clientSecret) {
  console.warn('Google OAuth credentials are not configured. Google login may not work.');
}

if (!oauthConfig.facebook.appId || !oauthConfig.facebook.appSecret) {
  console.warn('Facebook OAuth credentials are not configured. Facebook login may not work.');
}
```

```typescript
// SECURITY FIX: Use environment variables for analytics configuration