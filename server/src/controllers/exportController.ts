import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { exportQueue } from '../jobs/queue';
import { logger } from '../utils/logger';
import { ObjectId } from 'mongodb';
import { config } from '../config/env';

// Export data to CSV/JSON
export const exportData = async (req: Request, res: Response) => {
  try {
    // SECURITY FIX: Validate user authentication
    if (!req.user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // SECURITY FIX: Validate request body
    if (!req.body.entityType) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Entity type is required'
      });
    }

    const validEntityTypes = ['products', 'users', 'orders', 'categories'];
    if (!validEntityTypes.includes(req.body.entityType)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid entity type'
      });
    }

    // SECURITY FIX: Validate export format
    const validFormats = ['csv', 'json'];
    const format = req.body.format || 'csv';
    if (!validFormats.includes(format)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid export format. Only CSV and JSON are supported.'
      });
    }

    // Create export filters from query parameters
    const filters: Record<string, any> = {};
    
    // Date range filter
    if (req.query.startDate) {
      filters.created_at = { $gte: new Date(req.query.startDate as string) };
    }
    
    if (req.query.endDate) {
      filters.created_at = { 
        ...filters.created_at, 
        $lte: new Date(req.query.endDate as string) 
      };
    }
    
    // Status filter (for orders and products)
    if (req.query.status) {
      filters.status = req.query.status;
    }
    
    // Role filter (for users)
    if (req.query.role) {
      filters.role = req.query.role;
    }
    
    // Category filter (for products)
    if (req.query.categoryId) {
      filters.category_id = req.query.categoryId;
    }

    // Create export job
    const exportJob = {
      id: new ObjectId(),
      userId: req.user._id,
      entityType: req.body.entityType,
      format: format,
      filters: filters,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add job to queue
    await exportQueue.add('export', exportJob);

    logger.info('Export job created', { 
      jobId: exportJob.id, 
      userId: req.user._id, 
      entityType: req.body.entityType 
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Export job created successfully',
      data: {
        jobId: exportJob.id,
        status: 'pending',
        entityType: req.body.entityType,
        format: format,
        filters: filters
      }
    });
  } catch (error: any) {
    logger.error('Error creating export job:', error);
    
    // SECURITY FIX: Don't expose internal error details
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to create export job'
    });
  }
};

// Get export job status
export const getExportStatus = async (req: Request, res: Response) => {
  try {
    // SECURITY FIX: Validate user authentication
    if (!req.user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // SECURITY FIX: Validate job ID format
    if (!req.params.jobId || !/^[0-9a-fA-F]{24}$/.test(req.params.jobId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid job ID format'
      });
    }

    // SECURITY FIX: Verify job belongs to user or user has admin role
    const job = await exportQueue.getJob(req.params.jobId);
    if (!job) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Export job not found'
      });
    }

    if (job.data.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        jobId: job.id,
        status: job.data.status,
        progress: job.progress,
        entityType: job.data.entityType,
        format: job.data.format,
        filters: job.data.filters,
        createdAt: job.data.createdAt,
        updatedAt: job.data.updatedAt,
        fileUrl: job.data.fileUrl,
        error: job.failedReason
      }
    });
  } catch (error: any) {
    logger.error('Error getting export status:', error);
    
    // SECURITY FIX: Don't expose internal error details
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to get export status'
    });
  }
};

// Download exported file
export const downloadExport = async (req: Request, res: Response) => {
  try {
    // SECURITY FIX: Validate user authentication
    if (!req.user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // SECURITY FIX: Validate job ID format
    if (!req.params.jobId || !/^[0-9a-fA-F]{24}$/.test(req.params.jobId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid job ID format'
      });
    }

    // SECURITY FIX: Verify job belongs to user or user has admin role
    const job = await exportQueue.getJob(req.params.jobId);
    if (!job) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Export job not found'
      });
    }

    if (job.data.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    // SECURITY FIX: Verify job is completed
    if (job.data.status !== 'completed') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Export job is not completed'
      });
    }

    // SECURITY FIX: Validate file URL
    if (!job.data.fileUrl) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Export file not found'
      });
    }

    // SECURITY FIX: Validate file URL is from trusted domain
    const fileUrl = new URL(job.data.fileUrl);
    if (fileUrl.hostname !== config.SERVER_URL) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Invalid file URL'
      });
    }

    // Redirect to file URL
    res.redirect(job.data.fileUrl);
  } catch (error: any) {
    logger.error('Error downloading export file:', error);
    
    // SECURITY FIX: Don't expose internal error details
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to download export file'
    });
  }
};

// Cancel export job
export const cancelExport = async (req: Request, res: Response) => {
  try {
    // SECURITY FIX: Validate user authentication
    if (!req.user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // SECURITY FIX: Validate job ID format
    if (!req.params.jobId || !/^[0-9a-fA-F]{24}$/.test(req.params.jobId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid job ID format'
      });
    }

    // SECURITY FIX: Verify job belongs to user or user has admin role
    const job = await exportQueue.getJob(req.params.jobId);
    if (!job) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Export job not found'
      });
    }

    if (job.data.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    // SECURITY FIX: Only allow cancellation of pending jobs
    if (job.data.status !== 'pending') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Cannot cancel job that is not pending'
      });
    }

    // Remove job from queue
    await job.remove();

    logger.info('Export job cancelled', { 
      jobId: req.params.jobId, 
      userId: req.user._id 
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Export job cancelled successfully'
    });
  } catch (error: any) {
    logger.error('Error cancelling export job:', error);
    
    // SECURITY FIX: Don't expose internal error details
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to cancel export job'
    });
  }
};
```

```typescript