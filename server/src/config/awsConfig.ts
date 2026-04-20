// AWS configuration
export const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1',
  s3Bucket: process.env.S3_BUCKET_NAME,
};

// Validate required AWS configuration
if (!awsConfig.accessKeyId || !awsConfig.secretAccessKey) {
  console.warn('AWS credentials are not configured. File uploads may not work.');
}

if (!awsConfig.s3Bucket) {
  console.warn('S3 bucket name is not configured. File uploads may not work.');
}
```

```typescript
// SECURITY FIX: Use environment variables for OAuth configuration