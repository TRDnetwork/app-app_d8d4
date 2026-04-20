import * as fs from 'fs';
import { pipeline } from 'stream/promises';
import { Transform } from 'stream';

/**
 * JSON Validator utility for import operations
 * Handles JSON file parsing with validation and column mapping
 */
export class JSONValidator {
  private readonly MAX_DOCUMENTS = 100000; // Maximum documents to process
  private readonly BATCH_SIZE = 1000; // Documents to process in each batch

  /**
   * Parse JSON file and return first N documents for preview
   */
  async parseJSON(filePath: string, maxDocs: number = 5): Promise<any[]> {
    const results: any[] = [];
    let docCount = 0;

    try {
      await pipeline(
        fs.createReadStream(filePath),
        this.createJSONParser(),
        async function* (source) {
          for await (const chunk of source) {
            if (docCount >= maxDocs) {
              return;
            }
            
            // Validate and clean document
            const validatedDoc = this.validateDocument(chunk);
            if (validatedDoc) {
              results.push(validatedDoc);
              docCount++;
            }
          }
        }.bind(this)
      );

      return results;
    } catch (error) {
      throw new Error(`Failed to parse JSON file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Process JSON file in batches for import
   */
  async processJSON(filePath: string, columnMapping: Record<string, string>, batchSize: number = this.BATCH_SIZE): Promise<AsyncGenerator<any[]>> {
    return this.createBatchGenerator(filePath, columnMapping, batchSize);
  }

  /**
   * Create async generator for batch processing
   */
  private async *createBatchGenerator(filePath: string, columnMapping: Record<string, string>, batchSize: number) {
    let batch: any[] = [];
    let docCount = 0;

    try {
      await pipeline(
        fs.createReadStream(filePath),
        this.createJSONParser(),
        async function* (source) {
          for await (const chunk of source) {
            if (docCount >= this.MAX_DOCUMENTS) {
              throw new Error(`Maximum document limit of ${this.MAX_DOCUMENTS} exceeded`);
            }

            // Map and validate document
            const mappedDoc = this.mapDocument(chunk, columnMapping);
            if (mappedDoc) {
              batch.push(mappedDoc);
              docCount++;

              // Yield batch when full
              if (batch.length >= batchSize) {
                yield batch;
                batch = [];
              }
            }
          }

          // Yield remaining documents
          if (batch.length > 0) {
            yield batch;
          }
        }.bind(this)
      );
    } catch (error) {
      throw new Error(`Failed to process JSON file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create JSON parser stream
   * Handles both JSON array and line-delimited JSON
   */
  private createJSONParser(): Transform {
    let buffer = '';
    let isArray = false;
    let isFirstChunk = true;

    return new Transform({
      transform(chunk, encoding, callback) {
        buffer += chunk.toString();

        // Detect JSON format from first chunk
        if (isFirstChunk) {
          isFirstChunk = false;
          isArray = buffer.trim().startsWith('[');
        }

        try {
          let parsed: any[] = [];

          if (isArray) {
            // Handle JSON array
            const jsonMatch = buffer.match(/\[([\s\S]*)\]/);
            if (jsonMatch) {
              const jsonArray = JSON.parse(jsonMatch[0]);
              parsed = jsonArray;
              buffer = buffer.substring(jsonMatch[0].length);
            }
          } else {
            // Handle line-delimited JSON (JSONL)
            const lines = buffer.split('\n');
            buffer = lines.pop() || ''; // Keep incomplete line in buffer
            
            for (const line of lines) {
              const trimmedLine = line.trim();
              if (trimmedLine) {
                parsed.push(JSON.parse(trimmedLine));
              }
            }
          }

          // Push parsed documents
          for (const doc of parsed) {
            this.push(doc);
          }

          callback();
        } catch (error) {
          // Incomplete JSON, wait for more data
          callback();
        }
      },

      flush(callback) {
        // Process any remaining data
        if (buffer.trim()) {
          try {
            if (isArray) {
              const jsonArray = JSON.parse(buffer);
              for (const doc of jsonArray) {
                this.push(doc);
              }
            } else {
              const lines = buffer.split('\n');
              for (const line of lines) {
                const trimmedLine = line.trim();
                if (trimmedLine) {
                  this.push(JSON.parse(trimmedLine));
                }
              }
            }
          } catch (error) {
            // Invalid JSON, ignore
          }
        }
        callback();
      }
    });
  }

  /**
   * Validate document structure
   */
  private validateDocument(doc: any): any | null {
    if (!doc || typeof doc !== 'object' || Array.isArray(doc)) {
      return null;
    }

    const cleaned: any = {};

    // Clean and validate properties
    for (const [key, value] of Object.entries(doc)) {
      if (value === null || value === undefined) {
        continue;
      }

      const cleanedKey = this.cleanKey(key);
      if (!cleanedKey) {
        continue;
      }

      // Validate value type
      const validatedValue = this.validateValue(value, cleanedKey);
      if (validatedValue !== undefined) {
        cleaned[cleanedKey] = validatedValue;
      }
    }

    return Object.keys(cleaned).length > 0 ? cleaned : null;
  }

  /**
   * Validate value based on key
   */
  private validateValue(value: any, key: string): any | undefined {
    // Skip empty values
    if (value === '' || value === null || value === undefined) {
      return undefined;
    }

    // Handle specific key types
    switch (key) {
      case 'email':
        return this.isValidEmail(value) ? value : undefined;
      
      case 'price':
      case 'original_price':
      case 'subtotal':
      case 'total':
      case 'delivery_charge':
        return typeof value === 'number' && value >= 0 ? value : undefined;
      
      case 'stock_quantity':
      case 'quantity':
        return Number.isInteger(value) && value >= 0 ? value : undefined;
      
      case 'images':
      case 'tags':
        return Array.isArray(value) && value.every(item => typeof item === 'string') ? value : undefined;
      
      case 'emailVerified':
      case 'is_default':
      case 'is_featured':
      case 'is_sponsored':
        return typeof value === 'boolean' ? value : undefined;
      
      case 'created_at':
      case 'updated_at':
      case 'order_date':
        return this.isValidDate(value) ? new Date(value) : undefined;
      
      case 'role':
        return ['customer', 'seller', 'admin'].includes(value) ? value : undefined;
      
      case 'status':
        return ['active', 'inactive', 'out_of_stock'].includes(value) ? value : undefined;
      
      case 'delivery_speed':
        return ['standard', 'express', 'same_day'].includes(value) ? value : undefined;
      
      default:
        // For string values, ensure they're not empty after trimming
        if (typeof value === 'string') {
          const trimmed = value.trim();
          return trimmed ? trimmed : undefined;
        }
        
        // For other types, accept as-is
        return value;
    }
  }

  /**
   * Map document according to column mapping
   */
  private mapDocument(doc: any, columnMapping: Record<string, string>): any | null {
    const mapped: any = {};
    let hasData = false;

    const validatedDoc = this.validateDocument(doc);

    if (!validatedDoc) {
      return null;
    }

    for (const [fileColumn, entityColumn] of Object.entries(columnMapping)) {
      if (validatedDoc[fileColumn] !== undefined) {
        mapped[entityColumn] = validatedDoc[fileColumn];
        hasData = true;
      }
    }

    return hasData ? mapped : null;
  }

  /**
   * Suggest column mapping based on document analysis
   */
  suggestColumnMapping(doc: any, entityType: string): Record<string, string> {
    const suggestions: Record<string, string> = {};
    const mappingConfig = COLUMN_MAPPINGS[entityType];

    if (!mappingConfig) {
      return suggestions;
    }

    const docKeys = Object.keys(doc);

    for (const key of docKeys) {
      // Find best match from mapping configuration
      const bestMatch = this.findBestColumnMatch(key, mappingConfig.mapping);
      if (bestMatch) {
        suggestions[key] = bestMatch;
      }
    }

    return suggestions;
  }

  /**
   * Find best column match using fuzzy matching
   */
  private findBestColumnMatch(key: string, mapping: Record<string, string>): string | null {
    const keyLower = key.toLowerCase();
    
    // Exact match
    for (const [fileCol, entityCol] of Object.entries(mapping)) {
      if (fileCol.toLowerCase() === keyLower) {
        return entityCol;
      }
    }

    // Partial match
    for (const [fileCol, entityCol] of Object.entries(mapping)) {
      const fileColLower = fileCol.toLowerCase();
      if (keyLower.includes(fileColLower) || fileColLower.includes(keyLower)) {
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
      if (mapping[entityCol]) {
        for (const word of words) {
          if (keyLower.includes(word)) {
            return mapping[entityCol];
          }
        }
      }
    }

    return null;
  }

  /**
   * Clean key name - remove special characters, normalize
   */
  private cleanKey(key: string): string {
    if (!key) return '';

    return key
      .trim()
      .toLowerCase()
      .replace(/[^a-zA-Z0-9_]/g, '_')  // Replace special chars with underscore
      .replace(/_{2,}/g, '_')          // Replace multiple underscores
      .replace(/^_+|_+$/g, '');        // Remove leading/trailing underscores
  }

  /**
   * Validate email format
   */
  private isValidEmail(email: any): boolean {
    if (typeof email !== 'string') {
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate date string or object
   */
  private isValidDate(date: any): boolean {
    if (date instanceof Date) {
      return !isNaN(date.getTime());
    }
    
    if (typeof date === 'string') {
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime());
    }
    
    return false;
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