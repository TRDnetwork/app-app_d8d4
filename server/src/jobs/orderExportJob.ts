import { Job } from 'bull';
import { Order } from '../models/Order';
import { DataService } from '../services/dataService';
import { StatusCodes } from 'http-status-codes';
import { Readable } from 'stream';

interface ExportJobData {
  filter: any;
  format: 'csv' | 'json';
  userId: string;
}

interface ExportJobResult {
  success: boolean;
  message: string;
  data: any;
  format: 'csv' | 'json';
  duration: number;
}

// Exponential backoff configuration
const MAX_RETRIES = 3;
const BASE_DELAY = 1000; // 1 second

/**
 * Process order export job
 * @param job - Bull job object
 * @returns Export result
 */
export const processOrderExportJob = async (job: Job<ExportJobData>): Promise<ExportJobResult> => {
  const startTime = Date.now();
  
  try {
    let data: any;
    
    // Process export based on format
    if (job.data.format === 'csv') {
      data = await DataService.exportOrdersToCSV(job.data.filter);
    } else if (job.data.format === 'json') {
      data = await DataService.exportOrdersToJSON(job.data.filter);
    } else {
      return {
        success: false,
        message: `Unsupported format: ${job.data.format}`,
        data: null,
        format: job.data.format,
        duration: Date.now() - startTime
      };
    }
    
    return {
      success: true,
      message: 'Export completed successfully',
      data: data,
      format: job.data.format,
      duration: Date.now() - startTime
    };
  } catch (error: any) {
    // Handle retry logic
    if (job.attemptsMade < MAX_RETRIES) {
      // Calculate delay with exponential backoff
      const delay = BASE_DELAY * Math.pow(2, job.attemptsMade);
      
      // Retry the job with exponential backoff
      throw new Error(`Export failed: ${error.message}. Retrying in ${delay}ms...`);
    } else {
      // Max retries reached, mark as failed
      return {
        success: false,
        message: `Export failed after ${MAX_RETRIES} attempts: ${error.message}`,
        data: null,
        format: job.data.format,
        duration: Date.now() - startTime
      };
    }
  }
};

/**
 * Handle completed export job
 * @param job - Bull job object
 * @param result - Export result
 */
export const handleExportJobCompleted = async (job: Job<ExportJobData>, result: ExportJobResult) => {
  console.log(`Export job ${job.id} completed in ${result.duration}ms`);
  
  // Send notification to user with download link (in a real app)
  console.log(`Sending notification to user ${job.data.userId} about export results`);
};

/**
 * Handle failed export job
 * @param job - Bull job object
 * @param error - Error object
 */
export const handleExportJobFailed = async (job: Job<ExportJobData>, error: Error) => {
  console.error(`Export job ${job.id} failed after ${job.attemptsMade} attempts:`, error.message);
  
  // Send failure notification to user
  console.log(`Sending failure notification to user ${job.data.userId}`);
};
```

```typescript