import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { exportQueue } from '../jobs/queue';
import { logger } from '../utils/logger';
import { ObjectId } from 'mongodb';
import { format } from 'date-fns';

// SECURITY FIX: Validate and sanitize request data
interface ExportRequest {
  userId: string;
  collection: 'products' | 'users' | 'orders' | 'categories';
  format: 'csv' | 'json';
  filters?: Record<string, any>;
  fields?: string[];
  options?: {
    includeHeaders?: boolean;
    delimiter?: string;
  };
}

/**
 * Initiate data export job
 */
export const createExport = async (req: Request, res: Response) => {
  try {
    // SECURITY FIX: Validate user authentication and authorization
    if (!req.user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: 'Authentication required'
      });
    }

    const { collection, format, filters, fields, options } = req.body;
    
    // SECURITY FIX: Validate request parameters
    if (!collection || !['products', 'users', 'orders', 'categories'].includes(collection)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Invalid or missing collection parameter'
      });
    }

    if (!format || !['csv', 'json'].includes(format)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Invalid or missing format parameter'
      });
    }

    // SECURITY FIX: Validate filters and fields to prevent injection attacks
    if (filters && typeof filters !== 'object') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Invalid filters format'
      });
    }

    if (fields && (!Array.isArray(fields) || fields.some(f => typeof f !== 'string'))) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Invalid fields format'
      });
    }

    // SECURITY FIX: Validate options
    if (options) {
      if (typeof options.includeHeaders !== 'undefined' && typeof options.includeHeaders !== 'boolean') {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: 'Invalid includeHeaders option'
        });
      }
      
      if (options.delimiter && (typeof options.delimiter !== 'string' || options.delimiter.length !== 1)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: 'Invalid delimiter option'
        });
      }
    }

    // Create export job
    const exportJob = await exportQueue.add('export', {
      userId: req.user.id,
      collection,
      format,
      filters: filters || {},
      fields: fields || [],
      options: {
        includeHeaders: options?.includeHeaders !== false, // default to true
        delimiter: options?.delimiter || ','
      },
      metadata: {
        requestedAt: new Date().toISOString()
      }
    }, {
      // SECURITY FIX: Set job timeout and retry strategy
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000
      },
      timeout: 600000, // 10 minutes
      removeOnComplete: false, // Keep completed jobs for download
      removeOnFail: 3600000 // Remove failed jobs after 1 hour
    });

    logger.info(`Export job created: ${exportJob.id}`, {
      userId: req.user.id,
      collection,
      format,
      jobId: exportJob.id
    });

    res.status(StatusCodes.OK).json({
      message: 'Export job created successfully',
      jobId: exportJob.id,
      status: 'pending'
    });

  } catch (error: any) {
    logger.error('Error creating export:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: 'Failed to create export job'
    });
  }
};

/**
 * Get export job status
 */
export const getExportStatus = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    
    // SECURITY FIX: Validate user authentication
    if (!req.user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: 'Authentication required'
      });
    }

    // SECURITY FIX: Validate job ID format
    if (!jobId || !/^[0-9a-fA-F]{24}$/.test(jobId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Invalid job ID format'
      });
    }

    // Get job from queue
    const job = await exportQueue.getJob(jobId);
    
    if (!job) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: 'Export job not found'
      });
    }

    // SECURITY FIX: Verify job ownership
    const jobData = await job.getData();
    if (jobData.userId !== req.user.id) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: 'Access denied to this export job'
      });
    }

    const state = await job.getState();
    const progress = job.progress;
    
    let response: any = {
      jobId: job.id,
      status: state,
      progress: progress || 0,
      collection: jobData.collection,
      format: jobData.format
    };

    // Include additional details based on job state
    if (state === 'completed') {
      const result = await job.returnvalue();
      response.result = result;
      response.completedAt = job.finishedOn;
      response.downloadUrl = `/api/export/download/${job.id}`;
    } else if (state === 'failed') {
      const failedReason = await job.failedReason();
      response.error = failedReason;
      response.failedAt = job.finishedOn;
    } else if (state === 'active') {
      response.startedAt = job.startedOn;
    }

    res.status(StatusCodes.OK).json(response);

  } catch (error: any) {
    logger.error('Error getting export status:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: 'Failed to retrieve export status'
    });
  }
};

/**
 * Download exported file
 */
export const downloadExport = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    
    // SECURITY FIX: Validate user authentication
    if (!req.user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: 'Authentication required'
      });
    }

    // SECURITY FIX: Validate job ID format
    if (!jobId || !/^[0-9a-fA-F]{24}$/.test(jobId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Invalid job ID format'
      });
    }

    // Get job from queue
    const job = await exportQueue.getJob(jobId);
    
    if (!job) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: 'Export job not found'
      });
    }

    // SECURITY FIX: Verify job ownership
    const jobData = await job.getData();
    if (jobData.userId !== req.user.id) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: 'Access denied to this export job'
      });
    }

    // SECURITY FIX: Verify job is completed
    const state = await job.getState();
    if (state !== 'completed') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Export job is not completed yet'
      });
    }

    // SECURITY FIX: Get result safely
    const result = await job.returnvalue();
    if (!result || !result.filePath) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: 'Export result not found'
      });
    }

    // SECURITY FIX: Validate file path to prevent directory traversal
    const filePath = result.filePath;
    if (!filePath.startsWith('/tmp/shopsphere-exports/') || 
        !require('fs').existsSync(filePath)) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: 'Export file not found'
      });
    }

    // Set appropriate headers for file download
    const filename = `shopsphere-${jobData.collection}-${format(new Date(), 'yyyy-MM-dd')}.${jobData.format}`;
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    if (jobData.format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
    } else {
      res.setHeader('Content-Type', 'application/json');
    }

    // SECURITY FIX: Stream file to prevent memory issues with large files
    const fileStream = require('fs').createReadStream(filePath);
    fileStream.pipe(res);

    // Log download
    logger.info(`Export file downloaded: ${jobId}`, {
      userId: req.user.id,
      jobId,
      filename
    });

  } catch (error: any) {
    logger.error('Error downloading export:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: 'Failed to download export file'
    });
  }
};

/**
 * Cancel export job
 */
export const cancelExport = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    
    // SECURITY FIX: Validate user authentication
    if (!req.user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: 'Authentication required'
      });
    }

    // SECURITY FIX: Validate job ID format
    if (!jobId || !/^[0-9a-fA-F]{24}$/.test(jobId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Invalid job ID format'
      });
    }

    // Get job from queue
    const job = await exportQueue.getJob(jobId);
    
    if (!job) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: 'Export job not found'
      });
    }

    // SECURITY FIX: Verify job ownership
    const jobData = await job.getData();
    if (jobData.userId !== req.user.id) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: 'Access denied to this export job'
      });
    }

    // SECURITY FIX: Only allow cancellation of pending jobs
    const state = await job.getState();
    if (state !== 'waiting' && state !== 'delayed') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Cannot cancel export job in current state'
      });
    }

    // Remove job from queue
    await job.remove();
    
    logger.info(`Export job cancelled: ${jobId}`, {
      userId: req.user.id,
      jobId
    });

    res.status(StatusCodes.OK).json({
      message: 'Export job cancelled successfully',
      jobId
    });

  } catch (error: any) {
    logger.error('Error cancelling export:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: 'Failed to cancel export job'
    });
  }
};
```

```typescript