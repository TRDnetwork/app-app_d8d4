import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as csv from 'csv-parser';
import * as XLSX from 'xlsx';
import { Readable } from 'stream';
import { Product } from '../models/Product';
import { User } from '../models/User';
import { Category } from '../models/Category';
import { Order } from '../models/Order';
import { loggerWithId } from '../utils/logger';
import { authorize } from '../middleware/auth';

// Import types
interface ImportResult {
  success: boolean;
  message: string;
  data?: any;
  errors?: string[];
}

interface ImportStats {
  total: number;
  created: number;
  updated: number;
  failed: number;
  errors: string[];
}

// Supported file types
const SUPPORTED_FILE_TYPES = ['text/csv', 'application/json', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];

// Field mappings for different import types
const FIELD_MAPPINGS = {
  products: {
    required: ['title', 'price', 'stock'],
    optional: ['description', 'brand', 'category_id', 'discount_percent', 'tags'],
    mapping: {
      'title': 'title',
      'price': 'price',
      'stock': 'stock',
      'description': 'description',
      'brand': 'brand',
      'category': 'category_id',
      'discount': 'discount_percent',
      'tags': 'tags'
    }
  },
  users: {
    required: ['email', 'name'],
    optional: ['phone', 'role', 'address'],
    mapping: {
      'email': 'email',
      'name': 'name',
      'phone': 'phone',
      'role': 'role',
      'address': 'address'
    }
  },
  categories: {
    required: ['name'],
    optional: ['parent_id', 'description'],
    mapping: {
      'name': 'name',
      'parent': 'parent_id',
      'description': 'description'
    }
  }
};

/**
 * Validate file type and size
 */
const validateFile = (file: Express.Multer.File): ImportResult => {
  if (!file) {
    return { success: false, message: 'No file uploaded' };
  }

  if (!SUPPORTED_FILE_TYPES.includes(file.mimetype)) {
    return { 
      success: false, 
      message: 'Unsupported file type. Please upload CSV, JSON, or Excel files.' 
    };
  }

  if (file.size > 50 * 1024 * 1024) { // 50MB limit
    return { 
      success: false, 
      message: 'File size exceeds 50MB limit' 
    };
  }

  return { success: true, message: 'File validated successfully' };
};

/**
 * Parse CSV file
 */
const parseCSV = (file: Express.Multer.File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const results: any[] = [];
    const stream = Readable.from(file.buffer);
    
    stream
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
};

/**
 * Parse Excel file
 */
