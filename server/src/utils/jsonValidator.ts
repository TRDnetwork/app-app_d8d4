import Ajv from 'ajv';
import addFormats from 'ajv-formats';

/**
 * JSON Validator utility for validating JSON data against schemas
 * Uses Ajv for JSON Schema validation with additional formats
 */
export class JSONValidator {
  private static ajv: Ajv;

  // Initialize Ajv instance with formats
  private static getAjv(): Ajv {
    if (!this.ajv) {
      this.ajv = new Ajv({ allErrors: true });
      addFormats(this.ajv);
    }
    return this.ajv;
  }

  /**
   * Validate JSON data against a schema
   * @param data - JSON data to validate
   * @param schema - JSON Schema to validate against
   * @returns boolean - Whether data is valid
   */
  static validate(data: any, schema: any): boolean {
    const ajv = this.getAjv();
    const validate = ajv.compile(schema);
    const valid = validate(data);
    
    if (!valid && validate.errors) {
      console.error('JSON validation errors:', validate.errors);
    }
    
    return valid;
  }

  /**
   * Validate and parse JSON string
   * @param jsonString - JSON string to validate and parse
   * @returns any - Parsed JSON data
   * @throws Error if JSON is invalid
   */
  static validateAndParse(jsonString: string): any {
    // First, check if it's valid JSON
    let data: any;
    try {
      data = JSON.parse(jsonString);
    } catch (error) {
      throw new Error(`Invalid JSON: ${(error as Error).message}`);
    }

    // Then validate against appropriate schema based on data structure
    if (Array.isArray(data)) {
      // Validate array of objects
      const itemSchema = this.getSchemaForData(data[0]);
      if (itemSchema) {
        const ajv = this.getAjv();
        const validate = ajv.compile({
          type: 'array',
          items: itemSchema
        });
        
        const valid = validate(data);
        if (!valid && validate.errors) {
          throw new Error(`JSON validation failed: ${JSON.stringify(validate.errors)}`);
        }
      }
    } else if (typeof data === 'object' && data !== null) {
      // Validate single object
      const schema = this.getSchemaForData(data);
      if (schema) {
        const valid = this.validate(data, schema);
        if (!valid) {
          throw new Error('JSON validation failed');
        }
      }
    }

    return data;
  }

  /**
   * Get appropriate JSON schema based on data structure
   * @param data - Data to generate schema for
   * @returns any - JSON Schema
   */
  private static getSchemaForData(data: any): any {
    if (!data || typeof data !== 'object') {
      return null;
    }

    // Determine entity type based on data structure
    if ('title' in data && 'price' in data && 'description' in data) {
      // Product schema
      return {
        type: 'object',
        properties: {
          title: { type: 'string', minLength: 1 },
          slug: { type: 'string', pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$' },
          description: { type: 'string', minLength: 1 },
          price: { type: 'number', minimum: 0 },
          original_price: { type: 'number', minimum: 0 },
          discount_percent: { type: 'number', minimum: 0, maximum: 100 },
          sku: { type: 'string' },
          stock_quantity: { type: 'number', minimum: 0 },
          brand: { type: 'string' },
          category_id: { type: 'string' },
          seller_id: { type: 'string' },
          status: { type: 'string', enum: ['active', 'inactive', 'out_of_stock'] },
          is_featured: { type: 'boolean' },
          is_sponsored: { type: 'boolean' },
          images: { 
            type: 'array', 
            items: { type: 'string', format: 'uri' },
            minItems: 1
          },
          variants: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                values: { 
                  type: 'array', 
                  items: { type: 'string' },
                  minItems: 1
                },
                price_modifier: { type: 'number' }
              },
              required: ['name', 'values']
            }
          },
          tags: { type: 'array', items: { type: 'string' } }
        },
        required: ['title', 'description', 'price', 'category_id', 'seller_id']
      };
    } else if ('email' in data && 'name' in data && 'role' in data) {
      // User schema
      return {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          name: { type: 'string', minLength: 1 },
          phone: { type: 'string' },
          role: { type: 'string', enum: ['customer', 'seller', 'admin'] },
          profile_picture_url: { type: 'string', format: 'uri' },
          email_verified: { type: 'boolean' },
          loyalty_points: { type: 'number', minimum: 0 }
        },
        required: ['email', 'name', 'role']
      };
    } else if ('user_id' in data && 'order_number' in data && 'items' in data) {
      // Order schema
      return {
        type: 'object',
        properties: {
          user_id: { type: 'string' },
          order_number: { type: 'string' },
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                product_id: { type: 'string' },
                seller_id: { type: 'string' },
                variant: { type: 'string' },
                quantity: { type: 'number', minimum: 1 },
                price: { type: 'number', minimum: 0 },
                status: { type: 'string' }
              },
              required: ['product_id', 'quantity', 'price']
            }
          },
          address: { type: 'object' },
          delivery_speed: { type: 'string', enum: ['standard', 'express', 'same_day'] },
          payment_method: { type: 'string', enum: ['stripe', 'upi', 'cod'] },
          subtotal: { type: 'number', minimum: 0 },
          discount: { type: 'number', minimum: 0 },
          delivery_charge: { type: 'number', minimum: 0 },
          total: { type: 'number', minimum: 0 },
          status: { 
            type: 'string', 
            enum: ['placed', 'confirmed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'] 
          },
          tracking_number: { type: 'string' },
          estimated_delivery: { type: 'string', format: 'date-time' }
        },
        required: ['user_id', 'order_number', 'items', 'address', 'total']
      };
    } else if ('name' in data && 'slug' in data && 'parent_id' in data) {
      // Category schema
      return {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 1 },
          slug: { type: 'string', pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$' },
          parent_id: { type: 'string', nullable: true },
          image_url: { type: 'string', format: 'uri', nullable: true },
          order: { type: 'number', minimum: 0 }
        },
        required: ['name', 'slug']
      };
    }

    return null;
  }

  /**
   * Validate JSON file
   * @param filePath - Path to the JSON file
   * @returns Promise<any> - Parsed and validated JSON data
   */
  static async validateFile(filePath: string): Promise<any> {
    // SECURITY FIX: Validate file path is within allowed directory
    const allowedDir = process.env.UPLOAD_DIR || '/tmp/shopsphere-imports';
    const resolvedPath = path.resolve(filePath);
    const resolvedDir = path.resolve(allowedDir);
    
    if (!resolvedPath.startsWith(resolvedDir)) {
      throw new Error('Invalid file path');
    }

    // SECURITY FIX: Validate file exists
    if (!fs.existsSync(resolvedPath)) {
      throw new Error('File not found');
    }

    // Read file
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Validate and parse
    return this.validateAndParse(content);
  }
}
```

```typescript