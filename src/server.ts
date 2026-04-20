import app from './app';
import { checkTrialExpiry, handleTrialExpiry } from './services/trialService';
import { scheduleJob } from 'node-schedule';

const PORT = process.env.PORT || 3000;

// Schedule trial expiry checks
// Run every day at 2am
scheduleJob('0 2 * * *', async () => {
  console.log('Checking for expiring trials...');
  await checkTrialExpiry();
});

// Schedule trial conversion
// Run every day at 3am
scheduleJob('0 3 * * *', async () => {
  console.log('Handling expired trials...');
  await handleTrialExpiry();
});

app.listen(PORT, () => {
  console.log(`Billing service running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
```

```typescript