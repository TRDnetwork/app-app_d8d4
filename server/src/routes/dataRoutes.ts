import { Router } from 'express';
import multer from 'multer';
import { createReadStream } from 'fs';
import { parse } from 'csv-parse';
import { stringify } from 'csv-stringify';
import { Product } from '../models/Product';
import { Category } from '../models/Category';
import { User } from '../models/User';
import { Order } from '../models/Order';
import { authorizeRoles } from '../middleware/auth';
import { StatusCodes } from 'http-status-codes';
import { Readable } from 'stream';

const router = Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.mimetype === 'application/json') {
      cb(null, true);
    } else {
      cb(new Error('Only CSV and JSON files are allowed'));
    }
  }
});

// Import products from CSV
router.post('/import/products/csv', authorizeRoles('admin', 'seller'), upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'No file uploaded'
    });
  }

  try {
    const results: any[] = [];
    const errors: any[] = [];
    
    // Parse CSV data
    const parser = parse({
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    // Process each row
    parser.on('data', (row) => {
      try {
        // Validate required fields
        if (!row.title || !row.price || !row.category) {
          throw new Error('Missing required fields: title, price, category');
        }

        // Convert price to number
        const price = parseFloat(row.price);
        if (isNaN(price) || price < 0) {
          throw new Error('Invalid price');
        }

        // Handle optional fields with defaults
        const productData = {
          title: row.title,
          description: row.description || '',
          category: row.category,
          subcategory: row.subcategory || '',
          brand: row.brand || '',
          price: price,
          original_price: row.original_price ? parseFloat(row.original_price) : price,
          images: row.images ? row.images.split(',').map((url: string) => url.trim()) : [],
          variants: row.variants ? JSON.parse(row.variants) : [],
          stock_total: parseInt(row.stock_total) || 0,
          status: row.status || 'draft',
          tags: row.tags ? row.tags.split(',').map((tag: string) => tag.trim()) : []
        };

        results.push(productData);
      } catch (error: any) {
        errors.push({
          row: row,
          error: error.message
        });
      }
    });

    parser.on('end', async () => {
      try {
        // Insert products into database
        const insertedProducts = await Product.insertMany(results);
        
        res.json({
          success: true,
          message: `Successfully imported ${insertedProducts.length} products`,
          imported: insertedProducts.length,
          failed: errors.length,
          errors: errors
        });
      } catch (dbError: any) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: 'Database error during import',
          error: dbError.message
        });
      }
    });

    parser.on('error', (error) => {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Error parsing CSV file',
        error: error.message
      });
    });

    // Pipe the file buffer to the parser
    const bufferStream = new Readable();
    bufferStream.push(req.file.buffer);
    bufferStream.push(null);
    bufferStream.pipe(parser);
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error processing file',
      error: error.message
    });
  }
});

// Import products from JSON
router.post('/import/products/json', authorizeRoles('admin', 'seller'), upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'No file uploaded'
    });
  }

  try {
    const fileContent = req.file.buffer.toString('utf-8');
    const products = JSON.parse(fileContent);

    if (!Array.isArray(products)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'JSON file must contain an array of products'
      });
    }

    const results: any[] = [];
    const errors: any[] = [];

    // Validate and process each product
    for (const product of products) {
      try {
        // Validate required fields
        if (!product.title || !product.price || !product.category) {
          throw new Error('Missing required fields: title, price, category');
        }

        // Convert price to number
        const price = parseFloat(product.price);
        if (isNaN(price) || price < 0) {
          throw new Error('Invalid price');
        }

        // Handle optional fields with defaults
        const productData = {
          title: product.title,
          description: product.description || '',
          category: product.category,
          subcategory: product.subcategory || '',
          brand: product.brand || '',
          price: price,
          original_price: product.original_price ? parseFloat(product.original_price) : price,
          images: Array.isArray(product.images) ? product.images : [],
          variants: Array.isArray(product.variants) ? product.variants : [],
          stock_total: parseInt(product.stock_total) || 0,
          status: product.status || 'draft',
          tags: Array.isArray(product.tags) ? product.tags : []
        };

        results.push(productData);
      } catch (error: any) {
        errors.push({
          product: product,
          error: error.message
        });
      }
    }

    // Insert products into database
    const insertedProducts = await Product.insertMany(results);
    
    res.json({
      success: true,
      message: `Successfully imported ${insertedProducts.length} products`,
      imported: insertedProducts.length,
      failed: errors.length,
      errors: errors
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error processing JSON file',
      error: error.message
    });
  }
});

