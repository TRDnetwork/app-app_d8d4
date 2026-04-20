// File upload configuration
export const uploadConfig = {
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
  allowedMimeTypes: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
  ],
  uploadDir: process.env.UPLOAD_DIR || '/tmp/uploads',
  useS3: process.env.USE_S3 === 'true',
  s3Bucket: process.env.S3_BUCKET_NAME,
  s3Region: process.env.AWS_REGION || 'us-east-1',
};

// Validate required upload configuration
if (uploadConfig.useS3 && !uploadConfig.s3Bucket) {
  console.warn('S3 bucket is not configured for file uploads.');
}
```

```typescript
// SECURITY FIX: Use environment variables for security configuration