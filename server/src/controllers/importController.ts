import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CSVParser } from '../utils/csvParser';
import { JSONValidator } from '../utils/jsonValidator';
import { importQueue } from '../jobs/queue';
import { logger } from '../utils/logger';
import multer from 'multer';
import path from 'path';

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, '/tmp');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  }),
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.csv' || ext === '.json') {
      cb(null, true);
    } else {
      cb(new Error('Only CSV and JSON files are allowed'));
    }
  }
});

/**
 * @desc    Preview CSV file before import
 * @route   POST /api/admin/import/preview
 * @access  Private (Admin)
 */
export const previewCSV = [
  upload.single('file'),
  async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    try {
      const result = await CSVParser.previewCSV(req.file.path);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error: any) {
      logger.error({
        correlationId: req.id,
        error: error.message,
        stack: error.stack,
        message: 'CSV preview failed'
      });
      
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Failed to preview CSV file'
      });
    } finally {
      // Clean up uploaded file
      if (req.file && req.file.path) {
        const fs = require('fs');
        fs.unlink(req.file.path, () => {});
      }
    }
  }
];

/**
 * @desc    Import products from CSV file
 * @route   POST /api/admin/import/csv
 * @access  Private (Admin)
 */
export const importCSV = [
  upload.single('file'),
  async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    try {
      // Add job to queue
      const job = await importQueue.add('csv-import', {
        filePath: req.file.path,
        userId: req.user.id
      }, {
        removeOnComplete: true,
        removeOnFail: 1000,
      });

      res.json({
        success: true,
        message: 'CSV import started',
        jobId: job.id
      });
    } catch (error: any) {
      logger.error({
        correlationId: req.id,
        error: error.message,
        stack: error.stack,
        message: 'CSV import failed to queue'
      });
      
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Failed to start CSV import'
      });
    } finally {
      // Clean up uploaded file
      if (req.file && req.file.path) {
        const fs = require('fs');
        fs.unlink(req.file.path, () => {});
      }
    }
  }
];

/**
 * @desc    Import products from JSON data
 * @route   POST /api/admin/import/json
 * @access  Private (Admin)
 */
export const importJSON = async (req: Request, res: Response) => {
  const { data } = req.body;

  if (!data) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'No data provided'
    });
  }

  try {
    // Add job to queue
    const job = await importQueue.add('json-import', {
      jsonData: data,
      userId: req.user.id
    }, {
      removeOnComplete: true,
      removeOnFail: 1000,
    });

    res.json({
      success: true,
      message: 'JSON import started',
      jobId: job.id
    });
  } catch (error: any) {
    logger.error({
      correlationId: req.id,
      error: error.message,
      stack: error.stack,
      message: 'JSON import failed to queue'
    });
    
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || 'Failed to start JSON import'
    });
  }
};

/**
 * @desc    Get import job status
 * @route   GET /api/admin/import/status/:jobId
 * @access  Private (Admin)
 */
export const getImportStatus = async (req: Request, res: Response) => {
  const { jobId } = req.params;

  try {
    const job = await importQueue.getJob(jobId);
    
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
      message: 'Failed to get import job status'
    });
    
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || 'Failed to get import job status'
    });
  }
};

/**
 * @desc    Validate JSON data before import
 * @route   POST /api/admin/import/json/validate
 * @access  Private (Admin)
 */
export const validateJSON = async (req: Request, res: Response) => {
  const { data } = req.body;

  if (!data) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'No data provided'
    });
  }

  try {
    const result = await JSONValidator.importFromJSON(data, { validateOnly: true });
    
    res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    logger.error({
      correlationId: req.id,
      error: error.message,
      stack: error.stack,
      message: 'JSON validation failed'
    });
    
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: error.message || 'JSON validation failed'
    });
  }
};
```

```typescript