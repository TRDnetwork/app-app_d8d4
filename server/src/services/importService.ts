import { Readable } from 'stream';
import { parse } from 'csv-parse';
import { parse as parseJson } from 'jsonc-parser';
import { ObjectId } from 'mongodb';
import { db } from '../config/database';
import { jobService, JobType, JobStatus } from './jobService';
import { StatusCodes } from 'http-status-codes';

// Import result interface
export interface ImportResult {
  success: boolean;
  processed: number;
  inserted: number;
  updated: number;
  errors: Array<{
    row: number;
    error: string;
    data: Record<string, any>;
  }>;
  warnings: string[];
}

// Column mapping interface
export interface ColumnMapping {
  [sourceColumn: string]: string; // Maps source column name to destination field name
}

// Import options
export interface ImportOptions {
  mapping: ColumnMapping;
  batchSize?: number;
  updateExisting?: boolean;
  validateOnly?: boolean;
}

// Import service class
export class ImportService {
  private batchSize = 1000; // Default batch size

  /**
   * Import data from CSV
   */
  async importFromCsv(
    csvStream: Readable,
    resourceType: string,
    options: ImportOptions
  ): Promise<ImportResult> {
    const result: ImportResult = {
      success: true,
      processed: 0,
      inserted: 0,
      updated: 0,
      errors: [],
      warnings: []
    };

    // Validate mapping
    if (Object.keys(options.mapping).length === 0) {
      result.success = false;
      result.errors.push({
        row: 0,
        error: 'No column mapping provided',
        data: {}
      });
      return result;
    }

    // Get the collection for the resource type
    const collection = this.getCollection(resourceType);
    if (!collection) {
      result.success = false;
      result.errors.push({
        row: 0,
        error: `Unknown resource type: ${resourceType}`,
        data: {}
      });
      return result;
    }

    // Parse CSV
    const parser = csvStream.pipe(
      parse({
        columns: true,
        skip_empty_lines: true,
        trim: true,
        skip_lines_with_error: false
      })
    );

    // Process rows in batches
    const batch: any[] = [];
    let rowNumber = 0;

    for await (const row of parser) {
      rowNumber++;
      
      try {
        // Map columns according to mapping
        const mappedRow = this.mapRow(row, options.mapping);
        
        // Validate row
        const validationErrors = this.validateRow(mappedRow, resourceType);
        if (validationErrors.length > 0) {
          result.errors.push({
            row: rowNumber,
            error: validationErrors.join(', '),
            data: row
          });
          continue;
        }

        // Add to batch
        batch.push(mappedRow);

        // Process batch when it reaches the batch size
        if (batch.length >= (options.batchSize || this.batchSize)) {
          await this.processBatch(batch, collection, options, result);
          batch.length = 0; // Clear batch
        }

        result.processed++;
      } catch (error: any) {
        result.errors.push({
          row: rowNumber,
          error: error.message,
          data: row
        });
      }
    }

    // Process remaining rows in the batch
    if (batch.length > 0) {
      await this.processBatch(batch, collection, options, result);
    }

    // Set success flag based on errors
    result.success = result.errors.length === 0;

    return result;
  }

  /**
   * Import data from JSON
   */
  async importFromJson(
    jsonText: string,
    resourceType: string,
    options: ImportOptions
  ): Promise<ImportResult> {
    const result: ImportResult = {
      success: true,
      processed: 0,
      inserted: 0,
      updated: 0,
      errors: [],
      warnings: []
    };

    // Validate mapping
    if (Object.keys(options.mapping).length === 0) {
      result.success = false;
      result.errors.push({
        row: 0,
        error: 'No column mapping provided',
        data: {}
      });
      return result;
    }

    // Get the collection for the resource type
    const collection = this.getCollection(resourceType);
    if (!collection) {
      result.success = false;
      result.errors.push({
        row: 0,
        error: `Unknown resource type: ${resourceType}`,
        data: {}
      });
      return result;
    }

    try {
      // Parse JSON
      const data = parseJson(jsonText);
      
      // Ensure data is an array
      const dataArray = Array.isArray(data) ? data : [data];
      
      // Process in batches
      for (let i = 0; i < dataArray.length; i += options.batchSize || this.batchSize) {
        const batch = dataArray.slice(i, i + (options.batchSize || this.batchSize));
        
        // Map and validate rows
        const processedBatch = batch.map((row, index) => {
          const rowNumber = i + index + 1;
          
          try {
            // Map columns according to mapping
            const mappedRow = this.mapRow(row, options.mapping);
            
            // Validate row
            const validationErrors = this.validateRow(mappedRow, resourceType);
            if (validationErrors.length > 0) {
              result.errors.push({
                row: rowNumber,
                error: validationErrors.join(', '),
                data: row
              });
              return null;
            }
            
            result.processed++;
            return mappedRow;
          } catch (error: any) {
            result.errors.push({
              row: rowNumber,
              error: error.message,
              data: row
            });
            return null;
          }
        }).filter(row => row !== null) as any[];
        
        // Process the batch
        await this.processBatch(processedBatch, collection, options, result);
      }
      
      // Set success flag based on errors
      result.success = result.errors.length === 0;
    } catch (error: any) {
      result.success = false;
      result.errors.push({
        row: 0,
        error: `JSON parsing error: ${error.message}`,
        data: {}
      });
    }

    return result;
  }