const parseExcel = (file: Express.Multer.File): any[] => {
  const workbook = XLSX.read(file.buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(worksheet);
};

/**
 * Parse JSON file
 */
const parseJSON = (file: Express.Multer.File): any[] => {
  try {
    const content = file.buffer.toString('utf-8');
    const data = JSON.parse(content);
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    throw new Error('Invalid JSON format');
  }
};

/**
 * Parse file based on type
 */
const parseFile = async (file: Express.Multer.File): Promise<any[]> => {
  try {
    let data: any[] = [];
    
    if (file.mimetype === 'text/csv') {
      data = await parseCSV(file);
    } else if (file.mimetype === 'application/json') {
      data = parseJSON(file);
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      data = parseExcel(file);
    }
    
    return data;
  } catch (error: any) {
    throw new Error(`Failed to parse file: ${error.message}`);
  }
};

/**
 * Map fields according to mapping configuration
 */
const mapFields = (data: any[], mapping: Record<string, string>): any[] => {
  return data.map(row => {
    const mappedRow: any = {};
    Object.keys(row).forEach(key => {
      const normalizedKey = key.toLowerCase().trim();
      if (mapping[normalizedKey]) {
        mappedRow[mapping[normalizedKey]] = row[key];
      }
    });
    return mappedRow;
  });
};

/**
 * Validate required fields
 */
const validateRequiredFields = (data: any[], requiredFields: string[]): string[] => {
  const errors: string[] = [];
  
  data.forEach((row, index) => {
    requiredFields.forEach(field => {
      if (!row[field] && row[field] !== 0) {
        errors.push(`Row ${index + 1}: Missing required field '${field}'`);
      }
    });
  });
  
  return errors;
};

/**
 * Import products
 */
const importProducts = async (data: any[]): Promise<ImportStats> => {
  const stats: ImportStats = {
    total: data.length,
    created: 0,
    updated: 0,
    failed: 0,
    errors: []
  };

  const logger = loggerWithId('import-products');

  for (const productData of data) {
    try {
      // Validate required fields
      if (!productData.title || !productData.price || !productData.stock) {
        stats.errors.push(`Product '${productData.title || 'Unknown'}': Missing required fields`);
        stats.failed++;
        continue;
      }

      // Convert price and stock to numbers
      productData.price = parseFloat(productData.price);
      productData.stock = parseInt(productData.stock);
      productData.discount_percent = productData.discount_percent ? parseFloat(productData.discount_percent) : 0;

      // Handle tags
      if (productData.tags && typeof productData.tags === 'string') {
        productData.tags = productData.tags.split(',').map((tag: string) => tag.trim());
      }

      // Check if product exists
      const existingProduct = await Product.findOne({ title: productData.title });
      
      if (existingProduct) {
        // Update existing product
        Object.assign(existingProduct, productData);
        await existingProduct.save();
        stats.updated++;
        logger.info({ productId: existingProduct._id, action: 'updated' });
      } else {
        // Create new product
        const newProduct = new Product(productData);
        await newProduct.save();
        stats.created++;
        logger.info({ productId: newProduct._id, action: 'created' });
      }
    } catch (error: any) {
      stats.errors.push(`Product '${productData.title || 'Unknown'}': ${error.message}`);
      stats.failed++;
      logger.error({ error: error.message, productData });
    }
  }

  return stats;
};

/**
 * Import users
 */
const importUsers = async (data: any[]): Promise<ImportStats> => {
  const stats: ImportStats = {
    total: data.length,
    created: 0,
    updated: 0,
    failed: 0,
    errors: []
  };

  const logger = loggerWithId('import-users');

  for (const userData of data) {
    try {
      // Validate required fields
      if (!userData.email || !userData.name) {
        stats.errors.push(`User '${userData.name || 'Unknown'}': Missing required fields`);
        stats.failed++;
        continue;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        stats.errors.push(`User '${userData.name}': Invalid email format`);
        stats.failed++;
        continue;
      }

      // Normalize role
      if (userData.role) {
        const validRoles = ['customer', 'seller', 'admin'];
        userData.role = validRoles.includes(userData.role.toLowerCase()) ? userData.role.toLowerCase() : 'customer';
      } else {
        userData.role = 'customer';
      }

      // Check if user exists
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        // Update existing user
        Object.assign(existingUser, userData);
        await existingUser.save();
        stats.updated++;
        logger.info({ userId: existingUser._id, action: 'updated' });
      } else {
        // Create new user (with default password)
        const newUser = new User({
          ...userData,
          password_hash: '$2b$10$epkT0aQ5Y6Y6Y6Y6Y6Y6Y6uZ6Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6', // bcrypt("password123")
          email_verified: true
        });
        await newUser.save();
        stats.created++;
        logger.info({ userId: newUser._id, action: 'created' });
      }
    } catch (error: any) {
      stats.errors.push(`User '${userData.name || 'Unknown'}': ${error.message}`);
      stats.failed++;
      logger.error({ error: error.message, userData });
    }
  }

  return stats;
};

/**
 * Import categories
 */
const importCategories = async (data: any[]): Promise<ImportStats> => {
  const stats: ImportStats = {
    total: data.length,
    created: 0,
    updated: 0,
    failed: 0,
    errors: []
  };

  const logger = loggerWithId('import-categories');

  for (const categoryData of data) {
    try {
      // Validate required fields
      if (!categoryData.name) {
        stats.errors.push(`Category: Missing required field 'name'`);
        stats.failed++;
        continue;
      }

      // Check if category exists
      const existingCategory = await Category.findOne({ name: categoryData.name });
      
      if (existingCategory) {
        // Update existing category
        Object.assign(existingCategory, categoryData);
        await existingCategory.save();
        stats.updated++;
        logger.info({ categoryId: existingCategory._id, action: 'updated' });
      } else {
        // Create new category
        const newCategory = new Category(categoryData);
        await newCategory.save();
        stats.created++;
        logger.info({ categoryId: newCategory._id, action: 'created' });
      }
    } catch (error: any) {
      stats.errors.push(`Category '${categoryData.name || 'Unknown'}': ${error.message}`);
      stats.failed++;
      logger.error({ error: error.message, categoryData });
    }
  }

  return stats;
};

/**
 * Import data (generic)
 */
