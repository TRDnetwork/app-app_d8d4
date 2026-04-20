import { ObjectId } from 'mongodb';
import { db } from '../config/database';
import { StatusCodes } from 'http-status-codes';

// Job types
export enum JobType {
  DATA_IMPORT = 'data_import',
  DATA_EXPORT = 'data_export',
  EMAIL_NOTIFICATION = 'email_notification',
  DATA_CLEANUP = 'data_cleanup',
  USAGE_METERING = 'usage_metering',
  PRODUCT_SYNC = 'product_sync',
  ORDER_SYNC = 'order_sync',
  CUSTOMER_SYNC = 'customer_sync'
}

// Job status
export enum JobStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

// Job interface
export interface Job {
  _id?: ObjectId;
  job_type: JobType;
  status: JobStatus;
  payload: Record<string, any>;
  result?: Record<string, any>;
  error?: {
    message: string;
    stack?: string;
    code?: string;
  };
  attempts: number;
  max_attempts: number;
  retry_delay: number;
  scheduled_at: Date;
  started_at?: Date;
  completed_at?: Date;
  created_at: Date;
  updated_at: Date;
}

// Job creation options
export interface CreateJobOptions {
  max_attempts?: number;
  retry_delay?: number;
  scheduled_at?: Date;
}

// Job service class
export class JobService {
  private collection = db.collection<Job>('app_d8d4_jobs');

  /**
   * Create a new job
   */
  async createJob(
    jobType: JobType,
    payload: Record<string, any>,
    options: CreateJobOptions = {}
  ): Promise<Job> {
    const job: Job = {
      job_type: jobType,
      status: JobStatus.PENDING,
      payload,
      attempts: 0,
      max_attempts: options.max_attempts || 3,
      retry_delay: options.retry_delay || 60000, // 1 minute default
      scheduled_at: options.scheduled_at || new Date(),
      created_at: new Date(),
      updated_at: new Date()
    };

    const result = await this.collection.insertOne(job);
    return { ...job, _id: result.insertedId };
  }

  /**
   * Get a job by ID
   */
  async getJob(id: string): Promise<Job | null> {
    return this.collection.findOne({ _id: new ObjectId(id) });
  }

  /**
   * Get jobs by type and status
   */
  async getJobsByStatus(
    jobType: JobType,
    status: JobStatus,
    limit: number = 100
  ): Promise<Job[]> {
    return this.collection
      .find({ job_type: jobType, status })
      .sort({ scheduled_at: 1 })
      .limit(limit)
      .toArray();
  }

  /**
   * Get pending jobs that are scheduled to run
   */
  async getPendingJobs(limit: number = 100): Promise<Job[]> {
    return this.collection
      .find({
        status: JobStatus.PENDING,
        scheduled_at: { $lte: new Date() }
      })
      .sort({ scheduled_at: 1 })
      .limit(limit)
      .toArray();
  }

  /**
   * Mark a job as running
   */
  async markJobAsRunning(jobId: string): Promise<boolean> {
    const result = await this.collection.updateOne(
      { 
        _id: new ObjectId(jobId),
        status: JobStatus.PENDING 
      },
      {
        $set: { 
          status: JobStatus.RUNNING,
          started_at: new Date(),
          updated_at: new Date()
        },
        $inc: { attempts: 1 }
      }
    );

    return result.modifiedCount > 0;
  }

  /**
   * Mark a job as completed
   */
  async markJobAsCompleted(jobId: string, result: Record<string, any> = {}): Promise<boolean> {
    const resultOp = await this.collection.updateOne(
      { 
        _id: new ObjectId(jobId),
        status: JobStatus.RUNNING 
      },
      {
        $set: { 
          status: JobStatus.COMPLETED,
          result,
          completed_at: new Date(),
          updated_at: new Date()
        }
      }
    );

    return resultOp.modifiedCount > 0;
  }

  /**
   * Mark a job as failed
   */
  async markJobAsFailed(
    jobId: string, 
    error: Error | string,
    shouldRetry: boolean = true
  ): Promise<boolean> {
    // Parse error if it's a string
    const errorObj = typeof error === 'string' 
      ? { message: error } 
      : { 
          message: error.message,
          stack: error.stack,
          code: (error as any).code
        };

    // Determine next scheduled time based on retry strategy
    let nextScheduledAt: Date | null = null;
    if (shouldRetry) {
      const job = await this.getJob(jobId);
      if (job && job.attempts < job.max_attempts) {
        // Exponential backoff: retry_delay * 2^(attempts-1)
        const delay = job.retry_delay * Math.pow(2, job.attempts);
        nextScheduledAt = new Date(Date.now() + delay);
      }
    }

    const update: any = {
      $set: { 
        status: nextScheduledAt ? JobStatus.PENDING : JobStatus.FAILED,
        error: errorObj,
        updated_at: new Date()
      }
    };

    if (nextScheduledAt) {
      update.$set.scheduled_at = nextScheduledAt;
    } else if (!nextScheduledAt && !shouldRetry) {
      // If shouldRetry is false but no nextScheduledAt, mark as failed
      update.$set.status = JobStatus.FAILED;
    }

    const result = await this.collection.updateOne(
      { _id: new ObjectId(jobId) },
      update
    );

    return result.modifiedCount > 0;
  }

