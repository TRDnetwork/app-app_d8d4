```ts
import { Resend } from 'resend';
import { config } from '../config/env';

// Validate Resend config at module load
if (!config.RESEND_API_KEY?.startsWith('re_')) {
  throw new Error('❌ Invalid or missing RESEND_API_KEY in environment variables');
}

const resend = new Resend(config.RESEND_API_KEY);

export { resend };
```