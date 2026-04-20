import { Worker, Job } from 'bullmq';
import { logger } from '../utils/logger';
import { ObjectId } from 'mongodb';
import { CSVParser } from '../utils/csvParser';
import { JSONValidator } from '../utils/jsonValidator';
import { Product } from '../models/Product';
import { User } from '../models/User';
import { Order } from '../models/Order';
import { Category } from '../models/Category';

// SECURITY FIX: Create worker with enhanced security options
const importWorker = new Worker('import', async (job: Job) => {
  try {
    const { userId, collection, filePath, mapping, options } = job.data;
    
    logger.info(`Starting import job: ${job.id}`, {
      collection,
      filePath,
      userId
    });

    // Update job progress
    await job.updateProgress(10);

    // Read and parse file based on extension
    let data: any[] = [];
    
    if (filePath.endsWith('.csv')) {
      const csvParser = new CSVParser();
      const result = await csvParser.parseFile(filePath);
      
      // SECURITY FIX: Validate parsing result
      if (!result || !Array.isArray(result.data)) {
        throw new Error('Failed to parse CSV file');
      }
      
      data = result.data;
    } else if (filePath.endsWith('.json')) {
      const content = require('fs').readFileSync(filePath, 'utf8');
      const jsonData = JSON.parse(content);
      
      // SECURITY FIX: Validate JSON structure
      if (!Array.isArray(jsonData)) {
        throw new Error('JSON file must contain an array of objects');
      }
      
      data = jsonData;
    } else {
      throw new Error('Unsupported file format');
    }

    // Update job progress
    await job.updateProgress(30);

    // Transform data based on mapping
    const transformedData = transformData(data, mapping);
    
    // Update job progress
    await job.updateProgress(50);

    // Validate data
    const validationErrors = await validateData(transformedData, collection);
    if (validationErrors.length > 0) {
      // SECURITY FIX: Check if validateOnly option is set
      if (options.validateOnly) {
        return {
          status: 'validated',
          totalCount: transformedData.length,
          validationErrors
        };
      }
      
      throw new Error(`Validation failed: ${validationErrors.length} errors found`);
    }

    // Update job progress
    await job.updateProgress(70);

    // Import data into database
    const importResult = await importData(transformedData, collection, options);
    
    // Update job progress
    await job.updateProgress(100);

    logger.info(`Import job completed: ${job.id}`, {
      collection,
      importedCount: importResult.importedCount,
      updatedCount: importResult.updatedCount,
      errors: importResult.errors.length
    });

    return {
      status: 'completed',
      importedCount: importResult.importedCount,
      updatedCount: importResult.updatedCount,
      errors: importResult.errors,
      totalCount: transformedData.length
    };

  } catch (error: any) {
    logger.error(`Import job failed: ${job.id}`, {
      error: error.message,
      stack: error.stack
    });
    
    // SECURITY FIX: Don't expose sensitive error details
    throw new Error('Import process failed');
  } finally {
    // SECURITY FIX: Clean up temporary files
    try {
      if (job.data.filePath && require('fs').existsSync(job.data.filePath)) {
        require('fs').unlinkSync(job.data.filePath);
      }
    } catch (cleanupError) {
      logger.warn(`Failed to clean up import file: ${job.data.filePath}`, {
        error: cleanupError
      });
    }
  }
}, {
  // SECURITY FIX: Set worker options for security
  autorun: true,
  concurrency: 5,
  lockDuration: 300000, // 5 minutes
  lockRenewTime: 150000, // 2.5 minutes
  settings: {
    backoffStrategy: (attemptsMade: number, err: Error) => {
      return Math.min(1000 * Math.pow(2, attemptsMade), 60000); // Exponential backoff, max 1 minute
    }
  }
});

// SECURITY FIX: Handle worker errors
importWorker.on('failed', (job, err) => {
  logger.error(`Import worker failed: ${job?.id}`, {
    error: err.message,
    stack: err.stack
  });
});

importWorker.on('error', (err) => {
  logger.error('Import worker error:', {
    error: err.message,
    stack: err.stack
  });
});

/**
 * Transform data based on field mapping
 */
function transformData(data: any[], mapping: Record<string, string>): any[] {
  return data.map(row => {
    const transformed: any = {};
    
    for (const [sourceField, targetField] of Object.entries(mapping)) {
      if (row[sourceField] !== undefined) {
        transformed[targetField] = row[sourceField];
      }
    }
    
    return transformed;
  });
}

/**
 * Validate data based on collection type
 */
async function validateData(data: any[], collection: string): Promise<string[]> {
  const errors: string[] = [];
  
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    
    try {
      switch (collection) {
        case 'products':
          await validateProduct(item);
          break;
        case 'users':
          await validateUser(item);
          break;
        case 'orders':
          await validateOrder(item);
          break;
        case 'categories':
          await validateCategory(item);
          break;
        default:
          errors.push(`Unsupported collection: ${collection} at row ${i + 1}`);
      }
    } catch (error: any) {
      errors.push(`Row ${i + 1}: ${error.message}`);
    }
  }
  
  return errors;
}

/**
 * Validate product data
 */
