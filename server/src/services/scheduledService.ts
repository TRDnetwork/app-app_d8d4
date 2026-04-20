import { Pool } from 'pg';
import cron from 'node-cron';
import JobService from './jobService';
import { loggerWithId } from '../utils/logger';
import { captureError } from '../utils/monitoring';

class ScheduledService {
  private logger = loggerWithId('scheduled-service');
  
  /**
   * Start scheduled jobs
   */
  static async start(): Promise<void> {
    const logger = loggerWithId('scheduled-service');
    logger.info({ action: 'started' });
    
    // Daily digest at 8 AM
    cron.schedule('0 8 * * *', async () => {
      try {
        logger.info({ action: 'daily-digest-started' });
        await JobService.createJob({
          type: 'email',
          data: {
            template: 'daily-digest',
            recipients: 'all-users'
          }
        });
      } catch (error: any) {
        captureError(error, { context: 'ScheduledService.dailyDigest' });
      }
    });
    
    // Weekly reports every Monday at 9 AM
    cron.schedule('0 9 * * 1', async () => {
      try {
        logger.info({ action: 'weekly-reports-started' });
        await JobService.createJob({
          type: 'analytics',
          data: {
            reportType: 'weekly',
            period: 'last-week'
          }
        });
      } catch (error: any) {
        captureError(error, { context: 'ScheduledService.weeklyReports' });
      }
    });
    
    // Data cleanup every day at 2 AM
    cron.schedule('0 2 * * *', async () => {
      try {
        logger.info({ action: 'data-cleanup-started' });
        await JobService.createJob({
          type: 'data-cleanup',
          data: {
            cleanupType: 'old-records',
            retentionDays: 90
          }
        });
      } catch (error: any) {
        captureError(error, { context: 'ScheduledService.dataCleanup' });
      }
    });
    
    // Usage metering aggregation every hour
    cron.schedule('0 * * * *', async () => {
      try {
        logger.info({ action: 'usage-metering-started' });
        await JobService.createJob({
          type: 'analytics',
          data: {
            aggregationType: 'hourly',
            metric: 'usage'
          }
        });
      } catch (error: any) {
        captureError(error, { context: 'ScheduledService.usageMetering' });
      }
    });
  }
}

export default ScheduledService;
```
```typescript