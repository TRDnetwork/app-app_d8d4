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
import { config } from '../config/env';

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

// Column mapping configuration for different entity types
const COLUMN_MAPPINGS = {
  products: {
    required: ['title', 'price', 'category'],
    optional: ['description', 'brand', 'sku', 'stock_quantity', 'images'],
    mapping: {
      'title': 'title',
      'name': 'title',
      'price': 'price',
      'cost': 'price',
      'original_price': 'original_price',
      'discount_percent': 'discount_percent',
      'description': 'description',
      'desc': 'description',
      'category': 'category',
      'category_id': 'category_id',
      'brand': 'brand',
      'sku': 'sku',
      'stock': 'stock_quantity',
      'stock_quantity': 'stock_quantity',
      'images': 'images',
      'image_urls': 'images',
      'status': 'status'
    }
  },
  users: {
    required: ['email', 'name'],
    optional: ['phone', 'role'],
    mapping: {
      'email': 'email',
      'name': 'name',
      'full_name': 'name',
      'first_name': 'name',
      'phone': 'phone',
      'mobile': 'phone',
      'role': 'role',
      'user_role': 'role'
    }
  },
  orders: {
    required: ['user_id', 'total', 'items'],
    optional: ['status', 'delivery_speed'],
    mapping: {
      'user_id': 'user_id',
      'customer_id': 'user_id',
      'total': 'total',
      'subtotal': 'subtotal',
      'delivery_charge': 'delivery_charge',
      'items': 'items',
      'order_items': 'items',
      'status': 'status',
      'delivery_speed': 'delivery_speed'
    }
  },
  categories: {
    required: ['name'],
    optional: ['description', 'parent_id'],
    mapping: {
      'name': 'name',
      'slug': 'slug',
      'description': 'description',
      'parent_id': 'parent_id',
      'parent_category': 'parent_id'
    }
  }
};

/**
 * Upload and preview import file
 * Shows first 5 rows for validation before import
 */
export const uploadImportFile = async (req: Request, res: Response) => {
  try {
    // SECURITY FIX: Validate user role for import operations
    if (!req.user || !['admin', 'seller'].includes(req.user.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: 'Insufficient permissions to perform import'
      });
    }

    // Use multer to handle file upload
    upload.single('file')(req, res, async (err) => {
      if (err) {
        logger.error('File upload error:', err);
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: err.message || 'File upload failed'
        });
      }

      if (!req.file) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: 'No file provided'
        });
      }

      const { entity_type } = req.body;
      
      if (!entity_type || !COLUMN_MAPPINGS[entity_type]) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: 'Invalid or missing entity type'
        });
      }

      const filePath = req.file.path;
      const fileExtension = path.extname(req.file.originalname).toLowerCase();

      let previewData;
      let columnSuggestions = {};

      try {
        // Parse file based on type
        if (fileExtension === '.csv') {
          const parser = new CSVParser();
          previewData = await parser.parseCSV(filePath, 5);
          columnSuggestions = parser.suggestColumnMapping(previewData[0], entity_type);
        } else if (fileExtension === '.json') {
          const validator = new JSONValidator();
          previewData = await validator.parseJSON(filePath, 5);
          columnSuggestions = validator.suggestColumnMapping(previewData[0], entity_type);
        } else {
          return res.status(StatusCodes.BAD_REQUEST).json({
            error: 'Unsupported file format. Please use CSV or JSON.'
          });
        }

        // Validate required columns
        const requiredColumns = COLUMN_MAPPINGS[entity_type].required;
        const missingColumns = requiredColumns.filter(col => 
          !Object.values(columnSuggestions).includes(col)
        );

        res.status(StatusCodes.OK).json({
          success: true,
          file_id: path.basename(filePath),
          entity_type,
          preview: previewData,
          suggested_mapping: columnSuggestions,
          missing_required_columns: missingColumns,
          total_rows: previewData.length
        });

      } catch (parseError: any) {
        logger.error('File parsing error:', parseError);
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: parseError.message || 'Failed to parse file'
        });
      }
    });

  } catch (error: any) {
    logger.error('Upload import file error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: 'Failed to process import file'
    });
  }
};