async function validateProduct(product: any): Promise<void> {
  if (!product.title || typeof product.title !== 'string') {
    throw new Error('Title is required and must be a string');
  }
  
  if (!product.price || typeof product.price !== 'number' || product.price < 0) {
    throw new Error('Price is required and must be a positive number');
  }
  
  if (product.original_price && (typeof product.original_price !== 'number' || product.original_price < product.price)) {
    throw new Error('Original price must be greater than or equal to price');
  }
  
  if (product.discount_percent && (typeof product.discount_percent !== 'number' || product.discount_percent < 0 || product.discount_percent > 100)) {
    throw new Error('Discount percent must be between 0 and 100');
  }
  
  if (product.status && !['active', 'inactive', 'out_of_stock'].includes(product.status)) {
    throw new Error('Status must be one of: active, inactive, out_of_stock');
  }
  
  // Validate category exists
  if (product.category) {
    const category = await Category.findOne({ name: product.category });
    if (!category) {
      throw new Error(`Category "${product.category}" does not exist`);
    }
  }
}

/**
 * Validate user data
 */
async function validateUser(user: any): Promise<void> {
  if (!user.email || typeof user.email !== 'string') {
    throw new Error('Email is required and must be a string');
  }
  
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
    throw new Error('Email format is invalid');
  }
  
  if (!user.name || typeof user.name !== 'string') {
    throw new Error('Name is required and must be a string');
  }
  
  if (user.role && !['customer', 'seller', 'admin'].includes(user.role)) {
    throw new Error('Role must be one of: customer, seller, admin');
  }
  
  // Check for duplicate email
  if (!user._id) { // Only for new users
    const existingUser = await User.findOne({ email: user.email });
    if (existingUser) {
      throw new Error(`Email "${user.email}" is already registered`);
    }
  }
}

/**
 * Validate order data
 */
async function validateOrder(order: any): Promise<void> {
  if (!order.order_number || typeof order.order_number !== 'string') {
    throw new Error('Order number is required and must be a string');
  }
  
  if (!order.user_id || !ObjectId.isValid(order.user_id)) {
    throw new Error('Valid user ID is required');
  }
  
  const user = await User.findById(order.user_id);
  if (!user) {
    throw new Error(`User with ID "${order.user_id}" does not exist`);
  }
  
  if (!Array.isArray(order.items) || order.items.length === 0) {
    throw new Error('Order must contain at least one item');
  }
  
  for (const item of order.items) {
    if (!item.product_id || !ObjectId.isValid(item.product_id)) {
      throw new Error('Each order item must have a valid product ID');
    }
    
    if (!item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0) {
      throw new Error('Order item quantity must be a positive number');
    }
    
    if (!item.price || typeof item.price !== 'number' || item.price < 0) {
      throw new Error('Order item price must be a positive number');
    }
  }
  
  if (!order.total || typeof order.total !== 'number' || order.total < 0) {
    throw new Error('Order total must be a positive number');
  }
  
  if (order.status && !['placed', 'confirmed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'].includes(order.status)) {
    throw new Error('Invalid order status');
  }
}

/**
 * Validate category data
 */
async function validateCategory(category: any): Promise<void> {
  if (!category.name || typeof category.name !== 'string') {
    throw new Error('Category name is required and must be a string');
  }
  
  if (category.parent_id && !ObjectId.isValid(category.parent_id)) {
    throw new Error('Parent ID must be a valid ObjectId');
  }
  
  // Check for duplicate category name
  if (!category._id) { // Only for new categories
    const existingCategory = await Category.findOne({ name: category.name });
    if (existingCategory) {
      throw new Error(`Category "${category.name}" already exists`);
    }
  }
}

/**
 * Import data into database
 */
async function importData(data: any[], collection: string, options: { updateExisting?: boolean } = {}): Promise<{
  importedCount: number;
  updatedCount: number;
  errors: string[];
}> {
  let importedCount = 0;
  let updatedCount = 0;
  const errors: string[] = [];
  
  for (let i = 0; i < data.length; i++) {
    try {
      switch (collection) {
        case 'products':
          await importProduct(data[i], options);
          importedCount++;
          break;
        case 'users':
          await importUser(data[i], options);
          importedCount++;
          break;
        case 'orders':
          await importOrder(data[i], options);
          importedCount++;
          break;
        case 'categories':
          await importCategory(data[i], options);
          importedCount++;
          break;
      }
    } catch (error: any) {
      errors.push(`Row ${i + 1}: ${error.message}`);
    }
  }
  
  return { importedCount, updatedCount, errors };
}

/**
 * Import product
 */
async function importProduct(product: any, options: { updateExisting?: boolean } = {}): Promise<void> {
  const existingProduct = await Product.findOne({ title: product.title });
  
  if (existingProduct && options.updateExisting) {
    // Update existing product
    Object.assign(existingProduct, product);
    await existingProduct.save();
  } else if (!existingProduct) {
    // Create new product
    await Product.create(product);
  }
  // If product exists and updateExisting is false, skip it
}

/**
 * Import user
 */
async function importUser(user: any, options: { updateExisting?: boolean } = {}): Promise<void> {
  const existingUser = await User.findOne({ email: user.email });
  
  if (existingUser && options.updateExisting) {
    // Update existing user
    Object.assign(existingUser, user);
    await existingUser.save();
  } else if (!existingUser) {
    // Create new user
    await User.create(user);
  }
  // If user exists and updateExisting is false, skip it
}

/**
 * Import order
 */
async function importOrder(order: any, options: { updateExisting?: boolean } = {}): Promise<void> {
  const existingOrder = await Order.findOne({ order_number: order.order_number });
  
  if (existingOrder && options.updateExisting) {
    // Update existing order
    Object.assign(existingOrder, order);
    await existingOrder.save();
  } else if (!existingOrder) {
    // Create new order
    await Order.create(order);
  }
  // If order exists and updateExisting is false, skip it
}

/**
 * Import category
 */
async function importCategory(category: any, options: { updateExisting?: boolean } = {}): Promise<void> {
  const existingCategory = await Category.findOne({ name: category.name });
  
  if (existing