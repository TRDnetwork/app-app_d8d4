import * as csv from 'csv-parser';
import * as fs from 'fs';
import * as path from 'path';
import { Readable } from 'stream';
import { Product } from '../models/Product';

interface CSVRow {
  title: string;
  description: string;
  category: string;
  brand: string;
  price: string;
  original_price: string;
  discount_percent: string;
  stock: string;
  status: string;
  tags: string;
}

interface CSVImportResult {
  success: boolean;
  processed: number;
  created: number;
  updated: number;
  errors: Array<{
    row: number;
    error: string;
    data: Record<string, any>;
  }>;
}

export class CSVParser {
  /**
   * Parse CSV file and validate data
   */
  static async parseCSV(
    filePath: string | Buffer | Readable,
    options: {
      delimiter?: string;
      headers?: boolean;
    } = {}
  ): Promise<CSVImportResult> {
    const result: CSVImportResult = {
      success: true,
      processed: 0,
      created: 0,
      updated: 0,
      errors: []
    };

    // Create readable stream from different input types
    let stream: Readable;
    
    if (typeof filePath === 'string') {
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }
      stream = fs.createReadStream(filePath);
    } else if (Buffer.isBuffer(filePath)) {
      stream = new Readable();
      stream.push(filePath);
      stream.push(null);
    } else {
      stream = filePath;
    }

    return new Promise((resolve, reject) => {
      const results: CSVRow[] = [];
      
      stream
        .pipe(csv({
          separator: options.delimiter || ',',
          headers: options.headers !== false, // Default to true
        }))
        .on('data', (data) => {
          results.push(data);
        })
        .on('error', (error) => {
          reject(error);
        })
        .on('end', async () => {
          try {
            // Process each row
            for (let i = 0; i < results.length; i++) {
              const row = results[i];
              result.processed++;
              
              try {
                // Validate and transform data
                const productData = await this.validateAndTransformRow(row, i + 1);
                
                // Check if product exists (by title and brand)
                const existingProduct = await Product.findOne({
                  title: productData.title,
                  brand: productData.brand
                });
                
                if (existingProduct) {
                  // Update existing product
                  Object.assign(existingProduct, productData);
                  await existingProduct.save();
                  result.updated++;
                } else {
                  // Create new product
                  await Product.create(productData);
                  result.created++;
                }
              } catch (error: any) {
                result.errors.push({
                  row: i + 1,
                  error: error.message,
                  data: row
                });
                result.success = false;
              }
            }
            
            resolve(result);
          } catch (error) {
            reject(error);
          }
        });
    });
  }

  /**
   * Validate and transform a CSV row into product data
   */
  private static async validateAndTransformRow(row: CSVRow, rowIndex: number): Promise<any> {
    const errors: string[] = [];
    
    // Required fields validation
    if (!row.title?.trim()) {
      errors.push('Title is required');
    }
    
    if (!row.description?.trim()) {
      errors.push('Description is required');
    }
    
    if (!row.category?.trim()) {
      errors.push('Category is required');
    }
    
    if (!row.brand?.trim()) {
      errors.push('Brand is required');
    }
    
    // Price validation
    const price = parseFloat(row.price);
    if (isNaN(price) || price <= 0) {
      errors.push('Price must be a positive number');
    }
    
    // Original price validation (if provided)
    let originalPrice = null;
    if (row.original_price?.trim()) {
      originalPrice = parseFloat(row.original_price);
      if (isNaN(originalPrice) || originalPrice <= 0) {
        errors.push('Original price must be a positive number');
      }
    }
    
    // Discount percent validation
    let discountPercent = 0;
    if (row.discount_percent?.trim()) {
      discountPercent = parseFloat(row.discount_percent);
      if (isNaN(discountPercent) || discountPercent < 0 || discountPercent > 100) {
        errors.push('Discount percent must be between 0 and 100');
      }
    }
    
    // Stock validation
    const stock = parseInt(row.stock || '0', 10);
    if (isNaN(stock) || stock < 0) {
      errors.push('Stock must be a non-negative integer');
    }
    
    // Status validation
    const status = (row.status || 'draft').toLowerCase();
    if (!['active', 'draft', 'archived'].includes(status)) {
      errors.push('Status must be one of: active, draft, archived');
    }
    
    // Tags parsing
    let tags: string[] = [];
    if (row.tags?.trim()) {
      tags = row.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }
    
    // If we have validation errors, throw them
    if (errors.length > 0) {
      throw new Error(`Validation failed for row ${rowIndex}: ${errors.join(', ')}`);
    }
    
    // Calculate discount percent if not provided
    if (originalPrice && !discountPercent) {
      discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100);
    }
    
    return {
      title: row.title.trim(),
      description: row.description.trim(),
      category: row.category.trim(),
      brand: row.brand.trim(),
      price,
      original_price: originalPrice,
      discount_percent: discountPercent,
      stock_total: stock,
      status,
      tags,
      variants: [
        {
          sku: `SKU-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          stock: stock,
          color: 'Default',
          size: 'Default'
        }
      ]
    };
  }

  /**
   * Preview first N rows of a CSV file
   */
  static async previewCSV(
    filePath: string | Buffer | Readable,
    limit: number = 5
  ): Promise<{ headers: string[]; rows: Record<string, any>[] }> {
    const headers: string[] = [];
    const rows: Record<string, any>[] = [];
    
    // Create readable stream
    let stream: Readable;
    
    if (typeof filePath === 'string') {
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }
      stream = fs.createReadStream(filePath);
    } else if (Buffer.isBuffer(filePath)) {
      stream = new Readable();
      stream.push(filePath);
      stream.push(null);
    } else {
      stream = filePath;
    }

    return new Promise((resolve, reject) => {
      let rowCount = 0;
      
      stream
        .pipe(csv())
        .on('headers', (headerList) => {
          headers.push(...headerList);
        })
        .on('data', (data) => {
          if (rowCount < limit) {
            rows.push(data);
          }
          rowCount++;
        })
        .on('error', (error) => {
          reject(error);
        })
        .on('end', () => {
          resolve({ headers, rows });
        });
    });
  }
}
```

```typescript