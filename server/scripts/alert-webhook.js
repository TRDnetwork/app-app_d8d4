```js
#!/usr/bin/env node

const axios = require('axios');
const chalk = require('chalk');
const moment = require('moment');

// Configuration
const ALERT_WEBHOOK_URL = process.env.ALERT_WEBHOOK_URL;
const HEALTH_CHECK_URL = process.env.HEALTH_CHECK_URL || 'http://localhost:5000/api/health';
const DEPS_CHECK_URL = process.env.DEPS_CHECK_URL || 'http://localhost:5000/api/health/deps';
const CHECK_INTERVAL = parseInt(process.env.ALERT_CHECK_INTERVAL) || 60000; // 1 minute
const MAX_FAILURES = parseInt(process.env.ALERT_MAX_FAILURES) || 3;

// State
let failureCount = 0;
let lastAlertTime = null;

async function checkAndAlert() {
  try {
    // Check main health endpoint
    const healthResponse = await axios.get(HEALTH_CHECK_URL, { timeout: 10000 });
    
    if (healthResponse.data.status !== 'ok') {
      throw new Error('Main health check failed');
    }

    // Check dependencies
    const depsResponse = await axios.get(DEPS_CHECK_URL, { timeout: 10000 });
    
    if (depsResponse.data.status !== 'ok') {
      throw new Error('Dependencies health check failed');
    }

    // Reset failure count if all checks pass
    if (failureCount > 0) {
      console.log(chalk.green('✅ Service recovered'));
      await sendAlert('Service Recovered', 'The service has recovered and is now healthy.', 'success');
    }
    
    failureCount = 0;
    
  } catch (error) {
    failureCount++;
    console.log(chalk.red(`❌ Health check failed (${failureCount}/${MAX_FAILURES})`));
    
    // Send alert if we've reached the failure threshold
    if (failureCount >= MAX_FAILURES) {
      const now = Date.now();
      
      // Rate limit alerts to once per hour
      if (!lastAlertTime || now - lastAlertTime > 3600000) {
        console.log(chalk.red('🚨 Sending alert...'));
        
        const errorMessage = error.response 
          ? `${error.response.status}: ${error.response.data.message || error.response.statusText}`
          : error.message;
        
        await sendAlert(
          'Service Health Alert', 
          `The service health check has failed ${MAX_FAILURES} times in a row.\n\nError: ${errorMessage}`,
          'danger'
        );
        
        lastAlertTime = now;
      }
    }
  }
}

async function sendAlert(title, text, color = 'warning') {
  if (!ALERT_WEBHOOK_URL) {
    console.log(chalk.yellow('⚠️  ALERT_WEBHOOK_URL not configured, skipping alert'));
    return;
  }

  try {
    await axios.post(ALERT_WEBHOOK_URL, {
      attachments: [
        {
          color: color,
          title: title,
          text: text,
          fields: [
            {
              title: 'Environment',
              value: process.env.NODE_ENV || 'unknown',
              short: true
            },
            {
              title: 'Timestamp',
              value: moment().format('YYYY-MM-DD HH:mm:ss'),
              short: true
            }
          ],
          footer: 'ShopSphere Monitoring',
          footer_icon: 'https://shopsphere.com/favicon.ico',
          ts: Math.floor(Date.now() / 1000)
        }
      ]
    });
    
    console.log(chalk.green('✅ Alert sent successfully'));
  } catch (error) {
    console.log(chalk.red('❌ Failed to send alert'));
    console.log(chalk.red(`Error: ${error.message}`));
  }
}

// Run initial check
console.log(chalk.blue('🔔 Starting alert monitoring...'));
checkAndAlert();

// Set up periodic checks
setInterval(checkAndAlert, CHECK_INTERVAL);
```