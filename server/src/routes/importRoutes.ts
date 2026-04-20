```ts
import { Router } from 'express';
import multer from 'multer';
import { protect, admin } from '../middleware/auth';
import { importProducts, importUsers, importOrders } from '../controllers/importController';
import { importProductsJob, importUsersJob, importOrdersJob } from '../jobs/importJobs';

const router = Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

/**
 * POST /api/admin/import/products
 * Import products from CSV/JSON file
 */
router.post('/products', protect, admin, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Validate file type
    const fileExtension = req.file.originalname.split('.').pop()?.toLowerCase();
    if (!['csv', 'json'].includes(fileExtension || '')) {
      return res.status(400).json({ message: 'Invalid file format. Please upload CSV or JSON file.' });
    }

    // For small files, process immediately
    if (req.file.size < 1 * 1024 * 1024) { // 1MB
      const result = await importProducts(req.file.buffer, fileExtension, req.user);
      return res.json(result);
    }

    // For large files, queue for background processing
    const job = await importProductsJob({
      fileBuffer: req.file.buffer,
      fileExtension,
      userId: req.user.id,
      fileName: req.file.originalname
    });

    res.json({
      message: 'Import started successfully',
      jobId: job.id,
      status: 'queued',
      progress: 0
    });
  } catch (error: any) {
    console.error('Import products error:', error);
    res.status(500).json({ 
      message: 'Failed to process import',
      error: error.message 
    });
  }
});

/**
 * POST /api/admin/import/users
 * Import users from CSV/JSON file
 */
router.post('/users', protect, admin, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileExtension = req.file.originalname.split('.').pop()?.toLowerCase();
    if (!['csv', 'json'].includes(fileExtension || '')) {
      return res.status(400).json({ message: 'Invalid file format. Please upload CSV or JSON file.' });
    }

    if (req.file.size < 1 * 1024 * 1024) {
      const result = await importUsers(req.file.buffer, fileExtension, req.user);
      return res.json(result);
    }

    const job = await importUsersJob({
      fileBuffer: req.file.buffer,
      fileExtension,
      userId: req.user.id,
      fileName: req.file.originalname
    });

    res.json({
      message: 'Import started successfully',
      jobId: job.id,
      status: 'queued',
      progress: 0
    });
  } catch (error: any) {
    console.error('Import users error:', error);
    res.status(500).json({ 
      message: 'Failed to process import',
      error: error.message 
    });
  }
});

/**
 * POST /api/admin/import/orders
 * Import orders from CSV/JSON file
 */
router.post('/orders', protect, admin, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileExtension = req.file.originalname.split('.').pop()?.toLowerCase();
    if (!['csv', 'json'].includes(fileExtension || '')) {
      return res.status(400).json({ message: 'Invalid file format. Please upload CSV or JSON file.' });
    }

    if (req.file.size < 1 * 1024 * 1024) {
      const result = await importOrders(req.file.buffer, fileExtension, req.user);
      return res.json(result);
    }

    const job = await importOrdersJob({
      fileBuffer: req.file.buffer,
      fileExtension,
      userId: req.user.id,
      fileName: req.file.originalname
    });

    res.json({
      message: 'Import started successfully',
      jobId: job.id,
      status: 'queued',
      progress: 0
    });
  } catch (error: any) {
    console.error('Import orders error:', error);
    res.status(500).json({ 
      message: 'Failed to process import',
      error: error.message 
    });
  }
});

export default router;
```