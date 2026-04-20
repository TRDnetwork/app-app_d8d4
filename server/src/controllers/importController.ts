import { Request, Response } from 'express';
import csv from 'csv-parser';
import { Product } from '../models/Product';
import { User } from '../models/User';
import { StatusCodes } from 'http-status-codes';
import { loggerWithId } from '../utils/logger';
import { EmailService } from '../services/emailService';

interface ImportResult {
  success: boolean;
  total: number;
  processed: number;
  errors: Array<{
    row: number;
    error: string;
    data: any;
  }>;
  message?: string;
}

// Validate product data
const validateProduct = (data: any, rowIndex: number): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data.title?.trim()) {
    errors.push('Title is required');
  }
  
  if (!data.price || isNaN(parseFloat(data.price))) {
    errors.push('Valid price is required');
  }
  
  if (!data.stock || isNaN(parseInt(data.stock))) {
    errors.push('Valid stock is required');
  }
  
  if (!data.category_id?.trim()) {
    errors.push('Category ID is required');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

// Validate user data
const validateUser = (data: any, rowIndex: number): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data.email?.trim()) {
    errors.push('Email is required');
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.push('Invalid email format');
  }
  
  if (!data.name?.trim()) {
    errors.push('Name is required');
  }
  
  if (!data.role || !['customer', 'seller', 'admin'].includes(data.role)) {
    errors.push('Valid role is required (customer, seller, admin)');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

// Process CSV file
const processCSV = (req: Request, validateFn: (data: any, rowIndex: number) => { valid: boolean; errors: string[] }): Promise<ImportResult> => {
  return new Promise((resolve) => {
    if (!req.file) {
      return resolve({
        success: false,
        total: 0,
        processed: 0,
        errors: [{ row: 0, error: 'No file uploaded', data: {} }]
      });
    }

    const results: any[] = [];
    const errors: Array<{ row: number; error: string; data: any }> = [];
    let rowIndex = 0;
    let processed = 0;

    req.file.buffer
      .toString()
      .split('\n')
      .slice(1) // Skip header row
      .forEach((line, index) => {
        if (!line.trim()) return; // Skip empty lines
        
        rowIndex = index + 2; // +2 because we skip header and 0-indexing
        try {
          // Simple CSV parsing (for production, use a proper CSV parser)
          const columns = line.split(',').map(col => col.trim().replace(/^"(.*)"$/, '$1'));
          const headers = req.file?.originalname.includes('products') 
            ? ['title', 'description', 'price', 'stock', 'category_id', 'brand', 'images', 'tags', 'status']
            : ['name', 'email', 'role', 'phone', 'profile_picture_url'];
          
          const data: any = {};
          columns.forEach((value, i) => {
            if (headers[i]) {
              // Handle array fields
              if (headers[i] === 'images' || headers[i] === 'tags') {
                data[headers[i]] = value ? value.split(';').map(v => v.trim()) : [];
              } else {
                data[headers[i]] = value || undefined;
              }
            }
          });

          results.push(data);
        } catch (error: any) {
          errors.push({
            row: rowIndex,
            error: `Failed to parse row: ${error.message}`,
            data: { raw: line }
          });
        }
      });

    // Validate all rows
    results.forEach((data, index) => {
      const validation = validateFn(data, index + 2);
      if (!validation.valid) {
        errors.push({
          row: index + 2,
          error: validation.errors.join(', '),
          data
        });
      }
    });

    resolve({
      success: errors.length === 0,
      total: results.length,
      processed: results.length - errors.length,
      errors
    });
  });
};

// Process JSON data
const processJSON = (req: Request, validateFn: (data: any, rowIndex: number) => { valid: boolean; errors: string[] }): ImportResult => {
  const data = req.body.data;
  
  if (!Array.isArray(data)) {
    return {
      success: false,
      total: 0,
      processed: 0,
      errors: [{ row: 0, error: 'Data must be an array', data: {} }]
    };
  }

  const errors: Array<{ row: number; error: string; data: any }> = [];
  
  data.forEach((item, index) => {
    const validation = validateFn(item, index + 1);
    if (!validation.valid) {
      errors.push({
        row: index + 1,
        error: validation.errors.join(', '),
        data: item
      });
    }
  });

  return {
    success: errors.length === 0,
    total: data.length,
    processed: data.length - errors.length,
    errors
  };
};

// Import products
export const importProducts = async (req: Request, res: Response): Promise<void> => {
  const logger = loggerWithId(req.id);
  logger.info({ message: 'Starting product import' });

  try {
    let result: ImportResult;

    if (req.file) {
      // CSV import
      result = await processCSV(req, validateProduct);
    } else {
      // JSON import
      result = processJSON(req, validateProduct);
    }

    if (!result.success) {
      logger.warn({ message: 'Product import validation failed', errors: result.errors });
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Validation failed',
        ...result
      });
    }

    // Bulk insert products
    const productsToInsert = req.file 
      ? req.file.buffer.toString().split('\n').slice(1).map(line => {
          if (!line.trim()) return null;
          const columns = line.split(',').map(col => col.trim().replace(/^"(.*)"$/, '$1'));
          const headers = ['title', 'description', 'price', 'stock', 'category_id', 'brand', 'images', 'tags', 'status'];
          const data: any = {};
          columns.forEach((value, i) => {
            if (headers[i]) {
              if (headers[i] === 'images' || headers[i] === 'tags') {
                data[headers[i]] = value ? value.split(';').map(v => v.trim()) : [];
              } else if (headers[i] === 'price' || headers[i] === 'stock') {
                data[headers[i]] = parseFloat(value);
              } else {
                data[headers[i]] = value || undefined;
              }
            }
          });
          return data;
        }).filter(Boolean)
      : req.body.data;

    const inserted = await Product.insertMany(productsToInsert, { ordered: false });
    
    logger.info({ message: 'Products imported successfully', count: inserted.length });
    
    // Send success email to admin
    await EmailService.sendEmailVerification(
      'admin@example.com', 
      'product_import_success'
    );

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Successfully imported ${inserted.length} products`,
      count: inserted.length
    });
  } catch (error: any) {
    logger.error({ message: 'Product import failed', error: error.message });
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Import failed',
      error: error.message
    });
  }
};

// Import users
export const importUsers = async (req: Request, res: Response): Promise<void> => {
  const logger = loggerWithId(req.id);
  logger.info({ message: 'Starting user import' });

  try {
    let result: ImportResult;

    if (req.file) {
      // CSV import
      result = await processCSV(req, validateUser);
    } else {
      // JSON import
      result = processJSON(req, validateUser);
    }

    if (!result.success) {
      logger.warn({ message: 'User import validation failed', errors: result.errors });
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Validation failed',
        ...result
      });
    }

    // Bulk insert users
    const usersToInsert = req.file 
      ? req.file.buffer.toString().split('\n').slice(1).map(line => {
          if (!line.trim()) return null;
          const columns = line.split(',').map(col => col.trim().replace(/^"(.*)"$/, '$1'));
          const headers = ['name', 'email', 'role', 'phone', 'profile_picture_url'];
          const data: any = {};
          columns.forEach((value, i) => {
            if (headers[i]) {
              data[headers[i]] = value || undefined;
            }
          });
          return data;
        }).filter(Boolean)
      : req.body.data;

    const inserted = await User.insertMany(usersToInsert, { ordered: false });
    
    logger.info({ message: 'Users imported successfully', count: inserted.length });
    
    // Send success email to admin
    await EmailService.sendEmailVerification(
      'admin@example.com', 
      'user_import_success'
    );

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Successfully imported ${inserted.length} users`,
      count: inserted.length
    });
  } catch (error: any) {
    logger.error({ message: 'User import failed', error: error.message });
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Import failed',
      error: error.message
    });
  }
};