// Export products to CSV
router.get('/export/products/csv', authorizeRoles('admin'), async (req, res) => {
  try {
    // Get query parameters for filtering
    const { category, status, minPrice, maxPrice } = req.query;
    
    // Build filter object
    const filter: any = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (minPrice) filter.price = { ...filter.price, $gte: parseFloat(minPrice as string) };
    if (maxPrice) filter.price = { ...filter.price, $lte: parseFloat(maxPrice as string) };
    
    // Fetch products from database
    const products = await Product.find(filter).lean();
    
    // Set headers for CSV download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="products-export.csv"');
    
    // Create CSV stringifier
    const stringifier = stringify({
      header: true,
      columns: [
        'title', 'description', 'category', 'subcategory', 'brand', 
        'price', 'original_price', 'images', 'variants', 'stock_total', 
        'status', 'tags', 'avg_rating', 'review_count', 'created_at', 'updated_at'
      ]
    });
    
    // Pipe data to response
    stringifier.pipe(res);
    
    // Write each product to CSV
    for (const product of products) {
      stringifier.write([
        product.title,
        product.description,
        product.category,
        product.subcategory || '',
        product.brand || '',
        product.price,
        product.original_price || product.price,
        product.images ? product.images.join(',') : '',
        product.variants ? JSON.stringify(product.variants) : '',
        product.stock_total,
        product.status,
        product.tags ? product.tags.join(',') : '',
        product.avg_rating || 0,
        product.review_count || 0,
        product.created_at.toISOString(),
        product.updated_at.toISOString()
      ]);
    }
    
    // End the stream
    stringifier.end();
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error exporting products',
      error: error.message
    });
  }
});

// Export products to JSON
router.get('/export/products/json', authorizeRoles('admin'), async (req, res) => {
  try {
    // Get query parameters for filtering
    const { category, status, minPrice, maxPrice } = req.query;
    
    // Build filter object
    const filter: any = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (minPrice) filter.price = { ...filter.price, $gte: parseFloat(minPrice as string) };
    if (maxPrice) filter.price = { ...filter.price, $lte: parseFloat(maxPrice as string) };
    
    // Fetch products from database
    const products = await Product.find(filter).lean();
    
    // Set headers for JSON download
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="products-export.json"');
    
    // Send JSON response
    res.json(products);
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error exporting products',
      error: error.message
    });
  }
});

// Export orders to CSV
router.get('/export/orders/csv', authorizeRoles('admin'), async (req, res) => {
  try {
    // Get query parameters for filtering
    const { status, minAmount, maxAmount, startDate, endDate } = req.query;
    
    // Build filter object
    const filter: any = {};
    if (status) filter.order_status = status;
    if (minAmount) filter.total_amount = { ...filter.total_amount, $gte: parseFloat(minAmount as string) };
    if (maxAmount) filter.total_amount = { ...filter.total_amount, $lte: parseFloat(maxAmount as string) };
    if (startDate || endDate) {
      filter.created_at = {};
      if (startDate) filter.created_at.$gte = new Date(startDate as string);
      if (endDate) filter.created_at.$lte = new Date(endDate as string);
    }
    
    // Fetch orders from database with populated user and product data
    const orders = await Order.find(filter)
      .populate('user_id', 'name email')
      .populate('items.product_id', 'title')
      .lean();
    
    // Set headers for CSV download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="orders-export.csv"');
    
    // Create CSV stringifier
    const stringifier = stringify({
      header: true,
      columns: [
        'order_number', 'user_name', 'user_email', 'total_amount', 'payment_status', 
        'order_status', 'delivery_speed', 'created_at', 'updated_at', 'items'
      ]
    });
    
    // Pipe data to response
    stringifier.pipe(res);
    
    // Write each order to CSV
    for (const order of orders) {
      // Format items as a string
      const itemsString = order.items.map(item => 
        `${item.title} (x${item.quantity}) @ $${item.price}`
      ).join('; ');
      
      stringifier.write([
        order.order_number,
        order.user_id?.name || '',
        order.user_id?.email || '',
        order.total_amount,
        order.payment_status,
        order.order_status,
        order.delivery_speed,
        order.created_at.toISOString(),
        order.updated_at.toISOString(),
        itemsString
      ]);
    }
    
    // End the stream
    stringifier.end();
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error exporting orders',
      error: error.message
    });
  }
});

