import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { JSONValidator } from '../utils/jsonValidator';
import { exportQueue } from '../jobs/queue';
import { logger } from '../utils/logger';
import fs from 'fs';
import path from 'path';

/**
 * @desc    Export products to CSV
 * @route   POST /api/admin/export/csv
 * @access  Private (Admin)
 */
export const exportCSV = async (req: Request, res: Response) => {
  const { filter = {} } = req.body;

  try {
    // Add job to queue
    const job = await exportQueue.add('csv-export', {
      filter,
      userId: req.user.id
    }, {
      removeOnComplete: true,
      removeOnFail: 1000,
    });

    res.json({
      success: true,
      message: 'CSV export started',
      jobId: job.id
    });
  } catch (error: any) {
    logger.error({
      correlationId: req.id,
      error: error.message,
      stack: error.stack,
      message: 'CSV export failed to queue'
    });
    
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || 'Failed to start CSV export'
    });
  }
};

/**
 * @desc    Export products to JSON
 * @route   POST /api/admin/export/json
 * @access  Private (Admin)
 */
export const exportJSON = async (req: Request, res: Response) => {
  const { filter = {} } = req.body;

  try {
    // Add job to queue
    const job = await exportQueue.add('json-export', {
      filter,
      userId: req.user.id
    }, {
      removeOnComplete: true,
      removeOnFail: 1000,
    });

    res.json({
      success: true,
      message: 'JSON export started',
      jobId: job.id
    });
  } catch (error: any) {
    logger.error({
      correlationId: req.id,
      error: error.message,
      stack: error.stack,
      message: 'JSON export failed to queue'
    });
    
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || 'Failed to start JSON export'
    });
  }
};

/**
 * @desc    Get export job status
 * @route   GET /api/admin/export/status/:jobId
 * @access  Private (Admin)
 */
export const getExportStatus = async (req: Request, res: Response) => {
  const { jobId } = req.params;

  try {
    const job = await exportQueue.getJob(jobId);
    
    if (!job) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Job not found'
      });
    }

    const state = await job.getState();
    const progress = job.progress;
    
    let result = null;
    if (state === 'completed') {
      result = await job.finished();
    }

    res.json({
      success: true,
      data: {
        id: job.id,
        name: job.name,
        data: job.data,
        state,
        progress,
        result,
        timestamp: job.timestamp,
        processedOn: job.processedOn,
        finishedOn: job.finishedOn
      }
    });
  } catch (error: any) {
    logger.error({
      correlationId: req.id,
      error: error.message,
      stack: error.stack,
      message: 'Failed to get export job status'
    });
    
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || 'Failed to get export job status'
    });
  }
};

/**
 * @desc    Download exported file
 * @route   GET /api/admin/export/download/:jobId
 * @access  Private (Admin)
 */
export const downloadExport = async (req: Request, res: