```js
#!/usr/bin/env node

const axios = require('axios');
const chalk = require('chalk');
const moment = require('moment');

// Configuration
const HEALTH_CHECK_URL = process.env.HEALTH_CHECK_URL || 'http://localhost:5000/api/health';
const DEPS_CHECK_URL = process.env.DEPS_CHECK_URL || 'http://localhost:5000/api/health/deps';
const TIMEOUT = parseInt(process.env.HEALTH_CHECK_TIMEOUT) || 10000;

async function checkHealth() {
  console.log(chalk.blue('🔍 Starting health check...'));
  console.log(chalk.gray(`Health check URL: ${HEALTH_CHECK_URL}`));
  console.log(chalk.gray(`Dependencies check URL: ${DEPS_CHECK_URL}`));
  console.log('');

  try {
    // Check main health endpoint
    console.log(chalk.cyan('🏥 Checking main health endpoint...'));
    const healthResponse = await axios.get(HEALTH_CHECK_URL, { timeout: TIMEOUT });
    
    if (healthResponse.data.status === 'ok') {
      console.log(chalk.green('✅ Main health check passed'));
      console.log(chalk.gray(`Version: ${healthResponse.data.version}`));
      console.log(chalk.gray(`Uptime: ${healthResponse.data.uptime} seconds`));
    } else {
      console.log(chalk.red('❌ Main health check failed'));
      process.exit(1);
    }

    // Check dependencies
    console.log(chalk.cyan('🔌 Checking external dependencies...'));
    const depsResponse = await axios.get(DEPS_CHECK_URL, { timeout: TIMEOUT });
    
    if (depsResponse.data.status === 'ok') {
      console.log(chalk.green('✅ All dependencies are healthy'));
      Object.keys(depsResponse.data.services).forEach(service => {
        console.log(chalk.gray(`  ${service}: ${depsResponse.data.services[service].status}`));
      });
    } else {
      console.log(chalk.red('❌ Some dependencies are unhealthy'));
      Object.keys(depsResponse.data.services).forEach(service => {
        const status = depsResponse.data.services[service].status;
        if (status === 'error') {
          console.log(chalk.red(`  ${service}: ${status}`));
          console.log(chalk.red(`    Error: ${depsResponse.data.services[service].error}`));
        } else {
          console.log(chalk.gray(`  ${service}: ${status}`));
        }
      });
      process.exit(1);
    }

    console.log('');
    console.log(chalk.green('🎉 All health checks passed!'));
    console.log(chalk.gray(`Checked at: ${moment().format('YYYY-MM-DD HH:mm:ss')}`));
    
  } catch (error) {
    console.log(chalk.red('❌ Health check failed'));
    if (error.response) {
      console.log(chalk.red(`Status: ${error.response.status}`));
      console.log(chalk.red(`Message: ${error.response.data.message || error.response.statusText}`));
    } else if (error.code === 'ECONNABORTED') {
      console.log(chalk.red(`Timeout: Request took longer than ${TIMEOUT}ms`));
    } else {
      console.log(chalk.red(`Error: ${error.message}`));
    }
    process.exit(1);
  }
}

// Run health check
checkHealth();
```