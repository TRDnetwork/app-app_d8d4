import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CSVParser } from '../utils/csvParser';
import { JSONValidator } from '../utils/jsonValidator';
import { importQueue } from '../jobs/queue';
import { logger } from '../utils/logger';
import multer from 'multer';
import path from 'path';
import { sanitizeFilename, validateFileExtension } from '../utils/sanitize-filename';
import { ObjectId } from 'mongodb';
import { config } from '../config/env';

// SECURITY FIX: Configure multer with enhanced security options
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      // SECURITY FIX: Use secure temporary directory with proper permissions
      const uploadDir = config.UPLOAD_DIR || '/tmp/shopsphere-imports';
      // Ensure directory exists with proper permissions
      require('fs').mkdirSync(uploadDir, { recursive: true, mode: 0o700 });
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

// Import data from CSV/JSON file
export const importData = async (req: Request, res: Response) => {
  try {
    // SECURITY FIX: Validate user authentication and role
    if (!req.user || !['admin', 'seller'].includes(req.user.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Insufficient permissions'
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

    // SECURITY FIX: Validate file upload
    if (!req.file) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'File is required'
      });
    }

    // SECURITY FIX: Validate file size
    if (req.file.size > 10 * 1024 * 1024) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'File size exceeds 10MB limit'
      });
    }

    // SECURITY FIX: Validate file extension
    const fileExt = path.extname(req.file.originalname).toLowerCase();
    if (!['.csv', '.json'].includes(fileExt)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid file extension. Only CSV and JSON files are allowed.'
      });
    }

    // Create import job
    const importJob = {
      id: new ObjectId(),
      userId: req.user._id,
      entityType: req.body.entityType,
      fileName: req.file.filename,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add job to queue
    await importQueue.add('import', importJob);

    logger.info('Import job created', { 
      jobId: importJob.id, 
      userId: req.user._id, 
      entityType: req.body.entityType 
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Import job created successfully',
      data: {
        jobId: importJob.id,
        status: 'pending',
        entityType: req.body.entityType,
        fileName: req.file.originalname,
        fileSize: req.file.size
      }
    });
  } catch (error: any) {
    logger.error('Error creating import job:', error);
    
    // SECURITY FIX: Don't expose internal error details
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to create import job'
    });
  }
};

// Preview import data
export const previewImport = async (req: Request, res: Response) => {
  try {
    // SECURITY FIX: Validate user authentication and role
    if (!req.user || !['admin', 'seller'].includes(req.user.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    // SECURITY FIX: Validate request body
    if (!req.body.entityType || !req.body.file) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Entity type and file are required'
      });
    }

    const validEntityTypes = ['products', 'users', 'orders', 'categories'];
    if (!validEntityTypes.includes(req.body.entityType)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid entity type'
      });
    }

    // SECURITY FIX: Validate file data
    if (!req.body.file.content || !req.body.file.mimeType) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'File content and MIME type are required'
      });
    }

    const { content, mimeType } = req.body.file;

    // Parse file content based on MIME type
    let parsedData;
    if (mimeType === 'text/csv') {
      parsedData = await CSVParser.parse(content);
    } else if (mimeType === 'application/json') {
      parsedData = JSONValidator.validateAndParse(content);
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid file type. Only CSV and JSON files are allowed.'
      });
    }

    // SECURITY FIX: Limit preview to first 5 rows
    const previewData = parsedData.slice(0, 5);

    // Map columns based on entity type
    const columnMapping = getColumnMapping(req.body.entityType);

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        preview: previewData,
        columnMapping,
        totalRows: parsedData.length
      }
    });
  } catch (error: any) {
    logger.error('Error previewing import data:', error);
    
    // SECURITY FIX: Don't expose internal error details
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to preview import data'
    });
  }
};

// Get import job status
export const getImportStatus = async (req: Request, res: Response) => {
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
    const job = await importQueue.getJob(req.params.jobId);
    if (!job) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Import job not found'
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
        fileName: job.data.fileName,
        createdAt: job.data.createdAt,
        updatedAt: job.data.updatedAt,
        error: job.failedReason
      }
    });
  } catch (error: any) {
    logger.error('Error getting import status:', error);
    
    // SECURITY FIX: Don't expose internal error details
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to get import status'
    });
  }
};

// Cancel import job
export const cancelImport = async (req: Request, res: Response) => {
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
    const job = await importQueue.getJob(req.params.jobId);
    if (!job) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Import job not found'
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

    logger.info('Import job cancelled', { 
      jobId: req.params.jobId, 
      userId: req.user._id 
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Import job cancelled successfully'
    });
  } catch (error: any) {
    logger.error('Error cancelling import job:', error);
    
    // SECURITY FIX: Don't expose internal error details
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to cancel import job'
    });
  }
};

// Helper function to get column mapping based on entity type
const getColumnMapping = (entityType: string) => {
  const mappings: Record<string, Record<string, string>> = {
    products: {
      title: 'Title',
      slug: 'Slug',
      description: 'Description',
      price: 'Price',
      original_price: 'Original Price',
      discount_percent: 'Discount Percent',
      sku: 'SKU',
      stock_quantity: 'Stock Quantity',
      brand: 'Brand',
      category_id: 'Category ID',
      seller_id: 'Seller ID',
      status: 'Status',
      is_featured: 'Is Featured',
      is_sponsored: 'Is Sponsored'
    },
    users: {
      email: 'Email',
      name: 'Name',
      phone: 'Phone',
      role: 'Role',
      profile_picture_url: 'Profile Picture URL',
      email_verified: 'Email Verified',
      loyalty_points: 'Loyalty Points'
    },
    orders: {
      user_id: 'User ID',
      order_number: 'Order Number',
      items: 'Items',
      address: 'Address',
      delivery_speed: 'Delivery Speed',
      payment_method: 'Payment Method',
      subtotal: 'Subtotal',
      discount: 'Discount',
      delivery_charge: 'Delivery Charge',
      total: 'Total',
      status: 'Status',
      tracking_number: 'Tracking Number'
    },
    categories: {
      name: 'Name',
      slug: 'Slug',
      parent_id: 'Parent ID',
      image_url: 'Image URL',
      order: 'Order'
    }
  };

  return mappings[entityType] || {};
};

// Export upload middleware
export const uploadMiddleware = upload.single('file');
```

```typescript