  /**
   * Process a batch of records
   */
  private async processBatch(
    batch: any[],
    collection: any,
    options: ImportOptions,
    result: ImportResult
  ): Promise<void> {
    if (batch.length === 0 || options.validateOnly) {
      return;
    }

    try {
      // Prepare operations for bulk write
      const operations = batch.map(doc => {
        // For products, orders, and customers, use upsert based on unique identifiers
        if (options.updateExisting) {
          // Determine the filter for update based on resource type
          let filter: any;
          
          switch (collection.collectionName) {
            case 'app_d8d4_products':
              filter = { 
                $or: [
                  { _id: doc._id },
                  { sku: doc.sku },
                  { 'variants.sku': doc.variants?.[0]?.sku }
                ]
              };
              break;
            case 'app_d8d4_orders':
              filter = { order_number: doc.order_number };
              break;
            case 'app_d8d4_users':
              filter = { email: doc.email };
              break;
            default:
              // For other collections, use _id if provided
              filter = doc._id ? { _id: new ObjectId(doc._id) } : { _id: new ObjectId() };
          }

          return {
            updateOne: {
              filter,
              update: {
                $set: doc,
                $setOnInsert: { created_at: new Date() }
              },
              upsert: true
            }
          };
        } else {
          // Insert only
          return {
            insertOne: {
              document: {
                ...doc,
                created_at: new Date(),
                updated_at: new Date()
              }
            }
          };
        }
      });

      // Execute bulk write
      const bulkResult = await collection.bulkWrite(operations, { ordered: false });
      
      // Update result counters
      result.inserted += bulkResult.insertedCount;
      result.updated += bulkResult.modifiedCount;
    } catch (error: any) {
      // Handle bulk write errors
      if (error.writeErrors) {
        error.writeErrors.forEach((writeError: any) => {
          const originalDoc = batch[writeError.index];
          result.errors.push({
            row: writeError.index + 1,
            error: writeError.err.errmsg,
            data: originalDoc
          });
        });
      } else {
        // Generic error
        batch.forEach((doc, index) => {
          result.errors.push({
            row: index + 1,
            error: error.message,
            data: doc
          });
        });
      }
    }
  }

  /**
   * Map a row according to the column mapping
   */
  private mapRow(row: Record<string, any>, mapping: ColumnMapping): Record<string, any> {
    const mapped: Record<string, any> = {};
    
    for (const [sourceCol, destField] of Object.entries(mapping)) {
      if (row[sourceCol] !== undefined) {
        // Handle nested fields (e.g., "address.street")
        if (destField.includes('.')) {
          const parts = destField.split('.');
          let current = mapped;
          
          for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            if (!current[part]) {
              current[part] = {};
            }
            current = current[part];
          }
          
          current[parts[parts.length - 1]] = row[sourceCol];
        } else {
          mapped[destField] = row[sourceCol];
        }
      }
    }
    
