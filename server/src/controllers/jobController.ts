import { Request, Response, NextFunction } from 'express';
import JobService from '../services/jobService';
import { StatusCodes } from 'http-status-codes';
import { authorize } from '../middleware/auth';

/**
 * Create a new job
 */
export const createJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, data, maxRetries } = req.body;
    
    if (!type || !data) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Job type and data are required'
      });
    }
    
    const job = await JobService.createJob({ type, data, maxRetries });
    
    res.status(StatusCodes.CREATED).json({
      success: true,
      data: job
    });
  } catch (error: any) {
    next(error);
  }
};

/**
 * Get job by ID
 */
export const getJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const job = await JobService.getJob(id);
    
    if (!job) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    res.status(StatusCodes.OK).json({
      success: true,
      data: job
    });
  } catch (error: any) {
    next(error);
  }
};

/**
 * Get all jobs
 */
export const getJobs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.query;
    
    let jobs;
    if (status) {
      jobs = await JobService.getJobsByStatus(status as string);
    } else {
      jobs = await Job.find().sort({ createdAt: -1 });
    }
    
    res.status(StatusCodes.OK).json({
      success: true,
      data: jobs
    });
  } catch (error: any) {
    next(error);
  }
};

/**
 * Cancel a job
 */
export const cancelJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const job = await JobService.getJob(id);
    
    if (!job) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    if (['completed', 'failed'].includes(job.status)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Cannot cancel completed or failed job'
      });
    }
    
    await JobService.updateJobStatus(id, 'failed', 100, undefined, 'Cancelled by user');
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Job cancelled successfully'
    });
  } catch (error: any) {
    next(error);
  }
};
```
```typescript