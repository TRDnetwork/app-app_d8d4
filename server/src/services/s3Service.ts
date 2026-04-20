```ts
import { S3Client } from '@aws-sdk/client-s3';
import { config } from '../config/env';

// Validate AWS config at module load
const requiredEnvVars = [
  { key: 'AWS_ACCESS_KEY_ID', value: config.AWS_ACCESS_KEY_ID },
  { key: 'AWS_SECRET_ACCESS_KEY', value: config.AWS_SECRET_ACCESS_KEY },
  { key: 'S3_BUCKET_NAME', value: config.S3_BUCKET_NAME },
];

const missingVars = requiredEnvVars.filter(env => !env.value);
if (missingVars.length > 0) {
  throw new Error(`❌ Missing required environment variables: ${missingVars.map(v => v.key).join(', ')}`);
}

const s3Client = new S3Client({
  region: config.AWS_REGION,
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  },
  ...(process.env.NODE_ENV === 'production' ? {} : { useDualStack: true }), // Enable dual-stack in non-prod
});

export { s3Client };
```