    return mapped;
  }

  /**
   * Validate a row based on resource type
   */
  private validateRow(row: Record<string, any>, resourceType: string): string[] {
    const errors: string[] = [];
    
    switch (resourceType) {
      case 'products':
        if (!row.title || typeof row.title !== 'string') {
          errors.push('Title is required and must be a string');
        }
        
        if (row.price === undefined || typeof row.price !== 'number' || row.price < 0) {
          errors.push('Price is required and must be a non-negative number');
        }
        
        if (row.category && typeof row.category !== 'string') {
          errors.push('Category must be a string');
        }
        
        if (row.images && (!Array.isArray(row.images) || row.images.some(img => typeof img !== 'string'))) {
          errors.push('Images must be an array of strings');
        }
        
        if (row.variants && (!Array.isArray(row.variants) || 
            row.variants.some((variant: any) => 
              typeof variant !== 'object' || 
              variant.stock === undefined || 
              typeof variant.stock !== 'number' || 
              variant.stock < 0
            ))) {
          errors.push('Variants must be an array of objects with non-negative stock');
        }
        
        break;
        
      case 'orders':
        if (!row.order_number || typeof row.order_number !== 'string') {
          errors.push('Order number is required and must be a string');
        }
        
        if (!row.user_id || !ObjectId.isValid(row.user_id)) {
          errors.push('User ID is required and must be a valid ObjectId');
        }
        
        if (!row.items || !Array.isArray(row.items) || row.items.length === 0) {
          errors.push('Items are required and must be a non-empty array');
        } else {
          row.items.forEach((item: any, index: number) => {
            if (!item.product_id || !ObjectId.isValid(item.product_id)) {
              errors.push(`Item ${index + 1}: Product ID is required and must be a valid ObjectId`);
            }
            
            if (item.quantity === undefined || typeof item.quantity !== 'number' || item.quantity <= 0) {
              errors.push(`Item ${index + 1}: Quantity is required and must be a positive number`);
            }
            
            if (item.price === undefined || typeof item.price !== 'number' || item.price < 0) {
              errors.push(`Item ${index + 1}: Price is required and must be a non-negative number`);
            }
          });
        }
        
        if (row.total_amount === undefined || typeof row.total_amount !== 'number' || row.total_amount < 0) {
          errors.push('Total amount is required and must be a non-negative number');
        }
        
        if (!row.order_status || !['placed', 'confirmed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'].includes(row.order_status)) {
          errors.push('Order status is required and must be one of: placed, confirmed, shipped, out_for_delivery, delivered, cancelled');
        }
        
        break;
        
      case 'users':
        if (!row.email || typeof row.email !== 'string') {
          errors.push('Email is required and must be a string');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
          errors.push('Email must be a valid email address');
        }
        
        if (row.role && !['customer', 'seller', 'admin'].includes(row.role)) {
          errors.push('Role must be one of: customer, seller, admin');
        }
        
        if (row.phone && typeof row.phone !== 'string') {
          errors.push('Phone must be a string');
        }
        
        break;
        
      case 'reviews':
        if (!row.product_id || !ObjectId.isValid(row.product_id)) {
          errors.push('Product ID is required and must be a valid ObjectId');
        }
        
        if (!row.user_id || !ObjectId.isValid(row.user_id)) {
          errors.push('User ID is required and must be a valid ObjectId');
        }
        
        if (row.rating === undefined || typeof row.rating !== 'number' || row.rating < 1 || row.rating > 5) {
          errors.push('Rating is required and must be a number between 1 and 5');
        }
        
        if (!row.comment || typeof row.comment !== 'string') {
          errors.push('Comment is required and must be a string');
        }
        
        break;
        
      case 'categories':
        if (!row.name || typeof row.name !== 'string') {
          errors.push('Name is required and must be a string');
        }
        
        if (row.slug && typeof row.slug !== 'string') {
          errors.push('Slug must be a string');
        }
        
        if (row.parent_id && !ObjectId.isValid(row.parent_id)) {
          errors.push('Parent ID must be a valid ObjectId');
        }
        
        break;
        
      default:
        // For unknown resource types, just check for basic validity
        if (Object.keys(row).length === 0) {
          errors.push('Row cannot be empty');
        }
    }
    
    return errors;
  }

  /**
   * Get the MongoDB collection for a resource type
   */
  private getCollection(resourceType: string): any | null {
    switch (resourceType) {
      case 'products':
        return db.collection('app_d8d4_products');
      case 'orders':
        return db.collection('app_d8d4_orders');
      case 'users':
        return db.collection('app_d8d4_users');
      case 'reviews':
        return db.collection('app_d8d4_reviews');
      case 'categories':
        return db.collection('app_d8d4_categories');
      case 'addresses':
        return db.collection('app_d8d4_addresses');
      case 'carts':
        return db.collection('app_d8d4_carts');
      case 'wishlists':
        return db.collection('app_d8d4_wishlists');
      case 'questions':
        return db.collection('app_d8d4_questions');
      case 'coupons':
        return db.collection('app_d8d4_coupons');
      case 'banners':
        return db.collection('app_d8d4_banners');
      case 'seller_applications':
        return db.collection('app_d8d4_seller_applications');
      default:
        return null;
    }
  }
}

// Export singleton instance
export const importService = new ImportService();
```

```typescript