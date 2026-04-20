```ts
import { Router } from 'express';
import { protect, admin, seller } from '../middleware/auth';
import { exportProducts, exportUsers, exportOrders } from '../controllers/exportController';
import { exportProductsJob, exportUsersJob, exportOrdersJob } from '../jobs/exportJobs';

const router = Router();

/**
 * GET /api/admin/export/products
 * Export products to CSV/JSON
 */
router.get('/products', protect, admin, async (req, res) => {
  try {
    const { format = 'csv', category, brand, status, minPrice, maxPrice } = req.query;
    
    // Validate format
    if (!['csv', 'json'].includes(format as string)) {
      return res.status(400).json({ message: 'Invalid format. Use csv or json.' });
    }

    // For small datasets, export immediately
    const filter = {
      category: category as string,
      brand: brand as string,
      status: status as string,
      minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
      maxPrice: undefined,
    };

    // Check if dataset is small enough for immediate export
    const result = await exportProducts(format as 'csv' | 'json', filter, req.user);
    
    if (result.data && result.data.length < 1000) {
      // Small dataset - send immediately
      res.setHeader('Content-Type', result.contentType);
      res.setHeader('Content-Disposition', result.contentDisposition);
      return res.send(result.data);
    }

    // Large dataset - queue for background processing
    const job = await exportProductsJob({
      format: format as 'csv' | 'json',
      filter,
      userId: req.user.id
    });

    res.json({
      message: 'Export started successfully',
      jobId: job.id,
      status: 'queued',
      downloadUrl: null
    });
  } catch (error: any) {
    console.error('Export products error:', error);
    res.status(500).json({ 
      message: 'Failed to process export',
      error: error.message 
    });
  }
});

/**
 * GET /api/admin/export/users
 * Export users to CSV/JSON
 */
router.get('/users', protect, admin, async (req, res) => {
  try {
    const { format = 'csv', role, minCreatedDate, maxCreatedDate } = req.query;
    
    if (!['csv', 'json'].includes(format as string)) {
      return res.status(400).json({ message: 'Invalid format. Use csv or json.' });
    }

    const filter = {
      role: role as string,
      minCreatedDate: minCreatedDate ? new Date(minCreatedDate as string) : undefined,
      maxCreatedDate: maxCreatedDate ? new Date(maxCreatedDate as string) : undefined,
    };

    const result = await exportUsers(format as 'csv' | 'json', filter, req.user);
    
    if (result.data && result.data.length < 1000) {
      res.setHeader('Content-Type', result.contentType);
      res.setHeader('Content-Disposition', result.contentDisposition);
      return res.send(result.data);
    }

    const job = await exportUsersJob({
      format: format as 'csv' | 'json',
      filter,
      userId: req.user.id
    });

    res.json({
      message: 'Export started successfully',
      jobId: job.id,
      status: 'queued',
      downloadUrl: null
    });
  } catch (error: any) {
    console.error('Export users error:', error);
    res.status(500).json({ 
      message: 'Failed to process export',
      error: error.message 
    });
  }
});

/**
 * GET /api/admin/export/orders
 * Export orders to CSV/JSON
 */
router.get('/orders', protect, admin, async (req, res) => {
  try {
    const { format = 'csv', status, minDate, maxDate, minAmount, maxAmount } = req.query;
    
    if (!['csv', 'json'].includes(format as string)) {
      return res.status(400).json({ message: 'Invalid format. Use csv or json.' });
    }

    const filter = {
      status: status as string,
      minDate: minDate ? new Date(minDate as string) : undefined,
      maxDate: maxDate ? new Date(maxDate as string) : undefined,
      minAmount: minAmount ? parseFloat(minAmount as string) : undefined,
      maxAmount: maxAmount ? parseFloat(maxAmount as string) : undefined,
    };

    const result = await exportOrders(format as 'csv' | 'json', filter, req.user);
    
    if (result.data && result.data.length < 1000) {
      res.setHeader('Content-Type', result.contentType);
      res.setHeader('Content-Disposition', result.contentDisposition);
      return res.send(result.data);
    }

    const job = await exportOrdersJob({
      format: format as 'csv' | 'json',
      filter,
      userId: req.user.id
    });

    res.json({
      message: 'Export started successfully',
      jobId: job.id,
      status: 'queued',
      downloadUrl: null
    });
  } catch (error: any) {
    console.error('Export orders error:', error);
    res.status(500).json({ 
      message: 'Failed to process export',
      error: error.message 
    });
  }
});

/**
 * GET /api/seller/export/orders
 * Export seller orders to CSV/JSON
 */
router.get('/orders/seller', protect, seller, async (req, res) => {
  try {
    const { format = 'csv', status, minDate, maxDate } = req.query;
    
    if (!['csv', 'json'].includes(format as string)) {
      return res.status(400).json({ message: 'Invalid format. Use csv or json.' });
    }

    const filter = {
      status: status as string,
      minDate: minDate ? new Date(minDate as string) : undefined,
      maxDate: maxDate ? new Date(maxDate as string) : undefined,
    };

    const result = await exportOrders(format as 'csv' | 'json', filter, req.user, true);
    
    if (result.data && result.data.length < 1000) {
      res.setHeader('Content-Type', result.contentType);
      res.setHeader('Content-Disposition', result.contentDisposition);
      return res.send(result.data);
    }

    const job = await exportOrdersJob({
      format: format as 'csv' | 'json',
      filter,
      userId: req.user.id,
      isSeller: true
    });

    res.json({
      message: 'Export started successfully',
      jobId: job.id,
      status: 'queued',
      downloadUrl: null
    });
  } catch (error: any) {
    console.error('Export seller orders error:', error);
    res.status(500).json({ 
      message: 'Failed to process export',
      error: error.message 
    });
  }
});

export default router;
```