// Export products to CSV
export const exportProducts = async (req: Request, res: Response): Promise<void> => {
  const logger = loggerWithId(req.id);
  logger.info({ message: 'Starting product export' });

  try {
    // Apply filters from query parameters
    const filters: any = {};
    
    if (req.query.category_id) {
      filters.category_id = req.query.category_id;
    }
    
    if (req.query.brand) {
      filters.brand = req.query.brand;
    }
    
    if (req.query.status) {
      filters.status = req.query.status;
    }
    
    if (req.query.minPrice) {
      filters.price = { ...filters.price, $gte: parseFloat(req.query.minPrice as string) };
    }
    
    if (req.query.maxPrice) {
      filters.price = { ...filters.price, $lte: parseFloat(req.query.maxPrice as string) };
    }

    const products = await Product.find(filters).lean();
    
    // Create CSV content
    const headers = ['title', 'description', 'price', 'stock', 'category_id', 'brand', 'images', 'tags', 'status'];
    const csvContent = [
      headers.join(','),
      ...products.map(product => {
        return headers.map(header => {
          if (header === 'images' || header === 'tags') {
            return (product[header] as string[] || []).join(';');
          }
          return product[header] || '';
        }).join(',');
      })
    ].join('\n');

    // Set headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=products.csv');
    
    logger.info({ message: 'Product export completed', count: products.length });
    res.send(csvContent);
  } catch (error: any) {
    logger.error({ message: 'Product export failed', error: error.message });
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Export failed',
      error: error.message
    });
  }
};

// Export users to CSV
export const exportUsers = async (req: Request, res: Response): Promise<void> => {
  const logger = loggerWithId(req.id);
  logger.info({ message: 'Starting user export' });

  try {
    // Apply filters from query parameters
    const filters: any = {};
    
    if (req.query.role) {
      filters.role = req.query.role;
    }
    
    if (req.query.email_verified !== undefined) {
      filters.email_verified = req.query.email_verified === 'true';
    }

    const users = await User.find(filters).lean();
    
    // Create CSV content
    const headers = ['name', 'email', 'role', 'phone', 'profile_picture_url', 'email_verified'];
    const csvContent = [
      headers.join(','),
      ...users.map(user => {
        return headers.map(header => {
          return user[header] || '';
        }).join(',');
      })
    ].join('\n');

    // Set headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=users.csv');
    
    logger.info({ message: 'User export completed', count: users.length });
    res.send(csvContent);
  } catch (error: any) {
    logger.error({ message: 'User export failed', error: error.message });
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Export failed',
      error: error.message
    });
  }
};