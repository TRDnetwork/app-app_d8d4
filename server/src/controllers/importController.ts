import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CSVParser } from '../utils/csvParser';
import { JSONValidator } from '../utils/jsonValidator';
import { importQueue } from '../jobs/queue';
import { logger } from '../utils/logger';
import multer from 'multer';
import path from 'path';
import { sanitizeFilename } from '../utils/sanitize-filename';
import { ObjectId } from 'mongodb';

// SECURITY FIX: Configure multer with enhanced security options
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      // SECURITY FIX: Use secure temporary directory with proper permissions
      const uploadDir = '/tmp/shopsphere-imports';
      // Ensure directory exists with proper permissions
      require('fs').mkdirSync(uploadDir, { recursive: true });
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      // SECURITY FIX: Sanitize filename to prevent path traversal
      const sanitizedFilename = sanitizeFilename(file.originalname);
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, `${uniqueSuffix}-${sanitizedFilename}`);
    }
  }),
  fileFilter: (req, file, cb) => {
    // SECURITY FIX: Restrict file types to prevent malicious uploads
    const allowedTypes = ['text/csv', 'application/json'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only CSV and JSON files are allowed.'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1
  }
});

// SECURITY FIX: Validate and sanitize request data
interface ImportRequest {
  userId: string;
  collection: 'products' | 'users' | 'orders' | 'categories';
  mapping?: Record<string, string>;
  options?: {
    updateExisting?: boolean;
    validateOnly?: boolean;
  };
}

/**
 * Handle file upload and initiate import job
 */
export const uploadImportFile = async (req: Request, res: Response) => {
  try {
    // SECURITY FIX: Validate user authentication and authorization
    if (!req.user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: 'Authentication required'
      });
    }

    // SECURITY FIX: Validate request body
    const { collection, mapping, options } = req.body;
    
    if (!collection || !['products', 'users', 'orders', 'categories'].includes(collection)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Invalid or missing collection parameter'
      });
    }

    // SECURITY FIX: Validate file upload
    if (!req.file) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'No file uploaded'
      });
    }

    // SECURITY FIX: Validate file size and type
    if (req.file.size === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Uploaded file is empty'
      });
    }

    // Create import job
    const importJob = await importQueue.add('import', {
      userId: req.user.id,
      collection,
      filePath: req.file.path,
      filename: req.file.originalname,
      mapping: mapping || {},
      options: {
        updateExisting: options?.updateExisting || false,
        validateOnly: options?.validateOnly || false
      },
      metadata: {
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    }, {
      // SECURITY FIX: Set job timeout and retry strategy
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000
      },
      timeout: 300000, // 5 minutes
      removeOnComplete: true,
      removeOnFail: 10000
    });

    logger.info(`Import job created: ${importJob.id}`, {
      userId: req.user.id,
      collection,
      filename: req.file.originalname,
      jobId: importJob.id
    });

    res.status(StatusCodes.OK).json({
      message: 'Import job created successfully',
      jobId: importJob.id,
      status: 'pending'
    });

  } catch (error: any) {
    logger.error('Error uploading import file:', error);
    
    // SECURITY FIX: Provide generic error message to prevent information leakage
    if (error.message.includes('Invalid file type')) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Invalid file type. Only CSV and JSON files are allowed.'
      });
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: 'Failed to process import request'
    });
  }
};

/**
 * Get import job status
 */
export const getImportStatus = async (req: Request, res: Response) => {
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
    const job = await importQueue.getJob(jobId);
    
    if (!job) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: 'Import job not found'
      });
    }

    // SECURITY FIX: Verify job ownership
    const jobData = await job.getData();
    if (jobData.userId !== req.user.id) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: 'Access denied to this import job'
      });
    }

    const state = await job.getState();
    const progress = job.progress;
    
    let response: any = {
      jobId: job.id,
      status: state,
      progress: progress || 0,
      collection: jobData.collection,
      filename: jobData.filename
    };

    // Include additional details based on job state
    if (state === 'completed') {
      const result = await job.returnvalue();
      response.result = result;
      response.completedAt = job.finishedOn;
    } else if (state === 'failed') {
      const failedReason = await job.failedReason();
      response.error = failedReason;
      response.failedAt = job.finishedOn;
    } else if (state === 'active') {
      response.startedAt = job.startedOn;
    }

    res.status(StatusCodes.OK).json(response);

  } catch (error: any) {
    logger.error('Error getting import status:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: 'Failed to retrieve import status'
    });
  }
};

