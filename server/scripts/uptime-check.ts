#!/usr/bin/env node
import axios from 'axios';
import { logger } from '../src/middleware/logging';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Uptime check configuration
const TARGET_URL = process.env.HEALTH_CHECK_URL || 'http://localhost:3000/api/health';
const WEBHOOK_URL = process.env.ALERT_WEBHOOK_URL;
const CHECK_INTERVAL = parseInt(process.env.CHECK_INTERVAL || '300000'); // 5 minutes

// Function to perform health check
async function healthCheck() {
  try {
    const response = await axios.get(TARGET_URL, {
      timeout: 10000,
    });
    
    if (response.status === 200 && response.data.status === 'ok') {
      logger.info({
        type: 'uptime_check',
        status: 'success',
        url: TARGET_URL,
        responseTime: response.headers['x-response-time'],
        timestamp: new Date().toISOString(),
      });
    } else {
      await sendAlert(`Health check failed: ${TARGET_URL} returned ${response.status}`);
    }
  } catch (error) {
    await sendAlert(`Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Function to send alert
async function sendAlert(message: string) {
  logger.error({
    type: 'uptime_alert',
    message,
    url: TARGET_URL,
    timestamp: new Date().toISOString(),
  });
  
  // Send webhook alert if configured
  if (WEBHOOK_URL) {
    try {
      await axios.post(WEBHOOK_URL, {
        text: message,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error({
        type: 'alert_failed',
        message: 'Failed to send alert webhook',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      });
    }
  }
}

// Start health check loop
logger.info({
  type: 'uptime_monitor',
  message: 'Starting uptime monitoring',
  targetUrl: TARGET_URL,
  checkInterval: CHECK_INTERVAL,
  timestamp: new Date().toISOString(),
});

// Perform initial check
healthCheck();

// Set up recurring checks
setInterval(healthCheck, CHECK_INTERVAL);
```

```typescript
// SECURITY FIX: Use environment variables for source maps