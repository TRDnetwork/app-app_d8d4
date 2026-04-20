import { Job } from 'bull';
import { Product } from '../models/Product';
import { DataService } from '../services/dataService';
import { StatusCodes } from 'http-status-codes';

interface ImportJobData {
  fileData: string | Buffer;
  fileType: 'csv' | 'json';
  userId: string;
}

interface ImportJobResult {
  success: boolean;
  message: string;
  imported: number;
  failed: number;
  errors: any[];
  duration: number;
}

// Exponential backoff configuration
const MAX_RETRIES = 3;
const BASE_DELAY = 1000; // 1 second

/**
 * Process product import job
 * @param job - Bull job object
 * @returns Import result
 */
export const processProductImportJob = async (job: Job<ImportJobData>): Promise<ImportJobResult> => {
  const startTime = Date.now();
  
  try {
    let result: ImportJobResult;
    
    // Process import based on file type
    if (job.data.fileType === 'csv') {
      result = await DataService.importProductsFromCSV(job.data.fileData);
    } else if (job.data.fileType === 'json') {
      result = await DataService.importProductsFromJSON(job.data.fileData);
    } else {
      return {
        success: false,
        message: `Unsupported file type: ${job.data.fileType}`,
        imported: 0,
        failed: 0,
        errors: [],
        duration: Date.now() - startTime
      };
    }
    
    // Add duration to result
    result.duration = Date.now() - startTime;
    
    return result;
  } catch (error: any) {
    // Handle retry logic
    if (job.attemptsMade < MAX_RETRIES) {
      // Calculate delay with exponential backoff
      const delay = BASE_DELAY * Math.pow(2, job.attemptsMade);
      
      // Retry the job with exponential backoff
      throw new Error(`Import failed: ${error.message}. Retrying in ${delay}ms...`);
    } else {
      // Max retries reached, mark as failed
      return {
        success: false,
        message: `Import failed after ${MAX_RETRIES} attempts: ${error.message}`,
        imported: 0,
        failed: 0,
        errors: [{ error: error.message }],
        duration: Date.now() - startTime
      };
    }
  }
};

/**
 * Handle completed import job
 * @param job - Bull job object
 * @param result - Import result
 */
export const handleImportJobCompleted = async (job: Job<ImportJobData>, result: ImportJobResult) => {
  console.log(`Import job ${job.id} completed in ${result.duration}ms`);
  
  // Log import statistics
  console.log(`Imported ${result.imported} products, ${result.failed} failed`);
  
  // Send notification to user (in a real app, this would use email or push notifications)
  console.log(`Sending notification to user ${job.data.userId} about import results`);
};

/**
 * Handle failed import job
 * @param job - Bull job object
 * @param error - Error object
 */
export const handleImportJobFailed = async (job: Job<ImportJobData>, error: Error) => {
  console.error(`Import job ${job.id} failed after ${job.attemptsMade} attempts:`, error.message);
  
  // Send failure notification to user
  console.log(`Sending failure notification to user ${job.data.userId}`);
};
```

```typescript