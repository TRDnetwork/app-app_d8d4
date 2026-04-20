import * as csv from 'csv-parser';
import * as fs from 'fs';
import { pipeline } from 'stream/promises';

/**
 * CSV Parser utility for import operations
 * Handles CSV file parsing with validation and column mapping
 */
export class CSVParser {
  private readonly MAX_ROWS = 100000; // Maximum rows to process
  private readonly BATCH_SIZE = 1000; // Rows to process in each batch

  /**
   * Parse CSV file and return first N rows for preview
   */
  async parseCSV(filePath: string, maxRows: number = 5): Promise<any[]> {
    const results: any[] = [];
    let rowCount = 0;

    try {
      await pipeline(
        fs.createReadStream(filePath),
        csv({
          separator: ',',
          strict: false,
          skipEmptyLines: true
        }),
        async function* (source) {
          for await (const chunk of source) {
            if (rowCount >= maxRows) {
              return;
            }
            
            // Clean and validate row
            const cleanedRow = this.cleanRow(chunk);
            if (Object.keys(cleanedRow).length > 0) {
              results.push(cleanedRow);
              rowCount++;
            }
          }
        }
      );

      return results;
    } catch (error) {
      throw new Error(`Failed to parse CSV file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Process CSV file in batches for import
   */
  async processCSV(filePath: string, columnMapping: Record<string, string>, batchSize: number = this.BATCH_SIZE): Promise<AsyncGenerator<any[]>> {
    return this.createBatchGenerator(filePath, columnMapping, batchSize);
  }

  /**
   * Create async generator for batch processing
   */
  private async *createBatchGenerator(filePath: string, columnMapping: Record<string, string>, batchSize: number) {
    let batch: any[] = [];
    let rowCount = 0;

    try {
      await pipeline(
        fs.createReadStream(filePath),
        csv({
          separator: ',',
          strict: false,
          skipEmptyLines: true
        }),
        async function* (source) {
          for await (const chunk of source) {
            if (rowCount >= this.MAX_ROWS) {
              throw new Error(`Maximum row limit of ${this.MAX_ROWS} exceeded`);
            }

            // Clean and map row
            const mappedRow = this.mapRow(chunk, columnMapping);
            if (mappedRow) {
              batch.push(mappedRow);
              rowCount++;

              // Yield batch when full
              if (batch.length >= batchSize) {
                yield batch;
                batch = [];
              }
            }
          }

          // Yield remaining rows
          if (batch.length > 0) {
            yield batch;
          }
        }.bind(this)
      );
    } catch (error) {
      throw new Error(`Failed to process CSV file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Clean row data - remove empty values, trim whitespace
   */
  private cleanRow(row: Record<string, any>): Record<string, any> {
    const cleaned: Record<string, any> = {};

    for (const [key, value] of Object.entries(row)) {
      // Skip empty keys or values
      if (!key || value === null || value === undefined || value === '') {
        continue;
      }

      // Trim whitespace
      const trimmedValue = String(value).trim();
      if (trimmedValue === '') {
        continue;
      }

      // Clean column name
      const cleanedKey = this.cleanColumnName(key);
      if (cleanedKey) {
        cleaned[cleanedKey] = trimmedValue;
      }
    }

    return cleaned;
  }

  /**
   * Map row according to column mapping
   */
  private mapRow(row: Record<string, any>, columnMapping: Record<string, string>): Record<string, any> | null {
    const mapped: Record<string, any> = {};
    let hasData = false;

    const cleanedRow = this.cleanRow(row);

    for (const [fileColumn, entityColumn] of Object.entries(columnMapping)) {
      if (cleanedRow[fileColumn] !== undefined) {
        // Convert data types based on target column
        mapped[entityColumn] = this.convertDataType(cleanedRow[fileColumn], entityColumn);
        hasData = true;
      }
    }

    return hasData ? mapped : null;
  }

  /**
   * Suggest column mapping based on header analysis
   */
  suggestColumnMapping(headers: Record<string, any>, entityType: string): Record<string, string> {
    const suggestions: Record<string, string> = {};
    const mappingConfig = COLUMN_MAPPINGS[entityType];

    if (!mappingConfig) {
      return suggestions;
    }

    const headerKeys = Object.keys(headers).map(key => this.cleanColumnName(key));

    for (const header of headerKeys) {
      if (!header) continue;

      // Find best match from mapping configuration
      const bestMatch = this.findBestColumnMatch(header, mappingConfig.mapping);
      if (bestMatch) {
        suggestions[header] = bestMatch;
      }
    }

    return suggestions;
  }

  /**
   * Find best column match using fuzzy matching
   */
  private findBestColumnMatch(header: string, mapping: Record<string, string>): string | null {
    const headerLower = header.toLowerCase();
    
    // Exact match
    for (const [fileCol, entityCol] of Object.entries(mapping)) {
      if (fileCol.toLowerCase() === headerLower) {
        return entityCol;
      }
    }

    // Partial match
    for (const [fileCol, entityCol] of Object.entries(mapping)) {
      const fileColLower = fileCol.toLowerCase();
      if (headerLower.includes(fileColLower) || fileColLower.includes(headerLower)) {
        return entityCol;
      }
    }

    // Keyword match
    const keywords: Record<string, string[]> = {
      'title': ['title', 'name', 'product'],
      'price': ['price', 'cost', 'amount'],
      'description': ['description', 'desc', 'details'],
      'category': ['category', 'type', 'group'],
      'brand': ['brand', 'manufacturer', 'maker'],
      'sku': ['sku', 'code', 'id'],
      'stock': ['stock', 'quantity', 'count', 'available'],
      'email': ['email', 'mail', 'address'],
      'name': ['name', 'full', 'first', 'last'],
      'phone': ['phone', 'mobile', 'contact'],
      'role': ['role', 'type', 'access']
    };

    for (const [entityCol, words] of Object.entries(keywords)) {
      if (mappingConfig.mapping[entityCol]) {
        for (const word of words) {
          if (headerLower.includes(word)) {
            return mappingConfig.mapping[entityCol];
          }
        }
      }
    }

    return null;
  }

  /**
   * Clean column name - remove special characters, normalize
   */
  private cleanColumnName(name: string): string {
    if (!name) return '';

    return name
      .trim()
      .toLowerCase()
      .replace(/[^a-zA-Z0-9_]/g, '_')  // Replace special chars with underscore
      .replace(/_{2,}/g, '_')          // Replace multiple underscores
      .replace(/^_+|_+$/g, '');        // Remove leading/trailing underscores
  }

  /**
   * Convert data type based on target column
   */
  private convertDataType(value: string, column: string): any {
    // Handle specific column types
    switch (column) {
      case 'price':
      case 'original_price':
      case 'subtotal':
      case 'total':
      case 'delivery_charge':
        return this.parseNumber(value);
      
      case 'stock_quantity':
      case 'quantity':
        return this.parseInteger(value);
      
      case 'images':
      case 'tags':
        return this.parseArray(value);
      
      case 'emailVerified':
      case 'is_default':
      case 'is_featured':
      case 'is_sponsored':
        return this.parseBoolean(value);
      
      case 'created_at':
      case 'updated_at':
      case 'order_date':
        return this.parseDate(value);
      
      default:
        return value;
    }
  }

  /**
   * Parse number with error handling
   */
  private parseNumber(value: string): number | null {
    const num = Number(value.replace(/[^0-9.-]/g, ''));
    return isNaN(num) ? null : num;
  }

  /**
   * Parse integer
   */
  private parseInteger(value: string): number | null {
    const int = parseInt(value.replace(/[^0-9-]/g, ''), 10);
    return isNaN(int) ? null : int;
  }

  /**
   * Parse boolean values
   */
  private parseBoolean(value: string): boolean {
    const lowerValue = value.toLowerCase().trim();
    return ['true', '1', 'yes', 'on'].includes(lowerValue);
  }

  /**
   * Parse date string
   */
  private parseDate(value: string): Date | null {
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  }

  /**
   * Parse array from comma-separated string
   */
  private parseArray(value: string): string[] {
    return value
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);
  }
}

// Column mappings for different entity types
const COLUMN_MAPPINGS = {
  products: {
    mapping: {
      'title': 'title',
      'name': 'title',
      'price': 'price',
      'cost': 'price',
      'original_price': 'original_price',
      'discount_percent': 'discount_percent',
      'description': 'description',
      'desc': 'description',
      'category': 'category',
      'category_id': 'category_id',
      'brand': 'brand',
      'sku': 'sku',
      'stock': 'stock_quantity',
      'stock_quantity': 'stock_quantity',
      'images': 'images',
      'image_urls': 'images',
      'status': 'status'
    }
  },
  users: {
    mapping: {
      'email': 'email',
      'name': 'name',
      'full_name': 'name',
      'first_name': 'name',
      'phone': 'phone',
      'mobile': 'phone',
      'role': 'role',
      'user_role': 'role'
    }
  },
  orders: {
    mapping: {
      'user_id': 'user_id',
      'customer_id': 'user_id',
      'total': 'total',
      'subtotal': 'subtotal',
      'delivery_charge': 'delivery_charge',
      'items': 'items',
      'order_items': 'items',
      'status': 'status',
      'delivery_speed': 'delivery_speed'
    }
  },
  categories: {
    mapping: {
      'name': 'name',
      'slug': 'slug',
      'description': 'description',
      'parent_id': 'parent_id',
      'parent_category': 'parent_id'
    }
  }
};
```

```typescript