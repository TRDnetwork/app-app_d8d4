```ts
import csv from 'csv-parser';
import { Readable } from 'stream';
import { Product } from '../models/Product';
import { User } from '../models/User';
import { Order } from '../models/Order';
import { Category } from '../models/Category';
import { Address } from '../models/Address';
import { Cart } from '../models/Cart';
import { Wishlist } from '../models/Wishlist';
import { Review } from '../models/Review';
import { Coupon } from '../models/Coupon';
import { Question } from '../models/Question';
import { SellerAnalytics } from '../models/SellerAnalytics';
import { parse } from 'json2csv';
import { v4 as uuidv4 } from 'uuid';

interface ImportResult {
  success: boolean;
  total: number;
  imported: number;
  failed: number;
  errors: string[];
  summary: Record<string, any>;
}

/**
 * Import products from CSV/JSON
 */
export const importProducts = async (
  fileBuffer: Buffer,
  fileExtension: string,
  user: any
): Promise<ImportResult> => {
  const result: ImportResult = {
    success: true,
    total: 0,
    imported: 0,
    failed: 0,
    errors: [],
    summary: {}
  };

  try {
    let records: any[] = [];

    if (fileExtension === 'csv') {
      // Parse CSV
      records = await parseCSV(fileBuffer);
    } else if (fileExtension === 'json') {
      // Parse JSON
      records = JSON.parse(fileBuffer.toString());
    }

    result.total = records.length;

    // Validate records
    const validationErrors = validateProductRecords(records);
    if (validationErrors.length > 0) {
      result.success = false;
      result.errors = validationErrors;
      result.failed = records.length;
      return result;
    }

    // Process records
    for (const record of records) {
      try {
        // Find or create category
        let category = await Category.findOne({ name: record.category });
        if (!category) {
          category = await Category.create({
            name: record.category,
            slug: record.category.toLowerCase().replace(/\s+/g, '-'),
            parentId: null
          });
        }

        // Create product
        const productData = {
          seller_id: record.seller_id || user.id,
          title: record.title,
          description: record.description,
          brand: record.brand,
          category_id: category._id,
          price: parseFloat(record.price),
          discount_percent: parseFloat(record.discount_percent || 0),
          stock: parseInt(record.stock || 0),
          images: record.images ? record.images.split(',') : [],
          tags: record.tags ? record.tags.split(',') : [],
          status: record.status || 'active'
        };

        await Product.create(productData);
        result.imported++;
      } catch (error: any) {
        result.failed++;
        result.errors.push(`Error importing product ${record.title}: ${error.message}`);
      }
    }

    result.success = result.failed === 0;
    result.summary = {
      total: result.total,
      imported: result.imported,
      failed: result.failed,
      success_rate: ((result.imported / result.total) * 100).toFixed(2) + '%'
    };

  } catch (error: any) {
    result.success = false;
    result.errors.push(`Import failed: ${error.message}`);
    result.failed = result.total;
  }

  return result;
};

/**
 * Import users from CSV/JSON
 */
export const importUsers = async (
  fileBuffer: Buffer,
  fileExtension: string,
  user: any
): Promise<ImportResult> => {
  const result: ImportResult = {
    success: true,
    total: 0,
    imported: 0,
    failed: 0,
    errors: [],
    summary: {}
  };

  try {
    let records: any[] = [];

    if (fileExtension === 'csv') {
      records = await parseCSV(fileBuffer);
    } else if (fileExtension === 'json') {
      records = JSON.parse(fileBuffer.toString());
    }

    result.total = records.length;

    const validationErrors = validateUserRecords(records);
    if (validationErrors.length > 0) {
      result.success = false;
      result.errors = validationErrors;
      result.failed = records.length;
      return result;
    }

    for (const record of records) {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: record.email });
        if (existingUser) {
          result.failed++;
          result.errors.push(`User with email ${record.email} already exists`);
          continue;
        }

        const userData = {
          email: record.email,
          name: record.name,
          role: record.role || 'customer',
          phone: record.phone,
          email_verified: record.email_verified === 'true',
          profile_picture_url: record.profile_picture_url,
          created_at: record.created_at ? new Date(record.created_at) : new Date()
        };

        await User.create(userData);
        result.imported++;
      } catch (error: any) {
        result.failed++;
        result.errors.push(`Error importing user ${record.email}: ${error.message}`);
      }
    }

    result.success = result.failed === 0;
    result.summary = {
      total: result.total,
      imported: result.imported,
      failed: result.failed,
      success_rate: ((result.imported / result.total) * 100).toFixed(2) + '%'
    };

  } catch (error: any) {
    result.success = false;
    result.errors.push(`Import failed: ${error.message}`);
    result.failed = result.total;
  }

  return result;
};

/**
 * Import orders from CSV/JSON
 */
export const importOrders = async (
  fileBuffer: Buffer,
  fileExtension: string,
  user: any
): Promise<ImportResult> => {
  const result: ImportResult = {
    success: true,
    total: 0,
    imported: 0,
    failed: 0,
    errors: [],
    summary: {}
  };

  try {
    let records: any[] = [];

    if (fileExtension === 'csv') {
      records = await parseCSV(fileBuffer);
    } else if (fileExtension === 'json') {
      records = JSON.parse(fileBuffer.toString());
    }

    result.total = records.length;

    const validationErrors = validateOrderRecords(records);
    if (validationErrors.length > 0) {
      result.success = false;
      result.errors = validationErrors;
      result.failed = records.length;
      return result;
    }

    for (const record of records) {
      try {
        // Verify user exists
        const userExists = await User.findById(record.user_id);
        if (!userExists) {
          result.failed++;
          result.errors.push(`User with ID ${record.user_id} does not exist`);
          continue;
        }

        // Verify address exists
        const addressExists = await Address.findById(record.address_id);
        if (!record.address_id || !addressExists) {
          // Create address if it doesn't exist
          const addressData = {
            userId: record.user_id,
            addressLine1: record.address_line1,
            addressLine2: record.address_line2,
            city: record.city,
            state: record.state,
            zip: record.zip,
            country: record.country,
            isDefault: record.is_default === 'true'
          };
          
          const address = await Address.create(addressData);
          record.address_id = address._id;
        }

        // Process items
        const items = [];
        if (record.items) {
          const itemRecords = JSON.parse(record.items);
          for (const item of itemRecords) {
            const productExists = await Product.findById(item.product_id);
            if (!productExists) {
              result.failed++;
              result.errors.push(`Product with ID ${item.product_id} does not exist`);
              continue;
            }
            
            items.push({
              product_id: item.product_id,
              quantity: parseInt(item.quantity),
              price_at_purchase: parseFloat(item.price_at_purchase)
            });
          }
        }

        const orderData = {
          user_id: record.user_id,
          items,
          subtotal: parseFloat(record.subtotal),
          tax: parseFloat(record.tax),
          shipping_cost: parseFloat(record.shipping_cost),
          total: parseFloat(record.total),
          address_id: record.address_id,
          payment_method: record.payment_method,
          payment_status: record.payment_status || 'pending',
          order_status: record.order_status || 'placed',
          tracking_number: record.tracking_number,
          stripe_payment_intent_id: record.stripe_payment_intent_id,
          created_at: record.created_at ? new Date(record.created_at) : new Date()
        };

        await Order.create(orderData);
        result.imported++;
      } catch (error: any) {
        result.failed++;
        result.errors.push(`Error importing order ${record.id}: ${error.message}`);
      }
    }

    result.success = result.failed === 0;
    result.summary = {
      total: result.total,
      imported: result.imported,
      failed: result.failed,
      success_rate: ((result.imported / result.total) * 100).toFixed(2) + '%'
    };

  } catch (error: any) {
    result.success = false;
    result.errors.push(`Import failed: ${error.message}`);
    result.failed = result.total;
  }

  return result;
};

/**
 * Parse CSV file to array of objects
 */
const parseCSV = (fileBuffer: Buffer): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const results: any[] = [];
    const stream = Readable.from(fileBuffer);
    
    stream
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
};

/**
 * Validate product records
 */
const validateProductRecords = (records: any[]): string[] => {
  const errors: string[] = [];
  
  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    
    if (!record.title) {
      errors.push(`Row ${i + 1}: Title is required`);
    }
    
    if (!record.description) {
      errors.push(`Row ${i + 1}: Description is required`);
    }
    
    if (!record.price || isNaN(parseFloat(record.price))) {
      errors.push(`Row ${i + 1}: Price must be a valid number`);
    }
    
    if (record.discount_percent && (isNaN(parseFloat(record.discount_percent)) || parseFloat(record.discount_percent) < 0 || parseFloat(record.discount_percent) > 100)) {
      errors.push(`Row ${i + 1}: Discount percent must be between 0 and 100`);
    }
    
    if (record.stock && isNaN(parseInt(record.stock))) {
      errors.push(`Row ${i + 1}: Stock must be a valid number`);
    }
    
    if (record.status && !['active', 'inactive'].includes(record.status)) {
      errors.push(`Row ${i + 1}: Status must be 'active' or 'inactive'`);
    }
  }
  
  return errors;
};

/**
 * Validate user records
 */
const validateUserRecords = (records: any[]): string[] => {
  const errors: string[] = [];
  
  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    
    if (!record.email) {
      errors.push(`Row ${i + 1}: Email is required`);
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(record.email)) {
      errors.push(`Row ${i + 1}: Invalid email format`);
    }
    
    if (!record.name) {
      errors.push(`Row ${i + 1}: Name is required`);
    }
    
    if (record.role && !['customer', 'seller', 'admin'].includes(record.role)) {
      errors.push(`Row ${i + 1}: Role must be 'customer', 'seller', or 'admin'`);
    }
  }
  
  return errors;
};

/**
 * Validate order records
 */
const validateOrderRecords = (records: any[]): string[] => {
  const errors: string[] = [];
  
  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    
    if (!record.user_id) {
      errors.push(`Row ${i + 1}: User ID is required`);
    }
    
    if (!record.subtotal || isNaN(parseFloat(record.subtotal))) {
      errors.push(`Row ${i + 1}: Subtotal must be a valid number`);
    }
    
    if (!record.total || isNaN(parseFloat(record.total))) {
      errors.push(`Row ${i + 1}: Total must be a valid number`);
    }
    
    if (record.payment_status && !['pending', 'succeeded', 'failed', 'refunded'].includes(record.payment_status)) {
      errors.push(`Row ${i + 1}: Payment status must be 'pending', 'succeeded', 'failed', or 'refunded'`);
    }
    
    if (record.order_status && !['placed', 'confirmed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'].includes(record.order_status)) {
      errors.push(`Row ${i + 1}: Order status must be valid`);
    }
  }
  
  return errors;
};
```