/**
 * Standardized API response format
 * Ensures consistent response structure across the application
 */
export const apiResponse = (
  statusCode: number,
  message: string,
  data: any = null,
  errors: any = null
) => {
  return {
    success: statusCode >= 200 && statusCode < 300,
    statusCode,
    message,
    data,
    errors,
    timestamp: new Date().toISOString(),
  };
};
```

```typescript