// Export users to CSV
router.get('/export/users/csv', authorizeRoles('admin'), async (req, res) => {
  try {
    // Get query parameters for filtering
    const { role, emailVerified } = req.query;
    
    // Build filter object
    const filter: any = {};
    if (role) filter.role = role;
    if (emailVerified !== undefined) filter.email_verified = emailVerified === 'true';
    
    // Fetch users from database
    const users = await User.find(filter).lean();
    
    // Set headers for CSV download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="users-export.csv"');
    
    // Create CSV stringifier
    const stringifier = stringify({
      header: true,
      columns: [
        'name', 'email', 'role', 'phone', 'email_verified', 'created_at', 'updated_at'
      ]
    });
    
    // Pipe data to response
    stringifier.pipe(res);
    
    // Write each user to CSV
    for (const user of users) {
      stringifier.write([
        user.name,
        user.email,
        user.role,
        user.phone || '',
        user.email_verified ? 'Yes' : 'No',
        user.created_at.toISOString(),
        user.updated_at.toISOString()
      ]);
    }
    
    // End the stream
    stringifier.end();
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error exporting users',
      error: error.message
    });
  }
});

// Export analytics data to CSV
router.get('/export/analytics/csv', authorizeRoles('admin'), async (req, res) => {
  try {
    // Get query parameters
    const { period = 'month', startDate, endDate } = req.query;
    
    // Set date range
    let start = new Date();
    let end = new Date();
    
    if (startDate && endDate) {
      start = new Date(startDate as string);
      end = new Date(endDate as string);
    } else {
      // Set default period
      switch (period) {
        case 'week':
          start.setDate(start.getDate() - 7);
          break;
        case 'month':
          start.setMonth(start.getMonth() - 1);
          break;
        case 'quarter':
          start.setMonth(start.getMonth() - 3);
          break;
        case 'year':
          start.setFullYear(start.getFullYear() - 1);
          break;
      }
    }
    
    // Aggregate order data by date
    const ordersByDate = await Order.aggregate([
      {
        $match: {
          created_at: {
            $gte: start,
            $lte: end
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$created_at'
            }
          },
          totalRevenue: { $sum: '$total_amount' },
          orderCount: { $sum: 1 },
          avgOrderValue: { $avg: '$total_amount' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    // Set headers for CSV download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="analytics-export.csv"');
    
    // Create CSV stringifier
    const stringifier = stringify({
      header: true,
      columns: ['date', 'total_revenue', 'order_count', 'avg_order_value']
    });
    
    // Pipe data to response
    stringifier.pipe(res);
    
    // Write each date's data to CSV
    for (const data of ordersByDate) {
      stringifier.write([
        data._id,
        data.totalRevenue.toFixed(2),
        data.orderCount,
        data.avgOrderValue.toFixed(2)
      ]);
    }
    
    // End the stream
    stringifier.end();
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error exporting analytics',
      error: error.message
    });
  }
});

export default router;
```

```typescript