import Job from '../models/Job';
import { loggerWithId } from '../utils/logger';
import { captureError } from '../utils/monitoring';

interface JobData {
  type: string;
  data: Record<string, any>;
  maxRetries?: number;
}

class JobService {
  /**
   * Create a new job
   */
  static async createJob(jobData: JobData): Promise<any> {
    try {
      const job = new Job({
        type: jobData.type,
        data: jobData.data,
        maxRetries: jobData.maxRetries || 3
      });

      await job.save();
      
      const logger = loggerWithId(`job-${job._id}`);
      logger.info({ action: 'created', jobType: job.type });
      
      return job;
    } catch (error: any) {
      captureError(error, { context: 'JobService.createJob' });
      throw error;
    }
  }

  /**
   * Get job by ID
   */
  static async getJob(id: string): Promise<any> {
    try {
      return await Job.findById(id);
    } catch (error: any) {
      captureError(error, { context: 'JobService.getJob', jobId: id });
      throw error;
    }
  }

  /**
   * Update job status and progress
   */
  static async updateJobStatus(id: string, status: string, progress?: number, result?: any, error?: string): Promise<any> {
    try {
      const update: any = { status, updatedAt: new Date() };
      
      if (progress !== undefined) {
        update.progress = Math.max(0, Math.min(100, progress));
      }
      
      if (result) {
        update.result = result;
      }
      
      if (error) {
        update.error = error;
      }
      
      if (status === 'running' && !update.startedAt) {
        update.startedAt = new Date();
      }
      
      if (['completed', 'failed'].includes(status) && !update.completedAt) {
        update.completedAt = new Date();
      }

      const job = await Job.findByIdAndUpdate(id, update, { new: true });
      
      if (job) {
        const logger = loggerWithId(`job-${job._id}`);
        logger.info({ action: 'status-updated', status, progress });
      }
      
      return job;
    } catch (error: any) {
      captureError(error, { context: 'JobService.updateJobStatus', jobId: id });
      throw error;
    }
  }

  /**
   * Get jobs by status
   */
  static async getJobsByStatus(status: string): Promise<any[]> {
    try {
      return await Job.find({ status }).sort({ createdAt: -1 });
    } catch (error: any) {
      captureError(error, { context: 'JobService.getJobsByStatus', status });
      throw error;
    }
  }

  /**
   * Get pending jobs
   */
  static async getPendingJobs(): Promise<any[]> {
    try {
      return await Job.find({ 
        status: 'pending' 
      }).sort({ createdAt: 1 });
    } catch (error: any) {
      captureError(error, { context: 'JobService.getPendingJobs' });
      throw error;
    }
  }

  /**
   * Process a job
   */
  static async processJob(jobId: string): Promise<void> {
    const job = await this.getJob(jobId);
    if (!job) {
      throw new Error(`Job ${jobId} not found`);
    }

    const logger = loggerWithId(`job-${job._id}`);
    logger.info({ action: 'processing-started', jobType: job.type });

    try {
      // Update job status to running
      await this.updateJobStatus(jobId, 'running', 0);

      // Process job based on type
      switch (job.type) {
        case 'import':
          await this.processImportJob(job);
          break;
        case 'export':
          await this.processExportJob(job);
          break;
        case 'data-cleanup':
          await this.processDataCleanupJob(job);
          break;
        case 'analytics':
          await this.processAnalyticsJob(job);
          break;
        case 'email':
          await this.processEmailJob(job);
          break;
        default:
          throw new Error(`Unknown job type: ${job.type}`);
      }

      // Update job status to completed
      await this.updateJobStatus(jobId, 'completed', 100, { success: true });
      logger.info({ action: 'processing-completed', jobType: job.type });
    } catch (error: any) {
      logger.error({ action: 'processing-failed', error: error.message });
      
      // Increment retry count
      job.retries += 1;
      
      if (job.retries < job.maxRetries) {
        // Schedule retry with exponential backoff
        const delay = Math.pow(2, job.retries) * 1000; // 2^retries seconds
        logger.info({ action: 'retry-scheduled', retryCount: job.retries, delay });
        
        setTimeout(() => {
          this.processJob(jobId);
        }, delay);
      } else {
        // Mark as failed after max retries
        await this.updateJobStatus(jobId, 'failed', 100, undefined, error.message);
      }
      
      captureError(error, { context: 'JobService.processJob', jobId: jobId });
    }
  }

  /**
   * Process import job
   */
  private static async processImportJob(job: any): Promise<void> {
    const { type, fileData, mapping } = job.data;
    
    // In a real implementation, this would process the import
    // For now, simulate processing with progress updates
    const totalSteps = 10;
    
    for (let i = 1; i <= totalSteps; i++) {
      // Simulate work
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update progress
      const progress = (i / totalSteps) * 100;
      await this.updateJobStatus(job._id, 'running', progress);
    }
  }

  /**
   * Process export job
   */
  private static async processExportJob(job: any): Promise<void> {
    const { type, filters, format } = job.data;
    
    // In a real implementation, this would process the export
    // For now, simulate processing with progress updates
    const totalSteps = 8;
    
    for (let i = 1; i <= totalSteps; i++) {
      // Simulate work
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update progress
      const progress = (i / totalSteps) * 100;
      await this.updateJobStatus(job._id, 'running', progress);
    }
  }

  /**
   * Process data cleanup job
   */
  private static async processDataCleanupJob(job: any): Promise<void> {
    // In a real implementation, this would clean up old data
    // For now, simulate processing with progress updates
    const totalSteps = 5;
    
    for (let i = 1; i <= totalSteps; i++) {
      // Simulate work
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update progress
      const progress = (i / totalSteps) * 100;
      await this.updateJobStatus(job._id, 'running', progress);
    }
  }

  /**
   * Process analytics job
   */
  private static async processAnalyticsJob(job: any): Promise<void> {
    // In a real implementation, this would generate analytics
    // For now, simulate processing with progress updates
    const totalSteps = 12;
    
    for (let i = 1; i <= totalSteps; i++) {
      // Simulate work
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update progress
      const progress = (i / totalSteps) * 100;
      await this.updateJobStatus(job._id, 'running', progress);
    }
  }

  /**
   * Process email job
   */
  private static async processEmailJob(job: any): Promise<void> {
    // In a real implementation, this would send emails
    // For now, simulate processing with progress updates
    const totalSteps = 6;
    
    for (let i = 1; i <= totalSteps; i++) {
      // Simulate work
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update progress
      const progress = (i / totalSteps) * 100;
      await this.updateJobStatus(job._id, 'running', progress);
    }
  }

  /**
   * Start job processor
   */
  static async startProcessor(): Promise<void> {
    const logger = loggerWithId('job-processor');
    logger.info({ action: 'started' });
    
    // Process jobs every 5 seconds
    setInterval(async () => {
      try {
        const pendingJobs = await this.getPendingJobs();
        
        for (const job of pendingJobs) {
          this.processJob(job._id);
        }
      } catch (error: any) {
        captureError(error, { context: 'JobService.startProcessor' });
      }
    }, 5000);
  }
}

export default JobService;
```
```typescript