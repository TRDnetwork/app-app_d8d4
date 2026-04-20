import { onCLS, onFID, onLCP, onTTFB } from 'web-vitals';

// Track Web Vitals
const sendToAnalytics = (metric: any) => {
  // In a real app, send to analytics service
  // For now, we'll just log to console
  console.log(metric.name, metric.value);
  
  // You could also send to your analytics service
  // fetch('/api/analytics', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(metric),
  // });
};

// Track Core Web Vitals
onCLS(sendToAnalytics);
onFID(sendToAnalytics);
onLCP(sendToAnalytics);
onTTFB(sendToAnalytics);
```

```typescript
// SECURITY FIX: Use environment variables for alerting