  /**
   * Process a job (execute the job function)
   */
  async processJob(jobId: string): Promise<boolean> {
    const job = await this.getJob(jobId);
    if (!job) {
      return false;
    }

    // Mark job as running
    if (!await this.markJobAsRunning(jobId)) {
      // Job was already picked up by another worker
      return false;
    }

    try {
      // Execute the appropriate job handler based on job type
      switch (job.job_type) {
        case JobType.DATA_IMPORT:
          await this.handleDataImport(job);
          break;
        case JobType.DATA_EXPORT:
          await this.handleDataExport(job);
          break;
        case JobType.EMAIL_NOTIFICATION:
          await this.handleEmailNotification(job);
          break;
        case JobType.DATA_CLEANUP:
          await this.handleDataCleanup(job);
          break;
        case JobType.USAGE_METERING:
          await this.handleUsageMetering(job);
          break;
        case JobType.PRODUCT_SYNC:
          await this.handleProductSync(job);
          break;
        case JobType.ORDER_SYNC:
          await this.handleOrderSync(job);
          break;
        case JobType.CUSTOMER_SYNC:
          await this.handleCustomerSync(job);
          break;
        default:
          throw new Error(`Unknown job type: ${job.job_type}`);
      }

      // Mark job as completed
      await this.markJobAsCompleted(jobId);
      return true;
    } catch (error: any) {
      // Determine if we should retry based on error type
      const shouldRetry = this.shouldRetryOnError(error);
      
      // Mark job as failed (with potential retry)
      await this.markJobAsFailed(jobId, error, shouldRetry);
      return false;
    }
  }

  /**
   * Process all pending jobs
   */
  async processPendingJobs(): Promise<number> {
    const pendingJobs = await this.getPendingJobs();
    let processedCount = 0;

    for (const job of pendingJobs) {
      try {
        await this.processJob(job._id!.toString());
        processedCount++;
      } catch (error) {
        console.error(`Error processing job ${job._id}:`, error);
      }
    }

    return processedCount;
  }

  /**
   * Handle data import job
   */
  private async handleDataImport(job: Job): Promise<void> {
    const { file_type, file_url, mapping } = job.payload;
    
    // Import service would handle the actual import
    // This is a placeholder for the actual implementation
    console.log(`Importing ${file_type} from ${file_url} with mapping:`, mapping);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  /**
   * Handle data export job
   */
  private async handleDataExport(job: Job): Promise<void> {
    const { resource_type, format, filters } = job.payload;
    
    // Export service would handle the actual export
    // This is a placeholder for the actual implementation
    console.log(`Exporting ${resource_type} as ${format} with filters:`, filters);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  /**
   * Handle email notification job
   */
  private async handleEmailNotification(job: Job): Promise<void> {
    const { email, subject, template, data } = job.payload;
    
    // Email service would handle sending the email
    // This is a placeholder for the actual implementation
    console.log(`Sending email to ${email} with subject: ${subject}`);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  /**
   * Handle data cleanup job
   */
  private async handleDataCleanup(job: Job): Promise<void> {
    const { resource_type, cutoff_date } = job.payload;
    
    // Cleanup service would handle removing old records
    // This is a placeholder for the actual implementation
    console.log(`Cleaning up ${resource_type} records before ${cutoff_date}`);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  /**
   * Handle usage metering job
   */
  private async handleUsageMetering(job: Job): Promise<void> {
    const { period, metrics } = job.payload;
    
    // Metering service would handle aggregating usage data
    // This is a placeholder for the actual implementation
    console.log(`Aggregating usage metrics for ${period}:`, metrics);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  /**
   * Handle product sync job
   */
  private async handleProductSync(job: Job): Promise<void> {
    const { source, target } = job.payload;
    
    // Sync service would handle synchronizing products
    // This is a placeholder for the actual implementation
    console.log(`Syncing products from ${source} to ${target}`);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  /**
   * Handle order sync job
   */
  private async handleOrderSync(job: Job): Promise<void> {
    const { source, target } = job.payload;
    
    // Sync service would handle synchronizing orders
    // This is a placeholder for the actual implementation
    console.log(`Syncing orders from ${source} to ${target}`);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  /**
   * Handle customer sync job
   */
  private async handleCustomerSync(job: Job): Promise<void> {
    const { source, target } = job.payload;
    
    // Sync service would handle synchronizing customers
    // This is a placeholder for the actual implementation
    console.log(`Syncing customers from ${source} to ${target}`);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  /**
   * Determine if a job should be retried based on the error
   */
  private shouldRetryOnError(error: Error): boolean {
    const nonRetryableErrors = [
      'ValidationError',
      'AuthenticationError',
      'AuthorizationError',
      'NotFoundError'
    ];

    // Don't retry for validation, auth, or not found errors
    if (nonRetryableErrors.includes(error.name)) {
      return false;
    }

    // Don't retry for specific error messages
    const nonRetryableMessages = [
      'invalid credentials',
      'user not found',
      'resource not found',
      'invalid input'
    ];

    const errorMessage = error.message.toLowerCase();
    if (nonRetryableMessages.some(msg => errorMessage.includes(msg))) {
      return false;
    }

    // Retry for network, timeout, and server errors
    return true;
  }
}

// Export singleton instance
export const jobService = new JobService();
```

```typescript