/**
 * Start import process with column mapping
 * Uses background job queue for large files
 */
export const startImport = async (req: Request, res: Response) => {
  try {
    // SECURITY FIX: Validate user role
    if (!req.user || !['admin', 'seller'].includes(req.user.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: 'Insufficient permissions to perform import'
      });
    }

    const { file_id, entity_type, column_mapping, update_existing = false } = req.body;

    // Validate required fields
    if (!file_id || !entity_type || !column_mapping) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Missing required fields: file_id, entity_type, column_mapping'
      });
    }

    if (!COLUMN_MAPPINGS[entity_type]) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Invalid entity type'
      });
    }

    // Validate column mapping
    const requiredColumns = COLUMN_MAPPINGS[entity_type].required;
    const missingMapping = requiredColumns.filter(col => 
      !Object.values(column_mapping).includes(col)
    );

    if (missingMapping.length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: `Missing required column mappings: ${missingMapping.join(', ')}`
      });
    }

    // SECURITY FIX: Validate file path to prevent directory traversal
    const sanitizedFileId = sanitizeFilename(file_id);
    const filePath = path.join('/tmp/shopsphere-imports', sanitizedFileId);

    // Check if file exists
    try {
      await require('fs').promises.access(filePath);
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Import file not found or expired'
      });
    }

    // Create import job
    const importJob = await importQueue.add('import', {
      filePath,
      entity_type,
      column_mapping,
      update_existing,
      user_id: req.user.id,
      file_id: sanitizedFileId
    }, {
      removeOnComplete: true,
      removeOnFail: 5
    });

    logger.info('Import job created', {
      jobId: importJob.id,
      entity_type,
      user_id: req.user.id,
      file_id: sanitizedFileId
    });

    res.status(StatusCodes.ACCEPTED).json({
      success: true,
      message: 'Import process started',
      job_id: importJob.id,
      entity_type,
      status: 'pending'
    });

  } catch (error: any) {
    logger.error('Start import error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: 'Failed to start import process'
    });
  }
};

/**
 * Get import status
 * Pollable endpoint for frontend to check import progress
 */
export const getImportStatus = async (req: Request, res: Response) => {
  try {
    const { job_id } = req.params;

    if (!job_id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Job ID is required'
      });
    }

    const job = await importQueue.getJob(job_id);

    if (!job) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: 'Import job not found'
      });
    }

    const jobStatus = await job.getState();
    const progress = job.progress;

    let responseStatus;
    switch (jobStatus) {
      case 'completed':
        responseStatus = 'completed';
        break;
      case 'failed':
        responseStatus = 'failed';
        break;
      case 'delayed':
      case 'waiting':
        responseStatus = 'pending';
        break;
      case 'active':
        responseStatus = 'processing';
        break;
      default:
        responseStatus = jobStatus;
    }

    // Get job result if available
    let result = null;
    if (jobStatus === 'completed' || jobStatus === 'failed') {
      result = await job.finished();
    }

    res.status(StatusCodes.OK).json({
      job_id,
      status: responseStatus,
      progress,
      result,
      created_at: job.timestamp,
      updated_at: Date.now()
    });

  } catch (error: any) {
    logger.error('Get import status error:', error);
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
    const { job_id } = req.params;

    if (!job_id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Job ID is required'
      });
    }

    const job = await importQueue.getJob(job_id);

    if (!job) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: 'Import job not found'
      });
    }

    const jobStatus = await job.getState();

    // Only allow cancellation of pending or active jobs
    if (!['waiting', 'active', 'delayed'].includes(jobStatus)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Cannot cancel job in current state'
      });
    }

    await job.remove();

    logger.info('Import job cancelled', {
      job_id,
      user_id: req.user?.id
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Import job cancelled successfully'
    });

  } catch (error: any) {
    logger.error('Cancel import error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: 'Failed to cancel import job'
    });
  }
};
```

```typescript