export const importData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type } = req.params;
    const file = req.file;

    // Validate file
    const fileValidation = validateFile(file);
    if (!fileValidation.success) {
      return res.status(StatusCodes.BAD_REQUEST).json(fileValidation);
    }

    // Validate import type
    const validTypes = ['products', 'users', 'categories'];
    if (!type || !validTypes.includes(type)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid import type. Valid types: products, users, categories'
      });
    }

    // Parse file
    let data: any[];
    try {
      data = await parseFile(file);
    } catch (error: any) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: error.message
      });
    }

    if (data.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'No data found in file'
      });
    }

    // Map fields based on type
    const mappingConfig = FIELD_MAPPINGS[type as keyof typeof FIELD_MAPPINGS];
    const mappedData = mapFields(data, mappingConfig.mapping);

    // Validate required fields
    const validationErrors = validateRequiredFields(mappedData, mappingConfig.required);
    if (validationErrors.length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Import data based on type
    let importStats: ImportStats;
    
    switch (type) {
      case 'products':
        importStats = await importProducts(mappedData);
        break;
      case 'users':
        importStats = await importUsers(mappedData);
        break;
      case 'categories':
        importStats = await importCategories(mappedData);
        break;
      default:
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Invalid import type'
        });
    }

    // Return result
    res.status(StatusCodes.OK).json({
      success: true,
      message: `Successfully imported ${importStats.created} ${type}, updated ${importStats.updated}, failed ${importStats.failed}`,
      data: importStats
    });
  } catch (error: any) {
    next(error);
  }
};

/**
 * Export data
 */
export const exportData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, format = 'csv' } = req.query;
    const { startDate, endDate, status, category } = req.query;

    // Validate export type
    const validTypes = ['products', 'users', 'categories', 'orders'];
    if (!type || !validTypes.includes(type as string)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid export type. Valid types: products, users, categories, orders'
      });
    }

    // Build query based on filters
    let query: any = {};
    
    if (startDate) {
      query.created_at = { ...query.created_at, $gte: new Date(startDate as string) };
    }
    
    if (endDate) {
      query.created_at = { ...query.created_at, $lte: new Date(endDate as string) };
    }
    
    if (status && type === 'orders') {
      query.order_status = status;
    }
    
    if (category && type === 'products') {
      query.category_id = category;
    }

    // Fetch data based on type
    let data: any[] = [];
    let filename = '';

    switch (type) {
      case 'products':
        data = await Product.find(query).populate('category_id').lean();
        filename = `products-export-${new Date().toISOString().split('T')[0]}.${format}`;
        break;
      case 'users':
        data = await User.find(query).lean();
        filename = `users-export-${new Date().toISOString().split('T')[0]}.${format}`;
        break;
      case 'categories':
        data = await Category.find(query).populate('parent_id').lean();
        filename = `categories-export-${new Date().toISOString().split('T')[0]}.${format}`;
        break;
      case 'orders':
        data = await Order.find(query).populate('user_id').lean();
        filename = `orders-export-${new Date().toISOString().split('T')[0]}.${format}`;
        break;
    }

    if (data.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'No data found for export'
      });
    }

    // Format data for export
    let formattedData: any[] = [];
    
    switch (type) {
      case 'products':
        formattedData = data.map(product => ({
          title: product.title,
          description: product.description,
          price: product.price,
          stock: product.stock,
          brand: product.brand,
          category: product.category_id?.name || 'Uncategorized',
          discount_percent: product.discount_percent,
          tags: Array.isArray(product.tags) ? product.tags.join(', ') : '',
          status: product.status,
          created_at: product.created_at
        }));
        break;
      case 'users':
        formattedData = data.map(user => ({
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          address: user.address,
          email_verified: user.email_verified,
          created_at: user.created_at
        }));
        break;
      case 'categories':
        formattedData = data.map(category => ({
          name: category.name,
          slug: category.slug,
          parent: category.parent_id?.name || 'None',
          description: category.description,
          created_at: category.created_at
        }));
        break;
      case 'orders':
        formattedData = data.map(order => ({
          order_id: order._id,
          user: order.user_id?.name || 'Unknown',
          email: order.user_id?.email || 'Unknown',
          total: order.total,
          status: order.order_status,
          payment_method: order.payment_method,
          created_at: order.created_at
        }));
        break;
    }

    // Set response headers for file download
    res.setHeader('Content-Type', format === 'json' ? 'application/json' : 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Send data based on format
    if (format === 'json') {
      res.json(formattedData);
    } else {
      // Convert to CSV
      const csv = require('csv-writer').createObjectCsvWriter({
        path: 'temp.csv',
        header: Object.keys(formattedData[0]).map(key => ({ id: key, title: key }))
      });
      
      // Write to response
      await csv.writeRecords(formattedData);
      res.sendFile('temp.csv', { root: '.' }, () => {
        // Clean up temp file
        require('fs').unlinkSync('temp.csv');
      });
    }
  } catch (error: any) {
    next(error);
  }
};

/**
 * Get import/export status
 */
export const getStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // In a real implementation, this would check the status of background jobs
    // For now, return a simple status
    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        status: 'ready',
        lastImport: null,
        lastExport: null,
        activeJobs: 0
      }
    });
  } catch (error: any) {
    next(error);
  }
};
```
```typescript