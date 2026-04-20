// Analytics configuration
export const analyticsConfig = {
  googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID,
  posthogApiKey: process.env.POSTHOG_API_KEY,
  posthogApiHost: process.env.POSTHOG_API_HOST || 'https://app.posthog.com',
};

// Validate required analytics configuration
if (!analyticsConfig.posthogApiKey) {
  console.warn('PostHog API key is not configured. Analytics may not work.');
}
```

```typescript
// SECURITY FIX: Use environment variables for search configuration