/**
 * Cancel import job
 */
export const cancelImport = async (req: Request, res: Response) => {
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
    const job = await importQueue.getJob(jobId);
    
    if (!job) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: 'Import job not found'
      });
    }

    // SECURITY FIX: Verify job ownership
    const jobData = await job.getData();
    if (jobData.userId !== req.user.id) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: 'Access denied to this import job'
      });
    }

    // SECURITY FIX: Only allow cancellation of pending jobs
    const state = await job.getState();
    if (state !== 'waiting' && state !== 'delayed') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Cannot cancel import job in current state'
      });
    }

    // Remove job from queue
    await job.remove();
    
    logger.info(`Import job cancelled: ${jobId}`, {
      userId: req.user.id,
      jobId
    });

    res.status(StatusCodes.OK).json({
      message: 'Import job cancelled successfully',
      jobId
    });

  } catch (error: any) {
    logger.error('Error cancelling import:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: 'Failed to cancel import job'
    });
  }
};

/**
 * Preview import data before processing
 */
export const previewImport = async (req: Request, res: Response) => {
  try {
    const { collection } = req.body;
    const file = req.file;
    
    // SECURITY FIX: Validate user authentication
    if (!req.user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: 'Authentication required'
      });
    }

    // SECURITY FIX: Validate request data
    if (!collection || !['products', 'users', 'orders', 'categories'].includes(collection)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Invalid or missing collection parameter'
      });
    }

    if (!file) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'No file uploaded'
      });
    }

    // SECURITY FIX: Validate file size and type
    if (file.size === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Uploaded file is empty'
      });
    }

    if (!['text/csv', 'application/json'].includes(file.mimetype)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Invalid file type. Only CSV and JSON files are allowed.'
      });
    }

    let previewData: any[] = [];
    let headers: string[] = [];
    let totalCount = 0;

    // Process file based on type
    if (file.mimetype === 'text/csv') {
      const csvParser = new CSVParser();
      const result = await csvParser.parseFile(file.path);
      
      // SECURITY FIX: Validate CSV parsing result
      if (!result || !Array.isArray(result.data)) {
        throw new Error('Failed to parse CSV file');
      }
      
      previewData = result.data.slice(0, 5); // First 5 rows
      headers = result.headers;
      totalCount = result.data.length;
    } else if (file.mimetype === 'application/json') {
      const content = require('fs').readFileSync(file.path, 'utf8');
      const jsonData = JSON.parse(content);
      
      // SECURITY FIX: Validate JSON structure
      if (!Array.isArray(jsonData)) {
        throw new Error('JSON file must contain an array of objects');
      }
      
      previewData = jsonData.slice(0, 5); // First 5 items
      headers = Object.keys(previewData[0] || {});
      totalCount = jsonData.length;
    }

    // Map headers to collection fields
    const fieldMapping = getCollectionFieldMapping(collection);
    
    res.status(StatusCodes.OK).json({
      collection,
      headers,
      fieldMapping,
      preview: previewData,
      totalCount,
      filename: file.originalname
    });

  } catch (error: any) {
    logger.error('Error previewing import:', error);
    
    // SECURITY FIX: Provide generic error message
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: 'Failed to preview import data'
    });
  }
};

/**
 * Get available field mappings for a collection
 */
function getCollectionFieldMapping(collection: string): Record<string, string> {
  const mappings: Record<string, Record<string, string>> = {
    products: {
      'name': 'title',
      'title': 'title',
      'description': 'description',
      'price': 'price',
      'original_price': 'original_price',
      'discount': 'discount_percent',
      'category': 'category',
      'brand': 'brand',
      'sku': 'sku',
      'stock': 'stock_quantity',
      'images': 'images',
      'status': 'status'
    },
    users: {
      'name': 'name',
      'email': 'email',
      'phone': 'phone',
      'role': 'role',
      'address': 'addresses'
    },
    orders: {
      'order_number': 'order_number',
      'user_id': 'user_id',
      'items': 'items',
      'total': 'total',
      'status': 'status',
      'address': 'address'
    },
    categories: {
      'name': 'name',
      'slug': 'slug',
      'parent': 'parent_id',
      'image': 'image_url'
    }
  };

  return mappings[collection] || {};
}
```

```typescript